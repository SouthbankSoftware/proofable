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
 * @Last modified time: 2020-07-03T00:18:04+10:00
 */

import _ from "lodash";
import * as grpc from "grpc";
import { Empty } from "google-protobuf/google/protobuf/empty_pb";
import { SurfaceCall } from "grpc/build/src/call";
import {
  APIServiceClient,
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
import {
  anchorTrie,
  createTrieFromKeyValues,
  importAndVerifyTrieWithSortedKeyValues,
  ProofVerificationResult,
  verifyKeyValuesProofWithSortedKeyValues,
  verifyTrieWithSortedKeyValues,
} from "./helpers";
import { getAuthMetadata } from "./auth";
import { Timestamp } from "google-protobuf/google/protobuf/timestamp_pb";

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

  namespace RootFilter {
    /**
     * Constructs a root filter. When zero, the oldest TrieProof of current root hash will be
     * returned
     *
     * @param root the root hash. When zero (`""`), the current root hash of the trie will be used
     * to retrieve the TrieProof, and the request will be blocked until all ongoing updates are
     * finished
     * @param notBefore the not before timestamp. When not provided (`undefined`), this constraint
     * is not used, the oldest TrieProof for the root hash will be returned; when zero (epoch, i.e.
     * `new Date(0)`), the latest TrieProof for the root hash will be returned
     */
    function from(root: string, notBefore?: Date): RootFilter;
  }

  namespace TrieProofRequest {
    function from(id: string, query?: string | RootFilter): TrieProofRequest;
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
    keyTo(encoding?: "utf8" | "hex"): string;
    valTo(encoding?: "utf8" | "hex"): string;
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

RootFilter.from = (root, notBefore) => {
  const r = new RootFilter();

  r.setRoot(root);

  if (notBefore) {
    const ts = new Timestamp();

    ts.fromDate(notBefore);

    r.setNotBefore(ts);
  }

  return r;
};

TrieProofRequest.from = (id, query) => {
  const r = new TrieProofRequest();

  r.setTrieId(id);

  if (typeof query === "string") {
    r.setProofId(query);
  } else {
    r.setRootFilter(query);
  }

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
    key: this.keyTo(keyEncoding),
    val: this.valTo(valEncoding),
  };
};

KeyValue.prototype.keyTo = function (encoding) {
  return Buffer.from(this.getKey_asU8()).toString(encoding ?? "utf8");
};

KeyValue.prototype.valTo = function (encoding) {
  return Buffer.from(this.getValue_asU8()).toString(encoding ?? "utf8");
};

export class APIClient extends APIServiceClient {
  /**
   * Gets all tries. Admin privilege is required
   */
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

  /**
   * Gets a trie
   * @param id trie ID
   */
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
   *
   * @param id trie ID
   * @param path the trie input file path
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
   *
   * @param id trie ID
   * @param outputPath output file path
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
   * Creates a new trie with the given key-values
   *
   * @param keyValues the key-values
   */
  createTrieFromKeyValues(
    keyValues: Iterable<KeyValue> | AsyncIterable<KeyValue>
  ): Promise<Trie> {
    return createTrieFromKeyValues(this, keyValues);
  }

  /**
   * Deletes the given trie
   *
   * @param id trie ID
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

  /**
   * Gets the key-values of the trie at the given root. When root is zero (`""`), the current root
   * hash of the trie will be used, and the request will be blocked until all ongoing updates are
   * finished
   *
   * @param id trie ID
   * @param root trie root
   */
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

  /**
   * Get a key-value of the trie at the given root. When root is zero (`""`), the current root hash of
   * the trie will be used, and the request will be blocked until all ongoing updates are finished
   *
   * @param id trie ID
   * @param root trie root
   * @param key the key of the key-value
   */
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

  /**
   * Sets the key-values to the trie. When root is zero (`""`), the current root hash of the trie will
   * be used, and the request will be blocked until all ongoing updates are finished
   *
   * @param id trie ID
   * @param root trie root
   * @param keyValues the key-values
   */
  setTrieKeyValues(
    id: string,
    root: string,
    keyValues: Iterable<KeyValue> | AsyncIterable<KeyValue>
  ): Promise<Trie>;
  setTrieKeyValues(
    id: string,
    root: string,
    keyValues: Iterable<KeyValue>,
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

  /**
   * Gets roots of a trie. This is a series of roots showing the modification history of a trie
   *
   * @param id trie ID
   * @param filter the root filter. When not provided, all [[`TrieRoot`]]s will be returned
   */
  getTrieRoots(id: string, filter?: RootFilter): AsyncIterable<TrieRoot>;
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

  /**
   * Sets the root of a trie to the given one. This will add an entry in the root history
   *
   * @param id trie ID
   * @param root trie root
   */
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

  /**
   * Gets proofs of a trie. The returned [[`TrieProof`]]s will be in chronological order
   *
   * @param id trie ID
   * @param filter the root filter. When not provided, all [[`TrieProof`]]s will be returned
   */
  getTrieProofs(id: string, filter?: RootFilter): AsyncIterable<TrieProof>;
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

  /**
   * Gets a trie proof by either proof ID or root. If by root, the latest proof of that root will be
   * returned
   *
   * @param id trie ID
   * @param query trie proof ID or root filter. When not provided, the oldest [[`TrieProof`]] for
   * current trie root will be returned
   */
  getTrieProof(id: string, query?: string | RootFilter): Promise<TrieProof>;
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
      return getTrieProofPromise(this, arg1, arg2);
    }

    return super.getTrieProof(arg1, arg2, arg3, arg4);
  }

  /**
   * Subscribes to the given trie proof
   *
   * @param id trie ID
   * @param query trie proof ID or root filter. When not provided, the oldest [[`TrieProof`]] for
   * current trie root will be used
   */
  subscribeTrieProof(
    id: string,
    query?: string | RootFilter
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
      return subscribeTrieProofPromise(this, arg1, arg2);
    }

    return super.subscribeTrieProof(arg1, arg2, arg3);
  }

  /**
   * Creates a trie proof for the given trie root. When root is zero (`""`), the current root hash of
   * the trie will be used, and the request will be blocked until all ongoing updates are finished
   *
   * @param id trie Id
   * @param root trie root
   * @param anchorType the anchor type the trie proof should be submitted to. Default: `Anchor.Type.ETH`
   */
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

  /**
   * Anchors the trie at the given root by creating a trie proof and waiting for it to be confirmed
   *
   * @param trie the trie at a root
   * @param anchorType the anchor type the trie proof should be submitted to. Default:
   * `Anchor.Type.ETH`
   * @param outputProgress whether to output the anchoring progress to stdout. Default: `true`
   */
  anchorTrie(
    trie: Trie,
    anchorType?: Anchor.ValueOfType,
    outputProgress?: boolean
  ): Promise<TrieProof> {
    return anchorTrie(this, trie, anchorType, outputProgress);
  }

  /**
   * Deletes a proof for a trie root
   *
   * @param id trie ID
   * @param proofId trie proof ID
   */
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

  /**
   * Verifies the given trie proof
   *
   * @param trieId trie ID
   * @param proofId trie proof ID
   * @param outputKeyValues whether to output key-values contained in the trie. Default: `false`
   * @param dotGraphOutputPath Graphviz Dot Graph output file path. Default: `undefined` (don't output)
   */
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

  /**
   * Verifies the trie at the given root with the original data in sorted stream of key-values. The
   * returned results contain both proof and key-values status
   *
   * @param trie the trie at a root
   * @param sortedKeyValues the original data in sorted stream. You can use [[`sortKeyValues`]] to
   * sort a key-values array
   * @param trieProofQuery trie proof ID or root filter. When not provided, the oldest
   * [[`TrieProof`]] for current trie root will be used
   * @param dotGraphOutputPath Graphviz Dot Graph output file path. Default: `undefined` (don't
   * output)
   */
  verifyTrieWithSortedKeyValues(
    trie: Trie,
    sortedKeyValues: Iterable<KeyValue> | AsyncIterable<KeyValue>,
    trieProofQuery?: string | RootFilter,
    dotGraphOutputPath?: string
  ): Promise<ProofVerificationResult> {
    return verifyTrieWithSortedKeyValues(
      this,
      trie,
      sortedKeyValues,
      trieProofQuery,
      dotGraphOutputPath
    );
  }

  /**
   * Imports a trie and verifies its given root with the original data in sorted stream of
   * key-values. The returned results contain both proof and key-values status
   *
   * @param path the trie input file path
   * @param sortedKeyValues the original data in sorted stream. You can use [[`sortKeyValues`]] to
   * sort a key-values array
   * @param trieProofQuery trie proof ID or root filter. When not provided, the oldest
   * [[`TrieProof`]] for current trie root will be used
   * @param dotGraphOutputPath Graphviz Dot Graph output file path. Default: `undefined` (don't
   * output)
   */
  importAndVerifyTrieWithSortedKeyValues(
    path: string,
    sortedKeyValues: Iterable<KeyValue> | AsyncIterable<KeyValue>,
    trieProofQuery?: string | RootFilter,
    dotGraphOutputPath?: string
  ): Promise<ProofVerificationResult> {
    return importAndVerifyTrieWithSortedKeyValues(
      this,
      path,
      sortedKeyValues,
      trieProofQuery,
      dotGraphOutputPath
    );
  }

  /**
   * Creates a key-values proof for the provided key-values out of the given trie proof
   *
   * @param trieId trie ID
   * @param proofId trie proof ID to base on. When zero (`""`), a new trie proof will be created
   * on-the-fly
   * @param filter the key-values filter (optional). When null or zero, all key-values will be
   * included in the proof
   * @param outputPath the key-values proof output file path
   */
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

  /**
   * Verifies the given key-values proof
   *
   * @param path the key-values proof input file path
   * @param outputKeyValues whether to output key-values contained in the trie. Default: `false`
   * @param dotGraphOutputPath Graphviz Dot Graph output file path. Default: `undefined` (don't output)
   */
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

  /**
   * Verifies the key-values proof with the original data in sorted stream of key-values. The
   * returned results contain both proof and key-values status
   *
   * @param path the key-values proof input file path
   * @param sortedKeyValues the original data in sorted stream. You can use [[`sortKeyValues`]] to
   * sort a key-values array
   * @param dotGraphOutputPath Graphviz Dot Graph output file path. Default: `undefined` (don't
   * output)
   */
  verifyKeyValuesProofWithSortedKeyValues(
    path: string,
    sortedKeyValues: Iterable<KeyValue> | AsyncIterable<KeyValue>,
    dotGraphOutputPath?: string
  ): Promise<ProofVerificationResult> {
    return verifyKeyValuesProofWithSortedKeyValues(
      this,
      path,
      sortedKeyValues,
      dotGraphOutputPath
    );
  }
}

/**
 * Creates a new API Service client
 */
export function newAPIClient(
  hostPort: string,
  authMetadata?: grpc.Metadata,
  secure = true
): APIClient {
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

  return new APIClient(hostPort, creds);
}

export {
  Anchor,
  Batch,
  CreateKeyValuesProofRequest,
  CreateTrieProofRequest,
  DataChunk,
  DeleteTrieProofRequest,
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
