import _ from "lodash";
import fs from "fs";
import * as grpc from "grpc";
import { Empty } from "google-protobuf/google/protobuf/empty_pb";
import { SurfaceCall } from "grpc/build/src/call";
import { APIServiceClient } from "./client";
import {
  pipeFromReadableStream,
  pipeToWritableStream,
  VerifyProofReplyStream,
  CleanupFn,
  Trie,
  TrieRequest,
  KeyValuesFilter,
  CreateKeyValuesProofRequest,
  CreateTrieProofRequest,
  KeyValue,
  VerifyProofReply,
  VerifyTrieProofRequest,
  VerifyKeyValuesProofRequest,
  TrieKeyValuesRequest,
} from "../protos/api";

export function createTrie(
  cli: APIServiceClient,
  callback: grpc.requestCallback<Trie>
): SurfaceCall {
  return cli.createTrie(new Empty(), callback);
}

export function deleteTrie(
  cli: APIServiceClient,
  id: string,
  callback: grpc.requestCallback<Trie>
): SurfaceCall {
  return cli.deleteTrie(TrieRequest.from(id), callback);
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

export function exportTrie(
  cli: APIServiceClient,
  id: string,
  outputPath: string,
  callback: grpc.requestCallback<undefined>
): SurfaceCall {
  const outFile = fs.createWriteStream(outputPath);
  const stream = cli.exportTrie(TrieRequest.from(id));

  pipeToWritableStream(stream, outFile, undefined, (err) => {
    outFile.end();
    callback(err as grpc.ServiceError | null);
  });

  return stream;
}

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

export function createKeyValuesProof(
  cli: APIServiceClient,
  trieId: string,
  proofId: string,
  filter: KeyValuesFilter | null,
  outputPath: string,
  callback: grpc.requestCallback<undefined>
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
