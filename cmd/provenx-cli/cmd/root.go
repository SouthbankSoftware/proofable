/*
 * @Author: guiguan
 * @Date:   2019-09-16T15:59:40+10:00
 * @Last modified by:   guiguan
 * @Last modified time: 2020-02-18T11:33:37+11:00
 */

package cmd

import (
	"os"
	"strings"

	"github.com/spf13/cobra"
	"github.com/spf13/viper"
)

const (
	fileSuffixTrie = ".pxt"

	// global names

	name           = "provenx-cli"
	nameTrie       = "trie"
	nameCreate     = "create"
	nameVerify     = "verify"
	namePath       = "path"
	nameOutputPath = "output-path"

	// local names and viper keys

	nameAPIHostPort     = "api.host-port"
	viperKeyAPIHostPort = nameAPIHostPort
)

var cmdRoot = &cobra.Command{
	Use:   name,
	Short: "ProvenX CLI",
}

// Execute adds all child commands to the root command and sets flags appropriately.
// This is called by main.main(). It only needs to happen once to the rootCmd
func Execute() {
	if err := cmdRoot.Execute(); err != nil {
		cmdRoot.PrintErr(err)
		os.Exit(1)
	}
}

func init() {
	cobra.OnInitialize(initConfig)

	cmdRoot.PersistentFlags().String(nameAPIHostPort,
		"api.dev.provendb.com:443", "specify the ProvenX API hostPort")
	viper.BindPFlag(viperKeyAPIHostPort, cmdRoot.PersistentFlags().Lookup(nameAPIHostPort))
}

func initConfig() {
	viper.AutomaticEnv()
	viper.SetEnvPrefix(name)
	viper.SetEnvKeyReplacer(strings.NewReplacer("-", "_", ".", "_"))
}
