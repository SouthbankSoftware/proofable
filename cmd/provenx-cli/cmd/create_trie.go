/*
 * @Author: guiguan
 * @Date:   2019-09-16T16:21:53+10:00
 * @Last modified by:   guiguan
 * @Last modified time: 2020-02-18T16:52:16+11:00
 */

package cmd

import (
	"context"
	"fmt"

	"github.com/SouthbankSoftware/provendb-trie/pkg/trienodes"
	apiPB "github.com/SouthbankSoftware/provenx-api/pkg/api/proto"
	"github.com/SouthbankSoftware/provenx-cli/pkg/api"
	"github.com/spf13/cobra"
	"github.com/spf13/viper"
)

const (
	viperKeyCreateTrieOutputPath = nameCreate + "." + nameTrie + "." + nameOutputPath
)

var cmdCreateTrie = &cobra.Command{
	Use:   fmt.Sprintf("%v [path]", nameTrie),
	Short: "Create a trie (.pxt) for the given path",
	Args:  cobra.ExactArgs(1),
	RunE: func(cmd *cobra.Command, args []string) error {
		cmd.SilenceUsage = true

		return api.WithAPIClient(
			viper.GetString(viperKeyAPIHostPort),
			viper.GetBool(viperKeyAPISecure),
			func(cli apiPB.APIServiceClient) error {
				ctx, cancel := context.WithCancel(context.Background())
				defer cancel()

				return api.WithTrie(ctx, cli, func(id string) error {
					kvCH, errCH := api.GetFilePathKeyValueStream(ctx, args[0], 0, nil)

					kvCH = api.InterceptKeyValueStream(ctx, kvCH,
						func(kv *apiPB.KeyValue) {
							// TODO
							fmt.Printf("%s => %s\n",
								trienodes.HexOrString(kv.Key), trienodes.HexOrString(kv.Value))
						})

					_, err := api.SetTrieKeyValues(ctx, cli, id, "", kvCH)
					if err != nil {
						return err
					}

					err = <-errCH
					if err != nil {
						return err
					}

					return nil
				})
			})
	},
}

func init() {
	cmdCreate.AddCommand(cmdCreateTrie)

	cmdCreateTrie.Flags().StringP(nameOutputPath, "o", "", "specify the trie output path. By default, if the path is a directory, the trie will be created under the directory as \".pxt\"; if the path is a file, the trie will be created next to the file as \"[filename].pxt\"")
	viper.BindPFlag(viperKeyCreateTrieOutputPath, cmdCreateTrie.Flags().Lookup(nameOutputPath))
}
