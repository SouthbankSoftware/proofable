/*
 * @Author: guiguan
 * @Date:   2020-02-20T22:33:23+11:00
 * @Last modified by:   guiguan
 * @Last modified time: 2020-02-20T22:45:52+11:00
 */

package cmd

import (
	"os"
	"path/filepath"
	"testing"

	"github.com/SouthbankSoftware/provenx-cli/pkg/api"
)

func Test_Smoke(t *testing.T) {
	path := "../../../pkg"
	triePath := filepath.Join(path, api.FileExtensionTrie)
	defer os.RemoveAll(triePath)

	cmdRoot.SetArgs([]string{"create", "proof", path})

	err := cmdRoot.Execute()
	if err != nil {
		t.Fatal(err)
	}

	cmdRoot.SetArgs([]string{"verify", "proof", path})

	err = cmdRoot.Execute()
	if err != nil {
		t.Fatal(err)
	}
}
