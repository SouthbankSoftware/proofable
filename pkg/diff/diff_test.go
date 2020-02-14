/*
 * @Author: guiguan
 * @Date:   2020-02-14T13:21:46+11:00
 * @Last modified by:   guiguan
 * @Last modified time: 2020-02-14T23:32:04+11:00
 */

package diff

import (
	"context"
	"testing"

	apiPB "github.com/SouthbankSoftware/provenx-api/pkg/api/proto"
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
