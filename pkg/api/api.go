/*
 * @Author: guiguan
 * @Date:   2020-02-15T08:42:02+11:00
 * @Last modified by:   guiguan
 * @Last modified time: 2020-02-18T22:22:40+11:00
 */

package api

import (
	"context"
	"errors"
	"fmt"
	"io"
	"os"

	apiPB "github.com/SouthbankSoftware/provenx-api/pkg/api/proto"
	"github.com/golang/protobuf/ptypes/empty"
)

// CreateTrie creates a new trie
func CreateTrie(ctx context.Context, cli apiPB.APIServiceClient) (
	id, root string, er error) {
	tr, err := cli.CreateTrie(ctx, &empty.Empty{})
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
func WithTrie(ctx context.Context, cli apiPB.APIServiceClient,
	fn func(id string) error) (er error) {
	id, _, err := CreateTrie(ctx, cli)
	if err != nil {
		return err
	}
	defer func() {
		err := DeleteTrie(ctx, cli, id)
		if err != nil && er == nil {
			er = err
		}
	}()

	return fn(id)
}

// SetTrieKeyValues sets the key-values to the trie
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

// CreateTrieProof creates a trie proof for the given trie root
func CreateTrieProof(
	ctx context.Context,
	cli apiPB.APIServiceClient,
	id,
	root string,
) (tp *apiPB.TrieProof, er error) {
	return cli.CreateTrieProof(ctx, &apiPB.CreateTrieProofRequest{
		TrieId: id,
		Root:   root,
	})
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
