/*
 * @Author: guiguan
 * @Date:   2019-09-16T16:21:53+10:00
 * @Last modified by:   guiguan
 * @Last modified time: 2020-03-18T15:01:18+11:00
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

	"github.com/SouthbankSoftware/provenx-cli/pkg/api"
	"github.com/SouthbankSoftware/provenx-cli/pkg/colorcli"
	"github.com/SouthbankSoftware/provenx-cli/pkg/diff"
	"github.com/SouthbankSoftware/provenx-cli/pkg/hasher"
	apiPB "github.com/SouthbankSoftware/provenx-cli/pkg/protos/api"
	"github.com/SouthbankSoftware/provenx-cli/pkg/strutil"
	"github.com/spf13/cobra"
	"github.com/spf13/viper"
)

const (
	viperKeyVerifyKvpInputPath = nameVerify + "." + nameKvp + "." + nameInputPath
)

var cmdVerifyKvp = &cobra.Command{
	Use:   fmt.Sprintf("%v <path>", nameKvp),
	Short: "Verify a key-values proof",
	Long: fmt.Sprintf(`Verify a key-values proof (%v) against the given <path>

The <path> is the root for those keys in the proof, which is also the path that the trie (%v), used to create the proof, is proving for
`,
		api.FileExtensionKeyValuesProof, api.FileExtensionTrie),
	Args: cobra.ExactArgs(1),
	RunE: func(cmd *cobra.Command, args []string) error {
		// from this point, we should silence usage if error happens
		cmd.SilenceUsage = true

		verifiable := false

		filePath := args[0]
		kvpInputPath := viper.GetString(viperKeyVerifyKvpInputPath)

		et, err := api.GetEthTrieFromKeyValuesProof(kvpInputPath)
		if err != nil {
			return err
		}
		merkleRoot := hex.EncodeToString(et.Root())

		dotGraphOutputPath := viper.GetString(viperKeyVerifyDotGraphOutputPath)

		if dotGraphOutputPath != "" {
			err := checkOutputPath("dot graph output path", dotGraphOutputPath)
			if err != nil {
				return err
			}
		}

		ctx, cancel := context.WithCancel(context.Background())
		defer cancel()

		creds, err := getCreds(ctx)
		if err != nil {
			return err
		}

		df := &differ{}

		err = api.WithAPIClient(
			viper.GetString(viperKeyAPIHostPort),
			creds,
			func(cli apiPB.APIServiceClient) error {
				rightStream, rpCH, rightErrCH := api.VerifyKeyValuesProof(ctx, cli, kvpInputPath,
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
				colorcli.Faillnf("the key-values proof at %s with merkle root %s is falsified: %s",
					colorcli.Red(kvpInputPath),
					colorcli.Red(merkleRoot),
					err)

				return errSilentExitWithNonZeroCode
			}

			colorcli.Faillnf("the key-values proof at %s is unverifiable: %s",
				colorcli.Red(kvpInputPath),
				err)

			return errSilentExitWithNonZeroCode
		}

		colorcli.Passlnf("the key-values proof at %s with merkle root %s is verified, which is anchored to %s in block %v with transaction %s at %s, which can be viewed at %s",
			colorcli.Green(kvpInputPath),
			colorcli.Green(merkleRoot),
			colorcli.Green(et.AnchorType),
			colorcli.Green(et.BlockNumber),
			colorcli.Green(et.TxnID),
			colorcli.Green(time.Unix(int64(et.BlockTime), 0).Format(time.UnixDate)),
			et.TxnURI)

		if df.passedKV != df.totalKV {
			colorcli.Faillnf("the path at %s is falsified: mismatched with trie key-values\n\ttotal: %v\n\t%s\n\t%s\n\t%s",
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
	cmdVerify.AddCommand(cmdVerifyKvp)

	cmdVerifyKvp.Flags().StringP(nameInputPath, "p",
		defaultKvpPath, "specify the proof input path")
	viper.BindPFlag(viperKeyVerifyKvpInputPath, cmdVerifyKvp.Flags().Lookup(nameInputPath))
}
