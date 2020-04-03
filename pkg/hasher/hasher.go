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
 * @Last modified time: 2020-04-03T15:57:55+11:00
 */

package hasher

import (
	"fmt"
	"hash"

	"golang.org/x/crypto/sha3"
)

// HashSize is the size of a hash
const HashSize = 32

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

// VerifyHash verifies the hash size
func VerifyHash(hash []byte) error {
	if len(hash) != HashSize {
		return fmt.Errorf("hash size is not %v", HashSize)
	}

	return nil
}
