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
 * @Date:   2019-11-07T15:43:47+11:00
 * @Last modified by:   guiguan
 * @Last modified time: 2020-04-03T15:57:55+11:00
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
