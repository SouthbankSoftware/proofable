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
 * @Date:   2020-02-18T16:30:55+11:00
 * @Last modified by:   guiguan
 * @Last modified time: 2020-04-03T15:57:55+11:00
 */

package api

import (
	"context"

	apiPB "github.com/SouthbankSoftware/proofable/pkg/protos/api"
)

const (
	// anchorKeySepLen is the length of the key separator for the top anchor trie. For normal
	// Proof_ETH_TRIE format, it should be 1; for signed Proof_ETH_TRIE_SIGNED, it should be 2
	anchorKeySepLen = 1
)

// InterceptKeyValueStream intercepts the key-value stream with the given callback function
func InterceptKeyValueStream(
	ctx context.Context,
	input <-chan *apiPB.KeyValue,
	fn func(kv *apiPB.KeyValue) *apiPB.KeyValue,
) (output <-chan *apiPB.KeyValue) {
	ch := make(chan *apiPB.KeyValue)

	go func() {
		defer close(ch)

		for kv := range input {
			kv = fn(kv)

			select {
			case <-ctx.Done():
				return
			case ch <- kv:
			}
		}
	}()

	output = ch
	return
}

// StripCompoundKeyAnchorTriePart strips away the anchor trie part from the compound key. The anchor
// trie part of a key is added by Anchor Service after a successful anchoring
func StripCompoundKeyAnchorTriePart(
	kv *apiPB.KeyValue,
) *apiPB.KeyValue {
	if len(kv.KeySep) < anchorKeySepLen {
		return kv
	}

	kv.Key = kv.Key[kv.KeySep[anchorKeySepLen-1]:]
	kv.KeySep = kv.KeySep[anchorKeySepLen:]

	return kv
}
