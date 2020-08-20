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
 * @Last modified time: 2020-08-20T14:39:28+10:00
 */

package cmd

import (
	"bytes"
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/SouthbankSoftware/proofable/pkg/api"
	"github.com/SouthbankSoftware/proofable/pkg/colorcli"
	anchorPB "github.com/SouthbankSoftware/proofable/pkg/protos/anchor"
	apiPB "github.com/SouthbankSoftware/proofable/pkg/protos/api"
	"github.com/SouthbankSoftware/proofable/pkg/strutil"
	"github.com/karrick/godirwalk"
	"github.com/spf13/cobra"
	"github.com/spf13/viper"
)

const (
	nameAnchorType      = "anchor-type"
	nameIncludeMetadata = "include-metadata"

	viperKeyCreateProofAnchorType      = nameCreate + "." + nameProof + "." + nameAnchorType
	viperKeyCreateProofOutputPath      = nameCreate + "." + nameProof + "." + nameOutputPath
	viperKeyCreateProofIncludeMetadata = nameCreate + "." + nameProof + "." + nameIncludeMetadata
)

var cmdCreateProof = &cobra.Command{
	Use:   fmt.Sprintf("%v <path>", nameProof),
	Short: "Create a proof",
	Long: fmt.Sprintf(`Create a proof (%[1]v) for the given path. The proof can prove all the key-values of the path, i.e. file hashes and metadata

By default, if the path is a directory, the proof will be created under the directory as "%[1]v"; if the path is a file, the proof will be created next to the file as "[filename]%[1]v"
`, api.FileExtensionTrie),
	Args: cobra.ExactArgs(1),
	RunE: func(cmd *cobra.Command, args []string) error {
		// from this point, we should silence usage if error happens
		cmd.SilenceUsage = true

		var anchorType anchorPB.Anchor_Type

		anchorTypeStr := viper.GetString(viperKeyCreateProofAnchorType)
		if t, ok := anchorPB.Anchor_Type_value[anchorTypeStr]; ok {
			anchorType = anchorPB.Anchor_Type(t)
		} else {
			return fmt.Errorf("unknown anchor type `%s`", anchorTypeStr)
		}

		filePath := args[0]
		trieOutputPath, err := getTriePath(filePath,
			viper.GetString(viperKeyCreateProofOutputPath))
		if err != nil {
			return fmt.Errorf("invalid proof output path: %w", err)
		}

		quiet := viper.GetBool(viperKeyQuiet)

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
				return api.WithTrie(ctx, cli, func(id, _ string) error {
					includeMetadata := viper.GetBool(viperKeyCreateProofIncludeMetadata)

					first := true

					// no need to keep in order
					kvCH, errCH := api.GetFilePathKeyValueStream(ctx, filePath, 0, false,
						func(key, fp string, de *godirwalk.Dirent) (kvs []*apiPB.KeyValue, er error) {
							if first {
								first = false

								md, err := createFileTrieRootMetadata()
								if err != nil {
									er = err
									return
								}

								kvs = append(kvs, md...)
							}

							if includeMetadata {
								md, err := api.GetFilePathKeyMetadataKeyValues(key, fp, de)
								if err != nil {
									er = err
									return
								}

								kvs = append(kvs, md...)
							}

							return
						})

					count := 0

					kvCH = api.InterceptKeyValueStream(ctx, kvCH,
						func(kv *apiPB.KeyValue) *apiPB.KeyValue {
							if bytes.HasPrefix(kv.Key, strutil.Bytes(api.MetadataPrefix)) {
								colorcli.Printf("%s -> %s\n",
									colorcli.HeaderWhite(
										strutil.String(strutil.BytesWithoutNullChar(kv.Key))),
									strutil.HexOrString(kv.Value))
							} else {
								count++

								if !quiet {
									colorcli.Printf("%s -> %s\n",
										strutil.String(strutil.BytesWithoutNullChar(kv.Key)),
										strutil.HexOrString(kv.Value))
								}
							}

							return kv
						})

					root, err := api.SetTrieKeyValues(ctx, cli, id, "", kvCH)
					if err != nil {
						return err
					}

					err = <-errCH
					if err != nil {
						return err
					}

					triePf, err := api.CreateTrieProof(ctx, cli, id, root, anchorType)
					if err != nil {
						return err
					}

					tpCH, errCH := api.SubscribeTrieProof(ctx, cli, id, triePf.GetId())

					for tp := range tpCH {
						colorcli.Printf("Anchoring proof: %s\n", tp.GetStatus())
						triePf = tp

						if tp.GetStatus() == anchorPB.Batch_ERROR {
							return errors.New(tp.GetError())
						}
					}

					err = <-errCH
					if err != nil {
						return err
					}

					err = api.ExportTrie(ctx, cli, id, trieOutputPath)
					if err != nil {
						return err
					}

					colorcli.Oklnf("the proof has successfully been created at %s with %v key-values and a root hash of %s, which is anchored to %s in block %v with transaction %s at %s, which can be viewed at %s",
						colorcli.Green(trieOutputPath),
						colorcli.Green(count),
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

					return nil
				})
			})
	},
}

func init() {
	cmdCreate.AddCommand(cmdCreateProof)

	cmdCreateProof.Flags().StringP(nameAnchorType, "t", "ETH", "specify the anchor type. Please refer to https://github.com/SouthbankSoftware/proofable/blob/master/docs/anchor.md#anchortype for all available anchor types")
	viper.BindPFlag(viperKeyCreateProofAnchorType, cmdCreateProof.Flags().Lookup(nameAnchorType))

	cmdCreateProof.Flags().StringP(nameOutputPath, shorthandProofPath, "", "specify the proof output path")
	viper.BindPFlag(viperKeyCreateProofOutputPath, cmdCreateProof.Flags().Lookup(nameOutputPath))

	cmdCreateProof.Flags().Bool(nameIncludeMetadata, false, "specify whether to include metadata")
	viper.BindPFlag(viperKeyCreateProofIncludeMetadata, cmdCreateProof.Flags().Lookup(nameIncludeMetadata))
}
