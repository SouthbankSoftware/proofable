/*
 * @Author: guiguan
 * @Date:   2019-09-16T16:21:53+10:00
 * @Last modified by:   guiguan
 * @Last modified time: 2020-02-21T01:21:59+11:00
 */

package cmd

import (
	"context"
	"errors"
	"fmt"
	"os"

	tnEnc "github.com/SouthbankSoftware/provendb-trie/pkg/trienodes/encoding"
	apiPB "github.com/SouthbankSoftware/provenx-api/pkg/api/proto"
	"github.com/SouthbankSoftware/provenx-cli/pkg/api"
	"github.com/SouthbankSoftware/provenx-cli/pkg/diff"
	"github.com/fatih/color"
	"github.com/spf13/cobra"
	"github.com/spf13/viper"
)

const (
	// anchorKeySepLen is the length of the key separator for the top anchor trie. For normal
	// Proof_ETH_TRIE format, it should be 1; for signed Proof_ETH_TRIE_SIGNED, it should be 2
	anchorKeySepLen = 1

	viperKeyVerifyTrieInputPath = nameVerify + "." + nameTrie + "." + nameInputPath
)

var cmdVerifyTrie = &cobra.Command{
	Use:   fmt.Sprintf("%v <path>", nameTrie),
	Short: "Verify a trie (.pxt) for the given path",
	Args:  cobra.ExactArgs(1),
	RunE: func(cmd *cobra.Command, args []string) error {
		// from this point, we should silence usage if error happens
		cmd.SilenceUsage = true

		verifiable := false

		filePath := args[0]
		trieInputPath, err := getTriePath(filePath,
			viper.GetString(viperKeyVerifyTrieInputPath))
		if err != nil {
			return err
		}

		_, err = os.Stat(trieInputPath)
		if err != nil {
			return err
		}

		dotGraphOutputPath := viper.GetString(viperKeyVerifyDotGraphOutputPath)

		if dotGraphOutputPath != "" {
			err = checkOutputPath("dot graph output path", dotGraphOutputPath)
			if err != nil {
				return err
			}
		}

		var (
			trieRoot string
			totalKV,
			passedKV,
			changedKV,
			untrackedKV,
			missingKV int
		)

		err = api.WithAPIClient(
			viper.GetString(viperKeyAPIHostPort),
			viper.GetBool(viperKeyAPISecure),
			func(cli apiPB.APIServiceClient) error {
				ctx, cancel := context.WithCancel(context.Background())
				defer cancel()

				return api.WithImportedTrie(ctx, cli, "", trieInputPath,
					func(id, root string) error {
						tp, err := api.GetTrieProof(ctx, cli, id, "", root)
						if err != nil {
							return err
						}

						trieRoot = tp.GetRoot()

						// make sure concurrency is 1
						leftStream, leftErrCH := api.GetFilePathKeyValueStream(ctx, filePath, 1, nil)

						rightStream, rpCH, rightErrCH := api.VerifyTrieProof(ctx, cli, id, tp.GetId(),
							true, dotGraphOutputPath)

						// strip the anchor trie part from each key
						rightStream = api.InterceptKeyValueStream(ctx, rightStream,
							func(kv *apiPB.KeyValue) *apiPB.KeyValue {
								if len(kv.KeySep) < anchorKeySepLen {
									return kv
								}

								kv.Key = kv.Key[kv.KeySep[anchorKeySepLen-1]:]
								kv.KeySep = kv.KeySep[anchorKeySepLen:]

								return kv
							})

						err = diff.OrderedKeyValueStreams(leftStream, rightStream,
							func(leftKV, rightKV *apiPB.KeyValue, result diff.KeyValueDiffResult) error {
								totalKV++

								switch result {
								case diff.KeyValueEqual:
									passedKV++

									fmt.Fprintf(color.Output,
										"%s %s -> %s\n",
										headerGreen(" PASS "),
										tnEnc.HexOrString(leftKV.Key),
										tnEnc.HexOrString(leftKV.Value))
								case diff.KeyValueValueDifferent:
									changedKV++

									fmt.Fprintf(color.Error,
										"%s %s -> %s %s\n",
										headerRed(" FAIL "),
										tnEnc.HexOrString(leftKV.Key),
										red("- ", tnEnc.HexOrString(rightKV.Value)),
										green("+ ", tnEnc.HexOrString(leftKV.Value)))
								case diff.KeyValueLeftKeyMissing:
									missingKV++

									fmt.Fprintf(color.Error,
										"%s %s\n",
										headerRed(" FAIL "),
										red("- ",
											tnEnc.HexOrString(rightKV.Key),
											" -> ",
											tnEnc.HexOrString(rightKV.Value)))
								case diff.KeyValueRightKeyMissing:
									untrackedKV++

									fmt.Fprintf(color.Error,
										"%s %s\n",
										headerRed(" FAIL "),
										green("+ ",
											tnEnc.HexOrString(leftKV.Key),
											" -> ",
											tnEnc.HexOrString(leftKV.Value)))
								default:
									fmt.Fprintf(color.Error,
										"%s unexpected key-value diff result type: %T\n",
										headerRed(" FAIL "),
										result)
								}

								return nil
							})
						if err != nil {
							return err
						}

						err = <-leftErrCH
						if err != nil {
							return err
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
					})
			})
		if err != nil {
			if verifiable {
				fmt.Fprintf(color.Error,
					"%s the trie at %s with root %s is falsified: %s\n",
					headerRed(" FAIL "),
					red(trieInputPath),
					red(trieRoot),
					err)

				return ErrSilentExitWithNonZeroCode
			}

			fmt.Fprintf(color.Error,
				"%s the trie at %s is unverifiable: %s\n",
				headerRed(" FAIL "),
				red(trieInputPath),
				err)

			return ErrSilentExitWithNonZeroCode
		}

		fmt.Fprintf(color.Output,
			"%s the trie at %s with root %s is verified\n",
			headerGreen(" PASS "),
			green(trieInputPath),
			green(trieRoot))

		if passedKV != totalKV {
			fmt.Fprintf(color.Error,
				"%s the path at %s is falsified: mismatched with trie key-values\n\ttotal: %v\n\t%s\n\t%s\n\t%s\n\t%s\n",
				headerRed(" FAIL "),
				red(filePath),
				totalKV,
				green("passed: ", passedKV),
				red("changed: ", changedKV),
				red("untracked: ", untrackedKV),
				red("missing: ", missingKV))

			return ErrSilentExitWithNonZeroCode
		}

		fmt.Fprintf(color.Output,
			"%s the path at %s is verified, which contains %s key-values\n",
			headerGreen(" PASS "),
			green(filePath),
			green(totalKV))

		return nil
	},
}

func init() {
	cmdVerify.AddCommand(cmdVerifyTrie)

	cmdVerifyTrie.Flags().StringP(nameInputPath, "i", "", "specify the trie output path")
	viper.BindPFlag(viperKeyVerifyTrieInputPath, cmdVerifyTrie.Flags().Lookup(nameInputPath))
}
