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
 * @Date:   2020-02-20T22:33:23+11:00
 * @Last modified by:   guiguan
 * @Last modified time: 2020-04-03T15:57:55+11:00
 */

package cmd

import (
	"os"
	"path/filepath"
	"testing"

	"github.com/SouthbankSoftware/proofable/pkg/api"
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
