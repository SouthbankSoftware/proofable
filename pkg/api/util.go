/*
 * @Author: guiguan
 * @Date:   2020-02-18T16:30:55+11:00
 * @Last modified by:   guiguan
 * @Last modified time: 2020-03-06T14:04:16+11:00
 */

package api

import (
	"context"
	"reflect"
	"unsafe"

	apiPB "github.com/SouthbankSoftware/provenx-api/pkg/api/proto"
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

// String returns the string representation of the byte slice without copying
func String(bytes []byte) string {
	hdr := *(*reflect.SliceHeader)(unsafe.Pointer(&bytes))
	return *(*string)(unsafe.Pointer(&reflect.StringHeader{
		Data: hdr.Data,
		Len:  hdr.Len,
	}))
}

// Bytes returns the byte slice representation of the string without copying. The byte slice must
// NOT be changed
func Bytes(str string) []byte {
	hdr := *(*reflect.StringHeader)(unsafe.Pointer(&str))
	return *(*[]byte)(unsafe.Pointer(&reflect.SliceHeader{
		Data: hdr.Data,
		Len:  hdr.Len,
		Cap:  hdr.Len,
	}))
}
