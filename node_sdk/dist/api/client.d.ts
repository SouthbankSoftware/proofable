import * as grpc from "grpc";
import { Empty } from "google-protobuf/google/protobuf/empty_pb";
import { SurfaceCall } from "grpc/build/src/call";
import { APIServiceClient as Client } from "../protos/api/api_grpc_pb";
import { Trie, DataChunk, TrieRequest, CreateKeyValuesProofRequest, KeyValuesFilter, VerifyProofReply, KeyValue, VerifyTrieProofRequest, VerifyProofReplyChunk } from "../protos/api/api_pb";
declare module "../protos/api/api_pb" {
    namespace TrieRequest {
        function from(id: string): TrieRequest;
    }
    namespace TrieKeyValueRequest {
        function from(id: string, root: string, key: Key): TrieKeyValueRequest;
    }
    namespace TrieKeyValuesRequest {
        function from(id: string, root: string): TrieKeyValuesRequest;
    }
    namespace Key {
        function from(key: string, keyEncoding?: "utf8" | "hex"): Key;
    }
    namespace KeyValue {
        function from(key: string, val: string, keyEncoding?: "utf8" | "hex", valEncoding?: "utf8" | "hex"): KeyValue;
    }
    interface KeyValue {
        to(keyEncoding?: "utf8" | "hex", valEncoding?: "utf8" | "hex"): {
            key: string;
            val: string;
        };
    }
}
export declare class APIServiceClient extends Client {
    /**
     * Creates a new trie
     */
    createTrie(): Promise<Trie>;
    createTrie(callback: grpc.requestCallback<Trie>): SurfaceCall;
    createTrie(argument: Empty, callback: grpc.requestCallback<Trie>): grpc.ClientUnaryCall;
    createTrie(argument: Empty, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<Trie>): grpc.ClientUnaryCall;
    createTrie(argument: Empty, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<Trie>): grpc.ClientUnaryCall;
    /**
     * Deletes the given trie
     */
    deleteTrie(id: string, callback: grpc.requestCallback<Trie>): SurfaceCall;
    deleteTrie(argument: TrieRequest, callback: grpc.requestCallback<Trie>): grpc.ClientUnaryCall;
    deleteTrie(argument: TrieRequest, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<Trie>): grpc.ClientUnaryCall;
    deleteTrie(argument: TrieRequest, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<Trie>): grpc.ClientUnaryCall;
    /**
     * Imports the trie data and creates a new trie. If `id` is zero, a new trie ID will be generated,
     * which is recommended when importing
     */
    importTrie(id: string, path: string, callback: grpc.requestCallback<Trie>): SurfaceCall;
    importTrie(callback: grpc.requestCallback<Trie>): grpc.ClientWritableStream<DataChunk>;
    importTrie(metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<Trie>): grpc.ClientWritableStream<DataChunk>;
    importTrie(metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<Trie>): grpc.ClientWritableStream<DataChunk>;
    /**
     * Exports the given trie
     */
    exportTrie(id: string, outputPath: string, callback: grpc.requestCallback<undefined>): SurfaceCall;
    exportTrie(argument: TrieRequest, metadataOrOptions?: grpc.Metadata | grpc.CallOptions | null): grpc.ClientReadableStream<DataChunk>;
    exportTrie(argument: TrieRequest, metadata?: grpc.Metadata | null, options?: grpc.CallOptions | null): grpc.ClientReadableStream<DataChunk>;
    setTrieKeyValues(id: string, root: string, iter: Iterable<KeyValue>, callback: grpc.requestCallback<Trie>): SurfaceCall;
    setTrieKeyValues(callback: grpc.requestCallback<Trie>): grpc.ClientWritableStream<KeyValue>;
    setTrieKeyValues(metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<Trie>): grpc.ClientWritableStream<KeyValue>;
    setTrieKeyValues(metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<Trie>): grpc.ClientWritableStream<KeyValue>;
    createKeyValuesProof(trieId: string, proofId: string, filter: KeyValuesFilter | null, outputPath: string, callback: grpc.requestCallback<undefined>): SurfaceCall;
    createKeyValuesProof(argument: CreateKeyValuesProofRequest, metadataOrOptions?: grpc.Metadata | grpc.CallOptions | null): grpc.ClientReadableStream<DataChunk>;
    createKeyValuesProof(argument: CreateKeyValuesProofRequest, metadata?: grpc.Metadata | null, options?: grpc.CallOptions | null): grpc.ClientReadableStream<DataChunk>;
    verifyTrieProof(trieId: string, proofId: string, callback: grpc.requestCallback<VerifyProofReply>, onKeyValue?: (kv: KeyValue) => void, dotGraphOutputPath?: string): SurfaceCall;
    verifyTrieProof(argument: VerifyTrieProofRequest, metadataOrOptions?: grpc.Metadata | grpc.CallOptions | null): grpc.ClientReadableStream<VerifyProofReplyChunk>;
    verifyTrieProof(argument: VerifyTrieProofRequest, metadata?: grpc.Metadata | null, options?: grpc.CallOptions | null): grpc.ClientReadableStream<VerifyProofReplyChunk>;
    verifyKeyValuesProof(path: string, outputKeyValues?: boolean, dotGraphOutputPath?: string): AsyncIterable<KeyValue | VerifyProofReply>;
    verifyKeyValuesProof(path: string, callback: grpc.requestCallback<VerifyProofReply>, onKeyValue?: (kv: KeyValue) => void, dotGraphOutputPath?: string): SurfaceCall;
    verifyKeyValuesProof(metadataOrOptions?: grpc.Metadata | grpc.CallOptions | null): grpc.ClientDuplexStream<DataChunk, VerifyProofReplyChunk>;
    verifyKeyValuesProof(metadata?: grpc.Metadata | null, options?: grpc.CallOptions | null): grpc.ClientDuplexStream<DataChunk, VerifyProofReplyChunk>;
}
/**
 * Creates a new API Service client
 */
export declare function newApiServiceClient(hostPort: string, metadata: grpc.Metadata, secure?: boolean): APIServiceClient;
