/*
 * @Author: guiguan
 * @Date:   2019-09-16T15:59:40+10:00
 * @Last modified by:   guiguan
 * @Last modified time: 2020-02-24T11:58:02+11:00
 */

package cmd

import (
	"errors"
	"fmt"
	"os"
	"path/filepath"
	"strings"

	"github.com/SouthbankSoftware/provenx-cli/pkg/api"
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
	nameInputPath  = "input-path"
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
	// ErrSilentExitWithNonZeroCode is the error returned when the CLI should exit with non-zero
	// exit code silently without printing any error message
	ErrSilentExitWithNonZeroCode = errors.New("silent exit with non-zero code")

	headerGreen  = color.New(color.BgHiGreen, color.FgHiWhite, color.Bold).SprintFunc()
	headerYellow = color.New(color.BgHiYellow, color.FgHiWhite, color.Bold).SprintFunc()
	headerRed    = color.New(color.BgHiRed, color.FgHiWhite, color.Bold).SprintFunc()
	green        = color.New(color.FgHiGreen).SprintFunc()
	yellow       = color.New(color.FgHiYellow).SprintFunc()
	red          = color.New(color.FgHiRed).SprintFunc()

	// version is set automatically in CI
	version = "0.0.0"
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
		if !errors.Is(err, ErrSilentExitWithNonZeroCode) {
			fmt.Fprintf(color.Error, "%s %s\n", headerRed(" FAIL "), err)
		}

		os.Exit(1)
	}
}

func init() {
	cmdRoot.Version = version

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

func checkOutputPath(name, path string) error {
	if fi, err := os.Stat(path); err == nil && fi.IsDir() {
		return fmt.Errorf("the %s cannot be a directory", name)
	}

	pathDir := filepath.Dir(path)
	if _, err := os.Stat(pathDir); err != nil {
		return err
	}

	return nil
}

func getTriePath(filePath, userTriePath string) (triePath string, er error) {
	fileInfo, err := os.Stat(filePath)
	if err != nil {
		er = err
		return
	}

	triePath = userTriePath
	if triePath == "" {
		if fileInfo.IsDir() {
			triePath = filepath.Join(filePath, api.FileExtensionTrie)
		} else {
			triePath = filePath + api.FileExtensionTrie
		}
	}
	return
}
