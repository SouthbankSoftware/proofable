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
 * @Date:   2020-03-05T22:05:31+11:00
 * @Last modified by:   guiguan
 * @Last modified time: 2020-03-31T17:03:53+11:00
 */

package api

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"os"
	"reflect"
	"sort"
	"strings"

	apiPB "github.com/SouthbankSoftware/provenx/pkg/protos/api"
	"github.com/SouthbankSoftware/provenx/pkg/strutil"
	"github.com/djherbis/times"
	"github.com/karrick/godirwalk"
)

const (
	metadataPrefixHeader = "\x00"
	metadataPrefixBody   = "@META"

	// MetadataPrefix is the prefix for a metadata key
	MetadataPrefix = metadataPrefixHeader + metadataPrefixBody
	// MetadataSep is the separator for a metadata key
	MetadataSep = "/"
)

// NormalizeKey normalizes the given key to make sure that the metadata prefix if presented has the
// `metadataPrefixHeader`
func NormalizeKey(key []byte) []byte {
	bodyIdx := bytes.Index(key, strutil.Bytes(metadataPrefixBody))
	if bodyIdx == -1 {
		return key
	}

	headerIdx := bodyIdx - len(metadataPrefixHeader)
	if headerIdx < 0 {
		return append([]byte(metadataPrefixHeader), key...)
	}

	if bytes.Equal(key[headerIdx:bodyIdx], strutil.Bytes(metadataPrefixHeader)) {
		return key
	}

	result := append(key[:0:0], key[:bodyIdx]...)
	result = append(result, strutil.Bytes(metadataPrefixHeader)...)
	result = append(result, key[bodyIdx:]...)
	return result
}

func getKeyFromField(keyPrefix string, fdType reflect.StructField, fdValue reflect.Value) (
	skipped bool, key string) {
	name := ""

	if k, ok := fdType.Tag.Lookup("json"); ok {
		opts := strings.Split(k, ",")

		n := opts[0]

		if n == "-" ||
			len(opts) > 1 && opts[1] == "omitempty" && fdValue.IsZero() {
			skipped = true
			return
		}

		if n == "" {
			name = fdType.Name
		} else {
			name = n
		}
	} else {
		name = fdType.Name
	}

	key = keyPrefix + MetadataSep + name
	return
}

// MarshalToKeyValues marshals the given value to key-values while respecting the JSON tags
func MarshalToKeyValues(keyPrefix string, v interface{}) (kvs []*apiPB.KeyValue, er error) {
	st := reflect.ValueOf(v)

	if st.Kind() != reflect.Ptr {
		er = errors.New("`v` must a pointer to a struct")
		return
	}

	st = st.Elem()

	if st.Kind() != reflect.Struct {
		er = errors.New("`v` must a pointer to a struct")
		return
	}

	stType := st.Type()
	results := []*apiPB.KeyValue{}

	for i := 0; i < stType.NumField(); i++ {
		fdType := stType.Field(i)
		fdValue := st.Field(i)

		if fdValue.CanInterface() {
			skipped, keyStr := getKeyFromField(keyPrefix, fdType, fdValue)
			if skipped {
				continue
			}

			val, err := json.Marshal(fdValue.Interface())
			if err != nil {
				er = err
				return
			}

			results = append(results, &apiPB.KeyValue{
				Key:   strutil.Bytes(keyStr),
				Value: val,
			})
		}
	}

	kvs = results
	return
}

// UnmarshalFromKeyValues unmarshals the given value from the key-values while respecting the JSON
// tags
func UnmarshalFromKeyValues(
	keyPrefix string,
	getKeyValue func() (*apiPB.KeyValue, error),
	v interface{},
) (er error) {
	st := reflect.ValueOf(v)

	if st.Kind() != reflect.Ptr {
		er = errors.New("`v` must a pointer to a struct")
		return
	}

	st = st.Elem()

	if st.Kind() != reflect.Struct {
		er = errors.New("`v` must a pointer to a struct")
		return
	}

	stType := st.Type()

	type structField struct {
		key   string
		field *reflect.StructField
	}

	fields := []structField{}

	for i := 0; i < stType.NumField(); i++ {
		fdType := stType.Field(i)
		fdValue := st.Field(i)

		if !fdValue.CanSet() {
			continue
		}

		skipped, expectedKeyStr := getKeyFromField(keyPrefix, fdType, fdValue)
		if skipped {
			continue
		}

		fields = append(fields, structField{
			key:   expectedKeyStr,
			field: &fdType,
		})
	}

	sort.Slice(fields, func(i, j int) bool {
		return fields[i].key < fields[j].key
	})

	for _, fd := range fields {
		kv, err := getKeyValue()
		if err != nil {
			er = err
			return
		}

		if !bytes.Equal(kv.Key, strutil.Bytes(fd.key)) {
			er = fmt.Errorf("expected key `%v` but got `%v`", fd.key, strutil.String(kv.Key))
			return
		}

		fdValue := st.FieldByIndex(fd.field.Index)

		err = json.Unmarshal(kv.Value, fdValue.Addr().Interface())
		if err != nil {
			er = err
			return
		}
	}

	return nil
}

// FilePathKeyMetadata represents a file path key metadata
type FilePathKeyMetadata struct {
	Size       int64       `json:"size"`
	Mode       os.FileMode `json:"mode"`
	ModTime    int64       `json:"modTime"`
	ChangeTime int64       `json:"changeTime,omitempty"`
	BirthTime  int64       `json:"birthTime,omitempty"`
}

// GetFilePathMetadata gets the metadata for a file path key
func GetFilePathMetadata(fp string) (
	md *FilePathKeyMetadata, er error) {
	fi, err := os.Lstat(fp)
	if err != nil {
		er = err
		return
	}

	ts := times.Get(fi)

	metadata := &FilePathKeyMetadata{
		Size:    fi.Size(),
		Mode:    fi.Mode(),
		ModTime: ts.ModTime().Unix(),
	}

	if ts.HasChangeTime() {
		metadata.ChangeTime = ts.ChangeTime().Unix()
	}

	if ts.HasBirthTime() {
		metadata.BirthTime = ts.BirthTime().Unix()
	}

	md = metadata
	return
}

// GetFilePathKeyMetadataKeyValues gets the metadata key-values for a file path key
func GetFilePathKeyMetadataKeyValues(key, fp string, de *godirwalk.Dirent) (
	kvs []*apiPB.KeyValue, er error) {
	md, err := GetFilePathMetadata(fp)
	if err != nil {
		er = err
		return
	}

	var sep string

	if de.IsDir() {
		sep = "/"
	}

	return MarshalToKeyValues(key+sep+MetadataPrefix, md)
}
