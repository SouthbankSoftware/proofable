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
 * @Date:   2020-02-15T20:43:06+11:00
 * @Last modified by:   guiguan
 * @Last modified time: 2020-04-03T16:20:33+11:00
 */

package api

import (
	"context"
	"fmt"
	"log"

	apiPB "github.com/SouthbankSoftware/proofable/pkg/protos/api"
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
	// playground.go -> 87768d49ee2a77adc0cc99f751cf7c9a2bcd15e547bbd78c3791ce1f46345b5f
	// playground.go/!metadata/1 -> 76616c756531
	// playground.go/!metadata/2 -> 76616c756532
}
