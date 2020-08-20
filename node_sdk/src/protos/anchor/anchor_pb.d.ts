// package: anchor
// file: anchor/anchor.proto

import * as jspb from "google-protobuf";
import * as google_protobuf_empty_pb from "google-protobuf/google/protobuf/empty_pb";
import * as google_protobuf_timestamp_pb from "google-protobuf/google/protobuf/timestamp_pb";

export class Anchor extends jspb.Message {
  getType(): Anchor.TypeMap[keyof Anchor.TypeMap];
  setType(value: Anchor.TypeMap[keyof Anchor.TypeMap]): void;

  getStatus(): Anchor.StatusMap[keyof Anchor.StatusMap];
  setStatus(value: Anchor.StatusMap[keyof Anchor.StatusMap]): void;

  getError(): string;
  setError(value: string): void;

  clearSupportedFormatsList(): void;
  getSupportedFormatsList(): Array<Proof.FormatMap[keyof Proof.FormatMap]>;
  setSupportedFormatsList(value: Array<Proof.FormatMap[keyof Proof.FormatMap]>): void;
  addSupportedFormats(value: Proof.FormatMap[keyof Proof.FormatMap], index?: number): Proof.FormatMap[keyof Proof.FormatMap];

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Anchor.AsObject;
  static toObject(includeInstance: boolean, msg: Anchor): Anchor.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Anchor, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Anchor;
  static deserializeBinaryFromReader(message: Anchor, reader: jspb.BinaryReader): Anchor;
}

export namespace Anchor {
  export type AsObject = {
    type: Anchor.TypeMap[keyof Anchor.TypeMap],
    status: Anchor.StatusMap[keyof Anchor.StatusMap],
    error: string,
    supportedFormatsList: Array<Proof.FormatMap[keyof Proof.FormatMap]>,
  }

  export interface TypeMap {
    ETH: 0;
    ETH_MAINNET: 3;
    ETH_ELASTOS: 4;
    ETH_GOCHAIN: 9;
    BTC: 1;
    BTC_MAINNET: 5;
    CHP: 2;
    HEDERA: 6;
    HEDERA_MAINNET: 7;
    HYPERLEDGER: 8;
  }

  export const Type: TypeMap;

  export interface StatusMap {
    ERROR: 0;
    STOPPED: 1;
    RUNNING: 2;
  }

  export const Status: StatusMap;
}

export class Batch extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  getAnchorType(): Anchor.TypeMap[keyof Anchor.TypeMap];
  setAnchorType(value: Anchor.TypeMap[keyof Anchor.TypeMap]): void;

  getProofFormat(): Proof.FormatMap[keyof Proof.FormatMap];
  setProofFormat(value: Proof.FormatMap[keyof Proof.FormatMap]): void;

  getStatus(): Batch.StatusMap[keyof Batch.StatusMap];
  setStatus(value: Batch.StatusMap[keyof Batch.StatusMap]): void;

  getError(): string;
  setError(value: string): void;

  getSize(): number;
  setSize(value: number): void;

  hasCreatedAt(): boolean;
  clearCreatedAt(): void;
  getCreatedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setCreatedAt(value?: google_protobuf_timestamp_pb.Timestamp): void;

  hasFlushedAt(): boolean;
  clearFlushedAt(): void;
  getFlushedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setFlushedAt(value?: google_protobuf_timestamp_pb.Timestamp): void;

  hasStartedAt(): boolean;
  clearStartedAt(): void;
  getStartedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setStartedAt(value?: google_protobuf_timestamp_pb.Timestamp): void;

  hasSubmittedAt(): boolean;
  clearSubmittedAt(): void;
  getSubmittedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setSubmittedAt(value?: google_protobuf_timestamp_pb.Timestamp): void;

  hasFinalizedAt(): boolean;
  clearFinalizedAt(): void;
  getFinalizedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setFinalizedAt(value?: google_protobuf_timestamp_pb.Timestamp): void;

  getHash(): string;
  setHash(value: string): void;

  getData(): string;
  setData(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Batch.AsObject;
  static toObject(includeInstance: boolean, msg: Batch): Batch.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Batch, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Batch;
  static deserializeBinaryFromReader(message: Batch, reader: jspb.BinaryReader): Batch;
}

export namespace Batch {
  export type AsObject = {
    id: string,
    anchorType: Anchor.TypeMap[keyof Anchor.TypeMap],
    proofFormat: Proof.FormatMap[keyof Proof.FormatMap],
    status: Batch.StatusMap[keyof Batch.StatusMap],
    error: string,
    size: number,
    createdAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    flushedAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    startedAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    submittedAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    finalizedAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    hash: string,
    data: string,
  }

  export interface StatusMap {
    ERROR: 0;
    BATCHING: 1;
    QUEUING: 2;
    PROCESSING: 3;
    PENDING: 4;
    CONFIRMED: 5;
  }

  export const Status: StatusMap;
}

export class Proof extends jspb.Message {
  getHash(): string;
  setHash(value: string): void;

  getBatchId(): string;
  setBatchId(value: string): void;

  getAnchorType(): Anchor.TypeMap[keyof Anchor.TypeMap];
  setAnchorType(value: Anchor.TypeMap[keyof Anchor.TypeMap]): void;

  getBatchStatus(): Batch.StatusMap[keyof Batch.StatusMap];
  setBatchStatus(value: Batch.StatusMap[keyof Batch.StatusMap]): void;

  getFormat(): Proof.FormatMap[keyof Proof.FormatMap];
  setFormat(value: Proof.FormatMap[keyof Proof.FormatMap]): void;

  getData(): string;
  setData(value: string): void;

  hasBatch(): boolean;
  clearBatch(): void;
  getBatch(): Batch | undefined;
  setBatch(value?: Batch): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Proof.AsObject;
  static toObject(includeInstance: boolean, msg: Proof): Proof.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Proof, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Proof;
  static deserializeBinaryFromReader(message: Proof, reader: jspb.BinaryReader): Proof;
}

export namespace Proof {
  export type AsObject = {
    hash: string,
    batchId: string,
    anchorType: Anchor.TypeMap[keyof Anchor.TypeMap],
    batchStatus: Batch.StatusMap[keyof Batch.StatusMap],
    format: Proof.FormatMap[keyof Proof.FormatMap],
    data: string,
    batch?: Batch.AsObject,
  }

  export interface FormatMap {
    CHP_PATH: 0;
    ETH_TRIE: 1;
    CHP_PATH_SIGNED: 2;
    ETH_TRIE_SIGNED: 3;
  }

  export const Format: FormatMap;
}

export class AnchorRequest extends jspb.Message {
  getType(): Anchor.TypeMap[keyof Anchor.TypeMap];
  setType(value: Anchor.TypeMap[keyof Anchor.TypeMap]): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AnchorRequest.AsObject;
  static toObject(includeInstance: boolean, msg: AnchorRequest): AnchorRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: AnchorRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AnchorRequest;
  static deserializeBinaryFromReader(message: AnchorRequest, reader: jspb.BinaryReader): AnchorRequest;
}

export namespace AnchorRequest {
  export type AsObject = {
    type: Anchor.TypeMap[keyof Anchor.TypeMap],
  }
}

export class ProofRequest extends jspb.Message {
  getHash(): string;
  setHash(value: string): void;

  getBatchId(): string;
  setBatchId(value: string): void;

  getAnchorType(): Anchor.TypeMap[keyof Anchor.TypeMap];
  setAnchorType(value: Anchor.TypeMap[keyof Anchor.TypeMap]): void;

  getWithBatch(): boolean;
  setWithBatch(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ProofRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ProofRequest): ProofRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ProofRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ProofRequest;
  static deserializeBinaryFromReader(message: ProofRequest, reader: jspb.BinaryReader): ProofRequest;
}

export namespace ProofRequest {
  export type AsObject = {
    hash: string,
    batchId: string,
    anchorType: Anchor.TypeMap[keyof Anchor.TypeMap],
    withBatch: boolean,
  }
}

export class SubmitProofRequest extends jspb.Message {
  getHash(): string;
  setHash(value: string): void;

  getAnchorType(): Anchor.TypeMap[keyof Anchor.TypeMap];
  setAnchorType(value: Anchor.TypeMap[keyof Anchor.TypeMap]): void;

  getFormat(): Proof.FormatMap[keyof Proof.FormatMap];
  setFormat(value: Proof.FormatMap[keyof Proof.FormatMap]): void;

  getSkipBatching(): boolean;
  setSkipBatching(value: boolean): void;

  getWithBatch(): boolean;
  setWithBatch(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SubmitProofRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SubmitProofRequest): SubmitProofRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SubmitProofRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SubmitProofRequest;
  static deserializeBinaryFromReader(message: SubmitProofRequest, reader: jspb.BinaryReader): SubmitProofRequest;
}

export namespace SubmitProofRequest {
  export type AsObject = {
    hash: string,
    anchorType: Anchor.TypeMap[keyof Anchor.TypeMap],
    format: Proof.FormatMap[keyof Proof.FormatMap],
    skipBatching: boolean,
    withBatch: boolean,
  }
}

export class VerifyProofRequest extends jspb.Message {
  getAnchorType(): Anchor.TypeMap[keyof Anchor.TypeMap];
  setAnchorType(value: Anchor.TypeMap[keyof Anchor.TypeMap]): void;

  getFormat(): Proof.FormatMap[keyof Proof.FormatMap];
  setFormat(value: Proof.FormatMap[keyof Proof.FormatMap]): void;

  getData(): string;
  setData(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): VerifyProofRequest.AsObject;
  static toObject(includeInstance: boolean, msg: VerifyProofRequest): VerifyProofRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: VerifyProofRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): VerifyProofRequest;
  static deserializeBinaryFromReader(message: VerifyProofRequest, reader: jspb.BinaryReader): VerifyProofRequest;
}

export namespace VerifyProofRequest {
  export type AsObject = {
    anchorType: Anchor.TypeMap[keyof Anchor.TypeMap],
    format: Proof.FormatMap[keyof Proof.FormatMap],
    data: string,
  }
}

export class VerifyProofReply extends jspb.Message {
  getVerified(): boolean;
  setVerified(value: boolean): void;

  getError(): string;
  setError(value: string): void;

  getProvenhash(): string;
  setProvenhash(value: string): void;

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
    provenhash: string,
  }
}

export class BatchRequest extends jspb.Message {
  getBatchId(): string;
  setBatchId(value: string): void;

  getAnchorType(): Anchor.TypeMap[keyof Anchor.TypeMap];
  setAnchorType(value: Anchor.TypeMap[keyof Anchor.TypeMap]): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BatchRequest.AsObject;
  static toObject(includeInstance: boolean, msg: BatchRequest): BatchRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: BatchRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BatchRequest;
  static deserializeBinaryFromReader(message: BatchRequest, reader: jspb.BinaryReader): BatchRequest;
}

export namespace BatchRequest {
  export type AsObject = {
    batchId: string,
    anchorType: Anchor.TypeMap[keyof Anchor.TypeMap],
  }
}

export class SubscribeBatchesRequest extends jspb.Message {
  hasFilter(): boolean;
  clearFilter(): void;
  getFilter(): BatchRequest | undefined;
  setFilter(value?: BatchRequest): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SubscribeBatchesRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SubscribeBatchesRequest): SubscribeBatchesRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SubscribeBatchesRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SubscribeBatchesRequest;
  static deserializeBinaryFromReader(message: SubscribeBatchesRequest, reader: jspb.BinaryReader): SubscribeBatchesRequest;
}

export namespace SubscribeBatchesRequest {
  export type AsObject = {
    filter?: BatchRequest.AsObject,
  }
}

