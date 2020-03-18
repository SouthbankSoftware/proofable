/*
 * @Author: guiguan
 * @Date:   2020-02-18T16:30:55+11:00
 * @Last modified by:   guiguan
 * @Last modified time: 2020-03-18T15:01:17+11:00
 */

package api

import (
	"context"

	apiPB "github.com/SouthbankSoftware/provenx-cli/pkg/protos/api"
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
