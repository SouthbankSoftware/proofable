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
 * @Date:   2019-10-10T15:26:18+11:00
 * @Last modified by:   guiguan
 * @Last modified time: 2020-07-31T17:28:38+10:00
 */

package hasher

import (
	"fmt"
	"hash"
	"io"
	"os"

	"golang.org/x/crypto/sha3"
)

// HashSize is the size of a hash
const HashSize = 32

// EmptyHash is the hash value for empty byte array
var EmptyHash [HashSize]byte

func init() {
	NewKeccak().Read(EmptyHash[:])
}

// Keccak wraps sha3.state. In addition to the usual hash methods, it also supports Read to get a
// variable amount of data from the hash state. Read is faster than Sum because it doesn't copy the
// internal state, but also modifies the internal state.
type Keccak interface {
	hash.Hash
	Read([]byte) (int, error)
}

// NewKeccak creates a new SHA3 Keccak hasher
func NewKeccak() Keccak {
	return sha3.NewLegacyKeccak256().(Keccak)
}

// HashData hashes the given data and returns its sha3 hash value
func HashData(hasher Keccak, data []byte) (ha []byte, er error) {
	// always reset the hasher for future use
	defer hasher.Reset()

	hash := make([]byte, hasher.Size())

	_, err := hasher.Write(data)
	if err != nil {
		er = err
		return
	}

	_, err = hasher.Read(hash)
	if err != nil {
		er = err
		return
	}

	ha = hash
	return
}

// HashStream hashes the given stream and returns its sha3 hash value
func HashStream(hasher Keccak, reader io.Reader) (ha []byte, er error) {
	// always reset the hasher for future use
	defer hasher.Reset()

	hash := make([]byte, hasher.Size())

	_, err := io.Copy(hasher, reader)
	if err != nil {
		er = err
		return
	}

	_, err = hasher.Read(hash)
	if err != nil {
		er = err
		return
	}

	ha = hash
	return
}

// HashFile hashes the given file and returns its sha3 hash value
func HashFile(hasher Keccak, fp string) (ha []byte, er error) {
	f, err := os.Open(fp)
	if err != nil {
		er = err
		return
	}
	defer f.Close()

	return HashStream(hasher, f)
}

// VerifyHash verifies the hash value. At the moment, it only verifies the hash size
func VerifyHash(hash []byte) error {
	if len(hash) != HashSize {
		return fmt.Errorf("hash size is not %v", HashSize)
	}

	return nil
}
