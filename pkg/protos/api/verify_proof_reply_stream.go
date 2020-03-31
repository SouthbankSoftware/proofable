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
 * @Date:   2020-02-04T16:21:50+11:00
 * @Last modified by:   guiguan
 * @Last modified time: 2020-03-31T17:03:56+11:00
 */

package api

import (
	"errors"
	fmt "fmt"
	"io"
	"sync"
	"sync/atomic"

	context "golang.org/x/net/context"
)

// atomicError is a type-safe atomic value for errors.
// We use a struct{ error } to ensure consistent use of a concrete type.
type atomicError struct{ v atomic.Value }

func (a *atomicError) Store(err error) {
	a.v.Store(struct{ error }{err})
}
func (a *atomicError) Load() error {
	err, _ := a.v.Load().(struct{ error })
	return err.error
}

// VerifyProofReplyStreamReciever represents a gRPC verify proof reply stream receiver
type VerifyProofReplyStreamReciever interface {
	Context() context.Context
	Recv() (*VerifyProofReplyChunk, error)
}

// VerifyProofReplyStreamSender represents a gRPC verify proof reply stream sender
type VerifyProofReplyStreamSender interface {
	Context() context.Context
	Send(*VerifyProofReplyChunk) error
}

// NewVerifyProofReplyStreamReader creates a fan-out reader out of the
// VerifyProofReplyStreamReciever
func NewVerifyProofReplyStreamReader(
	vsr VerifyProofReplyStreamReciever,
) (
	sr *VerifyProofReplyStreamReader,
) {
	r := &VerifyProofReplyStreamReader{
		vsr:  vsr,
		kvCH: make(chan *KeyValue, 10),
		rpCH: make(chan *VerifyProofReply),
		dcCH: make(chan *DataChunk, 10),
		done: make(chan struct{}),
		once: new(sync.Once),
		err:  &atomicError{},
	}

	rc := NewDataStreamReader(r, nil)

	r.DotGraph = rc

	go func() {
		var er error

		defer func() {
			close(r.kvCH)
			close(r.rpCH)
			close(r.dcCH)

			r.Close(er)
		}()

		for {
			ck, err := vsr.Recv()
			if err != nil {
				if errors.Is(err, io.EOF) {
					return
				}

				er = err
				return
			}

			switch d := ck.GetData().(type) {
			case *VerifyProofReplyChunk_KeyValue:
				select {
				case <-r.done:
					return
				case r.kvCH <- d.KeyValue:
				}
			case *VerifyProofReplyChunk_DotGraphChunk:
				select {
				case <-r.done:
					return
				case r.dcCH <- d.DotGraphChunk:
				}
			case *VerifyProofReplyChunk_Reply:
				select {
				case <-r.done:
				case r.rpCH <- d.Reply:
				}

				return
			default:
				er = fmt.Errorf("unexpected verify proof reply chunk data type: %T", d)
				return
			}
		}
	}()

	sr = r
	return
}

// VerifyProofReplyStreamReader represents a fan-out reader
type VerifyProofReplyStreamReader struct {
	vsr  VerifyProofReplyStreamReciever
	kvCH chan *KeyValue
	rpCH chan *VerifyProofReply
	dcCH chan *DataChunk
	done chan struct{}
	once *sync.Once
	err  *atomicError

	// DotGraph is dot graph reader. It must be closed to ensure all data are read
	DotGraph io.ReadCloser
}

// KeyValues returns the key-value channel
func (v *VerifyProofReplyStreamReader) KeyValues() <-chan *KeyValue {
	return v.kvCH
}

// Reply returns the reply channel
func (v *VerifyProofReplyStreamReader) Reply() <-chan *VerifyProofReply {
	return v.rpCH
}

// Done returns the done channel
func (v *VerifyProofReplyStreamReader) Done() <-chan struct{} {
	return v.done
}

// Err returns the error when the reader is done
func (v *VerifyProofReplyStreamReader) Err() error {
	return v.err.Load()
}

// Close closes the fan-out reader with the error
func (v *VerifyProofReplyStreamReader) Close(err error) {
	if err != nil && v.err.Load() == nil {
		v.err.Store(err)
	}

	v.once.Do(func() {
		close(v.done)
	})
}

// Context returns the underlying stream context
func (v *VerifyProofReplyStreamReader) Context() context.Context {
	return v.vsr.Context()
}

// Recv receives a dot graph chunk
func (v *VerifyProofReplyStreamReader) Recv() (dc *DataChunk, er error) {
	ck, ok := <-v.dcCH
	if !ok {
		er = v.err.Load()

		if er == nil {
			er = io.EOF
		}

		return
	}

	dc = ck
	return
}

// NewVerifyProofReplyStreamWriter creates a fan-in writer out of the VerifyProofReplyStreamSender
func NewVerifyProofReplyStreamWriter(
	vss VerifyProofReplyStreamSender,
) (
	sw *VerifyProofReplyStreamWriter,
) {
	w := &VerifyProofReplyStreamWriter{
		vss:  vss,
		ckCH: make(chan *VerifyProofReplyChunk, 10),
		done: make(chan struct{}),
		once: new(sync.Once),
		err:  &atomicError{},
	}

	wc := NewDataStreamWriter(w, nil)

	w.DotGraph = wc

	go func() {
		var er error

		defer func() {
			w.close(er)
		}()

		for {
			select {
			case <-w.done:
				return
			case ck := <-w.ckCH:
				err := vss.Send(ck)
				if err != nil {
					er = err
					return
				}

				if _, ok := ck.GetData().(*VerifyProofReplyChunk_Reply); ok {
					return
				}
			}
		}
	}()

	sw = w
	return
}

// VerifyProofReplyStreamWriter represents a fan-in writer
type VerifyProofReplyStreamWriter struct {
	vss  VerifyProofReplyStreamSender
	ckCH chan *VerifyProofReplyChunk
	done chan struct{}
	once *sync.Once
	err  *atomicError

	// DotGraph is dot graph writer. It must be closed to ensure all data are written
	DotGraph io.WriteCloser
}

// WriteKeyValue writes a key-value pair
func (v *VerifyProofReplyStreamWriter) WriteKeyValue(kv *KeyValue) error {
	ck := &VerifyProofReplyChunk{
		Data: &VerifyProofReplyChunk_KeyValue{
			KeyValue: kv,
		},
	}

	select {
	case <-v.done:
		return v.err.Load()
	case v.ckCH <- ck:
		return nil
	}
}

// WriteReply writes a reply
func (v *VerifyProofReplyStreamWriter) WriteReply(reply *VerifyProofReply) error {
	ck := &VerifyProofReplyChunk{
		Data: &VerifyProofReplyChunk_Reply{
			Reply: reply,
		},
	}

	select {
	case <-v.done:
		return v.err.Load()
	case v.ckCH <- ck:
		return nil
	}
}

// Done returns the done channel
func (v *VerifyProofReplyStreamWriter) Done() <-chan struct{} {
	return v.done
}

// Err returns the error when the writer is done
func (v *VerifyProofReplyStreamWriter) Err() error {
	return v.err.Load()
}

func (v *VerifyProofReplyStreamWriter) close(err error) {
	if err != nil && v.err.Load() == nil {
		v.err.Store(err)
	}

	v.once.Do(func() {
		close(v.done)
	})
}

// Close closes the fan-in writer with the error. If error is nil, it will wait until the writer has
// processed all the inputs
func (v *VerifyProofReplyStreamWriter) Close(err error) {
	if err == nil {
		<-v.done
	} else {
		v.close(err)
	}
}

// Context returns the underlying stream context
func (v *VerifyProofReplyStreamWriter) Context() context.Context {
	return v.vss.Context()
}

// Send writes a dot graph chunk
func (v *VerifyProofReplyStreamWriter) Send(dc *DataChunk) error {
	ck := &VerifyProofReplyChunk{
		Data: &VerifyProofReplyChunk_DotGraphChunk{
			DotGraphChunk: dc,
		},
	}

	select {
	case <-v.done:
		return v.err.Load()
	case v.ckCH <- ck:
		return nil
	}
}
