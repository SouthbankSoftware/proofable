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
 * @Last modified time: 2020-10-21T18:18:40+11:00
 */

package cmd

import (
	"context"
	"errors"
	"fmt"
	"os"
	"time"

	"github.com/SouthbankSoftware/proofable/pkg/api"
	"github.com/SouthbankSoftware/proofable/pkg/colorcli"
	"github.com/SouthbankSoftware/proofable/pkg/diff"
	anchorPB "github.com/SouthbankSoftware/proofable/pkg/protos/anchor"
	apiPB "github.com/SouthbankSoftware/proofable/pkg/protos/api"
	"github.com/karrick/godirwalk"
	"github.com/spf13/cobra"
	"github.com/spf13/viper"
)

const (
	viperKeyVerifyProofInputPath = nameVerify + "." + nameProof + "." + nameInputPath
)

var cmdVerifyProof = &cobra.Command{
	Use:   fmt.Sprintf("%v <path>", nameProof),
	Short: "Verify a proof",
	Long:  fmt.Sprintf(`Verify a proof (%v) for the given path, ensuring the proof exists on the Blockchain and has not been falsified.`, api.FileExtensionTrie),
	Args:  cobra.ExactArgs(1),
	RunE: func(cmd *cobra.Command, args []string) error {
		// from this point, we should silence usage if error happens
		cmd.SilenceUsage = true

		verifiable := false

		filePath := args[0]
		trieInputPath, err := getTriePath(filePath,
			viper.GetString(viperKeyVerifyProofInputPath))
		if err != nil {
			return fmt.Errorf("invalid proof path: %w", err)
		}

		dotGraphOutputPath := viper.GetString(viperKeyVerifyDotGraphOutputPath)
		if dotGraphOutputPath != "" {
			err := checkFilePath(dotGraphOutputPath, api.FileExtensionDotGraph)
			if err != nil {
				return fmt.Errorf("invalid dot graph output path: %w", err)
			}
		}

		quiet := viper.GetBool(viperKeyQuiet)

		ctx, cancel := context.WithCancel(context.Background())
		defer cancel()

		creds, err := getCreds(ctx)
		if err != nil {
			return err
		}

		var (
			triePf *apiPB.TrieProof
			df     = &differ{
				quiet: quiet,
			}
		)

		err = api.WithAPIClient(
			viper.GetString(viperKeyAPIHostPort),
			creds,
			func(cli apiPB.APIServiceClient) error {
				var (
					totalTimeStart,
					walkTimeStart time.Time
				)

				totalTimeStart = time.Now()

				defer func() {
					endTime := time.Now()
					totalTime := endTime.Sub(totalTimeStart)
					importTime := walkTimeStart.Sub(totalTimeStart)
					walkTime := endTime.Sub(walkTimeStart)

					colorcli.Infolnf("finished verification in %s\n\timport: %s\n\twalk: %s",
						totalTime,
						importTime,
						walkTime)
				}()

				verifyProof := func(id, proofID string) error {
					walkTimeStart = time.Now()

					rightStream, rpCH, rightErrCH := api.VerifyTrieProof(ctx, cli, id, proofID,
						true, dotGraphOutputPath)

					rightStream = api.InterceptKeyValueStream(ctx, rightStream,
						api.StripCompoundKeyAnchorTriePart)

					trieMetadata, err := getFileTrieRootMetadata(rightStream)
					if err == nil {
						if trieMetadata.Version != fileTrieVersion {
							return fmt.Errorf("file proof version mismatched, expected `%v` but got `%v`",
								fileTrieVersion, trieMetadata.Version)
						}

						// make sure it is ordered
						leftStream, leftErrCH := api.GetFilePathKeyValueStream(ctx, filePath, 0, true,
							func(key, fp string, de *godirwalk.Dirent) (kvs []*apiPB.KeyValue, er error) {
								if trieMetadata.IncludeMetadata {
									return api.GetFilePathKeyMetadataKeyValues(key, fp, de)
								}

								return
							})

						err = diff.OrderedKeyValueStreams(leftStream, rightStream, df.push)
						if err != nil {
							return err
						}

						err = <-leftErrCH
						if err != nil {
							return err
						}
					}

					err = <-rightErrCH
					if err != nil {
						return err
					}

					verifiable = true
					rp := <-rpCH
					if !rp.GetVerified() {
						return errors.New(rp.GetError())
					}

					return nil
				}

				cloudTrie := &CloudTrie{}

				// try cloud trie first, if fails, try local trie
				err := cloudTrie.Load(trieInputPath)
				if err != nil {
					if os.IsNotExist(err) {
						return err
					}

					// try local trie
					return api.WithImportedTrie(ctx, cli, "", trieInputPath, apiPB.Trie_LOCAL,
						func(id, root string) error {
							tp, err := api.GetTrieProof(ctx, cli, id, "", root)
							if err != nil {
								return err
							}

							triePf = tp
							return verifyProof(id, tp.GetId())
						})
				}

				return verifyProof(cloudTrie.ID, cloudTrie.ProofID)
			})
		if err != nil {
			if verifiable {
				colorcli.Faillnf("the proof at %s with a root hash of %s is falsified: %s",
					colorcli.Red(trieInputPath),
					colorcli.Red(triePf.GetProofRoot()),
					unpackGRPCErr(err))

				return errSilentExitWithNonZeroCode
			}

			colorcli.Faillnf("the proof at %s is unverifiable: %s",
				colorcli.Red(trieInputPath),
				unpackGRPCErr(err))

			return errSilentExitWithNonZeroCode
		}

		colorcli.Passlnf("the proof at %s with a root hash of %s is anchored to %s in block %v with transaction %s at %s, which can be viewed at %s",
			colorcli.Green(trieInputPath),
			colorcli.Green(triePf.GetProofRoot()),
			colorcli.Green(triePf.GetAnchorType()),
			colorcli.Green(anchorPB.GetBlockNumberString(
				triePf.GetAnchorType().String(),
				triePf.GetBlockTime(),
				triePf.GetBlockTimeNano(),
				triePf.GetBlockNumber())),
			colorcli.Green(triePf.GetTxnId()),
			colorcli.Green(time.Unix(
				int64(triePf.GetBlockTime()),
				int64(triePf.GetBlockTimeNano())).Format(time.UnixDate)),
			colorcli.Green(triePf.GetTxnUri()))

		if df.passedKV != df.totalKV {
			colorcli.Faillnf("the path at %s is falsified: mismatched with proof key-values\n\ttotal: %v\n\t%s\n\t%s\n\t%s\n\t%s",
				colorcli.Red(filePath),
				df.totalKV,
				colorcli.Green("passed: ", df.passedKV),
				colorcli.Red("changed: ", df.changedKV),
				colorcli.Red("untracked: ", df.untrackedKV),
				colorcli.Red("missing: ", df.missingKV))

			return errSilentExitWithNonZeroCode
		}

		colorcli.Passlnf("the path at %s is verified, which contains %s key-values",
			colorcli.Green(filePath),
			colorcli.Green(df.totalKV))

		return nil
	},
}

func init() {
	cmdVerify.AddCommand(cmdVerifyProof)

	cmdVerifyProof.Flags().StringP(nameInputPath, shorthandProofPath, "", "specify the proof input path")
	viper.BindPFlag(viperKeyVerifyProofInputPath, cmdVerifyProof.Flags().Lookup(nameInputPath))
}
