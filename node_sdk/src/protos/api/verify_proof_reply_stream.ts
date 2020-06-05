import * as grpc from "grpc";
import _ from "lodash";
import { EventEmitter } from "events";
import {
  DataChunk,
  KeyValue,
  VerifyProofReplyChunk,
  VerifyProofReply,
} from "./api_pb";
import { ReadableDataStream } from "./data_stream";
import { makeServiceError } from "./util";

export class VerifyProofReplyStream {
  readonly dataStream: ReadableDataStream<DataChunk>;

  constructor(
    stream: grpc.ClientReadableStream<VerifyProofReplyChunk>,
    callback: grpc.requestCallback<VerifyProofReply>,
    onKeyValue?: (kv: KeyValue) => void
  ) {
    let emitter: EventEmitter | null = new EventEmitter();

    let er: grpc.ServiceError, reply: VerifyProofReply;

    const destroy = () => {
      if (!emitter) {
        return;
      }

      emitter.removeAllListeners();
      emitter = null;

      callback(er, reply);

      if (er) {
        stream.cancel();
        stream.destroyed || stream.destroy();
      }
    };

    const handleError = (err: Error) => {
      er = er || makeServiceError(err);
      emitter?.emit("error", er);
      destroy();
    };

    stream = stream
      .on("error", handleError)
      .on("data", (rc: VerifyProofReplyChunk) => {
        const { DataCase } = VerifyProofReplyChunk;

        switch (rc.getDataCase()) {
          case DataCase.DOT_GRAPH_CHUNK: {
            emitter?.emit("data", rc.getDotGraphChunk());
            break;
          }
          case DataCase.KEY_VALUE: {
            onKeyValue && onKeyValue(rc.getKeyValue()!);
            break;
          }
          case DataCase.REPLY: {
            reply = rc.getReply()!;
            break;
          }
          default:
            throw new Error(
              `unexpected \`VerifyProofReplyChunk.DataCase\`: ${rc.getDataCase()}`
            );
        }
      })
      .on("end", () => {
        emitter?.emit("end");
        destroy();
      });

    this.dataStream = {
      get destroyed(): boolean {
        return emitter == null;
      },
      destroy,
      cancel: destroy,
      on(event: string, listener: any): ReadableDataStream<DataChunk> {
        emitter?.on(event, listener);
        return this;
      },
    };
  }
}
