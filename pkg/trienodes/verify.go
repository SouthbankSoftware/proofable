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
 * @Date:   2020-12-17T15:45:53+11:00
 * @Last modified by:   guiguan
 * @Last modified time: 2020-12-17T17:53:46+11:00
 */

package trienodes

import (
	"bytes"
	"errors"
	"fmt"

	apiPB "github.com/SouthbankSoftware/proofable/pkg/protos/api"
	"github.com/SouthbankSoftware/proofable/pkg/trie"
	"github.com/ethereum/go-ethereum/ethdb"
)

const (
	labelMaxValueLength = 32
)

var (
	// ErrTrieCycleDetected is the error returned when trie cycle is detected
	ErrTrieCycleDetected = errors.New("trie cycle detected")
	// ErrTrieTraversalStopped is the error returned when trie traversal is stopped by a callback
	// function
	ErrTrieTraversalStopped = errors.New("trie traversal stopped")
	// ErrTrieRawKeyMissing is the error when a trie raw key is missing
	ErrTrieRawKeyMissing = errors.New("trie raw key missing")

	fullNodeVisitingOrder = []int{16, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15}
)

// OnTrieNodeFunc represents the function type that is called whenever a trie node is retrieved
// during a traversal. Return an error will stop the traversal. To halt the traversal earlier,
// return a ErrTrieTraversalStopped
type OnTrieNodeFunc func(rawKey, rawValue []byte) error

// OnKeyValueFunc represents the function type that is called whenever a key-value is retrieved
// during a traversal. Return an error will stop the traversal. To halt the traversal earlier,
// return a ErrTrieTraversalStopped
type OnKeyValueFunc func(kv apiPB.KeyValue) error

// VerifyTrieNodesStoreOption represents the options for VerifyProof
type VerifyTrieNodesStoreOption struct {
	Store      ethdb.KeyValueReader
	Node       trie.Node
	OnTrieNode OnTrieNodeFunc
	OnKeyValue OnKeyValueFunc

	keyPrefix        []byte
	parentTrieKey    []byte
	parentTrieKeySep []uint32
}

// VerifyTrieNodesStore verifies the trie nodes contained in the store. If it succeeds, it will
// return a set of key-value pairs the trie nodes contains, after which it is up to the caller to
// verify the key-value pairs
func VerifyTrieNodesStore(option VerifyTrieNodesStoreOption) error {
	if option.Node == nil {
		return nil
	}

	handleNestedErr := func(err error) error {
		if errors.Is(err, ErrTrieTraversalStopped) &&
			len(option.keyPrefix) == 0 && len(option.parentTrieKey) == 0 {
			// at root trie's root
			return nil
		}

		return err
	}

	switch tn := option.Node.(type) {
	case *trie.ShortNode:
		o := option
		o.Node = tn.Val
		o.keyPrefix = append(option.keyPrefix, tn.Key...)

		return handleNestedErr(VerifyTrieNodesStore(o))
	case *trie.FullNode:
		for _, i := range fullNodeVisitingOrder {
			n := tn.Children[i]

			o := option
			o.Node = n
			o.keyPrefix = append(option.keyPrefix, byte(i))

			err := VerifyTrieNodesStore(o)
			if err != nil {
				if errors.Is(err, ErrTrieRawKeyMissing) {
					continue
				}

				return handleNestedErr(err)
			}
		}

		return nil
	case trie.HashNode:
		buf, _ := option.Store.Get(tn[:])
		if len(buf) == 0 {
			return fmt.Errorf("cannot retrieve hash node `%v`: %w", tn, ErrTrieRawKeyMissing)
		}

		if option.OnTrieNode != nil {
			err := option.OnTrieNode(tn[:], buf)
			if err != nil {
				return err
			}
		}

		n, err := trie.DecodeNode(tn[:], buf)
		if err != nil {
			return fmt.Errorf("cannot decode hash node `%v`: %w", tn, err)
		}

		o := option
		o.Node = n

		return handleNestedErr(VerifyTrieNodesStore(o))
	case trie.ValueNode:
		kv := apiPB.KeyValue{
			Key:   trie.HexToKeybytes(option.keyPrefix),
			Value: tn,
		}

		if option.OnKeyValue != nil {
			return option.OnKeyValue(apiPB.KeyValue{
				// copy-on-write
				Key: append(option.parentTrieKey[:len(
					option.parentTrieKey):len(
					option.parentTrieKey)], kv.Key...),
				KeySep: option.parentTrieKeySep,
				Value:  kv.Value,
			})
		}

		return nil
	default:
		return fmt.Errorf("invalid proof node type: %T", tn)
	}
}

// VerifyChainedTrieNodesStore verifies the chained trie nodes contained in the store. If it
// succeeds, it will return a set of key-value pairs the chained trie nodes contains, after which it
// is up to the caller to verify the key-value pairs. The `KeySep` in each `KeyValue` can be used to
// access the key within each tries
func VerifyChainedTrieNodesStore(option VerifyTrieNodesStoreOption) error {
	o := option
	o.OnKeyValue = func(kv apiPB.KeyValue) error {
		if val := bytes.TrimPrefix(kv.Value, []byte(markChained)); len(val) < len(kv.Value) {
			var (
				o    = option
				hash []byte
			)

			if v := bytes.TrimPrefix(val, []byte(byKey)); len(v) < len(val) {
				hash = kv.Last()
			} else if v := bytes.TrimPrefix(val, []byte(byValue)); len(v) < len(val) {
				hash = v
			} else {
				return errors.New("invalid `MarkChained*` value prefix")
			}

			if ok, _ := option.Store.Has(hash); !ok {
				if option.OnKeyValue != nil {
					return option.OnKeyValue(kv)
				}

				return nil
			}

			o.Node = trie.HashNode(hash)
			o.keyPrefix = nil
			o.parentTrieKey = kv.Key
			// copy-on-write
			o.parentTrieKeySep = append(kv.KeySep[:len(
				kv.KeySep):len(
				kv.KeySep)], uint32(len(kv.Key)))

			return VerifyChainedTrieNodesStore(o)
		}

		if option.OnKeyValue != nil {
			return option.OnKeyValue(kv)
		}

		return nil
	}

	return VerifyTrieNodesStore(o)
}
