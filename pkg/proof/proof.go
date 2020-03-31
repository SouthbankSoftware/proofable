/*
 * provenx-cli
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
 * @Date:   2019-11-07T16:24:57+11:00
 * @Last modified by:   guiguan
 * @Last modified time: 2020-03-31T16:38:30+11:00
 */

package proof

import (
	"errors"
	"fmt"

	ap "github.com/SouthbankSoftware/provenx/pkg/protos/anchor"
)

const (
	// SignaturePrefix is the prefix for the signature entry in a proof
	SignaturePrefix = "sig:"
)

var (
	// ErrSignatureMissing is the error when the signature is missing in a proof
	ErrSignatureMissing = errors.New("signature is missing")
)

// Proof represents an existence proof in the `data` field of the result that is returned by the
// ProvenDB Anchor Service gRPC API
type Proof interface {
	// Unmarshal unmarshals to current proof.Data
	Unmarshal(data []byte) error
	// Marshal marshals current proof.Data
	Marshal() ([]byte, error)
}

// NewProof returns a new proof
func NewProof(format ap.Proof_Format) (Proof, error) {
	switch format {
	case ap.Proof_CHP_PATH, ap.Proof_CHP_PATH_SIGNED:
		return &ChpPath{}, nil
	case ap.Proof_ETH_TRIE, ap.Proof_ETH_TRIE_SIGNED:
		return &EthTrie{}, nil
	default:
		return nil, fmt.Errorf("unsupported proof format: %s", format)
	}
}
