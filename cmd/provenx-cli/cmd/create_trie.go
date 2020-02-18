/*
 * @Author: guiguan
 * @Date:   2019-09-16T16:21:53+10:00
 * @Last modified by:   guiguan
 * @Last modified time: 2020-02-18T11:30:48+11:00
 */

package cmd

import (
	"errors"
	"fmt"

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
		return errors.New("test")
	},
}

func init() {
	cmdCreate.AddCommand(cmdCreateTrie)

	cmdCreateTrie.Flags().StringP(nameOutputPath, "o", "", "specify the trie output path. By default, if the path is a directory, the trie will be created under the directory as \".pxt\"; if the path is a file, the trie will be created next to the file as \"[filename].pxt\"")
	viper.BindPFlag(viperKeyCreateTrieOutputPath, cmdCreateTrie.Flags().Lookup(nameOutputPath))
}
