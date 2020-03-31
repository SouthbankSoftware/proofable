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
 * @Date:   2020-01-24T13:47:12+11:00
 * @Last modified by:   guiguan
 * @Last modified time: 2020-03-31T11:21:39+11:00
 */

package api

import (
	"errors"
	"io"

	context "golang.org/x/net/context"
)

const (
	// MaxDataChunkSize is the buffer size used in data stream handling
	MaxDataChunkSize = 1024 // bytes
)

// DataChunkMetadata represents a data chunk metadata
type DataChunkMetadata = isDataChunk_Metadata

// DataStreamReciever represents a gRPC data stream receiver
type DataStreamReciever interface {
	Context() context.Context
	Recv() (*DataChunk, error)
}

// DataStreamSender represents a gRPC data stream sender
type DataStreamSender interface {
	Context() context.Context
	Send(*DataChunk) error
}

// NewDataStreamReader creates an io.ReadCloser out of the DataStreamReciever
func NewDataStreamReader(
	dsr DataStreamReciever,
	onMetadata func(md DataChunkMetadata) error,
) io.ReadCloser {
	pr, pw := io.Pipe()

	done := make(chan struct{})

	go func() {
		defer close(done)

		ctx := dsr.Context()
		first := true
		var er error

		defer func() {
			pw.CloseWithError(er)
		}()

		for {
			select {
			case <-ctx.Done():
				er = ctx.Err()
				return
			default:
			}

			dc, err := dsr.Recv()
			if err != nil {
				if errors.Is(err, io.EOF) {
					return
				}

				er = err
				return
			}

			if first {
				first = false

				if onMetadata != nil {
					err := onMetadata(dc.Metadata)
					if err != nil {
						er = err
						return
					}
				}
			}

			_, err = pw.Write(dc.GetData())
			if err != nil {
				er = err
				return
			}
		}
	}()

	return &dataStreamReader{
		pr:   pr,
		pw:   pw,
		done: done,
	}
}

type dataStreamReader struct {
	pr   *io.PipeReader
	pw   *io.PipeWriter
	done chan struct{}
}

func (d *dataStreamReader) Read(p []byte) (n int, er error) {
	return d.pr.Read(p)
}

// Close closes the reader, which always returns nil. This should always be called once after using
// the reader
func (d *dataStreamReader) Close() error {
	d.pr.Close()
	<-d.done
	return nil
}

// NewDataStreamWriter creates an io.WriteCloser out of the DataStreamSender
func NewDataStreamWriter(
	dss DataStreamSender,
	onMetadata func() (md DataChunkMetadata, er error),
) io.WriteCloser {
	pr, pw := io.Pipe()

	done := make(chan struct{})

	go func() {
		defer close(done)

		ctx := dss.Context()
		first := true
		var er error

		defer func() {
			pr.CloseWithError(er)
		}()

		for {
			select {
			case <-ctx.Done():
				er = ctx.Err()
				return
			default:
			}

			data := make([]byte, MaxDataChunkSize)

			n, err := io.ReadFull(pr, data)
			if err != nil {
				if errors.Is(err, io.ErrUnexpectedEOF) {
					data = data[:n]
				} else if errors.Is(err, io.EOF) {
					return
				} else {
					er = err
					return
				}
			}

			dc := &DataChunk{
				Data: data,
			}

			if first {
				first = false

				if onMetadata != nil {
					md, err := onMetadata()
					if err != nil {
						er = err
						return
					}

					dc.Metadata = md
				}
			}

			err = dss.Send(dc)
			if err != nil {
				er = err
				return
			}
		}
	}()

	return &dataStreamWriter{
		pr:   pr,
		pw:   pw,
		done: done,
	}
}

type dataStreamWriter struct {
	pr   *io.PipeReader
	pw   *io.PipeWriter
	done chan struct{}
}

func (d *dataStreamWriter) Write(p []byte) (n int, er error) {
	return d.pw.Write(p)
}

// Close closes the writer, which always returns nil. This should always be called once after using
// the writer
func (d *dataStreamWriter) Close() error {
	d.pw.Close()
	<-d.done
	return nil
}
