/*
 * @Author: guiguan
 * @Date:   2020-10-05T22:18:06+11:00
 * @Last modified by:   guiguan
 * @Last modified time: 2020-10-05T23:04:31+11:00
 */

package cmd

import (
	"encoding/json"
	"os"
)

// CloudTrie represents the info object for a cloud trie
type CloudTrie struct {
	ID      string `json:"id"`
	ProofID string `json:"proofId"`
}

// Save saves the cloud trie to a file
func (c *CloudTrie) Save(filePath string) error {
	f, err := os.Create(filePath)
	if err != nil {
		return err
	}
	defer f.Close()

	return json.NewEncoder(f).Encode(c)
}

// Load loads the cloud trie from a file
func (c *CloudTrie) Load(filePath string) error {
	f, err := os.Open(filePath)
	if err != nil {
		return err
	}
	defer f.Close()

	return json.NewDecoder(f).Decode(c)
}
