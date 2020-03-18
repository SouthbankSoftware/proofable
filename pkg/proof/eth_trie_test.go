/*
 * @Author: guiguan
 * @Date:   2019-11-07T15:43:47+11:00
 * @Last modified by:   guiguan
 * @Last modified time: 2020-03-17T13:13:51+11:00
 */

package proof

import (
	"reflect"
	"testing"
)

func TestEthTrie_Binary(t *testing.T) {
	et := EthTrie{
		TrieNodes: [][]byte{[]byte("a"), []byte("b"), []byte("d"), []byte("c")},
	}

	data, err := et.Marshal()
	if err != nil {
		t.Fatal(err)
	}

	newEt := EthTrie{}

	err = newEt.Unmarshal(data)
	if err != nil {
		t.Fatal(err)
	}

	if !reflect.DeepEqual(newEt, et) {
		t.Fatal("newEt != et")
	}
}
