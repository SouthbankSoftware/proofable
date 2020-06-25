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
 * @Date:   2020-06-24T12:14:57+10:00
 * @Last modified by:   guiguan
 * @Last modified time: 2020-06-25T16:18:32+10:00
 */

import _ from "lodash";
import fs from "fs";
import * as grpc from "grpc";
import { Empty } from "google-protobuf/google/protobuf/empty_pb";
import { SurfaceCall } from "grpc/build/src/call";
import { EventIterator } from "event-iterator";
import { APIServiceClient, Anchor } from "./client";
import {
  CleanupFn,
  CreateKeyValuesProofRequest,
  CreateTrieProofRequest,
  DeleteTrieProofRequest,
  Key,
  KeyValue,
  KeyValuesFilter,
  pipeFromReadableStream,
  pipeToWritableStream,
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
  VerifyKeyValuesProofRequest,
  VerifyProofReply,
  VerifyProofReplyStream,
  VerifyTrieProofRequest,
} from "../protos/api";
import { grpcClientReadableStreamToAsyncIterator } from "./util";

export function getTriesPromise(cli: APIServiceClient): AsyncIterable<Trie> {
  return grpcClientReadableStreamToAsyncIterator(cli.getTries(new Empty()));
}

export function getTriePromise(
  cli: APIServiceClient,
  id: string
): Promise<Trie> {
  return new Promise((resolve, reject) => {
    cli.getTrie(TrieRequest.from(id), (err, value) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(value);
    });
  });
}

export function importTrie(
  cli: APIServiceClient,
  id: string,
  path: string,
  callback: grpc.requestCallback<Trie>
): SurfaceCall {
  const inFile = fs.createReadStream(path);

  // we use the first error
  let cleanup: CleanupFn, er: grpc.ServiceError;

  const stream = cli.importTrie((err, value) => {
    // the error could come from here
    er = er || err;

    if (er) {
      cleanup(er);
      callback(er);
      return;
    }

    callback(null, value);
  });

  cleanup = pipeFromReadableStream(
    inFile,
    stream,
    (dc) => {
      dc.setTrieRequest(TrieRequest.from(id));
    },
    (err) => {
      // and here
      er = er || err;

      stream.end();
    }
  );

  return stream;
}

export function importTriePromise(
  cli: APIServiceClient,
  id: string,
  path: string
): Promise<Trie> {
  return new Promise((resolve, reject) => {
    importTrie(cli, id, path, (err, value) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(value);
    });
  });
}

export function exportTrie(
  cli: APIServiceClient,
  id: string,
  outputPath: string,
  callback: grpc.requestCallback<void>
): SurfaceCall {
  const outFile = fs.createWriteStream(outputPath);
  const stream = cli.exportTrie(TrieRequest.from(id));

  pipeToWritableStream(stream, outFile, undefined, (err) => {
    outFile.end();
    callback(err as grpc.ServiceError | null);
  });

  return stream;
}

export function exportTriePromise(
  cli: APIServiceClient,
  id: string,
  outputPath: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    exportTrie(cli, id, outputPath, (err) => {
      if (err) {
        reject(err);
        return;
      }

      resolve();
    });
  });
}

export function createTrie(
  cli: APIServiceClient,
  callback: grpc.requestCallback<Trie>
): SurfaceCall {
  return cli.createTrie(new Empty(), callback);
}

export function createTriePromise(cli: APIServiceClient): Promise<Trie> {
  return new Promise((resolve, reject) => {
    createTrie(cli, (err, value) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(value);
    });
  });
}

export function deleteTrie(
  cli: APIServiceClient,
  id: string,
  callback: grpc.requestCallback<Trie>
): SurfaceCall {
  return cli.deleteTrie(TrieRequest.from(id), callback);
}

export function deleteTriePromise(
  cli: APIServiceClient,
  id: string
): Promise<Trie> {
  return new Promise((resolve, reject) => {
    deleteTrie(cli, id, (err, value) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(value);
    });
  });
}

/**
 *
 * @param cli
 * @param id
 * @param root
 * getTrieKeyValuesPromise gets the key-values of the trie at the given root. When root is zero (""), the current root hash of the trie will be used, and the request will be blocked until all ongoing updates are finished
 */
export function getTrieKeyValuesPromise(
  cli: APIServiceClient,
  id: string,
  root: string
): AsyncIterable<KeyValue> {
  return grpcClientReadableStreamToAsyncIterator(
    cli.getTrieKeyValues(TrieKeyValuesRequest.from(id, root))
  );
}

export function getTrieKeyValuePromise(
  cli: APIServiceClient,
  id: string,
  root: string,
  key: Key
): Promise<KeyValue> {
  return new Promise((resolve, reject) => {
    cli.getTrieKeyValue(
      TrieKeyValueRequest.from(id, root, key),
      (err, value) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(value);
      }
    );
  });
}

/**
 *
 * @param cli
 * @param id
 * @param root
 * @param iter
 * @param callback
 * SetTrieKeyValues sets the key-values to the trie. When root is zero (""), the current root hash of the trie will be used, and the request will be blocked until all ongoing updates are finished
 */
export function setTrieKeyValues(
  cli: APIServiceClient,
  id: string,
  root: string,
  iter: Iterable<KeyValue>,
  callback: grpc.requestCallback<Trie>
): SurfaceCall {
  const stream = cli.setTrieKeyValues(callback);

  let first = true;

  for (const kv of iter) {
    if (first) {
      first = false;

      kv.setTrieKeyValuesRequest(TrieKeyValuesRequest.from(id, root));
    }

    stream.write(kv);
  }

  stream.end();

  return stream;
}

/**
 *
 * @param cli
 * @param id
 * @param root
 * @param iter
 *  SetTrieKeyValuesPromise sets the key-values to the trie. When root is zero (""), the current root hash of the trie will be used, and the request will be blocked until all ongoing updates are finished
 */
export function setTrieKeyValuesPromise(
  cli: APIServiceClient,
  id: string,
  root: string,
  iter: Iterable<KeyValue>
): Promise<Trie> {
  return new Promise((resolve, reject) => {
    cli.setTrieKeyValues(id, root, iter, (err, value) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(value);
    });
  });
}

export function getTrieRootsPromise(
  cli: APIServiceClient,
  id: string,
  filter: RootFilter | null
): AsyncIterable<TrieRoot> {
  return grpcClientReadableStreamToAsyncIterator(
    cli.getTrieRoots(TrieRootsRequest.from(id, filter ?? undefined))
  );
}

export function setTrieRootPromise(
  cli: APIServiceClient,
  id: string,
  root: string
): Promise<Trie> {
  return new Promise((resolve, reject) => {
    cli.setTrieRoot(SetTrieRootRequest.from(id, root), (err, value) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(value);
    });
  });
}

export function getTrieProofsPromise(
  cli: APIServiceClient,
  id: string,
  filter: RootFilter | null
): AsyncIterable<TrieProof> {
  return grpcClientReadableStreamToAsyncIterator(
    cli.getTrieProofs(TrieProofsRequest.from(id, filter ?? undefined))
  );
}

export function getTrieProofPromise(
  cli: APIServiceClient,
  id: string,
  proofId: string,
  filter: RootFilter | null
): Promise<TrieProof> {
  return new Promise((resolve, reject) => {
    cli.getTrieProof(
      TrieProofRequest.from(id, proofId, filter ?? undefined),
      (err, value) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(value);
      }
    );
  });
}

export function subscribeTrieProofPromise(
  cli: APIServiceClient,
  id: string,
  proofId: string,
  filter: RootFilter | null
): AsyncIterable<TrieProof> {
  return grpcClientReadableStreamToAsyncIterator(
    cli.subscribeTrieProof(
      TrieProofRequest.from(id, proofId, filter ?? undefined)
    )
  );
}

export function createTrieProofPromise(
  cli: APIServiceClient,
  id: string,
  root: string,
  anchorType: Anchor.ValueOfType = 0
): Promise<TrieProof> {
  return new Promise((resolve, reject) => {
    cli.createTrieProof(
      CreateTrieProofRequest.from(id, root, anchorType),
      (err, value) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(value);
      }
    );
  });
}

export function deleteTrieProofPromise(
  cli: APIServiceClient,
  id: string,
  proofId: string
): Promise<TrieProof> {
  return new Promise((resolve, reject) => {
    cli.deleteTrieProof(
      DeleteTrieProofRequest.from(id, proofId),
      (err, value) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(value);
      }
    );
  });
}

export function verifyTrieProof(
  cli: APIServiceClient,
  trieId: string,
  proofId: string,
  callback: grpc.requestCallback<VerifyProofReply>,
  onKeyValue?: (kv: KeyValue) => void,
  dotGraphOutputPath?: string
): SurfaceCall {
  const request = new VerifyTrieProofRequest();

  request.setTrieId(trieId);
  request.setProofId(proofId);
  onKeyValue && request.setOutputKeyValues(true);
  dotGraphOutputPath && request.setOutputDotGraph(true);

  const stream = cli.verifyTrieProof(request);

  const rs = new VerifyProofReplyStream(stream, callback, onKeyValue);

  if (dotGraphOutputPath) {
    const outFile = fs.createWriteStream(dotGraphOutputPath);

    pipeToWritableStream(rs.dataStream, outFile, undefined, () => {
      outFile.end();
    });
  }

  return stream;
}

export function verifyTrieProofPromise(
  cli: APIServiceClient,
  trieId: string,
  proofId: string,
  outputKeyValues = false,
  dotGraphOutputPath?: string
): AsyncIterable<KeyValue | VerifyProofReply> {
  return new EventIterator((queue) => {
    const sc = verifyTrieProof(
      cli,
      trieId,
      proofId,
      (err, reply) => {
        if (err) {
          queue.fail(err);
          return;
        }

        queue.push(reply!);
        queue.stop();
      },
      outputKeyValues ? queue.push : undefined,
      dotGraphOutputPath
    );

    return sc.cancel;
  });
}

export function createKeyValuesProof(
  cli: APIServiceClient,
  trieId: string,
  proofId: string,
  filter: KeyValuesFilter | null,
  outputPath: string,
  callback: grpc.requestCallback<void>
): SurfaceCall {
  const outFile = fs.createWriteStream(outputPath);

  const request = new CreateKeyValuesProofRequest();

  request.setTrieId(trieId);

  if (filter) {
    request.setFilter(filter);
  }

  if (proofId) {
    request.setProofId(proofId);
  } else {
    const r = new CreateTrieProofRequest();

    r.setTrieId(trieId);

    request.setRequest(r);
  }

  const stream = cli.createKeyValuesProof(request);

  pipeToWritableStream(stream, outFile, undefined, (err) => {
    outFile.end();
    callback(err as grpc.ServiceError | null);
  });

  return stream;
}

export function createKeyValuesProofPromise(
  cli: APIServiceClient,
  trieId: string,
  proofId: string,
  filter: KeyValuesFilter | null,
  outputPath: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    cli.createKeyValuesProof(trieId, proofId, filter, outputPath, (err) => {
      if (err) {
        reject(err);
        return;
      }

      resolve();
    });
  });
}

export function verifyKeyValuesProof(
  cli: APIServiceClient,
  path: string,
  callback: grpc.requestCallback<VerifyProofReply>,
  onKeyValue?: (kv: KeyValue) => void,
  dotGraphOutputPath?: string
): SurfaceCall {
  const inFile = fs.createReadStream(path);

  const stream = cli.verifyKeyValuesProof();

  callback = _.once(callback);

  pipeFromReadableStream(
    inFile,
    stream,
    (dc) => {
      const request = new VerifyKeyValuesProofRequest();

      onKeyValue && request.setOutputKeyValues(true);
      dotGraphOutputPath && request.setOutputDotGraph(true);

      dc.setVerifyKeyValuesProofRequest(request);
    },
    (err) => {
      if (err) {
        callback(err);
        return;
      }

      stream.end();
    }
  );

  const rs = new VerifyProofReplyStream(stream, callback, onKeyValue);

  if (dotGraphOutputPath) {
    const outFile = fs.createWriteStream(dotGraphOutputPath);

    pipeToWritableStream(rs.dataStream, outFile, undefined, () => {
      outFile.end();
    });
  }

  return stream;
}

export function verifyKeyValuesProofPromise(
  cli: APIServiceClient,
  path: string,
  outputKeyValues = false,
  dotGraphOutputPath?: string
): AsyncIterable<KeyValue | VerifyProofReply> {
  return new EventIterator((queue) => {
    const sc = verifyKeyValuesProof(
      cli,
      path,
      (err, reply) => {
        if (err) {
          queue.fail(err);
          return;
        }

        queue.push(reply!);
        queue.stop();
      },
      outputKeyValues ? queue.push : undefined,
      dotGraphOutputPath
    );

    return sc.cancel;
  });
}
