/*
 * @Author: guiguan
 * @Date:   2019-09-16T16:21:53+10:00
 * @Last modified by:   guiguan
 * @Last modified time: 2020-02-18T23:00:42+11:00
 */

package cmd

import (
	"context"
	"errors"
	"fmt"
	"os"
	"path/filepath"

	"github.com/SouthbankSoftware/provendb-trie/pkg/trienodes"
	apiPB "github.com/SouthbankSoftware/provenx-api/pkg/api/proto"
	"github.com/SouthbankSoftware/provenx-cli/pkg/api"
	"github.com/fatih/color"
	"github.com/spf13/cobra"
	"github.com/spf13/viper"
)

const (
	viperKeyCreateTrieOutputPath = nameCreate + "." + nameTrie + "." + nameOutputPath
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
		fileInfo, err := os.Stat(filePath)
		if err != nil {
			return err
		}

		trieOutputPath := viper.GetString(viperKeyCreateTrieOutputPath)
		if trieOutputPath == "" {
			if fileInfo.IsDir() {
				trieOutputPath = filepath.Join(filePath, api.FileExtensionTrie)
			} else {
				trieOutputPath = filePath + api.FileExtensionTrie
			}
		}

		if fi, err := os.Stat(trieOutputPath); err == nil && fi.IsDir() {
			return errors.New("the trie output path cannot be a directory")
		}

		trieOutputPathDir := filepath.Dir(trieOutputPath)
		if _, err := os.Stat(trieOutputPathDir); err != nil {
			return err
		}

		return api.WithAPIClient(
			viper.GetString(viperKeyAPIHostPort),
			viper.GetBool(viperKeyAPISecure),
			func(cli apiPB.APIServiceClient) error {
				ctx, cancel := context.WithCancel(context.Background())
				defer cancel()

				return api.WithTrie(ctx, cli, func(id string) error {
					kvCH, errCH := api.GetFilePathKeyValueStream(ctx, filePath, 0, nil)

					count := 0

					kvCH = api.InterceptKeyValueStream(ctx, kvCH,
						func(kv *apiPB.KeyValue) {
							fmt.Printf("%s -> %s\n",
								trienodes.HexOrString(kv.Key), trienodes.HexOrString(kv.Value))

							count++
						})

					root, err := api.SetTrieKeyValues(ctx, cli, id, "", kvCH)
					if err != nil {
						return err
					}

					err = <-errCH
					if err != nil {
						return err
					}

					tp, err := api.CreateTrieProof(ctx, cli, id, root)
					if err != nil {
						return err
					}

					tpCH, errCH := api.SubscribeTrieProof(ctx, cli, id, tp.GetId())

					for tp := range tpCH {
						fmt.Printf("Creating trie proof: %s\n", tp.GetStatus())
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
						"%s the trie has successfully been created at %s with %v key-values and root %s\n",
						headerGreen(" OK "), green(trieOutputPath), green(count), green(root))

					return nil
				})
			})
	},
}

func init() {
	cmdCreate.AddCommand(cmdCreateTrie)

	cmdCreateTrie.Flags().StringP(nameOutputPath, "o", "", "specify the trie output path")
	viper.BindPFlag(viperKeyCreateTrieOutputPath, cmdCreateTrie.Flags().Lookup(nameOutputPath))
}
