/*
 * @Author: guiguan
 * @Date:   2020-03-12T11:16:46+11:00
 * @Last modified by:   guiguan
 * @Last modified time: 2020-03-12T11:32:30+11:00
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
