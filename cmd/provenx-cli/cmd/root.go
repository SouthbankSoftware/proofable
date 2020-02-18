/*
 * @Author: guiguan
 * @Date:   2019-09-16T15:59:40+10:00
 * @Last modified by:   guiguan
 * @Last modified time: 2020-02-18T23:05:50+11:00
 */

package cmd

import (
	"errors"
	"fmt"
	"os"
	"strings"

	"github.com/fatih/color"
	"github.com/spf13/cobra"
	"github.com/spf13/viper"
)

const (
	// global names

	name           = "provenx-cli"
	nameTrie       = "trie"
	nameCreate     = "create"
	nameVerify     = "verify"
	namePath       = "path"
	nameOutputPath = "output-path"

	// local names, viper keys and default values

	nameAPIHostPort     = "api.host-port"
	viperKeyAPIHostPort = nameAPIHostPort
	defaultAPIHostPort  = "api.dev.provendb.com:443"
	nameAPISecure       = "api.secure"
	viperKeyAPISecure   = nameAPISecure
	defaultAPISecure    = true
)

var (
	// ErrSilentExit is the error returned when the CLI should exit silently without printing any
	// error message
	ErrSilentExit = errors.New("silent exit")

	headerGreen = color.New(color.BgHiGreen, color.FgHiWhite, color.Bold).SprintFunc()
	headerRed   = color.New(color.BgHiRed, color.FgHiWhite, color.Bold).SprintFunc()
	green       = color.New(color.FgHiGreen).SprintFunc()
	red         = color.New(color.FgHiRed).SprintFunc()

	cmdRoot = &cobra.Command{
		Use:           name,
		Short:         "ProvenX CLI",
		SilenceErrors: true,
	}
)

// Execute adds all child commands to the root command and sets flags appropriately.
// This is called by main.main(). It only needs to happen once to the rootCmd
func Execute() {
	if err := cmdRoot.Execute(); err != nil {
		if !errors.Is(err, ErrSilentExit) {
			fmt.Fprintf(color.Error, "%s %s\n", headerRed(" FAIL "), err)
		}

		os.Exit(1)
	}
}

func init() {
	cobra.OnInitialize(initConfig)

	cmdRoot.PersistentFlags().String(nameAPIHostPort,
		defaultAPIHostPort, "specify the ProvenX API hostPort")
	viper.BindPFlag(viperKeyAPIHostPort, cmdRoot.PersistentFlags().Lookup(nameAPIHostPort))
	cmdRoot.PersistentFlags().Bool(nameAPISecure,
		defaultAPISecure, "specify whether the ProvenX API connection is secure with TLS")
	viper.BindPFlag(nameAPISecure, cmdRoot.PersistentFlags().Lookup(nameAPISecure))
}

func initConfig() {
	viper.AutomaticEnv()
	viper.SetEnvPrefix(name)
	viper.SetEnvKeyReplacer(strings.NewReplacer("-", "_", ".", "_"))
}
