/*
 * @Author: guiguan
 * @Date:   2020-02-15T20:43:06+11:00
 * @Last modified by:   guiguan
 * @Last modified time: 2020-03-06T14:41:01+11:00
 */

package api

import (
	"context"
	"fmt"
	"log"

	apiPB "github.com/SouthbankSoftware/provenx-api/pkg/api/proto"
	"github.com/karrick/godirwalk"
)

func ExampleGetFilePathKeyValueStream() {
	kvCH, errCH := GetFilePathKeyValueStream(
		context.Background(),
		"../../cmd/playground/",
		1,
		true,
		func(key, fp string, de *godirwalk.Dirent) (kvs []*apiPB.KeyValue, er error) {
			// use this callback to define the metadata embedding logic and ignored files

			kvs = []*apiPB.KeyValue{
				{Key: []byte(key + "/!metadata/2"), Value: []byte("value2")},
				{Key: []byte(key + "/!metadata/1"), Value: []byte("value1")},
			}
			return
		})

	for kv := range kvCH {
		fmt.Printf("%s -> %x\n", kv.GetKey(), kv.GetValue())
	}

	err := <-errCH
	if err != nil {
		log.Fatal(err)
	}

	// Output:
	// ./!metadata/1 -> 76616c756531
	// ./!metadata/2 -> 76616c756532
	// playground.go -> c74ea0a37c69b514291f27a68e309b34fe3049bc14b86e218f702b3998771ba7
	// playground.go/!metadata/1 -> 76616c756531
	// playground.go/!metadata/2 -> 76616c756532
}
