// package: api
// file: api/api.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "grpc";
import * as api_api_pb from "../api/api_pb";
import * as google_protobuf_empty_pb from "google-protobuf/google/protobuf/empty_pb";
import * as google_protobuf_timestamp_pb from "google-protobuf/google/protobuf/timestamp_pb";
import * as anchor_anchor_pb from "../anchor/anchor_pb";

interface IAPIServiceService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    getTries: IAPIServiceService_IGetTries;
    getTrie: IAPIServiceService_IGetTrie;
    importTrie: IAPIServiceService_IImportTrie;
    exportTrie: IAPIServiceService_IExportTrie;
    createTrie: IAPIServiceService_ICreateTrie;
    deleteTrie: IAPIServiceService_IDeleteTrie;
    getTrieKeyValues: IAPIServiceService_IGetTrieKeyValues;
    getTrieKeyValue: IAPIServiceService_IGetTrieKeyValue;
    setTrieKeyValues: IAPIServiceService_ISetTrieKeyValues;
    getTrieRoots: IAPIServiceService_IGetTrieRoots;
    setTrieRoot: IAPIServiceService_ISetTrieRoot;
    getTrieProofs: IAPIServiceService_IGetTrieProofs;
    getTrieProof: IAPIServiceService_IGetTrieProof;
    subscribeTrieProof: IAPIServiceService_ISubscribeTrieProof;
    createTrieProof: IAPIServiceService_ICreateTrieProof;
    deleteTrieProof: IAPIServiceService_IDeleteTrieProof;
    verifyTrieProof: IAPIServiceService_IVerifyTrieProof;
    createKeyValuesProof: IAPIServiceService_ICreateKeyValuesProof;
    verifyKeyValuesProof: IAPIServiceService_IVerifyKeyValuesProof;
}

interface IAPIServiceService_IGetTries extends grpc.MethodDefinition<google_protobuf_empty_pb.Empty, api_api_pb.Trie> {
    path: string; // "/api.APIService/GetTries"
    requestStream: boolean; // false
    responseStream: boolean; // true
    requestSerialize: grpc.serialize<google_protobuf_empty_pb.Empty>;
    requestDeserialize: grpc.deserialize<google_protobuf_empty_pb.Empty>;
    responseSerialize: grpc.serialize<api_api_pb.Trie>;
    responseDeserialize: grpc.deserialize<api_api_pb.Trie>;
}
interface IAPIServiceService_IGetTrie extends grpc.MethodDefinition<api_api_pb.TrieRequest, api_api_pb.Trie> {
    path: string; // "/api.APIService/GetTrie"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestSerialize: grpc.serialize<api_api_pb.TrieRequest>;
    requestDeserialize: grpc.deserialize<api_api_pb.TrieRequest>;
    responseSerialize: grpc.serialize<api_api_pb.Trie>;
    responseDeserialize: grpc.deserialize<api_api_pb.Trie>;
}
interface IAPIServiceService_IImportTrie extends grpc.MethodDefinition<api_api_pb.DataChunk, api_api_pb.Trie> {
    path: string; // "/api.APIService/ImportTrie"
    requestStream: boolean; // true
    responseStream: boolean; // false
    requestSerialize: grpc.serialize<api_api_pb.DataChunk>;
    requestDeserialize: grpc.deserialize<api_api_pb.DataChunk>;
    responseSerialize: grpc.serialize<api_api_pb.Trie>;
    responseDeserialize: grpc.deserialize<api_api_pb.Trie>;
}
interface IAPIServiceService_IExportTrie extends grpc.MethodDefinition<api_api_pb.TrieRequest, api_api_pb.DataChunk> {
    path: string; // "/api.APIService/ExportTrie"
    requestStream: boolean; // false
    responseStream: boolean; // true
    requestSerialize: grpc.serialize<api_api_pb.TrieRequest>;
    requestDeserialize: grpc.deserialize<api_api_pb.TrieRequest>;
    responseSerialize: grpc.serialize<api_api_pb.DataChunk>;
    responseDeserialize: grpc.deserialize<api_api_pb.DataChunk>;
}
interface IAPIServiceService_ICreateTrie extends grpc.MethodDefinition<google_protobuf_empty_pb.Empty, api_api_pb.Trie> {
    path: string; // "/api.APIService/CreateTrie"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestSerialize: grpc.serialize<google_protobuf_empty_pb.Empty>;
    requestDeserialize: grpc.deserialize<google_protobuf_empty_pb.Empty>;
    responseSerialize: grpc.serialize<api_api_pb.Trie>;
    responseDeserialize: grpc.deserialize<api_api_pb.Trie>;
}
interface IAPIServiceService_IDeleteTrie extends grpc.MethodDefinition<api_api_pb.TrieRequest, api_api_pb.Trie> {
    path: string; // "/api.APIService/DeleteTrie"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestSerialize: grpc.serialize<api_api_pb.TrieRequest>;
    requestDeserialize: grpc.deserialize<api_api_pb.TrieRequest>;
    responseSerialize: grpc.serialize<api_api_pb.Trie>;
    responseDeserialize: grpc.deserialize<api_api_pb.Trie>;
}
interface IAPIServiceService_IGetTrieKeyValues extends grpc.MethodDefinition<api_api_pb.TrieKeyValuesRequest, api_api_pb.KeyValue> {
    path: string; // "/api.APIService/GetTrieKeyValues"
    requestStream: boolean; // false
    responseStream: boolean; // true
    requestSerialize: grpc.serialize<api_api_pb.TrieKeyValuesRequest>;
    requestDeserialize: grpc.deserialize<api_api_pb.TrieKeyValuesRequest>;
    responseSerialize: grpc.serialize<api_api_pb.KeyValue>;
    responseDeserialize: grpc.deserialize<api_api_pb.KeyValue>;
}
interface IAPIServiceService_IGetTrieKeyValue extends grpc.MethodDefinition<api_api_pb.TrieKeyValueRequest, api_api_pb.KeyValue> {
    path: string; // "/api.APIService/GetTrieKeyValue"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestSerialize: grpc.serialize<api_api_pb.TrieKeyValueRequest>;
    requestDeserialize: grpc.deserialize<api_api_pb.TrieKeyValueRequest>;
    responseSerialize: grpc.serialize<api_api_pb.KeyValue>;
    responseDeserialize: grpc.deserialize<api_api_pb.KeyValue>;
}
interface IAPIServiceService_ISetTrieKeyValues extends grpc.MethodDefinition<api_api_pb.KeyValue, api_api_pb.Trie> {
    path: string; // "/api.APIService/SetTrieKeyValues"
    requestStream: boolean; // true
    responseStream: boolean; // false
    requestSerialize: grpc.serialize<api_api_pb.KeyValue>;
    requestDeserialize: grpc.deserialize<api_api_pb.KeyValue>;
    responseSerialize: grpc.serialize<api_api_pb.Trie>;
    responseDeserialize: grpc.deserialize<api_api_pb.Trie>;
}
interface IAPIServiceService_IGetTrieRoots extends grpc.MethodDefinition<api_api_pb.TrieRootsRequest, api_api_pb.TrieRoot> {
    path: string; // "/api.APIService/GetTrieRoots"
    requestStream: boolean; // false
    responseStream: boolean; // true
    requestSerialize: grpc.serialize<api_api_pb.TrieRootsRequest>;
    requestDeserialize: grpc.deserialize<api_api_pb.TrieRootsRequest>;
    responseSerialize: grpc.serialize<api_api_pb.TrieRoot>;
    responseDeserialize: grpc.deserialize<api_api_pb.TrieRoot>;
}
interface IAPIServiceService_ISetTrieRoot extends grpc.MethodDefinition<api_api_pb.SetTrieRootRequest, api_api_pb.Trie> {
    path: string; // "/api.APIService/SetTrieRoot"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestSerialize: grpc.serialize<api_api_pb.SetTrieRootRequest>;
    requestDeserialize: grpc.deserialize<api_api_pb.SetTrieRootRequest>;
    responseSerialize: grpc.serialize<api_api_pb.Trie>;
    responseDeserialize: grpc.deserialize<api_api_pb.Trie>;
}
interface IAPIServiceService_IGetTrieProofs extends grpc.MethodDefinition<api_api_pb.TrieProofsRequest, api_api_pb.TrieProof> {
    path: string; // "/api.APIService/GetTrieProofs"
    requestStream: boolean; // false
    responseStream: boolean; // true
    requestSerialize: grpc.serialize<api_api_pb.TrieProofsRequest>;
    requestDeserialize: grpc.deserialize<api_api_pb.TrieProofsRequest>;
    responseSerialize: grpc.serialize<api_api_pb.TrieProof>;
    responseDeserialize: grpc.deserialize<api_api_pb.TrieProof>;
}
interface IAPIServiceService_IGetTrieProof extends grpc.MethodDefinition<api_api_pb.TrieProofRequest, api_api_pb.TrieProof> {
    path: string; // "/api.APIService/GetTrieProof"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestSerialize: grpc.serialize<api_api_pb.TrieProofRequest>;
    requestDeserialize: grpc.deserialize<api_api_pb.TrieProofRequest>;
    responseSerialize: grpc.serialize<api_api_pb.TrieProof>;
    responseDeserialize: grpc.deserialize<api_api_pb.TrieProof>;
}
interface IAPIServiceService_ISubscribeTrieProof extends grpc.MethodDefinition<api_api_pb.TrieProofRequest, api_api_pb.TrieProof> {
    path: string; // "/api.APIService/SubscribeTrieProof"
    requestStream: boolean; // false
    responseStream: boolean; // true
    requestSerialize: grpc.serialize<api_api_pb.TrieProofRequest>;
    requestDeserialize: grpc.deserialize<api_api_pb.TrieProofRequest>;
    responseSerialize: grpc.serialize<api_api_pb.TrieProof>;
    responseDeserialize: grpc.deserialize<api_api_pb.TrieProof>;
}
interface IAPIServiceService_ICreateTrieProof extends grpc.MethodDefinition<api_api_pb.CreateTrieProofRequest, api_api_pb.TrieProof> {
    path: string; // "/api.APIService/CreateTrieProof"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestSerialize: grpc.serialize<api_api_pb.CreateTrieProofRequest>;
    requestDeserialize: grpc.deserialize<api_api_pb.CreateTrieProofRequest>;
    responseSerialize: grpc.serialize<api_api_pb.TrieProof>;
    responseDeserialize: grpc.deserialize<api_api_pb.TrieProof>;
}
interface IAPIServiceService_IDeleteTrieProof extends grpc.MethodDefinition<api_api_pb.DeleteTrieProofRequest, api_api_pb.TrieProof> {
    path: string; // "/api.APIService/DeleteTrieProof"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestSerialize: grpc.serialize<api_api_pb.DeleteTrieProofRequest>;
    requestDeserialize: grpc.deserialize<api_api_pb.DeleteTrieProofRequest>;
    responseSerialize: grpc.serialize<api_api_pb.TrieProof>;
    responseDeserialize: grpc.deserialize<api_api_pb.TrieProof>;
}
interface IAPIServiceService_IVerifyTrieProof extends grpc.MethodDefinition<api_api_pb.VerifyTrieProofRequest, api_api_pb.VerifyProofReplyChunk> {
    path: string; // "/api.APIService/VerifyTrieProof"
    requestStream: boolean; // false
    responseStream: boolean; // true
    requestSerialize: grpc.serialize<api_api_pb.VerifyTrieProofRequest>;
    requestDeserialize: grpc.deserialize<api_api_pb.VerifyTrieProofRequest>;
    responseSerialize: grpc.serialize<api_api_pb.VerifyProofReplyChunk>;
    responseDeserialize: grpc.deserialize<api_api_pb.VerifyProofReplyChunk>;
}
interface IAPIServiceService_ICreateKeyValuesProof extends grpc.MethodDefinition<api_api_pb.CreateKeyValuesProofRequest, api_api_pb.DataChunk> {
    path: string; // "/api.APIService/CreateKeyValuesProof"
    requestStream: boolean; // false
    responseStream: boolean; // true
    requestSerialize: grpc.serialize<api_api_pb.CreateKeyValuesProofRequest>;
    requestDeserialize: grpc.deserialize<api_api_pb.CreateKeyValuesProofRequest>;
    responseSerialize: grpc.serialize<api_api_pb.DataChunk>;
    responseDeserialize: grpc.deserialize<api_api_pb.DataChunk>;
}
interface IAPIServiceService_IVerifyKeyValuesProof extends grpc.MethodDefinition<api_api_pb.DataChunk, api_api_pb.VerifyProofReplyChunk> {
    path: string; // "/api.APIService/VerifyKeyValuesProof"
    requestStream: boolean; // true
    responseStream: boolean; // true
    requestSerialize: grpc.serialize<api_api_pb.DataChunk>;
    requestDeserialize: grpc.deserialize<api_api_pb.DataChunk>;
    responseSerialize: grpc.serialize<api_api_pb.VerifyProofReplyChunk>;
    responseDeserialize: grpc.deserialize<api_api_pb.VerifyProofReplyChunk>;
}

export const APIServiceService: IAPIServiceService;

export interface IAPIServiceServer {
    getTries: grpc.handleServerStreamingCall<google_protobuf_empty_pb.Empty, api_api_pb.Trie>;
    getTrie: grpc.handleUnaryCall<api_api_pb.TrieRequest, api_api_pb.Trie>;
    importTrie: grpc.handleClientStreamingCall<api_api_pb.DataChunk, api_api_pb.Trie>;
    exportTrie: grpc.handleServerStreamingCall<api_api_pb.TrieRequest, api_api_pb.DataChunk>;
    createTrie: grpc.handleUnaryCall<google_protobuf_empty_pb.Empty, api_api_pb.Trie>;
    deleteTrie: grpc.handleUnaryCall<api_api_pb.TrieRequest, api_api_pb.Trie>;
    getTrieKeyValues: grpc.handleServerStreamingCall<api_api_pb.TrieKeyValuesRequest, api_api_pb.KeyValue>;
    getTrieKeyValue: grpc.handleUnaryCall<api_api_pb.TrieKeyValueRequest, api_api_pb.KeyValue>;
    setTrieKeyValues: grpc.handleClientStreamingCall<api_api_pb.KeyValue, api_api_pb.Trie>;
    getTrieRoots: grpc.handleServerStreamingCall<api_api_pb.TrieRootsRequest, api_api_pb.TrieRoot>;
    setTrieRoot: grpc.handleUnaryCall<api_api_pb.SetTrieRootRequest, api_api_pb.Trie>;
    getTrieProofs: grpc.handleServerStreamingCall<api_api_pb.TrieProofsRequest, api_api_pb.TrieProof>;
    getTrieProof: grpc.handleUnaryCall<api_api_pb.TrieProofRequest, api_api_pb.TrieProof>;
    subscribeTrieProof: grpc.handleServerStreamingCall<api_api_pb.TrieProofRequest, api_api_pb.TrieProof>;
    createTrieProof: grpc.handleUnaryCall<api_api_pb.CreateTrieProofRequest, api_api_pb.TrieProof>;
    deleteTrieProof: grpc.handleUnaryCall<api_api_pb.DeleteTrieProofRequest, api_api_pb.TrieProof>;
    verifyTrieProof: grpc.handleServerStreamingCall<api_api_pb.VerifyTrieProofRequest, api_api_pb.VerifyProofReplyChunk>;
    createKeyValuesProof: grpc.handleServerStreamingCall<api_api_pb.CreateKeyValuesProofRequest, api_api_pb.DataChunk>;
    verifyKeyValuesProof: grpc.handleBidiStreamingCall<api_api_pb.DataChunk, api_api_pb.VerifyProofReplyChunk>;
}

export interface IAPIServiceClient {
    getTries(request: google_protobuf_empty_pb.Empty, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<api_api_pb.Trie>;
    getTries(request: google_protobuf_empty_pb.Empty, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<api_api_pb.Trie>;
    getTrie(request: api_api_pb.TrieRequest, callback: (error: grpc.ServiceError | null, response: api_api_pb.Trie) => void): grpc.ClientUnaryCall;
    getTrie(request: api_api_pb.TrieRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: api_api_pb.Trie) => void): grpc.ClientUnaryCall;
    getTrie(request: api_api_pb.TrieRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: api_api_pb.Trie) => void): grpc.ClientUnaryCall;
    importTrie(callback: (error: grpc.ServiceError | null, response: api_api_pb.Trie) => void): grpc.ClientWritableStream<api_api_pb.DataChunk>;
    importTrie(metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: api_api_pb.Trie) => void): grpc.ClientWritableStream<api_api_pb.DataChunk>;
    importTrie(options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: api_api_pb.Trie) => void): grpc.ClientWritableStream<api_api_pb.DataChunk>;
    importTrie(metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: api_api_pb.Trie) => void): grpc.ClientWritableStream<api_api_pb.DataChunk>;
    exportTrie(request: api_api_pb.TrieRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<api_api_pb.DataChunk>;
    exportTrie(request: api_api_pb.TrieRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<api_api_pb.DataChunk>;
    createTrie(request: google_protobuf_empty_pb.Empty, callback: (error: grpc.ServiceError | null, response: api_api_pb.Trie) => void): grpc.ClientUnaryCall;
    createTrie(request: google_protobuf_empty_pb.Empty, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: api_api_pb.Trie) => void): grpc.ClientUnaryCall;
    createTrie(request: google_protobuf_empty_pb.Empty, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: api_api_pb.Trie) => void): grpc.ClientUnaryCall;
    deleteTrie(request: api_api_pb.TrieRequest, callback: (error: grpc.ServiceError | null, response: api_api_pb.Trie) => void): grpc.ClientUnaryCall;
    deleteTrie(request: api_api_pb.TrieRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: api_api_pb.Trie) => void): grpc.ClientUnaryCall;
    deleteTrie(request: api_api_pb.TrieRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: api_api_pb.Trie) => void): grpc.ClientUnaryCall;
    getTrieKeyValues(request: api_api_pb.TrieKeyValuesRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<api_api_pb.KeyValue>;
    getTrieKeyValues(request: api_api_pb.TrieKeyValuesRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<api_api_pb.KeyValue>;
    getTrieKeyValue(request: api_api_pb.TrieKeyValueRequest, callback: (error: grpc.ServiceError | null, response: api_api_pb.KeyValue) => void): grpc.ClientUnaryCall;
    getTrieKeyValue(request: api_api_pb.TrieKeyValueRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: api_api_pb.KeyValue) => void): grpc.ClientUnaryCall;
    getTrieKeyValue(request: api_api_pb.TrieKeyValueRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: api_api_pb.KeyValue) => void): grpc.ClientUnaryCall;
    setTrieKeyValues(callback: (error: grpc.ServiceError | null, response: api_api_pb.Trie) => void): grpc.ClientWritableStream<api_api_pb.KeyValue>;
    setTrieKeyValues(metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: api_api_pb.Trie) => void): grpc.ClientWritableStream<api_api_pb.KeyValue>;
    setTrieKeyValues(options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: api_api_pb.Trie) => void): grpc.ClientWritableStream<api_api_pb.KeyValue>;
    setTrieKeyValues(metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: api_api_pb.Trie) => void): grpc.ClientWritableStream<api_api_pb.KeyValue>;
    getTrieRoots(request: api_api_pb.TrieRootsRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<api_api_pb.TrieRoot>;
    getTrieRoots(request: api_api_pb.TrieRootsRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<api_api_pb.TrieRoot>;
    setTrieRoot(request: api_api_pb.SetTrieRootRequest, callback: (error: grpc.ServiceError | null, response: api_api_pb.Trie) => void): grpc.ClientUnaryCall;
    setTrieRoot(request: api_api_pb.SetTrieRootRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: api_api_pb.Trie) => void): grpc.ClientUnaryCall;
    setTrieRoot(request: api_api_pb.SetTrieRootRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: api_api_pb.Trie) => void): grpc.ClientUnaryCall;
    getTrieProofs(request: api_api_pb.TrieProofsRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<api_api_pb.TrieProof>;
    getTrieProofs(request: api_api_pb.TrieProofsRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<api_api_pb.TrieProof>;
    getTrieProof(request: api_api_pb.TrieProofRequest, callback: (error: grpc.ServiceError | null, response: api_api_pb.TrieProof) => void): grpc.ClientUnaryCall;
    getTrieProof(request: api_api_pb.TrieProofRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: api_api_pb.TrieProof) => void): grpc.ClientUnaryCall;
    getTrieProof(request: api_api_pb.TrieProofRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: api_api_pb.TrieProof) => void): grpc.ClientUnaryCall;
    subscribeTrieProof(request: api_api_pb.TrieProofRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<api_api_pb.TrieProof>;
    subscribeTrieProof(request: api_api_pb.TrieProofRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<api_api_pb.TrieProof>;
    createTrieProof(request: api_api_pb.CreateTrieProofRequest, callback: (error: grpc.ServiceError | null, response: api_api_pb.TrieProof) => void): grpc.ClientUnaryCall;
    createTrieProof(request: api_api_pb.CreateTrieProofRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: api_api_pb.TrieProof) => void): grpc.ClientUnaryCall;
    createTrieProof(request: api_api_pb.CreateTrieProofRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: api_api_pb.TrieProof) => void): grpc.ClientUnaryCall;
    deleteTrieProof(request: api_api_pb.DeleteTrieProofRequest, callback: (error: grpc.ServiceError | null, response: api_api_pb.TrieProof) => void): grpc.ClientUnaryCall;
    deleteTrieProof(request: api_api_pb.DeleteTrieProofRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: api_api_pb.TrieProof) => void): grpc.ClientUnaryCall;
    deleteTrieProof(request: api_api_pb.DeleteTrieProofRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: api_api_pb.TrieProof) => void): grpc.ClientUnaryCall;
    verifyTrieProof(request: api_api_pb.VerifyTrieProofRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<api_api_pb.VerifyProofReplyChunk>;
    verifyTrieProof(request: api_api_pb.VerifyTrieProofRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<api_api_pb.VerifyProofReplyChunk>;
    createKeyValuesProof(request: api_api_pb.CreateKeyValuesProofRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<api_api_pb.DataChunk>;
    createKeyValuesProof(request: api_api_pb.CreateKeyValuesProofRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<api_api_pb.DataChunk>;
    verifyKeyValuesProof(): grpc.ClientDuplexStream<api_api_pb.DataChunk, api_api_pb.VerifyProofReplyChunk>;
    verifyKeyValuesProof(options: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<api_api_pb.DataChunk, api_api_pb.VerifyProofReplyChunk>;
    verifyKeyValuesProof(metadata: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<api_api_pb.DataChunk, api_api_pb.VerifyProofReplyChunk>;
}

export class APIServiceClient extends grpc.Client implements IAPIServiceClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: object);
    public getTries(request: google_protobuf_empty_pb.Empty, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<api_api_pb.Trie>;
    public getTries(request: google_protobuf_empty_pb.Empty, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<api_api_pb.Trie>;
    public getTrie(request: api_api_pb.TrieRequest, callback: (error: grpc.ServiceError | null, response: api_api_pb.Trie) => void): grpc.ClientUnaryCall;
    public getTrie(request: api_api_pb.TrieRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: api_api_pb.Trie) => void): grpc.ClientUnaryCall;
    public getTrie(request: api_api_pb.TrieRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: api_api_pb.Trie) => void): grpc.ClientUnaryCall;
    public importTrie(callback: (error: grpc.ServiceError | null, response: api_api_pb.Trie) => void): grpc.ClientWritableStream<api_api_pb.DataChunk>;
    public importTrie(metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: api_api_pb.Trie) => void): grpc.ClientWritableStream<api_api_pb.DataChunk>;
    public importTrie(options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: api_api_pb.Trie) => void): grpc.ClientWritableStream<api_api_pb.DataChunk>;
    public importTrie(metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: api_api_pb.Trie) => void): grpc.ClientWritableStream<api_api_pb.DataChunk>;
    public exportTrie(request: api_api_pb.TrieRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<api_api_pb.DataChunk>;
    public exportTrie(request: api_api_pb.TrieRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<api_api_pb.DataChunk>;
    public createTrie(request: google_protobuf_empty_pb.Empty, callback: (error: grpc.ServiceError | null, response: api_api_pb.Trie) => void): grpc.ClientUnaryCall;
    public createTrie(request: google_protobuf_empty_pb.Empty, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: api_api_pb.Trie) => void): grpc.ClientUnaryCall;
    public createTrie(request: google_protobuf_empty_pb.Empty, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: api_api_pb.Trie) => void): grpc.ClientUnaryCall;
    public deleteTrie(request: api_api_pb.TrieRequest, callback: (error: grpc.ServiceError | null, response: api_api_pb.Trie) => void): grpc.ClientUnaryCall;
    public deleteTrie(request: api_api_pb.TrieRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: api_api_pb.Trie) => void): grpc.ClientUnaryCall;
    public deleteTrie(request: api_api_pb.TrieRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: api_api_pb.Trie) => void): grpc.ClientUnaryCall;
    public getTrieKeyValues(request: api_api_pb.TrieKeyValuesRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<api_api_pb.KeyValue>;
    public getTrieKeyValues(request: api_api_pb.TrieKeyValuesRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<api_api_pb.KeyValue>;
    public getTrieKeyValue(request: api_api_pb.TrieKeyValueRequest, callback: (error: grpc.ServiceError | null, response: api_api_pb.KeyValue) => void): grpc.ClientUnaryCall;
    public getTrieKeyValue(request: api_api_pb.TrieKeyValueRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: api_api_pb.KeyValue) => void): grpc.ClientUnaryCall;
    public getTrieKeyValue(request: api_api_pb.TrieKeyValueRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: api_api_pb.KeyValue) => void): grpc.ClientUnaryCall;
    public setTrieKeyValues(callback: (error: grpc.ServiceError | null, response: api_api_pb.Trie) => void): grpc.ClientWritableStream<api_api_pb.KeyValue>;
    public setTrieKeyValues(metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: api_api_pb.Trie) => void): grpc.ClientWritableStream<api_api_pb.KeyValue>;
    public setTrieKeyValues(options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: api_api_pb.Trie) => void): grpc.ClientWritableStream<api_api_pb.KeyValue>;
    public setTrieKeyValues(metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: api_api_pb.Trie) => void): grpc.ClientWritableStream<api_api_pb.KeyValue>;
    public getTrieRoots(request: api_api_pb.TrieRootsRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<api_api_pb.TrieRoot>;
    public getTrieRoots(request: api_api_pb.TrieRootsRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<api_api_pb.TrieRoot>;
    public setTrieRoot(request: api_api_pb.SetTrieRootRequest, callback: (error: grpc.ServiceError | null, response: api_api_pb.Trie) => void): grpc.ClientUnaryCall;
    public setTrieRoot(request: api_api_pb.SetTrieRootRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: api_api_pb.Trie) => void): grpc.ClientUnaryCall;
    public setTrieRoot(request: api_api_pb.SetTrieRootRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: api_api_pb.Trie) => void): grpc.ClientUnaryCall;
    public getTrieProofs(request: api_api_pb.TrieProofsRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<api_api_pb.TrieProof>;
    public getTrieProofs(request: api_api_pb.TrieProofsRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<api_api_pb.TrieProof>;
    public getTrieProof(request: api_api_pb.TrieProofRequest, callback: (error: grpc.ServiceError | null, response: api_api_pb.TrieProof) => void): grpc.ClientUnaryCall;
    public getTrieProof(request: api_api_pb.TrieProofRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: api_api_pb.TrieProof) => void): grpc.ClientUnaryCall;
    public getTrieProof(request: api_api_pb.TrieProofRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: api_api_pb.TrieProof) => void): grpc.ClientUnaryCall;
    public subscribeTrieProof(request: api_api_pb.TrieProofRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<api_api_pb.TrieProof>;
    public subscribeTrieProof(request: api_api_pb.TrieProofRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<api_api_pb.TrieProof>;
    public createTrieProof(request: api_api_pb.CreateTrieProofRequest, callback: (error: grpc.ServiceError | null, response: api_api_pb.TrieProof) => void): grpc.ClientUnaryCall;
    public createTrieProof(request: api_api_pb.CreateTrieProofRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: api_api_pb.TrieProof) => void): grpc.ClientUnaryCall;
    public createTrieProof(request: api_api_pb.CreateTrieProofRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: api_api_pb.TrieProof) => void): grpc.ClientUnaryCall;
    public deleteTrieProof(request: api_api_pb.DeleteTrieProofRequest, callback: (error: grpc.ServiceError | null, response: api_api_pb.TrieProof) => void): grpc.ClientUnaryCall;
    public deleteTrieProof(request: api_api_pb.DeleteTrieProofRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: api_api_pb.TrieProof) => void): grpc.ClientUnaryCall;
    public deleteTrieProof(request: api_api_pb.DeleteTrieProofRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: api_api_pb.TrieProof) => void): grpc.ClientUnaryCall;
    public verifyTrieProof(request: api_api_pb.VerifyTrieProofRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<api_api_pb.VerifyProofReplyChunk>;
    public verifyTrieProof(request: api_api_pb.VerifyTrieProofRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<api_api_pb.VerifyProofReplyChunk>;
    public createKeyValuesProof(request: api_api_pb.CreateKeyValuesProofRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<api_api_pb.DataChunk>;
    public createKeyValuesProof(request: api_api_pb.CreateKeyValuesProofRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<api_api_pb.DataChunk>;
    public verifyKeyValuesProof(options?: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<api_api_pb.DataChunk, api_api_pb.VerifyProofReplyChunk>;
    public verifyKeyValuesProof(metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<api_api_pb.DataChunk, api_api_pb.VerifyProofReplyChunk>;
}
