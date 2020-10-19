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
 * @Date:   2019-09-16T16:21:53+10:00
 * @Last modified by:   guiguan
 * @Last modified time: 2020-10-05T22:50:13+11:00
 */

package cmd

import (
	"context"
	"fmt"
	"time"

	"github.com/SouthbankSoftware/proofable/pkg/api"
	"github.com/SouthbankSoftware/proofable/pkg/colorcli"
	anchorPB "github.com/SouthbankSoftware/proofable/pkg/protos/anchor"
	apiPB "github.com/SouthbankSoftware/proofable/pkg/protos/api"
	"github.com/SouthbankSoftware/proofable/pkg/strutil"
	"github.com/spf13/cobra"
	"github.com/spf13/viper"
)

const (
	nameProofPath = "proof-path"

	viperKeyCreateSubproofProofPath  = nameCreate + "." + nameSubproof + "." + nameProofPath
	viperKeyCreateSubproofOutputPath = nameCreate + "." + nameSubproof + "." + nameOutputPath
)

var cmdCreateSubproof = &cobra.Command{
	Use:   fmt.Sprintf("%v <key ...>", nameSubproof),
	Short: "Create a subproof out of an existing proof",
	Long: fmt.Sprintf(`Create a subproof (%v) out of an existing proof (%v). The subproof can independently prove a subset of the proof's key-values

Each <key> must be a valid key from the output of "%s/%s %s"
`, api.FileExtensionKeyValuesProof, api.FileExtensionTrie, nameCreate, nameVerify, nameProof),
	Args: cobra.MinimumNArgs(1),
	RunE: func(cmd *cobra.Command, args []string) error {
		// from this point, we should silence usage if error happens
		cmd.SilenceUsage = true

		quiet := viper.GetBool(viperKeyQuiet)

		keyMap := map[string]struct{}{}
		filter := &apiPB.KeyValuesFilter{}

		for _, a := range args {
			if _, ok := keyMap[a]; ok {
				// already exists, skip
				continue
			}
			keyMap[a] = struct{}{}

			if !quiet {
				colorcli.Printf("%s\n", a)
			}

			filter.Keys = append(filter.Keys, &apiPB.Key{
				Key: api.NormalizeKey(strutil.Bytes(a)),
			})
		}

		triePath := viper.GetString(viperKeyCreateSubproofProofPath)
		err := checkFilePath(triePath, api.FileExtensionTrie)
		if err != nil {
			return fmt.Errorf("invalid proof path: %w", err)
		}

		kvpOutputPath := viper.GetString(viperKeyCreateSubproofOutputPath)
		err = checkFilePath(kvpOutputPath, api.FileExtensionKeyValuesProof)
		if err != nil {
			return fmt.Errorf("invalid subproof output path: %w", err)
		}

		ctx, cancel := context.WithCancel(context.Background())
		defer cancel()

		creds, err := getCreds(ctx)
		if err != nil {
			return err
		}

		return api.WithAPIClient(
			viper.GetString(viperKeyAPIHostPort),
			creds,
			func(cli apiPB.APIServiceClient) error {
				return api.WithImportedTrie(ctx, cli, "", apiPB.Trie_LOCAL, triePath,
					func(id, root string) error {
						tp, err := api.GetTrieProof(ctx, cli, id, "", root)
						if err != nil {
							return err
						}

						err = api.CreateKeyValuesProof(ctx, cli, id, tp.GetId(), filter,
							kvpOutputPath)
						if err != nil {
							return err
						}

						colorcli.Oklnf("the subproof has successfully been created at %s with %s key-values and a root hash of %s, which is anchored to %s in block %v with transaction %s at %s, which can be viewed at %s",
							colorcli.Green(kvpOutputPath),
							colorcli.Green(len(filter.Keys), " or more"),
							colorcli.Green(tp.GetProofRoot()),
							colorcli.Green(tp.GetAnchorType()),
							colorcli.Green(anchorPB.GetBlockNumberString(
								tp.GetAnchorType().String(),
								tp.GetBlockTime(),
								tp.GetBlockTimeNano(),
								tp.GetBlockNumber())),
							colorcli.Green(tp.GetTxnId()),
							colorcli.Green(time.Unix(
								int64(tp.GetBlockTime()),
								int64(tp.GetBlockTimeNano())).Format(time.UnixDate)),
							colorcli.Green(tp.GetTxnUri()))

						return nil
					})
			})
	},
}

func init() {
	cmdCreate.AddCommand(cmdCreateSubproof)

	cmdCreateSubproof.Flags().StringP(nameProofPath, shorthandProofPath, "", "specify the proof path")
	err := cmdCreateSubproof.MarkFlagRequired(nameProofPath)
	if err != nil {
		panic(err)
	}
	viper.BindPFlag(viperKeyCreateSubproofProofPath, cmdCreateSubproof.Flags().Lookup(nameProofPath))

	cmdCreateSubproof.Flags().StringP(nameOutputPath, shorthandSubproofPath,
		defaultSubproofPath, "specify the subproof output path")
	viper.BindPFlag(viperKeyCreateSubproofOutputPath, cmdCreateSubproof.Flags().Lookup(nameOutputPath))
}
