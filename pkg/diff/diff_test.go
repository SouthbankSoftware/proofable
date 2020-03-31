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
 * @Date:   2020-02-14T13:21:46+11:00
 * @Last modified by:   guiguan
 * @Last modified time: 2020-03-31T11:16:45+11:00
 */

package diff

import (
	"context"
	"testing"

	apiPB "github.com/SouthbankSoftware/provenx-cli/pkg/protos/api"
	"github.com/google/go-cmp/cmp"
	"golang.org/x/sync/errgroup"
)

func TestOrderedKeyValueStreams(t *testing.T) {
	leftStream := make(chan *apiPB.KeyValue)
	rightStream := make(chan *apiPB.KeyValue)

	eg, _ := errgroup.WithContext(context.Background())

	eg.Go(func() error {
		defer close(leftStream)

		leftStream <- &apiPB.KeyValue{
			Key:   []byte("anchor"),
			Value: []byte("val1"),
		}

		leftStream <- &apiPB.KeyValue{
			Key:   []byte("ci/pipeline-deploy.yml"),
			Value: []byte("val2"),
		}

		leftStream <- &apiPB.KeyValue{
			Key:   []byte("ci/tasks/task-unit-test.yml"),
			Value: []byte("val3"),
		}

		leftStream <- &apiPB.KeyValue{
			Key:   []byte("cmd/.DS_Store"),
			Value: []byte("val5"),
		}

		leftStream <- &apiPB.KeyValue{
			Key:   []byte("cmd/anchor/init.go"),
			Value: []byte("val7"),
		}

		return nil
	})

	eg.Go(func() error {
		defer close(rightStream)

		rightStream <- &apiPB.KeyValue{
			Key:   []byte("anchor"),
			Value: []byte("val1"),
		}

		rightStream <- &apiPB.KeyValue{
			Key:   []byte("ci/tasks/build-docker-tag.yml"),
			Value: []byte("val4"),
		}

		rightStream <- &apiPB.KeyValue{
			Key:   []byte("cmd/.DS_Store"),
			Value: []byte("val6"),
		}

		rightStream <- &apiPB.KeyValue{
			Key:   []byte("cmd/anchor/init.go"),
			Value: []byte("val7"),
		}

		return nil
	})

	results := []KeyValueDiffResult{}

	err := OrderedKeyValueStreams(leftStream, rightStream,
		func(leftKV, rightKV *apiPB.KeyValue, result KeyValueDiffResult) error {
			results = append(results, result)
			return nil
		})
	if err != nil {
		t.Fatal(err)
	}

	if !cmp.Equal(results, []KeyValueDiffResult{
		KeyValueEqual,
		KeyValueRightKeyMissing,
		KeyValueLeftKeyMissing,
		KeyValueRightKeyMissing,
		KeyValueValueDifferent,
		KeyValueEqual,
	}) {
		t.Fatal("mismatched key-value diff results")
	}
}
