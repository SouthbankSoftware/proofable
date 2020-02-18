/*
 * @Author: guiguan
 * @Date:   2020-02-15T20:43:06+11:00
 * @Last modified by:   guiguan
 * @Last modified time: 2020-02-18T16:42:59+11:00
 */

package api

import (
	"bytes"
	"context"
	"errors"
	"io"
	"os"
	"path/filepath"
	"sort"
	"sync"

	"github.com/SouthbankSoftware/provendb-trie/pkg/trienodes"
	apiPB "github.com/SouthbankSoftware/provenx-api/pkg/api/proto"
	"github.com/korovkin/limiter"
)

var (
	// DefaultGetFilePathKeyValueStreamConcurrency is the default concurrency for
	// GetFilePathKeyValueStream
	DefaultGetFilePathKeyValueStreamConcurrency uint32 = 4

	// ErrFileSkipped is the error returned when a file is skipped
	ErrFileSkipped = errors.New("file skipped")
)

// OnFileInfoFunc represents the callback function when a file info is available. The returned key
// of each key-value should contain the passed in key prefix. Return an ErrFileSkipped to skip
// current file and the walk will continue on the rest
type OnFileInfoFunc func(keyPrefix string, fi os.FileInfo) (kvs []*apiPB.KeyValue, er error)

// GetFilePathKeyValueStream returns a key value stream of the file path. When concurrency is 1, the
// key-value stream is guaranteed to be sorted lexically by key
func GetFilePathKeyValueStream(
	ctx context.Context,
	path string,
	concurrency uint32,
	onFileInfo OnFileInfoFunc,
) (kvCH <-chan *apiPB.KeyValue, errCH <-chan error) {
	if concurrency == 0 {
		concurrency = DefaultGetFilePathKeyValueStreamConcurrency
	}

	// keep the channel size low and tweak it when doing benchmark later on. The size could also be
	// based on the concurrency
	kvChan := make(chan *apiPB.KeyValue, 10)
	// error channel should always have size 1
	errChan := make(chan error, 1)
	// make sure the error channel only be closed once
	closeWithErrOnce := new(sync.Once)
	closeWithErr := func(err error) {
		closeWithErrOnce.Do(func() {
			if err != nil {
				errChan <- err
			}

			close(errChan)
		})
	}

	go func() {
		// always close all channels from the sender side
		defer close(kvChan)
		defer closeWithErr(nil)

		cLmt := (*limiter.ConcurrencyLimiter)(nil)

		if concurrency != 1 {
			cLmt = limiter.NewConcurrencyLimiter(int(concurrency))
			// always wait for all worker to finish
			defer cLmt.Wait()
		}

		hasherPool := &sync.Pool{
			New: func() interface{} {
				return trienodes.NewKeccak()
			},
		}

		hashTarget := func(key, fp string) (ha []byte, er error) {
			hasher := hasherPool.Get().(trienodes.Keccak)
			// always put the hasher back
			defer hasherPool.Put(hasher)
			// always reset the hasher for future use
			defer hasher.Reset()

			hash := make([]byte, hasher.Size())

			f, err := os.Open(fp)
			if err != nil {
				er = err
				return
			}
			defer f.Close()

			_, err = io.Copy(hasher, f)
			if err != nil {
				er = err
				return
			}

			_, err = hasher.Read(hash)
			if err != nil {
				er = err
				return
			}

			ha = hash
			return
		}

		sendKV := func(kv *apiPB.KeyValue) error {
			select {
			case <-ctx.Done():
				return ctx.Err()
			case kvChan <- kv:
				return nil
			}
		}

		err := filepath.Walk(path, func(fp string, fi os.FileInfo, err error) error {
			if err != nil {
				return err
			}

			target, err := filepath.Rel(path, fp)
			if err != nil {
				return err
			}

			results := []*apiPB.KeyValue(nil)

			if onFileInfo != nil {
				kvs, err := onFileInfo(target, fi)
				if err != nil {
					if errors.Is(err, ErrFileSkipped) {
						// just skip current file
						return nil
					}

					return err
				}

				results = kvs
			} else {
				results = []*apiPB.KeyValue{}
			}

			if !fi.IsDir() {
				if cLmt != nil {
					// hash in parallel with limited concurrency
					cLmt.Execute(func() {
						// check after potential queueing
						select {
						case <-errChan:
							// already errored, skip
							return
						default:
						}

						hash, err := hashTarget(target, fp)
						if err != nil {
							closeWithErr(err)
							return
						}

						err = sendKV(&apiPB.KeyValue{
							Key:   []byte(target),
							Value: hash,
						})
						if err != nil {
							closeWithErr(err)
							return
						}
					})
				} else {
					// hash in series
					hash, err := hashTarget(target, fp)
					if err != nil {
						return err
					}

					results = append(results, &apiPB.KeyValue{
						Key:   []byte(target),
						Value: hash,
					})
				}
			}

			if cLmt == nil && len(results) > 1 {
				// sort results by key lexically if concurency is 1
				sort.Slice(results, func(i, j int) bool {
					return bytes.Compare(results[i].Key, results[j].Key) < 0
				})
			}

			for _, r := range results {
				err := sendKV(r)
				if err != nil {
					return err
				}
			}

			return nil
		})
		if err != nil {
			closeWithErr(err)
			return
		}
	}()

	kvCH = kvChan
	errCH = errChan
	return
}
