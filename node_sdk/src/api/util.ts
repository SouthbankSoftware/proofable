import _ from "lodash";
import fs from "fs";
import readline from "readline";
import * as grpc from "grpc";
import { EventIterator } from "event-iterator";
import { EthTrie, defaultEthTrie } from "../proof/eth_trie";
import { KeyValue } from "../protos/api/api_pb";

/**
 * The length of the key separator for the top anchor trie. For normal Proof_ETH_TRIE format, it
 * should be 1; for signed Proof_ETH_TRIE_SIGNED, it should be 2
 */
export let ANCHOR_KEY_SEP_LEN = 1;

/**
 * Strips away the anchor trie part from the compound key. The anchor trie part of a key is added by
 * Anchor Service after a successful anchoring
 */
export function stripCompoundKeyAnchorTriePart(kv: KeyValue): KeyValue {
  const ks = kv.getKeySepList();

  if (ks.length < ANCHOR_KEY_SEP_LEN) {
    return kv;
  }

  kv.setKey(kv.getKey_asU8().slice(ks[ANCHOR_KEY_SEP_LEN - 1]));
  kv.setKeySepList(ks.slice(ANCHOR_KEY_SEP_LEN));

  return kv;
}

export function grpcClientReadableStreamToAsyncIterator<T>(
  stream: grpc.ClientReadableStream<T>
): AsyncIterable<T> {
  return new EventIterator((queue) => {
    stream.addListener("data", queue.push);
    stream.addListener("end", queue.stop);
    stream.addListener("error", queue.fail);

    return () => {
      stream.removeListener("data", queue.push);
      stream.removeListener("end", queue.stop);
      stream.removeListener("error", queue.fail);
      stream.destroy();
    };
  });
}

export async function getEthTrieFromKeyValuesProof(
  path: string
): Promise<EthTrie> {
  const file = fs.createReadStream(path);
  const reader = readline.createInterface({
    input: file,
  });

  const line = await new Promise<string>((resolve) => {
    reader.on("line", (val) => {
      reader.close();
      resolve(val);
    });
  });

  file.close();

  return _.defaults(JSON.parse(line), defaultEthTrie);
}
