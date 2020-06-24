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
 * @Date:   2020-06-19T10:49:04+10:00
 * @Last modified by:   guiguan
 * @Last modified time: 2020-06-24T13:18:03+10:00
 */

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
