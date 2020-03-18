/*
 * @Author: guiguan
 * @Date:   2019-08-26T17:41:36+10:00
 * @Last modified by:   guiguan
 * @Last modified time: 2020-03-18T15:04:57+11:00
 */

package proof

import (
	"bytes"
	"encoding/hex"
	"fmt"
	"strings"
	"time"

	"github.com/SouthbankSoftware/provendb-verify/pkg/merkle"
	"github.com/SouthbankSoftware/provendb-verify/pkg/proof/binary"
	pb "github.com/SouthbankSoftware/provenx-cli/pkg/protos/anchor"
)

const (
	// ProvenDBPrefix is the ProvenDB prefix used in Chainpoint Path format
	ProvenDBPrefix = "pdb"
)

// ChpAnchor represents a Chainpoint anchor object
type ChpAnchor struct {
	Type     string   `json:"type"`
	AnchorID string   `json:"anchor_id"`
	URIS     []string `json:"uris"`
}

// ChpOps represents a Chainpoint ops object
type ChpOps struct {
	L       string      `json:"l,omitempty"`
	R       string      `json:"r,omitempty"`
	OP      string      `json:"op,omitempty"`
	Anchors []ChpAnchor `json:"anchors,omitempty"`
}

// ChpBranch represents a Chainpoint branch object
type ChpBranch struct {
	Label    string      `json:"label"`
	OPS      []ChpOps    `json:"ops"`
	Branches []ChpBranch `json:"branches,omitempty"`
}

// ChpPath represents a proof in Chainpoint Path format
type ChpPath struct {
	Context             string      `json:"@context"`
	Type                string      `json:"type"`
	Hash                string      `json:"hash"`
	HashIDNode          string      `json:"hash_id_node"`
	HashSubmittedNodeAt string      `json:"hash_submitted_node_at"`
	HashIDCore          string      `json:"hash_id_core"`
	HashSubmittedCoreAt string      `json:"hash_submitted_core_at"`
	Branches            []ChpBranch `json:"branches"`
}

func byteToString(b []byte) string {
	if bytes.HasPrefix(b, []byte(SignaturePrefix)) {
		return string(b)
	}

	return hex.EncodeToString(b)
}

// NewChpPathFromMerkleProof creates a new ChpPath proof from the given merkle proof
func NewChpPathFromMerkleProof(
	proof *merkle.Proof,
	derivedAt time.Time,
	anchorType pb.Anchor_Type,
	anchorID string,
	anchorURI string,
) (
	path *ChpPath,
	er error,
) {
	var hash []byte

	switch algo := proof.ValueHashAlgorithm; algo {
	case merkle.VHAS.None:
		hash = proof.Value
	default:
		er = fmt.Errorf("%s is not a supported value hash algorithm", algo)
		return
	}

	var hca string

	switch algo := proof.HashCombiningAlgorithm; algo {
	case merkle.HCAS.Sha256:
		hca = "sha-256"
	default:
		er = fmt.Errorf("%s is not a supported hash combining algorithm", algo)
		return
	}

	ops := []ChpOps{}

	for _, p := range proof.Path {
		if len(p.LeftHash) > 0 {
			ops = append(ops, ChpOps{
				L: byteToString(p.LeftHash),
			})
		} else {
			ops = append(ops, ChpOps{
				R: byteToString(p.RightHash),
			})
		}

		ops = append(ops, ChpOps{
			OP: hca,
		})
	}

	acTpStr := strings.ToLower(anchorType.String())

	ops = append(ops, ChpOps{
		Anchors: []ChpAnchor{
			{
				// hack the Chainpoint schema v3 so it doesn't use its ad-hoc `btc` or `eth` (in the future
				// of the time of this message) logic to parse the proof, f.i., the `expected_value` of
				// original `btc_anchor_branch` is a Bitcoin block merkle root in little endian and the
				// `expected_value` of our `pdb_btc_anchor_branch` is the OP_RETURN value in big endian
				Type:     "cal",
				AnchorID: anchorID,
				URIS:     []string{anchorURI},
			},
		},
	})

	derivedAtStr := derivedAt.UTC().Format(time.RFC3339)

	// hash ID is fixed here for simplicity. The generation process can be found here:
	// https://github.com/chainpoint/chainpoint-services/blob/750d503972f596e73b01a3d7f971f11fe501a016/node-api-service/lib/endpoints/hashes.js#L62
	path = &ChpPath{
		Context:             "https://w3id.org/chainpoint/v3",
		Type:                "Chainpoint",
		Hash:                hex.EncodeToString(hash),
		HashIDNode:          "da023c5c-c895-11e9-a32f-2a2ae2dbcce4",
		HashSubmittedNodeAt: derivedAtStr,
		HashIDCore:          "da023c5c-c895-11e9-a32f-2a2ae2dbcce4",
		HashSubmittedCoreAt: derivedAtStr,
		Branches: []ChpBranch{
			{
				Label: ProvenDBPrefix + "_" + acTpStr + "_anchor_branch",
				OPS:   ops,
			},
		},
	}
	return
}

// Unmarshal unmarshals current ChpPath
func (c *ChpPath) Unmarshal(data []byte) error {
	return binary.Base642Proof(bytes.NewReader(data), c)
}

// Marshal marshals current ChpPath
func (c *ChpPath) Marshal() ([]byte, error) {
	w := &bytes.Buffer{}

	err := binary.Proof2Base64(c, w)
	if err != nil {
		return nil, err
	}

	return w.Bytes(), nil
}
