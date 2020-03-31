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
 * @Date:   2019-10-10T15:47:58+11:00
 * @Last modified by:   guiguan
 * @Last modified time: 2020-03-31T17:03:53+11:00
 */

package strutil

import (
	"encoding/hex"
	"encoding/json"
	"strconv"
)

// HexOrString represents a string in either hex or printable ASCII
type HexOrString []byte

// MarshalJSON marshals to JSON
func (h HexOrString) MarshalJSON() ([]byte, error) {
	return json.Marshal(h.String())
}

// UnmarshalJSON unmarshals from JSON
func (h *HexOrString) UnmarshalJSON(data []byte) error {
	s := ""

	err := json.Unmarshal(data, &s)
	if err != nil {
		return err
	}

	deS, err := hex.DecodeString(s)
	if err != nil {
		*h = HexOrString(Bytes(s))
		return nil
	}

	*h = deS
	return nil
}

func (h HexOrString) String() string {
	if h.IsPrint() {
		return String(h)
	}

	return hex.EncodeToString(h)
}

// IsPrint indicates whether the value is printable
func (h HexOrString) IsPrint() bool {
	for _, r := range String(h) {
		// �
		if r == rune(65533) {
			return false
		}

		if !strconv.IsPrint(r) {
			return false
		}
	}

	return true
}
