/*
 * @Author: guiguan
 * @Date:   2019-09-16T16:21:53+10:00
 * @Last modified by:   guiguan
 * @Last modified time: 2020-02-18T18:03:53+11:00
 */

package cmd

import (
	"fmt"

	"github.com/spf13/cobra"
)

var cmdVerifyTrie = &cobra.Command{
	Use:   fmt.Sprintf("%v <path>", nameTrie),
	Short: "Verify a trie (.pxt) for the given path",
	Args:  cobra.ExactArgs(1),
	RunE: func(cmd *cobra.Command, args []string) error {
		return nil
	},
}

func init() {
	cmdVerify.AddCommand(cmdVerifyTrie)
}
