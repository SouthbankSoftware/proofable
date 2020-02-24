/*
 * @Author: guiguan
 * @Date:   2020-02-15T20:43:06+11:00
 * @Last modified by:   guiguan
 * @Last modified time: 2020-02-24T13:27:43+11:00
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

	"github.com/SouthbankSoftware/provendb-trie/pkg/trienodes/hasher"
	apiPB "github.com/SouthbankSoftware/provenx-api/pkg/api/proto"
	"github.com/karrick/godirwalk"
	"github.com/korovkin/limiter"
)

var (
	// DefaultGetFilePathKeyValueStreamConcurrency is the default concurrency for
	// GetFilePathKeyValueStream
	DefaultGetFilePathKeyValueStreamConcurrency uint32 = 4

	// FileExtensionTrie is the file extension for a trie
	FileExtensionTrie = ".pxt"

	// ErrFileSkipped is the error returned when a file is skipped
	ErrFileSkipped = errors.New("file skipped")
)

// OnFileInfoFunc represents the callback function when a file info is available. The returned key
// of each key-value should contain the passed in key prefix. Return an ErrFileSkipped to skip
// current file and the walk will continue on the rest
type OnFileInfoFunc func(keyPrefix string, de *godirwalk.Dirent) (kvs []*apiPB.KeyValue, er error)

// GetFilePathKeyValueStream returns a key value stream of the file path. When concurrency is 1 or
// ordered is true, the key-value stream is guaranteed to be sorted lexically by key; when
// concurrency is 0, DefaultGetFilePathKeyValueStreamConcurrency is used
func GetFilePathKeyValueStream(
	ctx context.Context,
	path string,
	concurrency uint32,
	ordered bool,
	onFileInfo OnFileInfoFunc,
) (kvCH <-chan *apiPB.KeyValue, errCH <-chan error) {
	if concurrency == 0 {
		concurrency = DefaultGetFilePathKeyValueStreamConcurrency
	}

	// keep the channel size low and tweak it when doing benchmark later on
	kvChan := make(chan *apiPB.KeyValue, 2*concurrency)
	// error channel should always have size 1
	errChan := make(chan error, 1)
	doneChan := make(chan struct{})
	// make sure the error channel only be closed once
	closeWithErrOnce := new(sync.Once)
	closeWithErr := func(err error) {
		closeWithErrOnce.Do(func() {
			if err != nil {
				errChan <- err
			}

			close(errChan)
			close(doneChan)
		})
	}

	go func() {
		// always close all channels from the sender side
		defer close(kvChan)
		defer closeWithErr(nil)

		sendKV := func(kv *apiPB.KeyValue) bool {
			select {
			case <-ctx.Done():
				closeWithErr(ctx.Err())
				return false
			case <-doneChan:
				return true
			case kvChan <- kv:
				return true
			}
		}

		asyncKVReducerDoneChan := (chan struct{})(nil)
		asyncKVChan := (chan (<-chan *apiPB.KeyValue))(nil)
		cLmt := (*limiter.ConcurrencyLimiter)(nil)

		if concurrency != 1 {
			if ordered {
				asyncKVReducerDoneChan = make(chan struct{})
				defer func() {
					// wait for async key-value reducer to finish
					<-asyncKVReducerDoneChan
				}()

				asyncKVChan = make(chan (<-chan *apiPB.KeyValue), concurrency)
				// all senders to asyncKVChan should be finished by then
				defer close(asyncKVChan)

				// start async key-value reducer
				go func() {
					defer close(asyncKVReducerDoneChan)

					for aKV := range asyncKVChan {
						if kv, ok := <-aKV; ok {
							if !sendKV(kv) {
								return
							}
						}
					}
				}()
			}

			cLmt = limiter.NewConcurrencyLimiter(int(concurrency))
			// wait for all hash worker to finish
			defer cLmt.Wait()
		} else {
			ordered = true
		}

		hasherPool := &sync.Pool{
			New: func() interface{} {
				return hasher.NewKeccak()
			},
		}

		hashTarget := func(key, fp string) (ha []byte, er error) {
			hasher := hasherPool.Get().(hasher.Keccak)
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

		err := godirwalk.Walk(path, &godirwalk.Options{
			Callback: func(fp string, de *godirwalk.Dirent) error {
				if !(de.IsRegular() || de.IsDir()) ||
					de.IsRegular() && filepath.Ext(fp) == FileExtensionTrie {
					// skip non-regular files (except directories) and trie files
					return nil
				}

				target, err := filepath.Rel(path, fp)
				if err != nil {
					return err
				}

				results := []*apiPB.KeyValue(nil)

				if onFileInfo != nil {
					kvs, err := onFileInfo(target, de)
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

				if de.IsRegular() {
					if cLmt != nil {
						asyncKVMapperDoneChan := (chan *apiPB.KeyValue)(nil)

						if asyncKVChan != nil {
							asyncKVMapperDoneChan = make(chan *apiPB.KeyValue)

							select {
							case <-ctx.Done():
								return ctx.Err()
							case <-doneChan:
								return errors.New("error has happened during path walking")
							case asyncKVChan <- asyncKVMapperDoneChan:
							}
						}

						// hash in parallel with limited concurrency
						cLmt.Execute(func() {
							if asyncKVChan != nil {
								defer close(asyncKVMapperDoneChan)
							}

							// check after potential queueing
							select {
							case <-ctx.Done():
								// already canceled
								closeWithErr(ctx.Err())
								return
							case <-doneChan:
								// already terminated due to error, skip
								return
							default:
							}

							// hash operation might take long time
							hash, err := hashTarget(target, fp)
							if err != nil {
								closeWithErr(err)
								return
							}

							kv := &apiPB.KeyValue{
								Key:   []byte(target),
								Value: hash,
							}

							if asyncKVChan == nil {
								sendKV(kv)
							} else {
								select {
								case <-ctx.Done():
									closeWithErr(ctx.Err())
									return
								case <-doneChan:
									return
								case asyncKVMapperDoneChan <- kv:
									return
								}
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
					if !sendKV(r) {
						return errors.New("failed to send key-value during path walking")
					}
				}

				return nil
			},
			Unsorted:          !ordered,
			AllowNonDirectory: true,
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
