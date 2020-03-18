/*
 * @Author: guiguan
 * @Date:   2019-11-07T16:24:57+11:00
 * @Last modified by:   guiguan
 * @Last modified time: 2020-03-18T15:04:57+11:00
 */

package proof

import (
	"errors"
	"fmt"

	ap "github.com/SouthbankSoftware/provenx-cli/pkg/protos/anchor"
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
