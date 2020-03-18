/*
 * @Author: guiguan
 * @Date:   2019-09-16T15:59:40+10:00
 * @Last modified by:   guiguan
 * @Last modified time: 2020-03-18T15:01:17+11:00
 */

package cmd

import (
	"errors"
	"fmt"
	"os"
	"path/filepath"
	"strings"

	"github.com/SouthbankSoftware/provenx-cli/pkg/api"
	"github.com/SouthbankSoftware/provenx-cli/pkg/colorcli"
	apiPB "github.com/SouthbankSoftware/provenx-cli/pkg/protos/api"
	"github.com/spf13/cobra"
	"github.com/spf13/viper"
)

const (
	// global names

	name           = "provenx-cli"
	nameTrie       = "trie"
	nameKvp        = "kvp"
	nameCreate     = "create"
	nameVerify     = "verify"
	namePath       = "path"
	nameInputPath  = "input-path"
	nameOutputPath = "output-path"

	// local names, default values and viper keys

	nameAPIHostPort                = "api.host-port"
	nameAPISecure                  = "api.secure"
	nameProvenDBAPIGatewayEndpoint = "provendb-api-gateway.endpoint"
	nameDevToken                   = "dev-token"

	defaultAPIHostPort                = "api.dev.provendb.com:443"
	defaultAPISecure                  = true
	defaultProvenDBAPIGatewayEndpoint = "https://apigateway.dev.provendb.com"

	viperKeyAPIHostPort                = nameAPIHostPort
	viperKeyAPISecure                  = nameAPISecure
	viperKeyProvenDBAPIGatewayEndpoint = nameProvenDBAPIGatewayEndpoint
	viperKeyDevToken                   = nameDevToken
)

var (
	defaultKvpPath = "proof" + api.FileExtensionKeyValuesProof
)

var (
	// version is set automatically in CI
	version = "0.0.0"
	cmdRoot = &cobra.Command{
		Use:           name,
		Short:         "ProvenX CLI",
		SilenceErrors: true,
	}
	cliConfig *CLIConfig

	// errSilentExitWithNonZeroCode is the error returned when the CLI should exit with non-zero
	// exit code silently without printing any error message
	errSilentExitWithNonZeroCode = errors.New("silent exit with non-zero code")
)

// Execute adds all child commands to the root command and sets flags appropriately.
// This is called by main.main(). It only needs to happen once to the rootCmd
func Execute() {
	err := cmdRoot.Execute()

	if err := saveCLIConfig(); err != nil {
		colorcli.Faillnf("%s", err)
	}

	if err != nil {
		if !errors.Is(err, errSilentExitWithNonZeroCode) {
			colorcli.Faillnf("%s", err)
		}

		os.Exit(1)
	}
}

func init() {
	cmdRoot.Version = version

	cobra.OnInitialize(initConfig)

	err := loadCLIConfig()
	if err != nil {
		panic(err)
	}

	cmdRoot.PersistentFlags().String(nameAPIHostPort,
		cliConfig.APIHostPort, "specify the ProvenX API hostPort")
	viper.BindPFlag(viperKeyAPIHostPort, cmdRoot.PersistentFlags().Lookup(nameAPIHostPort))

	cmdRoot.PersistentFlags().Bool(nameAPISecure,
		cliConfig.APISecure, "specify whether the ProvenX API connection is secure with TLS")
	viper.BindPFlag(viperKeyAPISecure, cmdRoot.PersistentFlags().Lookup(nameAPISecure))

	cmdRoot.PersistentFlags().String(nameProvenDBAPIGatewayEndpoint,
		cliConfig.ProvendbAPIGatewayEndpoint,
		"specify the ProvenDB API Gateway endpoint to authenticate with")
	viper.BindPFlag(viperKeyProvenDBAPIGatewayEndpoint,
		cmdRoot.PersistentFlags().Lookup(nameProvenDBAPIGatewayEndpoint))

	cmdRoot.PersistentFlags().String(nameDevToken,
		cliConfig.DevToken, "specify the dev authentication token")
	if cliConfig.DevToken == "" {
		err = cmdRoot.PersistentFlags().MarkHidden(nameDevToken)
		if err != nil {
			panic(err)
		}
	}
	viper.BindPFlag(viperKeyDevToken, cmdRoot.PersistentFlags().Lookup(nameDevToken))
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

const (
	fileTrieVersion = 1
)

type fileTrieRootMetadata struct {
	Version         uint32 `json:"version"`
	IncludeMetadata bool   `json:"includeMetadata"`
}

func createFileTrieRootMetadata() (kvs []*apiPB.KeyValue, er error) {
	metadata := &fileTrieRootMetadata{
		Version:         fileTrieVersion,
		IncludeMetadata: viper.GetBool(viperKeyCreateTrieIncludeMetadata),
	}

	return api.MarshalToKeyValues(api.MetadataPrefix, metadata)
}

func getFileTrieRootMetadata(stream <-chan *apiPB.KeyValue) (
	md *fileTrieRootMetadata, er error) {
	getKeyValue := func() (kv *apiPB.KeyValue, er error) {
		keyValue, ok := <-stream
		if !ok {
			er = errors.New("stream is closed")
			return
		}

		kv = keyValue
		return
	}

	metadata := &fileTrieRootMetadata{}

	err := api.UnmarshalFromKeyValues(api.MetadataPrefix, getKeyValue, metadata)
	if err != nil {
		er = err
		return
	}

	md = metadata
	return
}
