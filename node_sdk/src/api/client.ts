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
 * @Last modified time: 2020-06-25T19:31:41+10:00
 */

import _ from "lodash";
import * as grpc from "grpc";
import { Empty } from "google-protobuf/google/protobuf/empty_pb";
import { SurfaceCall } from "grpc/build/src/call";
import {
  APIServiceClient as Client,
  CreateKeyValuesProofRequest,
  CreateTrieProofRequest,
  DataChunk,
  DeleteTrieProofRequest,
  Key,
  KeyValue,
  KeyValuesFilter,
  RootFilter,
  SetTrieRootRequest,
  Trie,
  TrieKeyValueRequest,
  TrieKeyValuesRequest,
  TrieProof,
  TrieProofRequest,
  TrieProofsRequest,
  TrieRequest,
  TrieRoot,
  TrieRootsRequest,
  VerifyProofReply,
  VerifyProofReplyChunk,
  VerifyTrieProofRequest,
} from "../protos/api";
import { Anchor, Batch } from "../protos/anchor";
import {
  createKeyValuesProof,
  createKeyValuesProofPromise,
  createTrie,
  createTriePromise,
  createTrieProofPromise,
  deleteTrie,
  deleteTriePromise,
  deleteTrieProofPromise,
  exportTrie,
  exportTriePromise,
  getTrieKeyValuePromise,
  getTrieKeyValuesPromise,
  getTriePromise,
  getTrieProofPromise,
  getTrieProofsPromise,
  getTrieRootsPromise,
  getTriesPromise,
  importTrie,
  importTriePromise,
  setTrieKeyValues,
  setTrieKeyValuesPromise,
  setTrieRootPromise,
  subscribeTrieProofPromise,
  verifyKeyValuesProof,
  verifyKeyValuesProofPromise,
  verifyTrieProof,
  verifyTrieProofPromise,
} from "./api";
import { getAuthMetadata } from "./auth";

declare module "../protos/anchor/anchor_pb.d" {
  namespace Anchor {
    type ValueOfType = Anchor.TypeMap[keyof Anchor.TypeMap];
    let TypeName: Record<ValueOfType, keyof Anchor.TypeMap>;

    type ValueOfStatus = Anchor.StatusMap[keyof Anchor.StatusMap];
    let StatusName: Record<ValueOfStatus, string>;
  }

  namespace Batch {
    type ValueOfStatus = Batch.StatusMap[keyof Batch.StatusMap];
    let StatusName: Record<ValueOfStatus, string>;
  }
}

Anchor.TypeName = _.invert(Anchor.Type) as any;
Anchor.StatusName = _.invert(Anchor.Status) as any;
Batch.StatusName = _.invert(Batch.Status) as any;

declare module "../protos/api/api_pb.d" {
  namespace TrieRequest {
    function from(id: string): TrieRequest;
  }

  namespace TrieKeyValueRequest {
    function from(id: string, root: string, key: Key): TrieKeyValueRequest;
  }

  namespace TrieKeyValuesRequest {
    function from(id: string, root: string): TrieKeyValuesRequest;
  }

  namespace KeyValuesFilter {
    function from(iter: Iterable<Key>): KeyValuesFilter;
  }

  namespace TrieProofRequest {
    function from(
      id: string,
      proofId: string,
      filter?: RootFilter
    ): TrieProofRequest;
  }

  namespace TrieProofsRequest {
    function from(id: string, filter?: RootFilter): TrieProofsRequest;
  }

  namespace TrieRootsRequest {
    function from(id: string, filter?: RootFilter): TrieRootsRequest;
  }

  namespace SetTrieRootRequest {
    function from(id: string, root: string): SetTrieRootRequest;
  }

  namespace CreateTrieProofRequest {
    function from(
      id: string,
      root: string,
      anchorType?: Anchor.ValueOfType
    ): CreateTrieProofRequest;
  }

  namespace DeleteTrieProofRequest {
    function from(id: string, proofId: string): DeleteTrieProofRequest;
  }

  namespace Key {
    function from(key: string, keyEncoding?: "utf8" | "hex"): Key;
  }

  namespace KeyValue {
    function from(
      key: string,
      val: string,
      keyEncoding?: "utf8" | "hex",
      valEncoding?: "utf8" | "hex"
    ): KeyValue;
  }

  interface KeyValue {
    to(
      keyEncoding?: "utf8" | "hex",
      valEncoding?: "utf8" | "hex"
    ): {
      key: string;
      val: string;
    };
  }
}

TrieRequest.from = (id) => {
  const tr = new TrieRequest();

  tr.setTrieId(id);

  return tr;
};

TrieKeyValueRequest.from = (id, root, key) => {
  const r = new TrieKeyValueRequest();

  r.setTrieId(id);
  r.setRoot(root);
  r.setKey(key);

  return r;
};

TrieKeyValuesRequest.from = (id, root) => {
  const r = new TrieKeyValuesRequest();

  r.setTrieId(id);
  r.setRoot(root);

  return r;
};

KeyValuesFilter.from = (iter) => {
  const r = new KeyValuesFilter();

  for (const k of iter) {
    r.addKeys(k);
  }

  return r;
};

TrieProofRequest.from = (id, proofId, filter) => {
  const r = new TrieProofRequest();

  r.setTrieId(id);
  r.setProofId(proofId);
  r.setRootFilter(filter);

  return r;
};

TrieProofsRequest.from = (id, filter) => {
  const r = new TrieProofsRequest();

  r.setTrieId(id);
  r.setRootFilter(filter);

  return r;
};

TrieRootsRequest.from = (id, filter) => {
  const r = new TrieRootsRequest();

  r.setTrieId(id);
  r.setRootFilter(filter);

  return r;
};

SetTrieRootRequest.from = (id, root) => {
  const r = new SetTrieRootRequest();

  r.setTrieId(id);
  r.setRoot(root);

  return r;
};

CreateTrieProofRequest.from = (id, root, anchorType = Anchor.Type.ETH) => {
  const r = new CreateTrieProofRequest();

  r.setTrieId(id);
  r.setRoot(root);
  r.setAnchorType(anchorType);

  return r;
};

DeleteTrieProofRequest.from = (id, proofId) => {
  const r = new DeleteTrieProofRequest();

  r.setTrieId(id);
  r.setProofId(proofId);

  return r;
};

Key.from = (key: string, keyEncoding) => {
  const k = new Key();

  k.setKey(Buffer.from(key, keyEncoding ?? "utf8"));

  return k;
};

KeyValue.from = (key, val, keyEncoding, valEncoding) => {
  const kv = new KeyValue();

  kv.setKey(Buffer.from(key, keyEncoding ?? "utf8"));
  kv.setValue(Buffer.from(val, valEncoding ?? "utf8"));

  return kv;
};

KeyValue.prototype.to = function (keyEncoding, valEncoding) {
  return {
    key: Buffer.from(this.getKey_asU8()).toString(keyEncoding ?? "utf8"),
    val: Buffer.from(this.getValue_asU8()).toString(valEncoding ?? "utf8"),
  };
};

export class APIServiceClient extends Client {
  getTries(): AsyncIterable<Trie>;
  getTries(
    argument: Empty,
    metadataOrOptions?: grpc.Metadata | grpc.CallOptions | null
  ): grpc.ClientReadableStream<Trie>;
  getTries(
    argument: Empty,
    metadata?: grpc.Metadata | null,
    options?: grpc.CallOptions | null
  ): grpc.ClientReadableStream<Trie>;
  getTries(arg1?: any, arg2?: any, arg3?: any): any {
    if (!arg1) {
      return getTriesPromise(this);
    }

    return super.getTries(arg1, arg2, arg3);
  }

  getTrie(id: string): Promise<Trie>;
  getTrie(
    argument: TrieRequest,
    callback: grpc.requestCallback<Trie>
  ): grpc.ClientUnaryCall;
  getTrie(
    argument: TrieRequest,
    metadataOrOptions: grpc.Metadata | grpc.CallOptions | null,
    callback: grpc.requestCallback<Trie>
  ): grpc.ClientUnaryCall;
  getTrie(
    argument: TrieRequest,
    metadata: grpc.Metadata | null,
    options: grpc.CallOptions | null,
    callback: grpc.requestCallback<Trie>
  ): grpc.ClientUnaryCall;
  getTrie(arg1: any, arg2?: any, arg3?: any, arg4?: any): any {
    if (typeof arg1 === "string") {
      return getTriePromise(this, arg1);
    }

    return super.getTrie(arg1, arg2, arg3, arg4);
  }

  /**
   * Imports the trie data and creates a new trie. If `id` is zero, a new trie ID will be generated,
   * which is recommended when importing
   */
  importTrie(id: string, path: string): Promise<Trie>;
  importTrie(
    id: string,
    path: string,
    callback: grpc.requestCallback<Trie>
  ): SurfaceCall;
  importTrie(
    callback: grpc.requestCallback<Trie>
  ): grpc.ClientWritableStream<DataChunk>;
  importTrie(
    metadataOrOptions: grpc.Metadata | grpc.CallOptions | null,
    callback: grpc.requestCallback<Trie>
  ): grpc.ClientWritableStream<DataChunk>;
  importTrie(
    metadata: grpc.Metadata | null,
    options: grpc.CallOptions | null,
    callback: grpc.requestCallback<Trie>
  ): grpc.ClientWritableStream<DataChunk>;
  importTrie(arg1: any, arg2?: any, arg3?: any): any {
    if (typeof arg1 === "string") {
      if (typeof arg3 === "function") {
        return importTrie(this, arg1, arg2, arg3);
      }

      return importTriePromise(this, arg1, arg2);
    }

    return super.importTrie(arg1, arg2, arg3);
  }

  /**
   * Exports the given trie
   */
  exportTrie(id: string, outputPath: string): Promise<void>;
  exportTrie(
    id: string,
    outputPath: string,
    callback: grpc.requestCallback<void>
  ): SurfaceCall;
  exportTrie(
    argument: TrieRequest,
    metadataOrOptions?: grpc.Metadata | grpc.CallOptions | null
  ): grpc.ClientReadableStream<DataChunk>;
  exportTrie(
    argument: TrieRequest,
    metadata?: grpc.Metadata | null,
    options?: grpc.CallOptions | null
  ): grpc.ClientReadableStream<DataChunk>;
  exportTrie(arg1: any, arg2?: any, arg3?: any): any {
    if (typeof arg1 === "string") {
      if (typeof arg3 === "function") {
        return exportTrie(this, arg1, arg2, arg3);
      }

      return exportTriePromise(this, arg1, arg2);
    }

    return super.exportTrie(arg1, arg2, arg3);
  }

  /**
   * Creates a new trie
   */
  createTrie(): Promise<Trie>;
  createTrie(callback: grpc.requestCallback<Trie>): SurfaceCall;
  createTrie(
    argument: Empty,
    callback: grpc.requestCallback<Trie>
  ): grpc.ClientUnaryCall;
  createTrie(
    argument: Empty,
    metadataOrOptions: grpc.Metadata | grpc.CallOptions | null,
    callback: grpc.requestCallback<Trie>
  ): grpc.ClientUnaryCall;
  createTrie(
    argument: Empty,
    metadata: grpc.Metadata | null,
    options: grpc.CallOptions | null,
    callback: grpc.requestCallback<Trie>
  ): grpc.ClientUnaryCall;
  createTrie(arg1?: any, arg2?: any, arg3?: any, arg4?: any): any {
    if (!arg1) {
      return createTriePromise(this);
    } else if (typeof arg1 === "function") {
      return createTrie(this, arg1);
    }

    return super.createTrie(arg1, arg2, arg3, arg4);
  }

  /**
   * Deletes the given trie
   */
  deleteTrie(id: string): Promise<Trie>;
  deleteTrie(id: string, callback: grpc.requestCallback<Trie>): SurfaceCall;
  deleteTrie(
    argument: TrieRequest,
    callback: grpc.requestCallback<Trie>
  ): grpc.ClientUnaryCall;
  deleteTrie(
    argument: TrieRequest,
    metadataOrOptions: grpc.Metadata | grpc.CallOptions | null,
    callback: grpc.requestCallback<Trie>
  ): grpc.ClientUnaryCall;
  deleteTrie(
    argument: TrieRequest,
    metadata: grpc.Metadata | null,
    options: grpc.CallOptions | null,
    callback: grpc.requestCallback<Trie>
  ): grpc.ClientUnaryCall;
  deleteTrie(arg1: any, arg2?: any, arg3?: any, arg4?: any): any {
    if (typeof arg1 === "string") {
      if (typeof arg2 === "function") {
        return deleteTrie(this, arg1, arg2);
      }

      return deleteTriePromise(this, arg1);
    }

    return super.deleteTrie(arg1, arg2, arg3, arg4);
  }

  getTrieKeyValues(id: string, root: string): AsyncIterable<KeyValue>;
  getTrieKeyValues(
    argument: TrieKeyValuesRequest,
    metadataOrOptions?: grpc.Metadata | grpc.CallOptions | null
  ): grpc.ClientReadableStream<KeyValue>;
  getTrieKeyValues(
    argument: TrieKeyValuesRequest,
    metadata?: grpc.Metadata | null,
    options?: grpc.CallOptions | null
  ): grpc.ClientReadableStream<KeyValue>;
  getTrieKeyValues(arg1: any, arg2: any, arg3?: any): any {
    if (typeof arg1 === "string") {
      return getTrieKeyValuesPromise(this, arg1, arg2);
    }

    return super.getTrieKeyValues(arg1, arg2, arg3);
  }

  setTrieKeyValues(
    id: string,
    root: string,
    iter: Iterable<KeyValue>
  ): Promise<Trie>;
  setTrieKeyValues(
    id: string,
    root: string,
    iter: Iterable<KeyValue>,
    callback: grpc.requestCallback<Trie>
  ): SurfaceCall;
  setTrieKeyValues(
    callback: grpc.requestCallback<Trie>
  ): grpc.ClientWritableStream<KeyValue>;
  setTrieKeyValues(
    metadataOrOptions: grpc.Metadata | grpc.CallOptions | null,
    callback: grpc.requestCallback<Trie>
  ): grpc.ClientWritableStream<KeyValue>;
  setTrieKeyValues(
    metadata: grpc.Metadata | null,
    options: grpc.CallOptions | null,
    callback: grpc.requestCallback<Trie>
  ): grpc.ClientWritableStream<KeyValue>;
  setTrieKeyValues(arg1: any, arg2?: any, arg3?: any, arg4?: any): any {
    if (typeof arg1 === "string") {
      if (typeof arg4 === "function") {
        return setTrieKeyValues(this, arg1, arg2, arg3, arg4);
      }

      return setTrieKeyValuesPromise(this, arg1, arg2, arg3);
    }

    return super.setTrieKeyValues(arg1, arg2, arg3);
  }

  getTrieKeyValue(id: string, root: string, key: Key): Promise<KeyValue>;
  getTrieKeyValue(
    argument: TrieKeyValueRequest,
    callback: grpc.requestCallback<KeyValue>
  ): grpc.ClientUnaryCall;
  getTrieKeyValue(
    argument: TrieKeyValueRequest,
    metadataOrOptions: grpc.Metadata | grpc.CallOptions | null,
    callback: grpc.requestCallback<KeyValue>
  ): grpc.ClientUnaryCall;
  getTrieKeyValue(
    argument: TrieKeyValueRequest,
    metadata: grpc.Metadata | null,
    options: grpc.CallOptions | null,
    callback: grpc.requestCallback<KeyValue>
  ): grpc.ClientUnaryCall;
  getTrieKeyValue(arg1: any, arg2: any, arg3?: any, arg4?: any): any {
    if (typeof arg1 === "string") {
      return getTrieKeyValuePromise(this, arg1, arg2, arg3);
    }

    return super.getTrieKeyValue(arg1, arg2, arg3, arg4);
  }

  getTrieRoots(id: string, filter: RootFilter | null): AsyncIterable<TrieRoot>;
  getTrieRoots(
    argument: TrieRootsRequest,
    metadataOrOptions?: grpc.Metadata | grpc.CallOptions | null
  ): grpc.ClientReadableStream<TrieRoot>;
  getTrieRoots(
    argument: TrieRootsRequest,
    metadata?: grpc.Metadata | null,
    options?: grpc.CallOptions | null
  ): grpc.ClientReadableStream<TrieRoot>;
  getTrieRoots(arg1: any, arg2: any, arg3?: any): any {
    if (typeof arg1 === "string") {
      return getTrieRootsPromise(this, arg1, arg2);
    }

    return super.getTrieRoots(arg1, arg2, arg3);
  }

  setTrieRoot(id: string, root: string): Promise<Trie>;
  setTrieRoot(
    argument: SetTrieRootRequest,
    callback: grpc.requestCallback<Trie>
  ): grpc.ClientUnaryCall;
  setTrieRoot(
    argument: SetTrieRootRequest,
    metadataOrOptions: grpc.Metadata | grpc.CallOptions | null,
    callback: grpc.requestCallback<Trie>
  ): grpc.ClientUnaryCall;
  setTrieRoot(
    argument: SetTrieRootRequest,
    metadata: grpc.Metadata | null,
    options: grpc.CallOptions | null,
    callback: grpc.requestCallback<Trie>
  ): grpc.ClientUnaryCall;
  setTrieRoot(arg1: any, arg2: any, arg3?: any, arg4?: any): any {
    if (typeof arg1 === "string") {
      return setTrieRootPromise(this, arg1, arg2);
    }

    return super.setTrieRoot(arg1, arg2, arg3, arg4);
  }

  getTrieProofs(
    id: string,
    filter: RootFilter | null
  ): AsyncIterable<TrieProof>;
  getTrieProofs(
    argument: TrieProofsRequest,
    metadataOrOptions?: grpc.Metadata | grpc.CallOptions | null
  ): grpc.ClientReadableStream<TrieProof>;
  getTrieProofs(
    argument: TrieProofsRequest,
    metadata?: grpc.Metadata | null,
    options?: grpc.CallOptions | null
  ): grpc.ClientReadableStream<TrieProof>;
  getTrieProofs(arg1: any, arg2: any, arg3?: any): any {
    if (typeof arg1 === "string") {
      return getTrieProofsPromise(this, arg1, arg2);
    }

    return super.getTrieProofs(arg1, arg2, arg3);
  }

  getTrieProof(
    id: string,
    proofId: string,
    filter: RootFilter | null
  ): Promise<TrieProof>;
  getTrieProof(
    argument: TrieProofRequest,
    callback: grpc.requestCallback<TrieProof>
  ): grpc.ClientUnaryCall;
  getTrieProof(
    argument: TrieProofRequest,
    metadataOrOptions: grpc.Metadata | grpc.CallOptions | null,
    callback: grpc.requestCallback<TrieProof>
  ): grpc.ClientUnaryCall;
  getTrieProof(
    argument: TrieProofRequest,
    metadata: grpc.Metadata | null,
    options: grpc.CallOptions | null,
    callback: grpc.requestCallback<TrieProof>
  ): grpc.ClientUnaryCall;
  getTrieProof(arg1: any, arg2: any, arg3?: any, arg4?: any): any {
    if (typeof arg1 === "string") {
      return getTrieProofPromise(this, arg1, arg2, arg3);
    }

    return super.getTrieProof(arg1, arg2, arg3, arg4);
  }

  subscribeTrieProof(
    id: string,
    proofId: string,
    filter: RootFilter | null
  ): AsyncIterable<TrieProof>;
  subscribeTrieProof(
    argument: TrieProofRequest,
    metadataOrOptions?: grpc.Metadata | grpc.CallOptions | null
  ): grpc.ClientReadableStream<TrieProof>;
  subscribeTrieProof(
    argument: TrieProofRequest,
    metadata?: grpc.Metadata | null,
    options?: grpc.CallOptions | null
  ): grpc.ClientReadableStream<TrieProof>;
  subscribeTrieProof(arg1: any, arg2: any, arg3?: any): any {
    if (typeof arg1 === "string") {
      return subscribeTrieProofPromise(this, arg1, arg2, arg3);
    }

    return super.subscribeTrieProof(arg1, arg2, arg3);
  }

  createTrieProof(
    id: string,
    root: string,
    anchorType?: Anchor.ValueOfType
  ): Promise<TrieProof>;
  createTrieProof(
    argument: CreateTrieProofRequest,
    callback: grpc.requestCallback<TrieProof>
  ): grpc.ClientUnaryCall;
  createTrieProof(
    argument: CreateTrieProofRequest,
    metadataOrOptions: grpc.Metadata | grpc.CallOptions | null,
    callback: grpc.requestCallback<TrieProof>
  ): grpc.ClientUnaryCall;
  createTrieProof(
    argument: CreateTrieProofRequest,
    metadata: grpc.Metadata | null,
    options: grpc.CallOptions | null,
    callback: grpc.requestCallback<TrieProof>
  ): grpc.ClientUnaryCall;
  createTrieProof(arg1: any, arg2: any, arg3?: any, arg4?: any): any {
    if (typeof arg1 === "string") {
      return createTrieProofPromise(this, arg1, arg2, arg3);
    }

    return super.createTrieProof(arg1, arg2, arg3, arg4);
  }

  deleteTrieProof(id: string, proofId: string): Promise<TrieProof>;
  deleteTrieProof(
    argument: DeleteTrieProofRequest,
    callback: grpc.requestCallback<TrieProof>
  ): grpc.ClientUnaryCall;
  deleteTrieProof(
    argument: DeleteTrieProofRequest,
    metadataOrOptions: grpc.Metadata | grpc.CallOptions | null,
    callback: grpc.requestCallback<TrieProof>
  ): grpc.ClientUnaryCall;
  deleteTrieProof(
    argument: DeleteTrieProofRequest,
    metadata: grpc.Metadata | null,
    options: grpc.CallOptions | null,
    callback: grpc.requestCallback<TrieProof>
  ): grpc.ClientUnaryCall;
  deleteTrieProof(arg1: any, arg2: any, arg3?: any, arg4?: any): any {
    if (typeof arg1 === "string") {
      return deleteTrieProofPromise(this, arg1, arg2);
    }

    return super.deleteTrieProof(arg1, arg2, arg3, arg4);
  }

  verifyTrieProof(
    trieId: string,
    proofId: string,
    outputKeyValues?: boolean,
    dotGraphOutputPath?: string
  ): AsyncIterable<KeyValue | VerifyProofReply>;
  verifyTrieProof(
    trieId: string,
    proofId: string,
    callback: grpc.requestCallback<VerifyProofReply>,
    onKeyValue?: (kv: KeyValue) => void,
    dotGraphOutputPath?: string
  ): SurfaceCall;
  verifyTrieProof(
    argument: VerifyTrieProofRequest,
    metadataOrOptions?: grpc.Metadata | grpc.CallOptions | null
  ): grpc.ClientReadableStream<VerifyProofReplyChunk>;
  verifyTrieProof(
    argument: VerifyTrieProofRequest,
    metadata?: grpc.Metadata | null,
    options?: grpc.CallOptions | null
  ): grpc.ClientReadableStream<VerifyProofReplyChunk>;
  verifyTrieProof(
    arg1: any,
    arg2: any,
    arg3?: any,
    arg4?: any,
    arg5?: any
  ): any {
    if (typeof arg1 === "string") {
      if (typeof arg3 === "function") {
        return verifyTrieProof(this, arg1, arg2, arg3, arg4, arg5);
      }

      return verifyTrieProofPromise(this, arg1, arg2, arg3, arg4);
    }

    return super.verifyTrieProof(arg1, arg2, arg3);
  }

  createKeyValuesProof(
    trieId: string,
    proofId: string,
    filter: KeyValuesFilter | null,
    outputPath: string
  ): Promise<void>;
  createKeyValuesProof(
    trieId: string,
    proofId: string,
    filter: KeyValuesFilter | null,
    outputPath: string,
    callback: grpc.requestCallback<void>
  ): SurfaceCall;
  createKeyValuesProof(
    argument: CreateKeyValuesProofRequest,
    metadataOrOptions?: grpc.Metadata | grpc.CallOptions | null
  ): grpc.ClientReadableStream<DataChunk>;
  createKeyValuesProof(
    argument: CreateKeyValuesProofRequest,
    metadata?: grpc.Metadata | null,
    options?: grpc.CallOptions | null
  ): grpc.ClientReadableStream<DataChunk>;
  createKeyValuesProof(
    arg1: any,
    arg2?: any,
    arg3?: any,
    arg4?: any,
    arg5?: any
  ): any {
    if (typeof arg1 === "string") {
      if (typeof arg5 === "function") {
        return createKeyValuesProof(this, arg1, arg2, arg3, arg4, arg5);
      }

      return createKeyValuesProofPromise(this, arg1, arg2, arg3, arg4);
    }

    return super.createKeyValuesProof(arg1, arg2, arg3);
  }

  verifyKeyValuesProof(
    path: string,
    outputKeyValues?: boolean,
    dotGraphOutputPath?: string
  ): AsyncIterable<KeyValue | VerifyProofReply>;
  verifyKeyValuesProof(
    path: string,
    callback: grpc.requestCallback<VerifyProofReply>,
    onKeyValue?: (kv: KeyValue) => void,
    dotGraphOutputPath?: string
  ): SurfaceCall;
  verifyKeyValuesProof(
    metadataOrOptions?: grpc.Metadata | grpc.CallOptions | null
  ): grpc.ClientDuplexStream<DataChunk, VerifyProofReplyChunk>;
  verifyKeyValuesProof(
    metadata?: grpc.Metadata | null,
    options?: grpc.CallOptions | null
  ): grpc.ClientDuplexStream<DataChunk, VerifyProofReplyChunk>;
  verifyKeyValuesProof(arg1: any, arg2?: any, arg3?: any, arg4?: any): any {
    if (typeof arg1 === "string") {
      if (typeof arg2 === "function") {
        return verifyKeyValuesProof(this, arg1, arg2, arg3, arg4);
      } else {
        return verifyKeyValuesProofPromise(this, arg1, arg2, arg3);
      }
    }

    return super.verifyKeyValuesProof(arg1, arg2);
  }
}

/**
 * Creates a new API Service client
 */
export function newApiServiceClient(
  hostPort: string,
  authMetadata?: grpc.Metadata,
  secure = true
): APIServiceClient {
  if (!authMetadata) {
    authMetadata = getAuthMetadata();
  }

  const callCreds = grpc.credentials.createFromMetadataGenerator(
    (args: any, callback: any) => {
      callback(null, authMetadata);
    }
  );
  let creds: grpc.ChannelCredentials;

  if (secure) {
    creds = grpc.credentials.combineChannelCredentials(
      grpc.credentials.createSsl(),
      callCreds
    );
  } else {
    creds = grpc.credentials.createInsecure();
    // they don't have a public API to do this: https://github.com/grpc/grpc-node/issues/543
    (creds as any).callCredentials = callCreds;
  }

  return new APIServiceClient(hostPort, creds);
}

export {
  Anchor,
  Batch,
  CreateKeyValuesProofRequest,
  CreateTrieProofRequest,
  DataChunk,
  grpc,
  Key,
  KeyValue,
  KeyValuesFilter,
  RootFilter,
  SetTrieRootRequest,
  Trie,
  TrieKeyValueRequest,
  TrieKeyValuesRequest,
  TrieProof,
  TrieProofRequest,
  TrieProofsRequest,
  TrieRequest,
  TrieRoot,
  TrieRootsRequest,
  VerifyProofReply,
  VerifyProofReplyChunk,
  VerifyTrieProofRequest,
};
