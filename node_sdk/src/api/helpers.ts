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
 * @Date:   2020-07-02T11:42:17+10:00
 * @Last modified by:   guiguan
 * @Last modified time: 2020-10-22T16:34:34+11:00
 */

import util from "util";
import {
  KeyValue,
  RootFilter,
  Trie,
  TrieProof,
  VerifyProofReply,
} from "../protos/api";
import { getBlockNumberString } from "../protos/anchor";
import { APIClient, Anchor, Batch } from "./client";
import {
  stripCompoundKeyAnchorTriePart,
  getEthTrieFromKeyValuesProof,
} from "./util";
import { diffOrderedKeyValueStreams, KeyValueDiff } from "../diff";

/**
 * Converts a data object to a key-values array
 *
 * @param data the data object. Only own properties will be converted
 */
export function dataToKeyValues(data: Record<string, any>): KeyValue[] {
  const result: KeyValue[] = [];

  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      let val = data[key];

      if (typeof val !== "string") {
        val = JSON.stringify(val);
      }

      result.push(KeyValue.from(key, val));
    }
  }

  return result;
}

/**
 * Sorts the given key-values array in place
 *
 * @param keyValues the key-values array
 */
export function sortKeyValues(keyValues: KeyValue[]): KeyValue[] {
  return keyValues.sort((a, b) =>
    Buffer.compare(a.getKey_asU8(), b.getKey_asU8())
  );
}

export async function createTrieFromKeyValues(
  cli: APIClient,
  keyValues: Iterable<KeyValue> | AsyncIterable<KeyValue>,
  storageType: Trie.ValueOfStorageType = Trie.StorageType.LOCAL
): Promise<Trie> {
  const trie = await cli.createTrie(storageType);

  return cli.setTrieKeyValues(trie.getId(), trie.getRoot(), keyValues);
}

export async function anchorTrie(
  cli: APIClient,
  trie: Trie,
  anchorType: Anchor.ValueOfType = Anchor.Type.ETH,
  outputProgress = true
): Promise<TrieProof> {
  let trieProof = await cli.createTrieProof(
    trie.getId(),
    trie.getRoot(),
    anchorType
  );

  for await (const tp of cli.subscribeTrieProof(
    trie.getId(),
    trieProof.getId()
  )) {
    outputProgress &&
      console.log("Anchoring proof: %s", Batch.StatusName[tp.getStatus()]);
    trieProof = tp;

    if (tp.getStatus() === Batch.Status.ERROR) {
      throw new Error(tp.getError());
    }
  }

  return trieProof;
}

export interface ProofVerificationResult {
  trie?: {
    id: string;
    root: string;
  };
  proof: {
    id?: string;
    verified: boolean;
    error?: string;
    root: string;
    anchorType: string;
    blockNumber: string;
    blockTimeString: string;
    blockTime: number;
    blockTimeNano: number;
    txnId: string;
    txnUri: string;
  };
  keyValues: {
    total: number;
    passed: number;
    changed: string[];
    untracked: string[];
    missing: string[];
  };
}

async function verifyProofWithSortedKeyValues(
  sortedKeyValues: Iterable<KeyValue> | AsyncIterable<KeyValue>,
  verifyStream: AsyncIterable<KeyValue | VerifyProofReply>
): Promise<ProofVerificationResult> {
  const result: ProofVerificationResult = {
    trie: undefined,
    proof: {
      id: undefined,
      verified: false,
      error: undefined,
      root: "",
      anchorType: "",
      blockNumber: "",
      blockTimeString: "",
      blockTime: 0,
      blockTimeNano: 0,
      txnId: "",
      txnUri: "",
    },
    keyValues: {
      total: 0,
      passed: 0,
      changed: [],
      untracked: [],
      missing: [],
    },
  };

  const rightStream = (async function* () {
    for await (const val of verifyStream) {
      if (val instanceof VerifyProofReply) {
        const verified = val.getVerified();

        result.proof.verified = verified;

        if (!verified) {
          result.proof.error = val.getError();
        }
      } else {
        yield stripCompoundKeyAnchorTriePart(val);
      }
    }

    return null;
  })();

  for await (const val of diffOrderedKeyValueStreams(
    sortedKeyValues,
    rightStream
  )) {
    result.keyValues.total++;

    switch (val.type) {
      case KeyValueDiff.Equal: {
        result.keyValues.passed++;

        break;
      }
      case KeyValueDiff.ValueDifferent: {
        result.keyValues.changed.push(val.left!.keyTo());

        break;
      }
      case KeyValueDiff.LeftKeyMissing: {
        result.keyValues.missing.push(val.right!.keyTo());

        break;
      }
      case KeyValueDiff.RightKeyMissing: {
        result.keyValues.untracked.push(val.left!.keyTo());

        break;
      }
      default:
        throw new Error(util.format("unexpected `KeyValueDiff`: %s", val.type));
    }
  }

  return result;
}

function getBlockTimeString(blockTime: number, blockTimeNano: number): string {
  return new Date(blockTime * 1000 + blockTimeNano / 1000).toString();
}

export async function verifyTrieWithSortedKeyValues(
  cli: APIClient,
  trie: Trie,
  sortedKeyValues: Iterable<KeyValue> | AsyncIterable<KeyValue>,
  trieProofQuery?: string | RootFilter,
  dotGraphOutputPath?: string
): Promise<ProofVerificationResult> {
  const tp = await cli.getTrieProof(
    trie.getId(),
    trieProofQuery ?? RootFilter.from(trie.getRoot())
  );

  const result = await verifyProofWithSortedKeyValues(
    sortedKeyValues,
    cli.verifyTrieProof(trie.getId(), tp.getId(), true, dotGraphOutputPath)
  );

  result.trie = {
    id: trie.getId(),
    root: tp.getRoot(),
  };
  result.proof.id = tp.getId();
  result.proof.root = tp.getProofRoot();

  const anchorType = Anchor.TypeName[tp.getAnchorType()];
  const blockTime = tp.getBlockTime();
  const blockTimeNano = tp.getBlockTimeNano();

  result.proof.anchorType = anchorType;
  result.proof.blockNumber = getBlockNumberString(
    anchorType,
    blockTime,
    blockTimeNano,
    tp.getBlockNumber()
  );
  result.proof.blockTimeString = getBlockTimeString(blockTime, blockTimeNano);
  result.proof.blockTime = blockTime;
  result.proof.blockTimeNano = blockTimeNano;
  result.proof.txnId = tp.getTxnId();
  result.proof.txnUri = tp.getTxnUri();

  return result;
}

export async function importAndVerifyTrieWithSortedKeyValues(
  cli: APIClient,
  path: string,
  sortedKeyValues: Iterable<KeyValue> | AsyncIterable<KeyValue>,
  trieProofQuery?: string | RootFilter,
  dotGraphOutputPath?: string
): Promise<ProofVerificationResult> {
  const trie = await cli.importTrie("", path);

  return verifyTrieWithSortedKeyValues(
    cli,
    trie,
    sortedKeyValues,
    trieProofQuery,
    dotGraphOutputPath
  );
}

export async function verifyKeyValuesProofWithSortedKeyValues(
  cli: APIClient,
  path: string,
  sortedKeyValues: Iterable<KeyValue> | AsyncIterable<KeyValue>,
  dotGraphOutputPath?: string
): Promise<ProofVerificationResult> {
  const result = await verifyProofWithSortedKeyValues(
    sortedKeyValues,
    cli.verifyKeyValuesProof(path, true, dotGraphOutputPath)
  );

  const et = await getEthTrieFromKeyValuesProof(path);

  result.proof.root = et.root;

  const anchorType = et.anchorType;
  const blockTime = et.blockTime;
  const blockTimeNano = et.blockTimeNano;

  result.proof.anchorType = anchorType;
  result.proof.blockNumber = getBlockNumberString(
    anchorType,
    blockTime,
    blockTimeNano,
    et.blockNumber
  );
  result.proof.blockTimeString = getBlockTimeString(blockTime, blockTimeNano);
  result.proof.blockTime = blockTime;
  result.proof.blockTimeNano = blockTimeNano;
  result.proof.txnId = et.txnId;
  result.proof.txnUri = et.txnUri;

  return result;
}
