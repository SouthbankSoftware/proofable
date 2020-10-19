// GENERATED CODE -- DO NOT EDIT!

// package: api
// file: api/api.proto

import * as api_api_pb from "../api/api_pb";
import * as google_protobuf_empty_pb from "google-protobuf/google/protobuf/empty_pb";
import * as grpc from "grpc";

interface IAPIServiceService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
  getTries: grpc.MethodDefinition<google_protobuf_empty_pb.Empty, api_api_pb.Trie>;
  getTrie: grpc.MethodDefinition<api_api_pb.TrieRequest, api_api_pb.Trie>;
  importTrie: grpc.MethodDefinition<api_api_pb.DataChunk, api_api_pb.Trie>;
  exportTrie: grpc.MethodDefinition<api_api_pb.TrieRequest, api_api_pb.DataChunk>;
  createTrie: grpc.MethodDefinition<api_api_pb.CreateTrieRequest, api_api_pb.Trie>;
  deleteTrie: grpc.MethodDefinition<api_api_pb.TrieRequest, api_api_pb.Trie>;
  getTrieKeyValues: grpc.MethodDefinition<api_api_pb.TrieKeyValuesRequest, api_api_pb.KeyValue>;
  getTrieKeyValue: grpc.MethodDefinition<api_api_pb.TrieKeyValueRequest, api_api_pb.KeyValue>;
  setTrieKeyValues: grpc.MethodDefinition<api_api_pb.KeyValue, api_api_pb.Trie>;
  getTrieRoots: grpc.MethodDefinition<api_api_pb.TrieRootsRequest, api_api_pb.TrieRoot>;
  setTrieRoot: grpc.MethodDefinition<api_api_pb.SetTrieRootRequest, api_api_pb.Trie>;
  setTrieStorageType: grpc.MethodDefinition<api_api_pb.SetTrieStorageTypeRequest, api_api_pb.Trie>;
  getTrieProofs: grpc.MethodDefinition<api_api_pb.TrieProofsRequest, api_api_pb.TrieProof>;
  getTrieProof: grpc.MethodDefinition<api_api_pb.TrieProofRequest, api_api_pb.TrieProof>;
  subscribeTrieProof: grpc.MethodDefinition<api_api_pb.TrieProofRequest, api_api_pb.TrieProof>;
  createTrieProof: grpc.MethodDefinition<api_api_pb.CreateTrieProofRequest, api_api_pb.TrieProof>;
  deleteTrieProof: grpc.MethodDefinition<api_api_pb.DeleteTrieProofRequest, api_api_pb.TrieProof>;
  verifyTrieProof: grpc.MethodDefinition<api_api_pb.VerifyTrieProofRequest, api_api_pb.VerifyProofReplyChunk>;
  createKeyValuesProof: grpc.MethodDefinition<api_api_pb.CreateKeyValuesProofRequest, api_api_pb.DataChunk>;
  verifyKeyValuesProof: grpc.MethodDefinition<api_api_pb.DataChunk, api_api_pb.VerifyProofReplyChunk>;
}

export const APIServiceService: IAPIServiceService;

export class APIServiceClient extends grpc.Client {
  constructor(address: string, credentials: grpc.ChannelCredentials, options?: object);
  getTries(argument: google_protobuf_empty_pb.Empty, metadataOrOptions?: grpc.Metadata | grpc.CallOptions | null): grpc.ClientReadableStream<api_api_pb.Trie>;
  getTries(argument: google_protobuf_empty_pb.Empty, metadata?: grpc.Metadata | null, options?: grpc.CallOptions | null): grpc.ClientReadableStream<api_api_pb.Trie>;
  getTrie(argument: api_api_pb.TrieRequest, callback: grpc.requestCallback<api_api_pb.Trie>): grpc.ClientUnaryCall;
  getTrie(argument: api_api_pb.TrieRequest, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<api_api_pb.Trie>): grpc.ClientUnaryCall;
  getTrie(argument: api_api_pb.TrieRequest, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<api_api_pb.Trie>): grpc.ClientUnaryCall;
  importTrie(callback: grpc.requestCallback<api_api_pb.Trie>): grpc.ClientWritableStream<api_api_pb.DataChunk>;
  importTrie(metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<api_api_pb.Trie>): grpc.ClientWritableStream<api_api_pb.DataChunk>;
  importTrie(metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<api_api_pb.Trie>): grpc.ClientWritableStream<api_api_pb.DataChunk>;
  exportTrie(argument: api_api_pb.TrieRequest, metadataOrOptions?: grpc.Metadata | grpc.CallOptions | null): grpc.ClientReadableStream<api_api_pb.DataChunk>;
  exportTrie(argument: api_api_pb.TrieRequest, metadata?: grpc.Metadata | null, options?: grpc.CallOptions | null): grpc.ClientReadableStream<api_api_pb.DataChunk>;
  createTrie(argument: api_api_pb.CreateTrieRequest, callback: grpc.requestCallback<api_api_pb.Trie>): grpc.ClientUnaryCall;
  createTrie(argument: api_api_pb.CreateTrieRequest, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<api_api_pb.Trie>): grpc.ClientUnaryCall;
  createTrie(argument: api_api_pb.CreateTrieRequest, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<api_api_pb.Trie>): grpc.ClientUnaryCall;
  deleteTrie(argument: api_api_pb.TrieRequest, callback: grpc.requestCallback<api_api_pb.Trie>): grpc.ClientUnaryCall;
  deleteTrie(argument: api_api_pb.TrieRequest, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<api_api_pb.Trie>): grpc.ClientUnaryCall;
  deleteTrie(argument: api_api_pb.TrieRequest, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<api_api_pb.Trie>): grpc.ClientUnaryCall;
  getTrieKeyValues(argument: api_api_pb.TrieKeyValuesRequest, metadataOrOptions?: grpc.Metadata | grpc.CallOptions | null): grpc.ClientReadableStream<api_api_pb.KeyValue>;
  getTrieKeyValues(argument: api_api_pb.TrieKeyValuesRequest, metadata?: grpc.Metadata | null, options?: grpc.CallOptions | null): grpc.ClientReadableStream<api_api_pb.KeyValue>;
  getTrieKeyValue(argument: api_api_pb.TrieKeyValueRequest, callback: grpc.requestCallback<api_api_pb.KeyValue>): grpc.ClientUnaryCall;
  getTrieKeyValue(argument: api_api_pb.TrieKeyValueRequest, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<api_api_pb.KeyValue>): grpc.ClientUnaryCall;
  getTrieKeyValue(argument: api_api_pb.TrieKeyValueRequest, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<api_api_pb.KeyValue>): grpc.ClientUnaryCall;
  setTrieKeyValues(callback: grpc.requestCallback<api_api_pb.Trie>): grpc.ClientWritableStream<api_api_pb.KeyValue>;
  setTrieKeyValues(metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<api_api_pb.Trie>): grpc.ClientWritableStream<api_api_pb.KeyValue>;
  setTrieKeyValues(metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<api_api_pb.Trie>): grpc.ClientWritableStream<api_api_pb.KeyValue>;
  getTrieRoots(argument: api_api_pb.TrieRootsRequest, metadataOrOptions?: grpc.Metadata | grpc.CallOptions | null): grpc.ClientReadableStream<api_api_pb.TrieRoot>;
  getTrieRoots(argument: api_api_pb.TrieRootsRequest, metadata?: grpc.Metadata | null, options?: grpc.CallOptions | null): grpc.ClientReadableStream<api_api_pb.TrieRoot>;
  setTrieRoot(argument: api_api_pb.SetTrieRootRequest, callback: grpc.requestCallback<api_api_pb.Trie>): grpc.ClientUnaryCall;
  setTrieRoot(argument: api_api_pb.SetTrieRootRequest, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<api_api_pb.Trie>): grpc.ClientUnaryCall;
  setTrieRoot(argument: api_api_pb.SetTrieRootRequest, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<api_api_pb.Trie>): grpc.ClientUnaryCall;
  setTrieStorageType(argument: api_api_pb.SetTrieStorageTypeRequest, callback: grpc.requestCallback<api_api_pb.Trie>): grpc.ClientUnaryCall;
  setTrieStorageType(argument: api_api_pb.SetTrieStorageTypeRequest, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<api_api_pb.Trie>): grpc.ClientUnaryCall;
  setTrieStorageType(argument: api_api_pb.SetTrieStorageTypeRequest, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<api_api_pb.Trie>): grpc.ClientUnaryCall;
  getTrieProofs(argument: api_api_pb.TrieProofsRequest, metadataOrOptions?: grpc.Metadata | grpc.CallOptions | null): grpc.ClientReadableStream<api_api_pb.TrieProof>;
  getTrieProofs(argument: api_api_pb.TrieProofsRequest, metadata?: grpc.Metadata | null, options?: grpc.CallOptions | null): grpc.ClientReadableStream<api_api_pb.TrieProof>;
  getTrieProof(argument: api_api_pb.TrieProofRequest, callback: grpc.requestCallback<api_api_pb.TrieProof>): grpc.ClientUnaryCall;
  getTrieProof(argument: api_api_pb.TrieProofRequest, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<api_api_pb.TrieProof>): grpc.ClientUnaryCall;
  getTrieProof(argument: api_api_pb.TrieProofRequest, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<api_api_pb.TrieProof>): grpc.ClientUnaryCall;
  subscribeTrieProof(argument: api_api_pb.TrieProofRequest, metadataOrOptions?: grpc.Metadata | grpc.CallOptions | null): grpc.ClientReadableStream<api_api_pb.TrieProof>;
  subscribeTrieProof(argument: api_api_pb.TrieProofRequest, metadata?: grpc.Metadata | null, options?: grpc.CallOptions | null): grpc.ClientReadableStream<api_api_pb.TrieProof>;
  createTrieProof(argument: api_api_pb.CreateTrieProofRequest, callback: grpc.requestCallback<api_api_pb.TrieProof>): grpc.ClientUnaryCall;
  createTrieProof(argument: api_api_pb.CreateTrieProofRequest, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<api_api_pb.TrieProof>): grpc.ClientUnaryCall;
  createTrieProof(argument: api_api_pb.CreateTrieProofRequest, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<api_api_pb.TrieProof>): grpc.ClientUnaryCall;
  deleteTrieProof(argument: api_api_pb.DeleteTrieProofRequest, callback: grpc.requestCallback<api_api_pb.TrieProof>): grpc.ClientUnaryCall;
  deleteTrieProof(argument: api_api_pb.DeleteTrieProofRequest, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<api_api_pb.TrieProof>): grpc.ClientUnaryCall;
  deleteTrieProof(argument: api_api_pb.DeleteTrieProofRequest, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<api_api_pb.TrieProof>): grpc.ClientUnaryCall;
  verifyTrieProof(argument: api_api_pb.VerifyTrieProofRequest, metadataOrOptions?: grpc.Metadata | grpc.CallOptions | null): grpc.ClientReadableStream<api_api_pb.VerifyProofReplyChunk>;
  verifyTrieProof(argument: api_api_pb.VerifyTrieProofRequest, metadata?: grpc.Metadata | null, options?: grpc.CallOptions | null): grpc.ClientReadableStream<api_api_pb.VerifyProofReplyChunk>;
  createKeyValuesProof(argument: api_api_pb.CreateKeyValuesProofRequest, metadataOrOptions?: grpc.Metadata | grpc.CallOptions | null): grpc.ClientReadableStream<api_api_pb.DataChunk>;
  createKeyValuesProof(argument: api_api_pb.CreateKeyValuesProofRequest, metadata?: grpc.Metadata | null, options?: grpc.CallOptions | null): grpc.ClientReadableStream<api_api_pb.DataChunk>;
  verifyKeyValuesProof(metadataOrOptions?: grpc.Metadata | grpc.CallOptions | null): grpc.ClientDuplexStream<api_api_pb.DataChunk, api_api_pb.VerifyProofReplyChunk>;
  verifyKeyValuesProof(metadata?: grpc.Metadata | null, options?: grpc.CallOptions | null): grpc.ClientDuplexStream<api_api_pb.DataChunk, api_api_pb.VerifyProofReplyChunk>;
}
