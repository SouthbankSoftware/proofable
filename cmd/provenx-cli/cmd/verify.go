/*
 * @Author: guiguan
 * @Date:   2019-09-16T16:21:53+10:00
 * @Last modified by:   guiguan
 * @Last modified time: 2020-02-15T12:46:44+11:00
 */

package cmd

import (
	"github.com/spf13/cobra"
	"github.com/spf13/viper"
)

const (
	nameDotGraphPath           = "dot-graph-path"
	viperKeyVerifyDotGraphPath = nameVerify + "." + nameDotGraphPath
)

var cmdVerify = &cobra.Command{
	Use:   nameVerify,
	Short: "Verify a target",
}

func init() {
	cmdRoot.AddCommand(cmdVerify)

	cmdVerify.PersistentFlags().StringP(nameDotGraphPath, "d", "", "specify the Graphviz Dot Graph (.dot) output path")
	viper.BindPFlag(viperKeyVerifyDotGraphPath, cmdCreateTrie.PersistentFlags().Lookup(nameDotGraphPath))
}
