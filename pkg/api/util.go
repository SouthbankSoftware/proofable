/*
 * provenx-cli
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
 * @Date:   2020-02-18T16:30:55+11:00
 * @Last modified by:   guiguan
 * @Last modified time: 2020-03-31T16:38:30+11:00
 */

package api

import (
	"context"

	apiPB "github.com/SouthbankSoftware/provenx/pkg/protos/api"
)

// InterceptKeyValueStream intercepts the key-value stream with the given callback function
func InterceptKeyValueStream(
	ctx context.Context,
	input <-chan *apiPB.KeyValue,
	fn func(kv *apiPB.KeyValue) *apiPB.KeyValue,
) (output <-chan *apiPB.KeyValue) {
	ch := make(chan *apiPB.KeyValue)

	go func() {
		defer close(ch)

		for kv := range input {
			kv = fn(kv)

			select {
			case <-ctx.Done():
				return
			case ch <- kv:
			}
		}
	}()

	output = ch
	return
}
