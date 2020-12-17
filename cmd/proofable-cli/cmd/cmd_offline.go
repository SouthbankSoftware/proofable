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
 * @Date:   2020-12-17T14:50:13+11:00
 * @Last modified by:   guiguan
 * @Last modified time: 2020-12-17T17:55:52+11:00
 */

package cmd

import (
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"os"
	"time"

	"github.com/SouthbankSoftware/proofable/pkg/api"
	"github.com/SouthbankSoftware/proofable/pkg/colorcli"
	"github.com/SouthbankSoftware/proofable/pkg/hasher"
	"github.com/SouthbankSoftware/proofable/pkg/proof"
	anchorPB "github.com/SouthbankSoftware/proofable/pkg/protos/anchor"
	apiPB "github.com/SouthbankSoftware/proofable/pkg/protos/api"
	"github.com/SouthbankSoftware/proofable/pkg/strutil"
	"github.com/SouthbankSoftware/proofable/pkg/trie"
	"github.com/SouthbankSoftware/proofable/pkg/trienodes"
	"github.com/ethereum/go-ethereum/ethdb/memorydb"
	"github.com/spf13/cobra"
)

var cmdOffline = &cobra.Command{
	Use:   fmt.Sprintf("%v <subproof path>", nameOffline),
	Short: "Offline verify a subproof",
	Long: fmt.Sprintf(`Offline verify a subproof (%v). This subcommand demonstrates a minimal set of logics required to parse and verify a trie (https://docs.proofable.io/concepts/trie.html) structure
`,
		api.FileExtensionKeyValuesProof),
	Args: cobra.ExactArgs(1),
	RunE: func(cmd *cobra.Command, args []string) error {
		// from this point, we should silence usage if error happens
		cmd.SilenceUsage = true

		// check subproof path
		subproofPath := args[0]
		err := checkFilePath(subproofPath, api.FileExtensionKeyValuesProof)
		if err != nil {
			return fmt.Errorf("invalid subproof path: %w", err)
		}

		// decode subproof
		subproofFile, err := os.Open(subproofPath)
		if err != nil {
			return err
		}
		defer subproofFile.Close()

		// decode subproof header
		subproofHeader := &proof.EthTrie{}

		dec := json.NewDecoder(subproofFile)
		err = dec.Decode(subproofHeader)
		if err != nil {
			return err
		}

		// prepare the temp trie store
		store := memorydb.New()
		defer store.Close()

		ha := hasher.NewKeccak()
		hash := make([]byte, ha.Size())

		// decode the header (anchoring part) trie nodes
		for _, n := range subproofHeader.TrieNodes {
			ha.Reset()

			_, err := ha.Write(n)
			if err != nil {
				return err
			}

			_, err = ha.Read(hash)
			if err != nil {
				return err
			}

			err = store.Put(hash, n)
			if err != nil {
				return err
			}
		}

		// decode the body (your key-values) trie nodes
		node := []byte{}
		for {
			if err := dec.Decode(&node); err == io.EOF {
				break
			} else if err != nil {
				return err
			}

			ha.Reset()

			_, err := ha.Write(node)
			if err != nil {
				return err
			}

			_, err = ha.Read(hash)
			if err != nil {
				return err
			}

			// put will clone both key and value
			err = store.Put(hash, node)
			if err != nil {
				return err
			}
		}

		// verify the trie structure
		rootHash := subproofHeader.Root()
		rootHashStr := hex.EncodeToString(rootHash)

		err = trienodes.VerifyChainedTrieNodesStore(trienodes.VerifyTrieNodesStoreOption{
			Store: store,
			Node:  trie.HashNode(rootHash),
			OnKeyValue: func(kv apiPB.KeyValue) error {
				strippedKV := api.StripCompoundKeyAnchorTriePart(&kv)

				colorcli.Printf("%s %s -> %s\n",
					colorcli.HeaderGreen(" KV "),
					strutil.String(strutil.BytesWithoutNullChar(strippedKV.Key)),
					strutil.HexOrString(strippedKV.Value),
				)

				return nil
			},
		})
		if err != nil {
			colorcli.Faillnf("the subproof at %s with a root hash of %s is falsified: %s",
				colorcli.Red(subproofPath),
				colorcli.Red(rootHashStr),
				err)

			return errSilentExitWithNonZeroCode
		}

		colorcli.Printf("\nThe subproof at %s with a root hash of %s contains the above key-values, and claims that it has been anchored to %s in block %v with transaction %s at %s\n\nPlease %s the transaction details (timestamp, payload...) at %s\n",
			colorcli.Green(subproofPath),
			colorcli.Green(rootHashStr),
			colorcli.Green(subproofHeader.AnchorType),
			colorcli.Green(anchorPB.GetBlockNumberString(
				subproofHeader.AnchorType,
				subproofHeader.BlockTime,
				subproofHeader.BlockTimeNano,
				subproofHeader.BlockNumber)),
			colorcli.Green(subproofHeader.TxnID),
			colorcli.Green(time.Unix(
				int64(subproofHeader.BlockTime),
				int64(subproofHeader.BlockTimeNano)).Format(time.UnixDate)),
			colorcli.Yellow("MANUALLY CHECK"),
			colorcli.Green(subproofHeader.TxnURI))

		return nil
	},
}

func init() {
	cmdRoot.AddCommand(cmdOffline)
}
