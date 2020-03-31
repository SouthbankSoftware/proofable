/*
 * provenx
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
 * @Date:   2020-03-12T11:16:46+11:00
 * @Last modified by:   guiguan
 * @Last modified time: 2020-03-31T17:03:53+11:00
 */

package config

import (
	"os"
	"path/filepath"
)

const (
	// NameConfigRoot is the name of the root config directory
	NameConfigRoot = "ProvenDB"
	// FilePerm is the file system permission that a new file or directory should be created with
	FilePerm = 0755
)

// RootPath returns the config root path
func RootPath() (pt string, er error) {
	userConfDir, err := os.UserConfigDir()
	if err != nil {
		er = err
		return
	}

	pt = filepath.Join(userConfDir, NameConfigRoot)
	return
}

// FilePath returns the config file path for the given config file name
func FilePath(configFileName string) (pt string, er error) {
	pt, err := RootPath()
	if err != nil {
		er = err
		return
	}

	pt = filepath.Join(pt, configFileName)
	return
}
