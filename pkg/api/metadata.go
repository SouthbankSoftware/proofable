/*
 * @Author: guiguan
 * @Date:   2020-03-05T22:05:31+11:00
 * @Last modified by:   guiguan
 * @Last modified time: 2020-03-06T23:48:55+11:00
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

	apiPB "github.com/SouthbankSoftware/provenx-api/pkg/api/proto"
	"github.com/djherbis/times"
	"github.com/karrick/godirwalk"
)

const (
	// MetadataPrefix is the prefix for metadata
	MetadataPrefix = "\x00@META"
)

func getKeyFromField(keyPrefix string, fdType reflect.StructField, fdValue reflect.Value) (
	skipped bool, key string) {
	name := ""

	if k, ok := fdType.Tag.Lookup("json"); ok {
		opts := strings.Split(k, ",")

		if opts[0] == "-" || opts[0] == "" {
			skipped = true
			return
		}

		if len(opts) > 1 && opts[1] == "omitempty" && fdValue.IsZero() {
			skipped = true
			return
		}

		name = opts[0]
	} else {
		name = fdType.Name
	}

	key = keyPrefix + "/" + name
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
				Key:   Bytes(keyStr),
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

		if !bytes.Equal(kv.Key, Bytes(fd.key)) {
			er = fmt.Errorf("expected key `%v` but got `%v`", fd.key, String(kv.Key))
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

// GetFilePathKeyMetadata gets the metadata for a file path key
func GetFilePathKeyMetadata(key, fp string, de *godirwalk.Dirent) (
	kvs []*apiPB.KeyValue, er error) {
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

	var sep string

	if de.IsDir() {
		sep = "/"
	}

	return MarshalToKeyValues(key+sep+MetadataPrefix, metadata)
}
