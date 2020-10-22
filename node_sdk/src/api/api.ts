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
 * @Last modified time: 2020-10-22T16:40:24+11:00
 */

import _ from "lodash";
import fs from "fs";
import * as grpc from "grpc";
import { Empty } from "google-protobuf/google/protobuf/empty_pb";
import { SurfaceCall } from "grpc/build/src/call";
import { EventIterator } from "event-iterator";
import { APIClient, Anchor } from "./client";
import {
  CleanupFn,
  CreateKeyValuesProofRequest,
  CreateTrieProofRequest,
  CreateTrieRequest,
  DeleteTrieProofRequest,
  ImportTrieRequest,
  Key,
  KeyValue,
  KeyValuesFilter,
  pipeFromReadableStream,
  pipeToWritableStream,
  RootFilter,
  SetTrieRootRequest,
  SetTrieStorageTypeRequest,
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

export function getTriesPromise(cli: APIClient): AsyncIterable<Trie> {
  return grpcClientReadableStreamToAsyncIterator(cli.getTries(new Empty()));
}

export function getTriePromise(cli: APIClient, id: string): Promise<Trie> {
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
  cli: APIClient,
  id: string,
  path: string,
  callback: grpc.requestCallback<Trie>,
  storageType: Trie.ValueOfStorageType = Trie.StorageType.LOCAL
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
      dc.setImportTrieRequest(ImportTrieRequest.from(id, storageType));
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
  cli: APIClient,
  id: string,
  path: string,
  storageType: Trie.ValueOfStorageType = Trie.StorageType.LOCAL
): Promise<Trie> {
  return new Promise((resolve, reject) => {
    importTrie(
      cli,
      id,
      path,
      (err, value) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(value);
      },
      storageType
    );
  });
}

export function exportTrie(
  cli: APIClient,
  id: string,
  outputPath: string,
  callback: grpc.requestCallback<void>
): SurfaceCall {
  const outFile = fs.createWriteStream(outputPath);
  const stream = cli.exportTrie(TrieRequest.from(id));

  pipeToWritableStream(stream, outFile, undefined, (err) => {
    outFile.end(() => callback(err as grpc.ServiceError | null));
  });

  return stream;
}

export function exportTriePromise(
  cli: APIClient,
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
  cli: APIClient,
  callback: grpc.requestCallback<Trie>,
  storageType: Trie.ValueOfStorageType = Trie.StorageType.LOCAL
): SurfaceCall {
  return cli.createTrie(CreateTrieRequest.from(storageType), callback);
}

export function createTriePromise(
  cli: APIClient,
  storageType: Trie.ValueOfStorageType = Trie.StorageType.LOCAL
): Promise<Trie> {
  return new Promise((resolve, reject) => {
    createTrie(
      cli,
      (err, value) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(value);
      },
      storageType
    );
  });
}

export function deleteTrie(
  cli: APIClient,
  id: string,
  callback: grpc.requestCallback<Trie>
): SurfaceCall {
  return cli.deleteTrie(TrieRequest.from(id), callback);
}

export function deleteTriePromise(cli: APIClient, id: string): Promise<Trie> {
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

export function getTrieKeyValuesPromise(
  cli: APIClient,
  id: string,
  root: string
): AsyncIterable<KeyValue> {
  return grpcClientReadableStreamToAsyncIterator(
    cli.getTrieKeyValues(TrieKeyValuesRequest.from(id, root))
  );
}

export function getTrieKeyValuePromise(
  cli: APIClient,
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

export function setTrieKeyValues(
  cli: APIClient,
  id: string,
  root: string,
  keyValues: Iterable<KeyValue>,
  callback: grpc.requestCallback<Trie>
): SurfaceCall {
  const stream = cli.setTrieKeyValues(callback);

  let first = true;

  for (const kv of keyValues) {
    if (first) {
      first = false;

      kv.setTrieKeyValuesRequest(TrieKeyValuesRequest.from(id, root));
    }

    stream.write(kv);
  }

  stream.end();

  return stream;
}

export async function setTrieKeyValuesPromise(
  cli: APIClient,
  id: string,
  root: string,
  keyValues: Iterable<KeyValue> | AsyncIterable<KeyValue>
): Promise<Trie> {
  return new Promise(async (resolve, reject) => {
    const stream = cli.setTrieKeyValues((err, value) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(value);
    });

    let first = true;

    for await (const kv of keyValues) {
      if (first) {
        first = false;

        kv.setTrieKeyValuesRequest(TrieKeyValuesRequest.from(id, root));
      }

      stream.write(kv);
    }

    stream.end();

    return stream;
  });
}

export async function setTrieStorageTypePromise(
  cli: APIClient,
  id: string,
  storageType: Trie.ValueOfStorageType = Trie.StorageType.LOCAL
): Promise<Trie> {
  return new Promise((resolve, reject) => {
    cli.setTrieStorageType(
      SetTrieStorageTypeRequest.from(id, storageType),
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

export function getTrieRootsPromise(
  cli: APIClient,
  id: string,
  filter?: RootFilter
): AsyncIterable<TrieRoot> {
  return grpcClientReadableStreamToAsyncIterator(
    cli.getTrieRoots(TrieRootsRequest.from(id, filter))
  );
}

export function setTrieRootPromise(
  cli: APIClient,
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
  cli: APIClient,
  id: string,
  filter?: RootFilter
): AsyncIterable<TrieProof> {
  return grpcClientReadableStreamToAsyncIterator(
    cli.getTrieProofs(TrieProofsRequest.from(id, filter))
  );
}

export function getTrieProofPromise(
  cli: APIClient,
  id: string,
  query?: string | RootFilter
): Promise<TrieProof> {
  return new Promise((resolve, reject) => {
    cli.getTrieProof(TrieProofRequest.from(id, query), (err, value) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(value);
    });
  });
}

export function subscribeTrieProofPromise(
  cli: APIClient,
  id: string,
  query?: string | RootFilter
): AsyncIterable<TrieProof> {
  return grpcClientReadableStreamToAsyncIterator(
    cli.subscribeTrieProof(TrieProofRequest.from(id, query))
  );
}

export function createTrieProofPromise(
  cli: APIClient,
  id: string,
  root: string,
  anchorType: Anchor.ValueOfType = Anchor.Type.ETH
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
  cli: APIClient,
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
  cli: APIClient,
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
  cli: APIClient,
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
  cli: APIClient,
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
    outFile.end(() => callback(err as grpc.ServiceError | null));
  });

  return stream;
}

export function createKeyValuesProofPromise(
  cli: APIClient,
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
  cli: APIClient,
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
  cli: APIClient,
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
