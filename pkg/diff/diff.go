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
 * @Date:   2020-02-14T13:21:46+11:00
 * @Last modified by:   guiguan
 * @Last modified time: 2020-04-03T15:57:55+11:00
 */

package diff

import (
	"bytes"
	"errors"

	apiPB "github.com/SouthbankSoftware/proofable/pkg/protos/api"
)

var (
	// ErrDiffStopped is the error returned when a diff opertion is stopped by a callback function
	ErrDiffStopped = errors.New("diff stopped")
)

// KeyValueDiffResult represents a key-value diff result
type KeyValueDiffResult int

const (
	// KeyValueEqual means the two key-values are identical
	KeyValueEqual KeyValueDiffResult = iota
	// KeyValueValueDifferent means the two key-values are different in values
	KeyValueValueDifferent
	// KeyValueLeftKeyMissing means the left key-value is missing
	KeyValueLeftKeyMissing
	// KeyValueRightKeyMissing means the right key-value is missing
	KeyValueRightKeyMissing
)

// OnOrderedKeyValueDiffResult represents the callback function when a diff result of a key-value is
// available
type OnOrderedKeyValueDiffResult func(leftKV, rightKV *apiPB.KeyValue, result KeyValueDiffResult) error

// OrderedKeyValueStreams diffs two ordered key-value streams. The streams must be closed eventually
// for the diff to terminate
func OrderedKeyValueStreams(
	leftStream, rightStream <-chan *apiPB.KeyValue,
	onResult OnOrderedKeyValueDiffResult,
) error {
	if onResult == nil {
		return errors.New("`onResult` must be provided")
	}

	leftKV := <-leftStream
	rightKV := <-rightStream

	for {
		var result KeyValueDiffResult

		if leftKV == nil {
			if rightKV == nil {
				return nil
			}

			result = KeyValueLeftKeyMissing
		} else if rightKV == nil {
			result = KeyValueRightKeyMissing
		} else if o := bytes.Compare(leftKV.GetKey(), rightKV.GetKey()); o == 0 {
			if bytes.Equal(leftKV.GetValue(), rightKV.GetValue()) {
				result = KeyValueEqual
			} else {
				result = KeyValueValueDifferent
			}
		} else if o < 0 {
			result = KeyValueRightKeyMissing
		} else {
			result = KeyValueLeftKeyMissing
		}

		err := onResult(leftKV, rightKV, result)
		if err != nil {
			if errors.Is(err, ErrDiffStopped) {
				return nil
			}

			return err
		}

		if result == KeyValueLeftKeyMissing {
			rightKV = <-rightStream
		} else if result == KeyValueRightKeyMissing {
			leftKV = <-leftStream
		} else {
			leftKV = <-leftStream
			rightKV = <-rightStream
		}
	}
}
