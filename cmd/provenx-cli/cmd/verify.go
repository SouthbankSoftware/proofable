/*
 * @Author: guiguan
 * @Date:   2019-09-16T16:21:53+10:00
 * @Last modified by:   guiguan
 * @Last modified time: 2020-02-19T11:35:35+11:00
 */

package cmd

import (
	"github.com/spf13/cobra"
	"github.com/spf13/viper"
)

const (
	nameDotGraphOutputPath           = "dot-graph." + nameOutputPath
	viperKeyVerifyDotGraphOutputPath = nameVerify + "." + nameDotGraphOutputPath
)

var cmdVerify = &cobra.Command{
	Use:   nameVerify,
	Short: "Verify a target",
}

func init() {
	cmdRoot.AddCommand(cmdVerify)

	cmdVerify.PersistentFlags().StringP(nameDotGraphOutputPath, "d", "", "specify the Graphviz Dot Graph (.dot) output path")
	viper.BindPFlag(viperKeyVerifyDotGraphOutputPath, cmdVerify.PersistentFlags().Lookup(nameDotGraphOutputPath))
}
