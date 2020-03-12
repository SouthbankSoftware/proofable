/*
 * @Author: guiguan
 * @Date:   2020-03-12T10:44:37+11:00
 * @Last modified by:   guiguan
 * @Last modified time: 2020-03-12T11:46:37+11:00
 */

package cmd

import (
	"encoding/json"
	"io/ioutil"
	"os"
	"path/filepath"

	"github.com/SouthbankSoftware/provenx-cli/pkg/config"
)

// CLIConfig represents a CLI config
type CLIConfig struct {
	APIHostPort                string `json:"apiHostPort"`
	APISecure                  bool   `json:"apiSecure"`
	ProvendbAPIGatewayEndpoint string `json:"provendbApiGatewayEndpoint"`
}

func getCLIConfigPath() (pt string, er error) {
	return config.FilePath(name + ".json")
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
