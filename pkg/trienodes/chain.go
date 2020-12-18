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
 * @Last modified time: 2020-12-17T17:53:34+11:00
 */

package trienodes

import (
	"bytes"
)

const (
	markChained = "MKC"
	byKey       = "BK"
	byValue     = "BV"

	// MarkChainedByKey is used as a value placeholder in a parent TrieNodes (PP), which indicates
	// that there is a child TrieNodes (CP) chained up in the PP with the key as the CP's root hash
	// and the value equals to this placeholder.
	MarkChainedByKey = markChained + byKey
	// MarkChainedByValue is used to prefix a value in a parent TrieNodes (PP), which indicates that
	// there is a child TrieNodes (CP) chained up in the PP with the prefix + CP's root hash as the
	// value in PP.
	MarkChainedByValue = markChained + byValue
)

// ChainedBy represents a chained by type
type ChainedBy int

const (
	// NotChained is not chained
	NotChained ChainedBy = iota
	// ChainedByKey is chained by key
	ChainedByKey
	// ChainedByValue is chained by value
	ChainedByValue
)

// IsChainedByKey indicates whether the value is a meta value that means chained by key
func IsChainedByKey(value []byte) bool {
	if _, tp := GetChainedBy(value); tp == ChainedByKey {
		return true
	}

	return false
}

// IsChainedByValue indicates whether the value is chained by value. If so, the descendent key will
// be returned, and the ok will be true
func IsChainedByValue(value []byte) (key []byte, ok bool) {
	if v, tp := GetChainedBy(value); tp == ChainedByValue {
		key = v
		ok = true
		return
	}

	return
}

// GetChainedBy gets the value's descendent key and chained by type. When the type is ChainedByKey,
// the returned key is nil, and the user should use the key that is used to retrieve the value as
// the descendent key
func GetChainedBy(value []byte) (key []byte, tp ChainedBy) {
	if val := bytes.TrimPrefix(value, []byte(markChained)); len(val) < len(value) {
		if v := bytes.TrimPrefix(val, []byte(byKey)); len(v) < len(val) {
			key = nil
			tp = ChainedByKey
			return
		} else if v := bytes.TrimPrefix(val, []byte(byValue)); len(v) < len(val) {
			key = v
			tp = ChainedByValue
			return
		}
	}

	return
}

// ChainByKey returns the value to indicate that the key of the value should be used as the
// descendent key that is the root of the child trie
func ChainByKey() []byte {
	return []byte(MarkChainedByKey)
}

// ChainByValue marks the value as chained by key, where the value will be used as the descendent
// key that is the root of the child trie
func ChainByValue(value []byte) []byte {
	return append([]byte(MarkChainedByValue), value...)
}
