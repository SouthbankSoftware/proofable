/*
 * proofable
 * Copyright (C) 2020  Southbank Software Ltd.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 *
 * @Author: guiguan
 * @Date:   2019-09-16T15:59:40+10:00
 * @Last modified by:   guiguan
 * @Last modified time: 2020-07-08T10:51:06+10:00
 */

package cmd

import (
	"errors"
	"fmt"
	"os"
	"path/filepath"
	"strings"

	"github.com/SouthbankSoftware/proofable/pkg/api"
	"github.com/SouthbankSoftware/proofable/pkg/colorcli"
	apiPB "github.com/SouthbankSoftware/proofable/pkg/protos/api"
	"github.com/spf13/cobra"
	"github.com/spf13/viper"
	"google.golang.org/grpc/status"
)

const (
	// global names

	name           = "proofable-cli"
	nameProof      = "proof"
	nameSubproof   = "subproof"
	nameCreate     = "create"
	nameVerify     = "verify"
	namePath       = "path"
	nameInputPath  = "input-path"
	nameOutputPath = "output-path"

	shorthandProofPath    = "p"
	shorthandSubproofPath = "s"

	// local names, default values and viper keys

	nameAPIHostPort                = "api.host-port"
	nameAPISecure                  = "api.secure"
	nameProvenDBAPIGatewayEndpoint = "provendb-api-gateway.endpoint"
	nameDevToken                   = "dev-token"
	nameQuiet                      = "quiet"

	defaultAPIHostPort                = "api.proofable.io:443"
	defaultAPISecure                  = true
	defaultProvenDBAPIGatewayEndpoint = "https://apigateway.dev.provendb.com"

	viperKeyAPIHostPort                = nameAPIHostPort
	viperKeyAPISecure                  = nameAPISecure
	viperKeyProvenDBAPIGatewayEndpoint = nameProvenDBAPIGatewayEndpoint
	viperKeyDevToken                   = nameDevToken
	viperKeyQuiet                      = nameQuiet
)

var (
	defaultSubproofPath = "default" + api.FileExtensionKeyValuesProof
)

var (
	// version is set automatically in CI
	version = "0.0.0"
	cmdRoot = &cobra.Command{
		Use:           name,
		Short:         "Proofable CLI",
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
			colorcli.Faillnf("%s", unpackGRPCErr(err))
		}

		os.Exit(1)
	}
}

func unpackGRPCErr(err error) error {
	if s, ok := status.FromError(err); ok {
		return errors.New(s.Message())
	}

	return err
}

func init() {
	cmdRoot.Version = version

	cobra.OnInitialize(initConfig)

	err := loadCLIConfig()
	if err != nil {
		panic(err)
	}

	cmdRoot.PersistentFlags().String(nameAPIHostPort,
		cliConfig.APIHostPort, "specify the Proofable API hostPort")
	viper.BindPFlag(viperKeyAPIHostPort, cmdRoot.PersistentFlags().Lookup(nameAPIHostPort))

	cmdRoot.PersistentFlags().Bool(nameAPISecure,
		cliConfig.APISecure, "specify whether the Proofable API connection is secure with TLS")
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

	cmdRoot.PersistentFlags().Bool(nameQuiet,
		false, "specify whether to run the CLI in quiet mode with less verbose output")
	viper.BindPFlag(viperKeyQuiet, cmdRoot.PersistentFlags().Lookup(nameQuiet))
}

func initConfig() {
	viper.AutomaticEnv()
	viper.SetEnvPrefix(name)
	viper.SetEnvKeyReplacer(strings.NewReplacer("-", "_", ".", "_"))
}

func checkFilePath(path, ext string) error {
	if fi, err := os.Stat(path); err == nil && fi.IsDir() {
		return errors.New("file path is a directory")
	}

	pathDir := filepath.Dir(path)
	if _, err := os.Stat(pathDir); err != nil {
		return err
	}

	if filepath.Ext(path) != ext {
		return fmt.Errorf("file extension must be `%s`", ext)
	}

	return nil
}

func getTriePath(filePath, userTriePath string) (triePath string, er error) {
	fileInfo, err := os.Stat(filePath)
	if err != nil {
		er = err
		return
	}

	if userTriePath == "" {
		if fileInfo.IsDir() {
			triePath = filepath.Join(filePath, api.FileExtensionTrie)
			return
		}

		triePath = filePath + api.FileExtensionTrie
		return
	}

	if fi, err := os.Stat(userTriePath); err == nil && fi.IsDir() {
		triePath = filepath.Join(userTriePath, fileInfo.Name()+api.FileExtensionTrie)
		return
	}

	if filepath.Ext(userTriePath) != api.FileExtensionTrie {
		er = fmt.Errorf("file extension must be `%s`", api.FileExtensionTrie)
		return
	}

	triePath = filepath.Clean(userTriePath)
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
		IncludeMetadata: viper.GetBool(viperKeyCreateProofIncludeMetadata),
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
