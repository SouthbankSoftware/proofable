import * as grpc from "grpc";
import { DataChunk, KeyValue, VerifyProofReplyChunk, VerifyProofReply } from "./api_pb";
import { ReadableDataStream } from "./data_stream";
export declare class VerifyProofReplyStream {
    readonly dataStream: ReadableDataStream<DataChunk>;
    constructor(stream: grpc.ClientReadableStream<VerifyProofReplyChunk>, callback: grpc.requestCallback<VerifyProofReply>, onKeyValue?: (kv: KeyValue) => void);
}
