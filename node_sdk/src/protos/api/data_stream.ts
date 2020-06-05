import _ from "lodash";
import { Readable, Writable } from "stream";
import * as grpc from "grpc";
import { ServiceError } from "grpc/build/src/call";
import { DataChunk } from "./api_pb";
import { makeServiceError } from "./util";

export type CleanupFn = (err?: ServiceError) => void;

export interface ReadableDataStream<T> {
  destroyed: boolean;
  destroy(): void;
  cancel(): void;
  on(event: "error", listener: (arg: Error) => void): this;
  on(event: "data", listener: (arg: T) => void): this;
  on(event: "end", listener: () => void): this;
}

export type WritableDataStream<T> = grpc.ClientWritableStream<T>;

/**
 * The buffer size used in data stream handling
 */
export const MAX_DATA_CHUNK_SIZE = 1024;

/**
 * Pipe the readable stream to the gRPC writable data stream
 *
 * @param onFirstDataChunk callback function when the first DataChunk is about to be generated. Use
 * this for setting any necessary metadata for this gRPC call
 * @param onEnd callback function when the pipe operation is ended. Use this to close the writer. If
 * the `err` is not undefined, it means an error has happened during the operation
 * @returns a [[`CleanupFn`]] for external logic to interrupt and cleanup the pipe operation
 */
export function pipeFromReadableStream(
  from: Readable,
  to: WritableDataStream<DataChunk>,
  onFirstDataChunk?: (dc: DataChunk) => void,
  onEnd?: (err?: ServiceError) => void
): CleanupFn {
  let er: ServiceError;

  // make sure to only cleanup once
  const cleanup = _.once<CleanupFn>((err?: ServiceError) => {
    er = er || err;

    onEnd && onEnd(er);

    if (er) {
      // cleanup
      from.destroyed || from.destroy();
      to.cancel();
      to.destroyed || to.destroy();
    }
  });

  const handleError = (err: Error) => {
    er = er || makeServiceError(err);
    cleanup();
  };

  let first = true;

  from
    .on("error", handleError)
    .on("readable", () => {
      let chunk;
      while (null !== (chunk = from.read(MAX_DATA_CHUNK_SIZE))) {
        const dc = new DataChunk();

        dc.setData(chunk);

        if (first) {
          first = false;

          onFirstDataChunk && onFirstDataChunk(dc);
        }

        to.write(dc);
      }
    })
    .on("end", cleanup);

  to.on("error", handleError);

  return cleanup;
}

/**
 * Pipe the gRPC readable data stream to the writable stream
 *
 * @param onFirstDataChunk callback function when the first DataChunk is received. Use
 * this to access any metadata in this gRPC call reply
 * @param onEnd callback function when the pipe operation is ended. Use this to close the writer. If
 * the `err` is not undefined, it means an error has happened during the operation
 * @returns a [[`CleanupFn`]] for external logic to interrupt and cleanup the pipe operation
 */
export function pipeToWritableStream(
  from: ReadableDataStream<DataChunk>,
  to: Writable,
  onFirstDataChunk?: (dc: DataChunk) => void,
  onEnd?: (err?: ServiceError) => void
): CleanupFn {
  let er: ServiceError;

  // make sure to only cleanup once
  const cleanup = _.once<CleanupFn>((err?: ServiceError) => {
    er = er || err;

    onEnd && onEnd(er);

    if (er) {
      // cleanup
      from.cancel();
      from.destroyed || from.destroy();
      to.destroyed || to.destroy();
    }
  });

  const handleError = (err: Error) => {
    er = er || makeServiceError(err);
    cleanup();
  };

  let first = true;

  from
    .on("error", handleError)
    .on("data", (dc: DataChunk) => {
      if (first) {
        first = false;

        onFirstDataChunk && onFirstDataChunk(dc);
      }

      to.write(dc.getData());
    })
    .on("end", cleanup);

  to.on("error", handleError);

  return cleanup;
}
