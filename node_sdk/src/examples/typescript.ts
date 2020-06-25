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
 * @Author: Koustubh Gaikwad
 * @Date:   2020-06-19T09:26:20+10:00
 * @Last modified by:   guiguan
 * @Last modified time: 2020-06-25T12:17:32+10:00
 */

import * as grpc from "grpc";
import {
  Anchor,
  Batch,
  getEthTrieFromKeyValuesProof,
  Key,
  KeyValue,
  KeyValuesFilter,
  newApiServiceClient,
  stripCompoundKeyAnchorTriePart,
  Trie,
  VerifyProofReply,
} from "../api";

const API_PROOFABLE_ENDPOINT = "api.dev.proofable.io:443";
const VERIFY_PROOF_DOTGRAPH_FILE = "proof.dot";
const VERIFY_SUBPROOF_DOTGRAPH_FILE = "subproof_verify.dot";

// key-values to be proved
const TRIE_KEY_VALUES = [
  KeyValue.from("balcony/wind/speed", "11km/h"),
  KeyValue.from("balcony/wind/direction", "N"),
  KeyValue.from("living_room/temp", "24.8℃"),
  KeyValue.from("living_room/Co2", "564ppm"),
];

// the key for which the subproof needs to be extracted
const SUBPROOF_KEY = "living_room/Co2";

// setup the Proofable API service client
const metadata = new grpc.Metadata();
metadata.add("authorization", "Bearer magic");
const client = newApiServiceClient(API_PROOFABLE_ENDPOINT, metadata);

// use `npm run example` to run this example
(async () => {
  let trie: Trie | null = null;

  try {
    // create an empty trie
    trie = await client.createTrie();
    console.log("createTrie -> ");
    console.log(trie.toObject());

    // set the key-values we want to prove. Note: the root is changed after we modify
    // the trie
    trie = await client.setTrieKeyValues(
      trie.getId(),
      trie.getRoot(),
      TRIE_KEY_VALUES
    );
    console.log("setTrieKeyValues -> ");
    console.log(trie.toObject());

    // create a proof for the key-values
    let trieProof = await client.createTrieProof(
      trie.getId(),
      trie.getRoot(),
      Anchor.Type.ETH
    );
    console.log("createTrieProof -> ");
    console.log(trieProof.toObject());

    // wait for the proof to be anchored to Ethereum
    for await (const tp of client.subscribeTrieProof(
      trie.getId(),
      trieProof.getId(),
      null
    )) {
      console.log("Anchoring proof: %s", Batch.StatusName[tp.getStatus()]);
      trieProof = tp;
    }

    // verify the proof
    console.log("key-values contained in the proof:");
    for await (const val of client.verifyTrieProof(
      trie.getId(),
      trieProof.getId(),
      true,
      VERIFY_PROOF_DOTGRAPH_FILE
    )) {
      if (val instanceof VerifyProofReply) {
        if (!val.getVerified()) {
          console.error("falsified proof: %s", val.getError());
          return;
        }
      } else {
        // strip the anchor trie part from each key
        const kv = stripCompoundKeyAnchorTriePart(val).to();

        console.log("\t%s -> %s", kv.key, kv.val);
      }
    }

    console.log(
      "\nthe proof with a root hash of %s is anchored to %s in block %s with transaction %s on %s, which can be viewed at %s",
      trieProof.getRoot(),
      Anchor.TypeName[trieProof.getAnchorType()],
      trieProof.getBlockNumber(),
      trieProof.getTxnId(),
      new Date(trieProof.getBlockTime() * 1000).toUTCString(),
      trieProof.getTxnUri()
    );
    console.log(
      "the proof's dot graph is saved to `%s`",
      VERIFY_PROOF_DOTGRAPH_FILE
    );

    // extract a subproof for just one key value out of the proof
    await client.createKeyValuesProof(
      trie.getId(),
      trieProof.getId(),
      KeyValuesFilter.from([Key.from(SUBPROOF_KEY)]),
      SUBPROOF_KEY.replace("/", "-") + ".subproofable"
    );
    console.log(
      "the subproof for the key `%s` is saved to `%s.subproofable`",
      SUBPROOF_KEY,
      SUBPROOF_KEY.replace("/", "-")
    );

    // verify the subproof independently
    console.log("key-values contained in the subproof:");
    for await (const val of client.verifyKeyValuesProof(
      SUBPROOF_KEY.replace("/", "-") + ".subproofable",
      true,
      VERIFY_SUBPROOF_DOTGRAPH_FILE
    )) {
      if (val instanceof VerifyProofReply) {
        if (!val.getVerified()) {
          console.error("falsified subproof: %s", val.getError());
          return;
        }
      } else {
        // strip the anchor trie part from each key
        const kv = stripCompoundKeyAnchorTriePart(val).to();

        console.log("\t%s -> %s", kv.key, kv.val);
      }
    }

    const ethTrie = await getEthTrieFromKeyValuesProof(
      SUBPROOF_KEY.replace("/", "-") + ".subproofable"
    );

    console.log(
      "\nthe subproof with a root hash of %s is anchored to %s in block %s with transaction %s on %s, which can be viewed at %s",
      ethTrie.root,
      ethTrie.anchorType,
      ethTrie.blockNumber,
      ethTrie.txnId,
      new Date(ethTrie.blockTime * 1000).toUTCString(),
      ethTrie.txnUri
    );
    console.log(
      "the subproof's dot graph is saved to `%s`",
      VERIFY_SUBPROOF_DOTGRAPH_FILE
    );
  } catch (err) {
    console.error(err);
  } finally {
    trie && (await client.deleteTrie(trie.getId()));
  }
})();
