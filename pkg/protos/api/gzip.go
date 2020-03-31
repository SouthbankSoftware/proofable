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
 * @Date:   2020-01-28T23:19:56+11:00
 * @Last modified by:   guiguan
 * @Last modified time: 2020-03-31T17:03:56+11:00
 */

package api

import (
	"archive/tar"
	"compress/gzip"
	"io"
	"os"
	"path/filepath"
)

// Compress compresses the filesystem in the path as tar.gz stream and writes to the given writer
func Compress(path string, w io.Writer) (er error) {
	gw := gzip.NewWriter(w)
	defer func() {
		err := gw.Close()
		if err != nil && er == nil {
			er = err
		}
	}()
	tw := tar.NewWriter(gw)
	defer func() {
		err := tw.Close()
		if err != nil && er == nil {
			er = err
		}
	}()

	return filepath.Walk(path, func(fp string, fi os.FileInfo, err error) error {
		if err != nil {
			return err
		}

		// generate tar header
		header, err := tar.FileInfoHeader(fi, fi.Name())
		if err != nil {
			return err
		}

		target, err := filepath.Rel(path, fp)
		if err != nil {
			return err
		}

		header.Name = target

		// write header
		err = tw.WriteHeader(header)
		if err != nil {
			return err
		}

		// if not a dir, write file content
		if !fi.IsDir() {
			f, err := os.Open(fp)
			if err != nil {
				return err
			}

			_, err = io.Copy(tw, f)
			if err != nil {
				return err
			}
		}

		return nil
	})
}

// Decompress reads from the given reader and decompresses the tar.gz stream back to the filesystem
// in the path
func Decompress(path string, r io.Reader) (er error) {
	zr, err := gzip.NewReader(r)
	if err != nil {
		return err
	}
	defer func() {
		err := zr.Close()
		if err != nil && er == nil {
			er = err
		}
	}()

	tr := tar.NewReader(zr)

	for {
		header, err := tr.Next()
		if err != nil {
			if err == io.EOF {
				// end of archive
				break
			}

			return err
		}

		target := filepath.Join(path, header.Name)

		switch header.Typeflag {
		case tar.TypeDir:
			if err := os.MkdirAll(target, 0755); err != nil {
				return err
			}
		case tar.TypeReg:
			f, err := os.OpenFile(target,
				os.O_CREATE|os.O_RDWR, os.FileMode(header.Mode))
			if err != nil {
				return err
			}

			_, err = io.Copy(f, tr)
			if err != nil {
				return err
			}

			// manually close here; otherwise it would cause each file to close until all operations
			// have completed.
			err = f.Close()
			if err != nil {
				return err
			}
		}
	}

	return nil
}
