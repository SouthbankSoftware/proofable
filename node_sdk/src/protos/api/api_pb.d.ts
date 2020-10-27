// package: api
// file: api/api.proto

import * as jspb from "google-protobuf";
import * as google_protobuf_empty_pb from "google-protobuf/google/protobuf/empty_pb";
import * as google_protobuf_timestamp_pb from "google-protobuf/google/protobuf/timestamp_pb";
import * as anchor_anchor_pb from "../anchor/anchor_pb";

export class Trie extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  getRoot(): string;
  setRoot(value: string): void;

  getStorageType(): Trie.StorageTypeMap[keyof Trie.StorageTypeMap];
  setStorageType(value: Trie.StorageTypeMap[keyof Trie.StorageTypeMap]): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Trie.AsObject;
  static toObject(includeInstance: boolean, msg: Trie): Trie.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Trie, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Trie;
  static deserializeBinaryFromReader(message: Trie, reader: jspb.BinaryReader): Trie;
}

export namespace Trie {
  export type AsObject = {
    id: string,
    root: string,
    storageType: Trie.StorageTypeMap[keyof Trie.StorageTypeMap],
  }

  export interface StorageTypeMap {
    LOCAL: 0;
    CLOUD: 1;
  }

  export const StorageType: StorageTypeMap;
}

export class DataChunk extends jspb.Message {
  getData(): Uint8Array | string;
  getData_asU8(): Uint8Array;
  getData_asB64(): string;
  setData(value: Uint8Array | string): void;

  hasImportTrieRequest(): boolean;
  clearImportTrieRequest(): void;
  getImportTrieRequest(): ImportTrieRequest | undefined;
  setImportTrieRequest(value?: ImportTrieRequest): void;

  hasVerifyKeyValuesProofRequest(): boolean;
  clearVerifyKeyValuesProofRequest(): void;
  getVerifyKeyValuesProofRequest(): VerifyKeyValuesProofRequest | undefined;
  setVerifyKeyValuesProofRequest(value?: VerifyKeyValuesProofRequest): void;

  getMetadataCase(): DataChunk.MetadataCase;
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DataChunk.AsObject;
  static toObject(includeInstance: boolean, msg: DataChunk): DataChunk.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DataChunk, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DataChunk;
  static deserializeBinaryFromReader(message: DataChunk, reader: jspb.BinaryReader): DataChunk;
}

export namespace DataChunk {
  export type AsObject = {
    data: Uint8Array | string,
    importTrieRequest?: ImportTrieRequest.AsObject,
    verifyKeyValuesProofRequest?: VerifyKeyValuesProofRequest.AsObject,
  }

  export enum MetadataCase {
    METADATA_NOT_SET = 0,
    IMPORT_TRIE_REQUEST = 2,
    VERIFY_KEY_VALUES_PROOF_REQUEST = 3,
  }
}

export class KeyValue extends jspb.Message {
  getKey(): Uint8Array | string;
  getKey_asU8(): Uint8Array;
  getKey_asB64(): string;
  setKey(value: Uint8Array | string): void;

  clearKeySepList(): void;
  getKeySepList(): Array<number>;
  setKeySepList(value: Array<number>): void;
  addKeySep(value: number, index?: number): number;

  getValue(): Uint8Array | string;
  getValue_asU8(): Uint8Array;
  getValue_asB64(): string;
  setValue(value: Uint8Array | string): void;

  hasTrieKeyValuesRequest(): boolean;
  clearTrieKeyValuesRequest(): void;
  getTrieKeyValuesRequest(): TrieKeyValuesRequest | undefined;
  setTrieKeyValuesRequest(value?: TrieKeyValuesRequest): void;

  getMetadataCase(): KeyValue.MetadataCase;
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): KeyValue.AsObject;
  static toObject(includeInstance: boolean, msg: KeyValue): KeyValue.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: KeyValue, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): KeyValue;
  static deserializeBinaryFromReader(message: KeyValue, reader: jspb.BinaryReader): KeyValue;
}

export namespace KeyValue {
  export type AsObject = {
    key: Uint8Array | string,
    keySepList: Array<number>,
    value: Uint8Array | string,
    trieKeyValuesRequest?: TrieKeyValuesRequest.AsObject,
  }

  export enum MetadataCase {
    METADATA_NOT_SET = 0,
    TRIE_KEY_VALUES_REQUEST = 4,
  }
}

export class VerifyProofReplyChunk extends jspb.Message {
  hasKeyValue(): boolean;
  clearKeyValue(): void;
  getKeyValue(): KeyValue | undefined;
  setKeyValue(value?: KeyValue): void;

  hasDotGraphChunk(): boolean;
  clearDotGraphChunk(): void;
  getDotGraphChunk(): DataChunk | undefined;
  setDotGraphChunk(value?: DataChunk): void;

  hasReply(): boolean;
  clearReply(): void;
  getReply(): VerifyProofReply | undefined;
  setReply(value?: VerifyProofReply): void;

  getDataCase(): VerifyProofReplyChunk.DataCase;
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): VerifyProofReplyChunk.AsObject;
  static toObject(includeInstance: boolean, msg: VerifyProofReplyChunk): VerifyProofReplyChunk.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: VerifyProofReplyChunk, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): VerifyProofReplyChunk;
  static deserializeBinaryFromReader(message: VerifyProofReplyChunk, reader: jspb.BinaryReader): VerifyProofReplyChunk;
}

export namespace VerifyProofReplyChunk {
  export type AsObject = {
    keyValue?: KeyValue.AsObject,
    dotGraphChunk?: DataChunk.AsObject,
    reply?: VerifyProofReply.AsObject,
  }

  export enum DataCase {
    DATA_NOT_SET = 0,
    KEY_VALUE = 1,
    DOT_GRAPH_CHUNK = 2,
    REPLY = 3,
  }
}

export class Key extends jspb.Message {
  getKey(): Uint8Array | string;
  getKey_asU8(): Uint8Array;
  getKey_asB64(): string;
  setKey(value: Uint8Array | string): void;

  clearKeySepList(): void;
  getKeySepList(): Array<number>;
  setKeySepList(value: Array<number>): void;
  addKeySep(value: number, index?: number): number;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Key.AsObject;
  static toObject(includeInstance: boolean, msg: Key): Key.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Key, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Key;
  static deserializeBinaryFromReader(message: Key, reader: jspb.BinaryReader): Key;
}

export namespace Key {
  export type AsObject = {
    key: Uint8Array | string,
    keySepList: Array<number>,
  }
}

export class TrieRoot extends jspb.Message {
  getRoot(): string;
  setRoot(value: string): void;

  hasCreatedAt(): boolean;
  clearCreatedAt(): void;
  getCreatedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setCreatedAt(value?: google_protobuf_timestamp_pb.Timestamp): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TrieRoot.AsObject;
  static toObject(includeInstance: boolean, msg: TrieRoot): TrieRoot.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TrieRoot, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TrieRoot;
  static deserializeBinaryFromReader(message: TrieRoot, reader: jspb.BinaryReader): TrieRoot;
}

export namespace TrieRoot {
  export type AsObject = {
    root: string,
    createdAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
  }
}

export class TrieProof extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  getTrieId(): string;
  setTrieId(value: string): void;

  getRoot(): string;
  setRoot(value: string): void;

  hasCreatedAt(): boolean;
  clearCreatedAt(): void;
  getCreatedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setCreatedAt(value?: google_protobuf_timestamp_pb.Timestamp): void;

  getStatus(): anchor_anchor_pb.Batch.StatusMap[keyof anchor_anchor_pb.Batch.StatusMap];
  setStatus(value: anchor_anchor_pb.Batch.StatusMap[keyof anchor_anchor_pb.Batch.StatusMap]): void;

  getError(): string;
  setError(value: string): void;

  getAnchorType(): anchor_anchor_pb.Anchor.TypeMap[keyof anchor_anchor_pb.Anchor.TypeMap];
  setAnchorType(value: anchor_anchor_pb.Anchor.TypeMap[keyof anchor_anchor_pb.Anchor.TypeMap]): void;

  getTxnId(): string;
  setTxnId(value: string): void;

  getTxnUri(): string;
  setTxnUri(value: string): void;

  getBlockTime(): number;
  setBlockTime(value: number): void;

  getBlockTimeNano(): number;
  setBlockTimeNano(value: number): void;

  getBlockNumber(): number;
  setBlockNumber(value: number): void;

  getProofRoot(): string;
  setProofRoot(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TrieProof.AsObject;
  static toObject(includeInstance: boolean, msg: TrieProof): TrieProof.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TrieProof, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TrieProof;
  static deserializeBinaryFromReader(message: TrieProof, reader: jspb.BinaryReader): TrieProof;
}

export namespace TrieProof {
  export type AsObject = {
    id: string,
    trieId: string,
    root: string,
    createdAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    status: anchor_anchor_pb.Batch.StatusMap[keyof anchor_anchor_pb.Batch.StatusMap],
    error: string,
    anchorType: anchor_anchor_pb.Anchor.TypeMap[keyof anchor_anchor_pb.Anchor.TypeMap],
    txnId: string,
    txnUri: string,
    blockTime: number,
    blockTimeNano: number,
    blockNumber: number,
    proofRoot: string,
  }
}

export class RootFilter extends jspb.Message {
  getRoot(): string;
  setRoot(value: string): void;

  hasNotBefore(): boolean;
  clearNotBefore(): void;
  getNotBefore(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setNotBefore(value?: google_protobuf_timestamp_pb.Timestamp): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RootFilter.AsObject;
  static toObject(includeInstance: boolean, msg: RootFilter): RootFilter.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: RootFilter, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RootFilter;
  static deserializeBinaryFromReader(message: RootFilter, reader: jspb.BinaryReader): RootFilter;
}

export namespace RootFilter {
  export type AsObject = {
    root: string,
    notBefore?: google_protobuf_timestamp_pb.Timestamp.AsObject,
  }
}

export class KeyValuesFilter extends jspb.Message {
  clearKeysList(): void;
  getKeysList(): Array<Key>;
  setKeysList(value: Array<Key>): void;
  addKeys(value?: Key, index?: number): Key;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): KeyValuesFilter.AsObject;
  static toObject(includeInstance: boolean, msg: KeyValuesFilter): KeyValuesFilter.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: KeyValuesFilter, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): KeyValuesFilter;
  static deserializeBinaryFromReader(message: KeyValuesFilter, reader: jspb.BinaryReader): KeyValuesFilter;
}

export namespace KeyValuesFilter {
  export type AsObject = {
    keysList: Array<Key.AsObject>,
  }
}

export class TrieRequest extends jspb.Message {
  getTrieId(): string;
  setTrieId(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TrieRequest.AsObject;
  static toObject(includeInstance: boolean, msg: TrieRequest): TrieRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TrieRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TrieRequest;
  static deserializeBinaryFromReader(message: TrieRequest, reader: jspb.BinaryReader): TrieRequest;
}

export namespace TrieRequest {
  export type AsObject = {
    trieId: string,
  }
}

export class TrieKeyValuesRequest extends jspb.Message {
  getTrieId(): string;
  setTrieId(value: string): void;

  getRoot(): string;
  setRoot(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TrieKeyValuesRequest.AsObject;
  static toObject(includeInstance: boolean, msg: TrieKeyValuesRequest): TrieKeyValuesRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TrieKeyValuesRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TrieKeyValuesRequest;
  static deserializeBinaryFromReader(message: TrieKeyValuesRequest, reader: jspb.BinaryReader): TrieKeyValuesRequest;
}

export namespace TrieKeyValuesRequest {
  export type AsObject = {
    trieId: string,
    root: string,
  }
}

export class TrieKeyValueRequest extends jspb.Message {
  getTrieId(): string;
  setTrieId(value: string): void;

  getRoot(): string;
  setRoot(value: string): void;

  hasKey(): boolean;
  clearKey(): void;
  getKey(): Key | undefined;
  setKey(value?: Key): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TrieKeyValueRequest.AsObject;
  static toObject(includeInstance: boolean, msg: TrieKeyValueRequest): TrieKeyValueRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TrieKeyValueRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TrieKeyValueRequest;
  static deserializeBinaryFromReader(message: TrieKeyValueRequest, reader: jspb.BinaryReader): TrieKeyValueRequest;
}

export namespace TrieKeyValueRequest {
  export type AsObject = {
    trieId: string,
    root: string,
    key?: Key.AsObject,
  }
}

export class TrieRootsRequest extends jspb.Message {
  getTrieId(): string;
  setTrieId(value: string): void;

  hasRootFilter(): boolean;
  clearRootFilter(): void;
  getRootFilter(): RootFilter | undefined;
  setRootFilter(value?: RootFilter): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TrieRootsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: TrieRootsRequest): TrieRootsRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TrieRootsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TrieRootsRequest;
  static deserializeBinaryFromReader(message: TrieRootsRequest, reader: jspb.BinaryReader): TrieRootsRequest;
}

export namespace TrieRootsRequest {
  export type AsObject = {
    trieId: string,
    rootFilter?: RootFilter.AsObject,
  }
}

export class SetTrieRootRequest extends jspb.Message {
  getTrieId(): string;
  setTrieId(value: string): void;

  getRoot(): string;
  setRoot(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SetTrieRootRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SetTrieRootRequest): SetTrieRootRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SetTrieRootRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SetTrieRootRequest;
  static deserializeBinaryFromReader(message: SetTrieRootRequest, reader: jspb.BinaryReader): SetTrieRootRequest;
}

export namespace SetTrieRootRequest {
  export type AsObject = {
    trieId: string,
    root: string,
  }
}

export class SetTrieStorageTypeRequest extends jspb.Message {
  getTrieId(): string;
  setTrieId(value: string): void;

  getStorageType(): Trie.StorageTypeMap[keyof Trie.StorageTypeMap];
  setStorageType(value: Trie.StorageTypeMap[keyof Trie.StorageTypeMap]): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SetTrieStorageTypeRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SetTrieStorageTypeRequest): SetTrieStorageTypeRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SetTrieStorageTypeRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SetTrieStorageTypeRequest;
  static deserializeBinaryFromReader(message: SetTrieStorageTypeRequest, reader: jspb.BinaryReader): SetTrieStorageTypeRequest;
}

export namespace SetTrieStorageTypeRequest {
  export type AsObject = {
    trieId: string,
    storageType: Trie.StorageTypeMap[keyof Trie.StorageTypeMap],
  }
}

export class TrieProofsRequest extends jspb.Message {
  getTrieId(): string;
  setTrieId(value: string): void;

  hasRootFilter(): boolean;
  clearRootFilter(): void;
  getRootFilter(): RootFilter | undefined;
  setRootFilter(value?: RootFilter): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TrieProofsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: TrieProofsRequest): TrieProofsRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TrieProofsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TrieProofsRequest;
  static deserializeBinaryFromReader(message: TrieProofsRequest, reader: jspb.BinaryReader): TrieProofsRequest;
}

export namespace TrieProofsRequest {
  export type AsObject = {
    trieId: string,
    rootFilter?: RootFilter.AsObject,
  }
}

export class TrieProofRequest extends jspb.Message {
  getTrieId(): string;
  setTrieId(value: string): void;

  hasProofId(): boolean;
  clearProofId(): void;
  getProofId(): string;
  setProofId(value: string): void;

  hasRootFilter(): boolean;
  clearRootFilter(): void;
  getRootFilter(): RootFilter | undefined;
  setRootFilter(value?: RootFilter): void;

  getQueryCase(): TrieProofRequest.QueryCase;
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TrieProofRequest.AsObject;
  static toObject(includeInstance: boolean, msg: TrieProofRequest): TrieProofRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TrieProofRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TrieProofRequest;
  static deserializeBinaryFromReader(message: TrieProofRequest, reader: jspb.BinaryReader): TrieProofRequest;
}

export namespace TrieProofRequest {
  export type AsObject = {
    trieId: string,
    proofId: string,
    rootFilter?: RootFilter.AsObject,
  }

  export enum QueryCase {
    QUERY_NOT_SET = 0,
    PROOF_ID = 2,
    ROOT_FILTER = 3,
  }
}

export class CreateTrieRequest extends jspb.Message {
  getStorageType(): Trie.StorageTypeMap[keyof Trie.StorageTypeMap];
  setStorageType(value: Trie.StorageTypeMap[keyof Trie.StorageTypeMap]): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateTrieRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CreateTrieRequest): CreateTrieRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CreateTrieRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateTrieRequest;
  static deserializeBinaryFromReader(message: CreateTrieRequest, reader: jspb.BinaryReader): CreateTrieRequest;
}

export namespace CreateTrieRequest {
  export type AsObject = {
    storageType: Trie.StorageTypeMap[keyof Trie.StorageTypeMap],
  }
}

export class ImportTrieRequest extends jspb.Message {
  getTrieId(): string;
  setTrieId(value: string): void;

  getStorageType(): Trie.StorageTypeMap[keyof Trie.StorageTypeMap];
  setStorageType(value: Trie.StorageTypeMap[keyof Trie.StorageTypeMap]): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ImportTrieRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ImportTrieRequest): ImportTrieRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ImportTrieRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ImportTrieRequest;
  static deserializeBinaryFromReader(message: ImportTrieRequest, reader: jspb.BinaryReader): ImportTrieRequest;
}

export namespace ImportTrieRequest {
  export type AsObject = {
    trieId: string,
    storageType: Trie.StorageTypeMap[keyof Trie.StorageTypeMap],
  }
}

export class CreateTrieProofRequest extends jspb.Message {
  getTrieId(): string;
  setTrieId(value: string): void;

  getRoot(): string;
  setRoot(value: string): void;

  getAnchorType(): anchor_anchor_pb.Anchor.TypeMap[keyof anchor_anchor_pb.Anchor.TypeMap];
  setAnchorType(value: anchor_anchor_pb.Anchor.TypeMap[keyof anchor_anchor_pb.Anchor.TypeMap]): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateTrieProofRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CreateTrieProofRequest): CreateTrieProofRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CreateTrieProofRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateTrieProofRequest;
  static deserializeBinaryFromReader(message: CreateTrieProofRequest, reader: jspb.BinaryReader): CreateTrieProofRequest;
}

export namespace CreateTrieProofRequest {
  export type AsObject = {
    trieId: string,
    root: string,
    anchorType: anchor_anchor_pb.Anchor.TypeMap[keyof anchor_anchor_pb.Anchor.TypeMap],
  }
}

export class DeleteTrieProofRequest extends jspb.Message {
  getTrieId(): string;
  setTrieId(value: string): void;

  getProofId(): string;
  setProofId(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DeleteTrieProofRequest.AsObject;
  static toObject(includeInstance: boolean, msg: DeleteTrieProofRequest): DeleteTrieProofRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DeleteTrieProofRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DeleteTrieProofRequest;
  static deserializeBinaryFromReader(message: DeleteTrieProofRequest, reader: jspb.BinaryReader): DeleteTrieProofRequest;
}

export namespace DeleteTrieProofRequest {
  export type AsObject = {
    trieId: string,
    proofId: string,
  }
}

export class VerifyTrieProofRequest extends jspb.Message {
  getTrieId(): string;
  setTrieId(value: string): void;

  getProofId(): string;
  setProofId(value: string): void;

  getOutputKeyValues(): boolean;
  setOutputKeyValues(value: boolean): void;

  getOutputDotGraph(): boolean;
  setOutputDotGraph(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): VerifyTrieProofRequest.AsObject;
  static toObject(includeInstance: boolean, msg: VerifyTrieProofRequest): VerifyTrieProofRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: VerifyTrieProofRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): VerifyTrieProofRequest;
  static deserializeBinaryFromReader(message: VerifyTrieProofRequest, reader: jspb.BinaryReader): VerifyTrieProofRequest;
}

export namespace VerifyTrieProofRequest {
  export type AsObject = {
    trieId: string,
    proofId: string,
    outputKeyValues: boolean,
    outputDotGraph: boolean,
  }
}

export class CreateKeyValuesProofRequest extends jspb.Message {
  getTrieId(): string;
  setTrieId(value: string): void;

  hasProofId(): boolean;
  clearProofId(): void;
  getProofId(): string;
  setProofId(value: string): void;

  hasRequest(): boolean;
  clearRequest(): void;
  getRequest(): CreateTrieProofRequest | undefined;
  setRequest(value?: CreateTrieProofRequest): void;

  hasFilter(): boolean;
  clearFilter(): void;
  getFilter(): KeyValuesFilter | undefined;
  setFilter(value?: KeyValuesFilter): void;

  getTrieProofCase(): CreateKeyValuesProofRequest.TrieProofCase;
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateKeyValuesProofRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CreateKeyValuesProofRequest): CreateKeyValuesProofRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CreateKeyValuesProofRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateKeyValuesProofRequest;
  static deserializeBinaryFromReader(message: CreateKeyValuesProofRequest, reader: jspb.BinaryReader): CreateKeyValuesProofRequest;
}

export namespace CreateKeyValuesProofRequest {
  export type AsObject = {
    trieId: string,
    proofId: string,
    request?: CreateTrieProofRequest.AsObject,
    filter?: KeyValuesFilter.AsObject,
  }

  export enum TrieProofCase {
    TRIE_PROOF_NOT_SET = 0,
    PROOF_ID = 2,
    REQUEST = 3,
  }
}

export class VerifyKeyValuesProofRequest extends jspb.Message {
  getOutputKeyValues(): boolean;
  setOutputKeyValues(value: boolean): void;

  getOutputDotGraph(): boolean;
  setOutputDotGraph(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): VerifyKeyValuesProofRequest.AsObject;
  static toObject(includeInstance: boolean, msg: VerifyKeyValuesProofRequest): VerifyKeyValuesProofRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: VerifyKeyValuesProofRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): VerifyKeyValuesProofRequest;
  static deserializeBinaryFromReader(message: VerifyKeyValuesProofRequest, reader: jspb.BinaryReader): VerifyKeyValuesProofRequest;
}

export namespace VerifyKeyValuesProofRequest {
  export type AsObject = {
    outputKeyValues: boolean,
    outputDotGraph: boolean,
  }
}

export class VerifyProofReply extends jspb.Message {
  getVerified(): boolean;
  setVerified(value: boolean): void;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): VerifyProofReply.AsObject;
  static toObject(includeInstance: boolean, msg: VerifyProofReply): VerifyProofReply.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: VerifyProofReply, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): VerifyProofReply;
  static deserializeBinaryFromReader(message: VerifyProofReply, reader: jspb.BinaryReader): VerifyProofReply;
}

export namespace VerifyProofReply {
  export type AsObject = {
    verified: boolean,
    error: string,
  }
}

