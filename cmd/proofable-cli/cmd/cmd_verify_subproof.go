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
 * @Last modified time: 2020-06-22T15:28:38+10:00
 */

package cmd

import (
	"bytes"
	"context"
	"encoding/hex"
	"errors"
	"fmt"
	"os"
	"path/filepath"
	"time"

	"github.com/SouthbankSoftware/proofable/pkg/api"
	"github.com/SouthbankSoftware/proofable/pkg/colorcli"
	"github.com/SouthbankSoftware/proofable/pkg/diff"
	"github.com/SouthbankSoftware/proofable/pkg/hasher"
	apiPB "github.com/SouthbankSoftware/proofable/pkg/protos/api"
	"github.com/SouthbankSoftware/proofable/pkg/strutil"
	"github.com/spf13/cobra"
	"github.com/spf13/viper"
)

const (
	viperKeyVerifySubproofInputPath = nameVerify + "." + nameSubproof + "." + nameInputPath
)

var cmdVerifySubproof = &cobra.Command{
	Use:   fmt.Sprintf("%v <path>", nameSubproof),
	Short: "Verify a subproof",
	Long: fmt.Sprintf(`Verify a subproof (%v) against the given <path>

The <path> is the root for those keys in the subproof, which is also the path that the proof (%v), used to create the subproof, is proving for
`,
		api.FileExtensionKeyValuesProof, api.FileExtensionTrie),
	Args: cobra.ExactArgs(1),
	RunE: func(cmd *cobra.Command, args []string) error {
		// from this point, we should silence usage if error happens
		cmd.SilenceUsage = true

		verifiable := false
		filePath := args[0]

		kvpInputPath := viper.GetString(viperKeyVerifySubproofInputPath)
		err := checkFilePath(kvpInputPath, api.FileExtensionKeyValuesProof)
		if err != nil {
			return fmt.Errorf("invalid subproof path: %w", err)
		}

		et, err := api.GetEthTrieFromKeyValuesProof(kvpInputPath)
		if err != nil {
			return err
		}
		merkleRoot := hex.EncodeToString(et.Root())

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

		df := &differ{
			quiet: quiet,
		}

		err = api.WithAPIClient(
			viper.GetString(viperKeyAPIHostPort),
			creds,
			func(cli apiPB.APIServiceClient) error {
				rightStream, rpCH, rightErrCH := api.VerifyKeyValuesProof(ctx, cli, kvpInputPath,
					true, dotGraphOutputPath)

				rightStream = api.InterceptKeyValueStream(ctx, rightStream,
					api.StripCompoundKeyAnchorTriePart)

				var (
					prevFileMetadataPath string
					prevFileMetadataMap  map[string][]byte
					fileHasher           hasher.Keccak
				)

				for kv := range rightStream {
					idx := bytes.Index(kv.Key, strutil.Bytes(api.MetadataPrefix))
					if idx == -1 {
						// file hash
						if fileHasher == nil {
							fileHasher = hasher.NewKeccak()
						}

						fp := filepath.Join(filePath, filepath.ToSlash(strutil.String(kv.Key)))

						ha, err := api.HashFile(fileHasher, fp)
						if err != nil {
							if os.IsNotExist(err) {
								df.push(nil, kv, diff.KeyValueLeftKeyMissing)

								continue
							}

							return err
						}

						if bytes.Equal(ha, kv.Value) {
							df.push(kv, kv, diff.KeyValueEqual)
						} else {
							df.push(&apiPB.KeyValue{
								Key:   kv.Key,
								Value: ha,
							}, kv, diff.KeyValueValueDifferent)
						}

						continue
					}

					fileKey := strutil.String(kv.Key[:idx])
					metadataKey := strutil.String(kv.Key[idx+len(api.MetadataPrefix):])

					var mdMap map[string][]byte

					if fileKey == prevFileMetadataPath {
						mdMap = prevFileMetadataMap
					} else {
						fp := filepath.Join(filePath, filepath.ToSlash(fileKey))

						md, err := api.GetFilePathMetadata(fp)
						if err != nil {
							if os.IsNotExist(err) {
								prevFileMetadataPath = fileKey
								prevFileMetadataMap = nil

								df.push(nil, kv, diff.KeyValueLeftKeyMissing)

								goto check
							}

							return err
						}

						kvs, err := api.MarshalToKeyValues("", md)
						if err != nil {
							return err
						}

						mdMap = map[string][]byte{}
						for _, kv := range kvs {
							mdMap[strutil.String(kv.Key)] = kv.Value
						}

						prevFileMetadataPath = fileKey
						prevFileMetadataMap = mdMap
					}

				check:
					if v, ok := mdMap[metadataKey]; ok {
						if bytes.Equal(v, kv.Value) {
							df.push(kv, kv, diff.KeyValueEqual)
						} else {
							df.push(&apiPB.KeyValue{
								Key:   kv.Key,
								Value: v,
							}, kv, diff.KeyValueValueDifferent)
						}
					} else {
						df.push(nil, kv, diff.KeyValueLeftKeyMissing)
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
			})
		if err != nil {
			if verifiable {
				colorcli.Faillnf("the subproof at %s with a root hash of %s is falsified: %s",
					colorcli.Red(kvpInputPath),
					colorcli.Red(merkleRoot),
					unpackGRPCErr(err))

				return errSilentExitWithNonZeroCode
			}

			colorcli.Faillnf("the subproof at %s is unverifiable: %s",
				colorcli.Red(kvpInputPath),
				unpackGRPCErr(err))

			return errSilentExitWithNonZeroCode
		}

		colorcli.Passlnf("the subproof at %s with a root hash of %s is anchored to %s in block %v with transaction %s at %s, which can be viewed at %s",
			colorcli.Green(kvpInputPath),
			colorcli.Green(merkleRoot),
			colorcli.Green(et.AnchorType),
			colorcli.Green(getBlockNumberString(
				et.AnchorType,
				et.BlockTime,
				et.BlockTimeNano,
				et.BlockNumber)),
			colorcli.Green(et.TxnID),
			colorcli.Green(time.Unix(
				int64(et.BlockTime),
				int64(et.BlockTimeNano)).Format(time.UnixDate)),
			colorcli.Green(et.TxnURI))

		if df.passedKV != df.totalKV {
			colorcli.Faillnf("the path at %s is falsified: mismatched with subproof key-values\n\ttotal: %v\n\t%s\n\t%s\n\t%s",
				colorcli.Red(filePath),
				df.totalKV,
				colorcli.Green("passed: ", df.passedKV),
				colorcli.Red("changed: ", df.changedKV),
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
	cmdVerify.AddCommand(cmdVerifySubproof)

	cmdVerifySubproof.Flags().StringP(nameInputPath, shorthandSubproofPath,
		defaultSubproofPath, "specify the subproof input path")
	viper.BindPFlag(viperKeyVerifySubproofInputPath, cmdVerifySubproof.Flags().Lookup(nameInputPath))
}
