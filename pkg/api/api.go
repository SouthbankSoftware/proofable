/*
 * @Author: guiguan
 * @Date:   2020-02-15T08:42:02+11:00
 * @Last modified by:   guiguan
 * @Last modified time: 2020-02-18T16:59:04+11:00
 */

package api

import (
	"context"
	"fmt"

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

// DeleteTrie deletes a trie
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
