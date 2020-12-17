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
 * @Last modified time: 2020-12-17T17:53:41+11:00
 */

package trienodes

import (
	"bytes"
	"fmt"
	"io"
	"io/ioutil"
	"os"
	"testing"

	"github.com/SouthbankSoftware/proofable/pkg/hasher"
	apiPB "github.com/SouthbankSoftware/proofable/pkg/protos/api"
	"github.com/SouthbankSoftware/proofable/pkg/trie"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/ethdb/leveldb"
	"github.com/otiai10/copy"
)

func hashStream(r io.Reader) (hs []byte, er error) {
	hasher := hasher.NewKeccak()
	hash := make([]byte, hasher.Size())

	_, err := io.Copy(hasher, r)
	if err != nil {
		er = err
		return
	}

	_, err = hasher.Read(hash)
	if err != nil {
		er = err
		return
	}

	hs = hash
	return
}

func withVerifyTestStore(fn func(store *leveldb.Database) error) error {
	path := "data"

	err := os.MkdirAll(path, 0755)
	if err != nil {
		return err
	}

	tp, err := ioutil.TempDir(path, "verify_test_")
	if err != nil {
		return err
	}
	defer os.RemoveAll(tp)

	err = copy.Copy("testdata/verify_test_store", tp)
	if err != nil {
		return err
	}

	store, err := leveldb.New(tp, 0, 0, "")
	if err != nil {
		return err
	}
	defer store.Close()

	return fn(store)
}

func TestVerifyChainedTrieNodesStore(t *testing.T) {
	// get hash for verify_test_keys.txt
	keysFile, err := os.Open("testdata/verify_test_keys.txt")
	if err != nil {
		t.Fatal(err)
	}

	keysHash, err := hashStream(keysFile)
	if err != nil {
		t.Fatal(err)
	}

	err = keysFile.Close()
	if err != nil {
		t.Fatal(err)
	}

	err = withVerifyTestStore(func(store *leveldb.Database) error {
		rootHash := common.Hex2Bytes("c200ba751f37f6c946dc7d6c1ba508103de5c6c07e36fbc796d5c0f7e741d042")

		newKeysHasher := hasher.NewKeccak()

		// traverse the trie
		err = VerifyChainedTrieNodesStore(VerifyTrieNodesStoreOption{
			Store: store,
			Node:  trie.HashNode(rootHash),
			OnKeyValue: func(kv apiPB.KeyValue) error {
				fmt.Println(kv.KeyString())
				_, err := fmt.Fprintln(newKeysHasher, kv.KeyString())
				return err
			},
		})
		if err != nil {
			t.Fatal(err)
		}

		newKeysHash := make([]byte, newKeysHasher.Size())
		_, err = newKeysHasher.Read(newKeysHash)
		if err != nil {
			t.Fatal(err)
		}

		if !bytes.Equal(keysHash, newKeysHash) {
			t.Fatal("mismatched keys hashes")
		}

		return nil
	})
	if err != nil {
		t.Fatal(err)
	}
}

func TestVerifyChainedTrieNodesStore_stopTraversal(t *testing.T) {
	err := withVerifyTestStore(func(store *leveldb.Database) error {
		// traverse the trie
		rootHash := common.Hex2Bytes("c200ba751f37f6c946dc7d6c1ba508103de5c6c07e36fbc796d5c0f7e741d042")

		err := VerifyChainedTrieNodesStore(VerifyTrieNodesStoreOption{
			Store: store,
			Node:  trie.HashNode(rootHash),
			OnKeyValue: func(kv apiPB.KeyValue) error {
				if string(kv.Last()) == "ci/tasks/write-labels-to-file.yml" {
					// stop condition
					return ErrTrieTraversalStopped
				}

				return nil
			},
		})
		if err != nil {
			t.Fatal(err)
		}

		return nil
	})
	if err != nil {
		t.Fatal(err)
	}
}
