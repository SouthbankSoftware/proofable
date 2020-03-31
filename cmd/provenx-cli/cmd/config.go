/*
 * provenx-cli
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
 * @Date:   2020-03-12T10:44:37+11:00
 * @Last modified by:   guiguan
 * @Last modified time: 2020-03-31T16:38:31+11:00
 */

package cmd

import (
	"encoding/json"
	"io/ioutil"
	"os"
	"path/filepath"

	"github.com/SouthbankSoftware/provenx/pkg/config"
	"github.com/spf13/viper"
)

// CLIConfig represents a CLI config
type CLIConfig struct {
	APIHostPort                string `json:"apiHostPort"`
	APISecure                  bool   `json:"apiSecure"`
	ProvendbAPIGatewayEndpoint string `json:"provendbApiGatewayEndpoint"`
	DevToken                   string `json:"devToken,omitempty"`
}

func getCLIConfigPath() (pt string, er error) {
	return config.FilePath(name + ".json")
}

func loadCLIConfig() error {
	cliConfig = new(CLIConfig)

	changed := false

	err := cliConfig.Load()
	if err != nil {
		if os.IsNotExist(err) {
			cliConfig.APISecure = defaultAPISecure

			changed = true
		} else {
			return err
		}
	}

	if cliConfig.APIHostPort == "" {
		cliConfig.APIHostPort = defaultAPIHostPort
	}

	if cliConfig.ProvendbAPIGatewayEndpoint == "" {
		cliConfig.ProvendbAPIGatewayEndpoint = defaultProvenDBAPIGatewayEndpoint
	}

	if changed {
		err := cliConfig.Save()
		if err != nil {
			return err
		}
	}

	return nil
}

func saveCLIConfig() error {
	changed := false

	if val := viper.GetString(viperKeyAPIHostPort); val != cliConfig.APIHostPort {
		changed = true
		cliConfig.APIHostPort = val
	}

	if val := viper.GetBool(viperKeyAPISecure); val != cliConfig.APISecure {
		changed = true
		cliConfig.APISecure = val
	}

	if val := viper.GetString(viperKeyProvenDBAPIGatewayEndpoint); val != cliConfig.ProvendbAPIGatewayEndpoint {
		changed = true
		cliConfig.ProvendbAPIGatewayEndpoint = val
	}

	if val := viper.GetString(viperKeyDevToken); val != cliConfig.DevToken {
		changed = true
		cliConfig.DevToken = val
	}

	if changed {
		err := cliConfig.Save()
		if err != nil {
			return err
		}
	}

	return nil
}

// Load loads the CLI config from the user's config location
func (c *CLIConfig) Load() error {
	pth, err := getCLIConfigPath()
	if err != nil {
		return err
	}

	data, err := ioutil.ReadFile(pth)
	if err != nil {
		return err
	}

	return json.Unmarshal(data, c)
}

// Save saves the CLI config to the user's config location
func (c *CLIConfig) Save() error {
	pth, err := getCLIConfigPath()
	if err != nil {
		return err
	}

	// make sure dir exists
	err = os.MkdirAll(filepath.Dir(pth), config.FilePerm)
	if err != nil {
		return err
	}

	data, err := json.Marshal(c)
	if err != nil {
		return err
	}

	return ioutil.WriteFile(pth, data, config.FilePerm)
}
