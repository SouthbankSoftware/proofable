/*
 * @Author: guiguan
 * @Date:   2020-03-17T09:42:27+11:00
 * @Last modified by:   guiguan
 * @Last modified time: 2020-03-17T12:04:33+11:00
 */

package strutil

import (
	"reflect"
	"unsafe"
	"bytes"
)

// String returns the string representation of the byte slice without copying
func String(byt []byte) string {
	hdr := *(*reflect.SliceHeader)(unsafe.Pointer(&byt))
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

// BytesWithoutNullChar returns a new byte slice with the null characters removed
func BytesWithoutNullChar(byt []byte) []byte {
	return bytes.ReplaceAll(byt, Bytes("\x00"), nil)
}
