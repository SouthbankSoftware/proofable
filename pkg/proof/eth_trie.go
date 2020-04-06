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
 * @Last modified time: 2020-04-06T10:01:47+10:00
 */

package proof

import (
	"bytes"

	"github.com/SouthbankSoftware/proofable/pkg/hasher"
	ap "github.com/SouthbankSoftware/proofable/pkg/protos/anchor"
	"github.com/SouthbankSoftware/provendb-verify/pkg/proof/binary"
)

// EthTrie represents a confirmed proof for pieces of data in Ethereum Trie (ETH_TRIE) format
type EthTrie struct {
	AnchorType  string   `json:"anchorType"`
	TxnID       string   `json:"txnId"`
	TxnURI      string   `json:"txnUri"`
	BlockTime   uint64   `json:"blockTime,omitempty"`
	BlockNumber uint64   `json:"blockNumber,omitempty"`
	TrieNodes   [][]byte `json:"trieNodes,omitempty"`
}

// NewEthTrie creates a new EthTrie
func NewEthTrie(
	acType ap.Anchor_Type,
	txnID,
	txnURI string,
	pfTrie [][]byte,
) *EthTrie {
	return &EthTrie{
		AnchorType: acType.String(),
		TxnID:      txnID,
		TxnURI:     txnURI,
		TrieNodes:  pfTrie,
	}
}

// Unmarshal unmarshals current EthTrie
func (e *EthTrie) Unmarshal(data []byte) error {
	return binary.Base642Proof(bytes.NewReader(data), e)
}

// Marshal marshals current EthTrie
func (e *EthTrie) Marshal() ([]byte, error) {
	w := &bytes.Buffer{}

	err := binary.Proof2Base64(e, w)
	if err != nil {
		return nil, err
	}

	return w.Bytes(), nil
}

// Root returns current EthTrie's merkle root
func (e *EthTrie) Root() []byte {
	hasher := hasher.NewKeccak()
	hash := make([]byte, hasher.Size())

	hasher.Reset()

	if len(e.TrieNodes) > 0 {
		hasher.Write(e.TrieNodes[0])
	}

	hasher.Read(hash)

	return hash
}
