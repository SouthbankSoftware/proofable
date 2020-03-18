/*
 * @Author: guiguan
 * @Date:   2019-10-10T15:47:58+11:00
 * @Last modified by:   guiguan
 * @Last modified time: 2020-03-17T10:54:07+11:00
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
