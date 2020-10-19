/*
 * proofable
 * Copyright (C) 2020  Southbank Software Ltd.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 *
 * @Author: guiguan
 * @Date:   2020-02-15T08:42:02+11:00
 * @Last modified by:   guiguan
 * @Last modified time: 2020-10-16T12:09:41+11:00
 */

package api

import (
	"context"
	"errors"
	"fmt"
	"io"
	"os"

	anchorPB "github.com/SouthbankSoftware/proofable/pkg/protos/anchor"
	apiPB "github.com/SouthbankSoftware/proofable/pkg/protos/api"
	"github.com/golang/protobuf/ptypes/empty"
	"golang.org/x/sync/errgroup"
)

// GetTries gets all tries. Admin privilege is required
func GetTries(
	ctx context.Context,
	cli apiPB.APIServiceClient,
) (trCH <-chan *apiPB.Trie, errCH <-chan error) {
	trChan := make(chan *apiPB.Trie, 3)
	errChan := make(chan error, 1)

	go func() {
		defer close(trChan)
		defer close(errChan)

		var er error

		defer func() {
			if er != nil {
				errChan <- er
			}
		}()

		getCli, err := cli.GetTries(ctx, &empty.Empty{})
		if err != nil {
			er = err
			return
		}

		for {
			tr, err := getCli.Recv()
			if err != nil {
				if errors.Is(err, io.EOF) {
					break
				}

				er = err
				return
			}

			select {
			case <-ctx.Done():
				er = ctx.Err()
				return
			case trChan <- tr:
			}
		}

		return
	}()

	trCH = trChan
	errCH = errChan
	return
}

// GetTrie gets a trie
func GetTrie(
	ctx context.Context,
	cli apiPB.APIServiceClient,
	id string,
) (root string, er error) {
	tr, err := cli.GetTrie(ctx, &apiPB.TrieRequest{
		TrieId: id,
	})
	if err != nil {
		er = err
		return
	}

	root = tr.GetRoot()
	return
}

// ImportTrie imports the trie data and creates a new trie. If ID is zero, a new trie ID will be
// generated, which is recommended when importing
func ImportTrie(
	ctx context.Context,
	cli apiPB.APIServiceClient,
	id string,
	storageType apiPB.Trie_StorageType,
	path string,
) (newID, root string, er error) {
	impCli, err := cli.ImportTrie(ctx)
	if err != nil {
		er = err
		return
	}

	inFile, err := os.Open(path)
	if err != nil {
		er = err
		return
	}
	defer inFile.Close()

	wc := apiPB.NewDataStreamWriter(
		impCli,
		func() (md apiPB.DataChunkMetadata, er error) {
			md = &apiPB.DataChunk_ImportTrieRequest{
				ImportTrieRequest: &apiPB.ImportTrieRequest{
					TrieId:      id,
					StorageType: storageType,
				},
			}
			return
		},
	)
	defer func() {
		// close the stream writer
		wc.Close()

		tri, err := impCli.CloseAndRecv()
		if err != nil {
			er = err
			return
		}

		newID = tri.GetId()
		root = tri.GetRoot()
	}()

	_, er = io.Copy(wc, inFile)
	return
}

// WithImportedTrie provides a new imported trie to the closure that is automatically destroyed when
// done. If ID is zero, a new trie ID will be generated, which is recommended when importing
func WithImportedTrie(
	ctx context.Context,
	cli apiPB.APIServiceClient,
	id string,
	storageType apiPB.Trie_StorageType,
	path string,
	fn func(id, root string) error) (er error) {
	newID, root, err := ImportTrie(ctx, cli, id, storageType, path)
	if err != nil {
		return err
	}
	defer func() {
		err := DeleteTrie(ctx, cli, newID)
		if err != nil && er == nil {
			er = err
		}
	}()

	return fn(newID, root)
}

// ExportTrie exports the given trie
func ExportTrie(
	ctx context.Context,
	cli apiPB.APIServiceClient,
	id,
	outputPath string,
) error {
	stream, err := cli.ExportTrie(ctx, &apiPB.TrieRequest{
		TrieId: id,
	})
	if err != nil {
		return err
	}

	rc := apiPB.NewDataStreamReader(stream, nil)
	defer rc.Close()

	outFile, err := os.Create(outputPath)
	if err != nil {
		return err
	}
	defer outFile.Close()

	_, err = io.Copy(outFile, rc)
	return err
}

// CreateTrie creates a new empty trie
func CreateTrie(
	ctx context.Context,
	cli apiPB.APIServiceClient,
	storageType apiPB.Trie_StorageType,
) (
	id, root string, er error) {
	tr, err := cli.CreateTrie(ctx, &apiPB.CreateTrieRequest{
		StorageType: storageType,
	})
	if err != nil {
		er = err
		return
	}

	id = tr.GetId()
	root = tr.GetRoot()
	return
}

// DeleteTrie deletes the given trie
func DeleteTrie(ctx context.Context, cli apiPB.APIServiceClient, id string) error {
	_, err := cli.DeleteTrie(ctx, &apiPB.TrieRequest{
		TrieId: id,
	})
	return err
}

// WithTrie provides a new trie to the closure that is automatically destroyed when done
func WithTrie(
	ctx context.Context,
	cli apiPB.APIServiceClient,
	storageType apiPB.Trie_StorageType,
	fn func(id, root string) error,
) (er error) {
	id, root, err := CreateTrie(ctx, cli, storageType)
	if err != nil {
		return err
	}
	defer func() {
		err := DeleteTrie(ctx, cli, id)
		if err != nil && er == nil {
			er = err
		}
	}()

	return fn(id, root)
}

// GetTrieKeyValues gets the key-values of the trie at the given root. When root is zero (""), the
// current root hash of the trie will be used, and the request will be blocked until all ongoing
// updates are finished
func GetTrieKeyValues(
	ctx context.Context,
	cli apiPB.APIServiceClient,
	id,
	root string,
) (kvCH <-chan *apiPB.KeyValue, errCH <-chan error) {
	kvChan := make(chan *apiPB.KeyValue, 10)
	errChan := make(chan error, 1)

	go func() {
		defer close(kvChan)
		defer close(errChan)

		var er error

		defer func() {
			if er != nil {
				errChan <- er
			}
		}()

		getCli, err := cli.GetTrieKeyValues(ctx, &apiPB.TrieKeyValuesRequest{
			TrieId: id,
			Root:   root,
		})
		if err != nil {
			er = err
			return
		}

		for {
			kv, err := getCli.Recv()
			if err != nil {
				if errors.Is(err, io.EOF) {
					break
				}

				er = err
				return
			}

			select {
			case <-ctx.Done():
				er = ctx.Err()
				return
			case kvChan <- kv:
			}
		}

		return
	}()

	kvCH = kvChan
	errCH = errChan
	return
}

// GetTrieKeyValue get a key-value of the trie at the given root. When root is zero (""), the
// current root hash of the trie will be used, and the request will be blocked until all ongoing
// updates are finished
func GetTrieKeyValue(
	ctx context.Context,
	cli apiPB.APIServiceClient,
	id,
	root string,
	key *apiPB.Key,
) (kv *apiPB.KeyValue, er error) {
	return cli.GetTrieKeyValue(ctx, &apiPB.TrieKeyValueRequest{
		TrieId: id,
		Root:   root,
		Key:    key,
	})
}

// SetTrieKeyValues sets the key-values to the trie. When root is zero (""), the current root hash
// of the trie will be used, and the request will be blocked until all ongoing updates are finished
func SetTrieKeyValues(
	ctx context.Context,
	cli apiPB.APIServiceClient,
	id,
	root string,
	rangeable interface{},
) (nextRoot string, er error) {
	setCli, err := cli.SetTrieKeyValues(ctx)
	if err != nil {
		er = err
		return
	}
	defer func() {
		// make sure CloseAndRecv is always called
		// https://grpc.io/docs/reference/go/generated-code/#client-streaming-methods-1
		tr, err := setCli.CloseAndRecv()
		if err != nil {
			er = err
		}

		nextRoot = tr.GetRoot()
	}()

	first := true

	send := func(kv *apiPB.KeyValue) error {
		if first {
			first = false

			kv.Metadata = &apiPB.KeyValue_TrieKeyValuesRequest{
				TrieKeyValuesRequest: &apiPB.TrieKeyValuesRequest{
					TrieId: id,
					Root:   root,
				},
			}
		}

		err := setCli.Send(kv)
		if err != nil {
			return err
		}

		return nil
	}

	switch r := rangeable.(type) {
	case []*apiPB.KeyValue:
		for _, kv := range r {
			err := send(kv)
			if err != nil {
				er = err
				return
			}
		}
	case chan *apiPB.KeyValue:
		for kv := range r {
			err := send(kv)
			if err != nil {
				er = err
				return
			}
		}
	case <-chan *apiPB.KeyValue:
		for kv := range r {
			err := send(kv)
			if err != nil {
				er = err
				return
			}
		}
	default:
		er = fmt.Errorf("unexpected rangeable type: %T", r)
		return
	}

	return
}

// GetTrieRoots gets roots of a trie. This is a series of roots showing the modification history of
// a trie
func GetTrieRoots(
	ctx context.Context,
	cli apiPB.APIServiceClient,
	id string,
	filter *apiPB.RootFilter,
) (trCH <-chan *apiPB.TrieRoot, errCH <-chan error) {
	trChan := make(chan *apiPB.TrieRoot, 3)
	errChan := make(chan error, 1)

	go func() {
		defer close(trChan)
		defer close(errChan)

		var er error

		defer func() {
			if er != nil {
				errChan <- er
			}
		}()

		getCli, err := cli.GetTrieRoots(ctx, &apiPB.TrieRootsRequest{
			TrieId:     id,
			RootFilter: filter,
		})
		if err != nil {
			er = err
			return
		}

		for {
			tr, err := getCli.Recv()
			if err != nil {
				if errors.Is(err, io.EOF) {
					break
				}

				er = err
				return
			}

			select {
			case <-ctx.Done():
				er = ctx.Err()
				return
			case trChan <- tr:
			}
		}

		return
	}()

	trCH = trChan
	errCH = errChan
	return
}

// SetTrieRoot sets the root of a trie to the given one. This will add an entry in the root history
func SetTrieRoot(
	ctx context.Context,
	cli apiPB.APIServiceClient,
	id,
	root string,
) (er error) {
	_, er = cli.SetTrieRoot(ctx, &apiPB.SetTrieRootRequest{
		TrieId: id,
		Root:   root,
	})
	return
}

// GetTrieProofs gets proofs of a trie
func GetTrieProofs(
	ctx context.Context,
	cli apiPB.APIServiceClient,
	id string,
	filter *apiPB.RootFilter,
) (tpCH <-chan *apiPB.TrieProof, errCH <-chan error) {
	tpChan := make(chan *apiPB.TrieProof, 3)
	errChan := make(chan error, 1)

	go func() {
		defer close(tpChan)
		defer close(errChan)

		var er error

		defer func() {
			if er != nil {
				errChan <- er
			}
		}()

		getCli, err := cli.GetTrieProofs(ctx, &apiPB.TrieProofsRequest{
			TrieId:     id,
			RootFilter: filter,
		})
		if err != nil {
			er = err
			return
		}

		for {
			tp, err := getCli.Recv()
			if err != nil {
				if errors.Is(err, io.EOF) {
					break
				}

				er = err
				return
			}

			select {
			case <-ctx.Done():
				er = ctx.Err()
				return
			case tpChan <- tp:
			}
		}

		return
	}()

	tpCH = tpChan
	errCH = errChan
	return
}

// GetTrieProof gets a trie proof by either proof ID or root. If by root, the latest proof of
// that root will be returned
func GetTrieProof(
	ctx context.Context,
	cli apiPB.APIServiceClient,
	trieID,
	proofID,
	trieRoot string,
) (tp *apiPB.TrieProof, er error) {
	request := &apiPB.TrieProofRequest{
		TrieId: trieID,
	}

	if proofID != "" {
		request.Query = &apiPB.TrieProofRequest_ProofId{
			ProofId: proofID,
		}
	} else {
		request.Query = &apiPB.TrieProofRequest_RootFilter{
			RootFilter: &apiPB.RootFilter{
				Root: trieRoot,
			},
		}
	}

	return cli.GetTrieProof(ctx, request)
}

// SubscribeTrieProof subscribes to the given trie proof
func SubscribeTrieProof(
	ctx context.Context,
	cli apiPB.APIServiceClient,
	trieID,
	proofID string,
) (tpCH <-chan *apiPB.TrieProof, errCH <-chan error) {
	tpChan := make(chan *apiPB.TrieProof)
	errChan := make(chan error, 1)

	go func() {
		defer close(tpChan)
		defer close(errChan)

		var er error

		defer func() {
			if er != nil {
				errChan <- er
			}
		}()

		subCli, err := cli.SubscribeTrieProof(ctx, &apiPB.TrieProofRequest{
			TrieId: trieID,
			Query: &apiPB.TrieProofRequest_ProofId{
				ProofId: proofID,
			},
		})
		if err != nil {
			er = err
			return
		}

		for {
			tp, err := subCli.Recv()
			if err != nil {
				if errors.Is(err, io.EOF) {
					break
				}

				er = err
				return
			}

			select {
			case <-ctx.Done():
				er = ctx.Err()
				return
			case tpChan <- tp:
			}
		}
	}()

	tpCH = tpChan
	errCH = errChan
	return
}

// CreateTrieProof creates a trie proof for the given trie root. When root is zero (""), the current
// root hash of the trie will be used, and the request will be blocked until all ongoing updates are
// finished
func CreateTrieProof(
	ctx context.Context,
	cli apiPB.APIServiceClient,
	id,
	root string,
	anchorType anchorPB.Anchor_Type,
) (tp *apiPB.TrieProof, er error) {
	return cli.CreateTrieProof(ctx, &apiPB.CreateTrieProofRequest{
		TrieId:     id,
		Root:       root,
		AnchorType: anchorType,
	})
}

// DeleteTrieProof deletes a proof for a trie root
func DeleteTrieProof(
	ctx context.Context,
	cli apiPB.APIServiceClient,
	id,
	proofID string,
) (tp *apiPB.TrieProof, er error) {
	return cli.DeleteTrieProof(ctx, &apiPB.DeleteTrieProofRequest{
		TrieId:  id,
		ProofId: proofID,
	})
}

// VerifyTrieProof verifies the given trie proof. When dotGraphOutputPath is non-zero, a Graphviz
// Dot Graph will be output
func VerifyTrieProof(
	ctx context.Context,
	cli apiPB.APIServiceClient,
	id,
	proofID string,
	outputKeyValues bool,
	dotGraphOutputPath string,
) (kvCH <-chan *apiPB.KeyValue, rpCH <-chan *apiPB.VerifyProofReply, errCH <-chan error) {
	kvChan := make(chan *apiPB.KeyValue, 10)
	rpChan := make(chan *apiPB.VerifyProofReply, 1)
	errChan := make(chan error, 1)

	go func() {
		defer close(kvChan)
		defer close(rpChan)
		defer close(errChan)

		var er error

		defer func() {
			if er != nil {
				errChan <- er
			}
		}()

		stream, err := cli.VerifyTrieProof(ctx, &apiPB.VerifyTrieProofRequest{
			TrieId:          id,
			ProofId:         proofID,
			OutputKeyValues: outputKeyValues,
			OutputDotGraph:  dotGraphOutputPath != "",
		})
		if err != nil {
			er = err
			return
		}

		sr := apiPB.NewVerifyProofReplyStreamReader(stream)
		// remember to always close. The optional error will be notified to receivers
		defer func() {
			sr.Close(er)
		}()

		eg, ctx := errgroup.WithContext(ctx)

		if dotGraphOutputPath != "" {
			eg.Go(func() (er error) {
				// dot graph
				outFile, err := os.Create(dotGraphOutputPath)
				if err != nil {
					return err
				}
				defer func() {
					err := outFile.Close()
					if err != nil {
						er = err
					}
				}()

				_, er = io.Copy(outFile, sr.DotGraph)
				return
			})
		}

		eg.Go(func() error {
			for kv := range sr.KeyValues() {
				select {
				case <-ctx.Done():
					return ctx.Err()
				case kvChan <- kv:
				}
			}

			return nil
		})

		eg.Go(func() (er error) {
			for rp := range sr.Reply() {
				select {
				case <-ctx.Done():
					return ctx.Err()
				case rpChan <- rp:
				}
			}

			return nil
		})

		err = eg.Wait()
		if err != nil {
			er = err
			return
		}

		er = sr.Err()
		return
	}()

	kvCH = kvChan
	rpCH = rpChan
	errCH = errChan
	return
}

// CreateKeyValuesProof creates a key-values proof for the provided key-values out of the given trie
// proof. When ProofID is zero, a new trie proof will be created on-the-fly
func CreateKeyValuesProof(
	ctx context.Context,
	cli apiPB.APIServiceClient,
	trieID,
	proofID string,
	filter *apiPB.KeyValuesFilter,
	outputPath string,
) (er error) {
	request := &apiPB.CreateKeyValuesProofRequest{
		TrieId: trieID,
		Filter: filter,
	}

	if proofID != "" {
		request.TrieProof = &apiPB.CreateKeyValuesProofRequest_ProofId{
			ProofId: proofID,
		}
	} else {
		// this is equivalent to a nil request
		request.TrieProof = &apiPB.CreateKeyValuesProofRequest_Request{
			Request: &apiPB.CreateTrieProofRequest{
				TrieId: trieID,
				Root:   "",
			},
		}
	}

	stream, err := cli.CreateKeyValuesProof(ctx, request)
	if err != nil {
		return err
	}

	rc := apiPB.NewDataStreamReader(stream, nil)
	defer rc.Close()

	outFile, err := os.Create(outputPath)
	if err != nil {
		return err
	}
	defer outFile.Close()

	_, er = io.Copy(outFile, rc)
	return
}

// VerifyKeyValuesProof verifies the given key-values proof. When dotGraphOutputPath is non-zero, a
// Graphviz Dot Graph will be output
func VerifyKeyValuesProof(
	ctx context.Context,
	cli apiPB.APIServiceClient,
	path string,
	outputKeyValues bool,
	dotGraphOutputPath string,
) (kvCH <-chan *apiPB.KeyValue, rpCH <-chan *apiPB.VerifyProofReply, errCH <-chan error) {
	kvChan := make(chan *apiPB.KeyValue, 10)
	rpChan := make(chan *apiPB.VerifyProofReply, 1)
	errChan := make(chan error, 1)

	go func() {
		defer close(kvChan)
		defer close(rpChan)
		defer close(errChan)

		var er error

		defer func() {
			if er != nil {
				errChan <- er
			}
		}()

		// stream in the key-values proof
		inFile, err := os.Open(path)
		if err != nil {
			er = err
			return
		}
		defer inFile.Close()

		stream, err := cli.VerifyKeyValuesProof(ctx)
		if err != nil {
			er = err
			return
		}

		eg, ctx := errgroup.WithContext(ctx)

		eg.Go(func() (er error) {
			wc := apiPB.NewDataStreamWriter(
				stream,
				func() (md apiPB.DataChunkMetadata, er error) {
					md = &apiPB.DataChunk_VerifyKeyValuesProofRequest{
						VerifyKeyValuesProofRequest: &apiPB.VerifyKeyValuesProofRequest{
							OutputKeyValues: outputKeyValues,
							OutputDotGraph:  dotGraphOutputPath != "",
						},
					}
					return
				},
			)
			defer func() {
				wc.Close()

				// IMPORTANT: when finish sending the proof, we must call this to notify server-side
				// that an EOF has been reached, because, otherwise, this CloseSend is only called when
				// both sending and receiving have finished, which is a deadlock
				err := stream.CloseSend()
				if err != nil {
					er = err
				}
			}()

			_, er = io.Copy(wc, inFile)
			return
		})

		// stream out the results
		sr := apiPB.NewVerifyProofReplyStreamReader(stream)
		// remember to always close. The optional error will be notified to receivers
		defer func() {
			sr.Close(er)
		}()

		if dotGraphOutputPath != "" {
			eg.Go(func() (er error) {
				// dot graph
				outFile, err := os.Create(dotGraphOutputPath)
				if err != nil {
					return err
				}
				defer func() {
					err := outFile.Close()
					if err != nil {
						er = err
					}
				}()

				_, er = io.Copy(outFile, sr.DotGraph)
				return
			})
		}

		eg.Go(func() error {
			for kv := range sr.KeyValues() {
				select {
				case <-ctx.Done():
					return ctx.Err()
				case kvChan <- kv:
				}
			}

			return nil
		})

		eg.Go(func() (er error) {
			for rp := range sr.Reply() {
				select {
				case <-ctx.Done():
					return ctx.Err()
				case rpChan <- rp:
				}
			}

			return nil
		})

		err = eg.Wait()
		if err != nil {
			er = err
			return
		}

		er = sr.Err()
		return
	}()

	kvCH = kvChan
	rpCH = rpChan
	errCH = errChan
	return
}
