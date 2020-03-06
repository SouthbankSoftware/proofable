/*
 * @Author: guiguan
 * @Date:   2019-09-16T16:21:53+10:00
 * @Last modified by:   guiguan
 * @Last modified time: 2020-03-07T00:53:29+11:00
 */

package cmd

import (
	"bytes"
	"context"
	"fmt"
	"time"

	tnEnc "github.com/SouthbankSoftware/provendb-trie/pkg/trienodes/encoding"
	apiPB "github.com/SouthbankSoftware/provenx-api/pkg/api/proto"
	"github.com/SouthbankSoftware/provenx-cli/pkg/api"
	"github.com/fatih/color"
	"github.com/karrick/godirwalk"
	"github.com/spf13/cobra"
	"github.com/spf13/viper"
)

const (
	nameIncludeMetadata = "include-metadata"

	viperKeyCreateTrieOutputPath      = nameCreate + "." + nameTrie + "." + nameOutputPath
	viperKeyCreateTrieIncludeMetadata = nameCreate + "." + nameTrie + "." + nameIncludeMetadata
)

var cmdCreateTrie = &cobra.Command{
	Use: fmt.Sprintf("%v <path>", nameTrie),
	Long: `Create a trie (.pxt) for the given path

By default, if the path is a directory, the trie will be created under the directory as ".pxt"; if the path is a file, the trie will be created next to the file as "[filename].pxt"
`,
	Args: cobra.ExactArgs(1),
	RunE: func(cmd *cobra.Command, args []string) error {
		// from this point, we should silence usage if error happens
		cmd.SilenceUsage = true

		filePath := args[0]
		trieOutputPath, err := getTriePath(filePath,
			viper.GetString(viperKeyCreateTrieOutputPath))
		if err != nil {
			return err
		}

		err = checkOutputPath("trie output path", trieOutputPath)
		if err != nil {
			return err
		}

		return api.WithAPIClient(
			viper.GetString(viperKeyAPIHostPort),
			viper.GetBool(viperKeyAPISecure),
			func(cli apiPB.APIServiceClient) error {
				ctx, cancel := context.WithCancel(context.Background())
				defer cancel()

				return api.WithTrie(ctx, cli, func(id, _ string) error {
					includeMetadata := viper.GetBool(viperKeyCreateTrieIncludeMetadata)

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
								md, err := api.GetFilePathKeyMetadata(key, fp, de)
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
							keyStr := api.String(kv.Key)

							if bytes.HasPrefix(kv.Key, api.Bytes(api.MetadataPrefix)) {
								keyStr = headerWhite(keyStr)
							}

							fmt.Fprintf(color.Output, "%s -> %s\n",
								keyStr, tnEnc.HexOrString(kv.Value))

							count++

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

					triePf, err := api.CreateTrieProof(ctx, cli, id, root)
					if err != nil {
						return err
					}

					tpCH, errCH := api.SubscribeTrieProof(ctx, cli, id, triePf.GetId())

					for tp := range tpCH {
						fmt.Printf("Creating trie proof: %s\n", tp.GetStatus())
						triePf = tp
					}

					err = <-errCH
					if err != nil {
						return err
					}

					err = api.ExportTrie(ctx, cli, id, trieOutputPath)
					if err != nil {
						return err
					}

					fmt.Fprintf(color.Output,
						"%s the trie has successfully been created at %s with %v key-values and root %s, which is anchored to %s in block %v with transaction %s at %s, which can be viewed at %s\n",
						headerGreen(" OK "),
						green(trieOutputPath),
						green(count),
						green(root),
						green(triePf.GetAnchorType()),
						green(triePf.GetBlockNumber()),
						green(triePf.GetTxnId()),
						green(time.Unix(int64(triePf.GetBlockTime()), 0).Format(time.UnixDate)),
						triePf.GetTxnUri())

					return nil
				})
			})
	},
}

func init() {
	cmdCreate.AddCommand(cmdCreateTrie)

	cmdCreateTrie.Flags().StringP(nameOutputPath, "t", "", "specify the trie output path")
	viper.BindPFlag(viperKeyCreateTrieOutputPath, cmdCreateTrie.Flags().Lookup(nameOutputPath))
	cmdCreateTrie.Flags().Bool(nameIncludeMetadata, false, "specify whether to include metadata")
	viper.BindPFlag(viperKeyCreateTrieIncludeMetadata, cmdCreateTrie.Flags().Lookup(nameIncludeMetadata))
}
