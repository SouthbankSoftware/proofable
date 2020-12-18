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
 * @Date:   2020-12-17T17:43:12+11:00
 * @Last modified by:   guiguan
 * @Last modified time: 2020-12-17T17:47:30+11:00
 */

package api

import (
	fmt "fmt"
	"strings"

	"github.com/SouthbankSoftware/proofable/pkg/strutil"
)

// Last returns the last key component
func (kv *KeyValue) Last() []byte {
	if l := len(kv.KeySep); l > 0 {
		return kv.Key[kv.KeySep[l-1]:]
	}

	return kv.Key
}

// KeyString returns a human readable string representation of the key
func (kv KeyValue) KeyString() string {
	b := new(strings.Builder)
	i := uint32(0)

	for _, s := range kv.KeySep {
		fmt.Fprint(b, strutil.HexOrString(kv.Key[i:s]), " ")
		i = s
	}

	fmt.Fprint(b, strutil.HexOrString(kv.Key[i:]))

	return b.String()
}
