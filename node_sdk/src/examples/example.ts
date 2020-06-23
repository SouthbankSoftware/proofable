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
 * @Last modified by:   Koustubh Gaikwad
 * @Last modified time: 2020-06-23T15:47:10+10:00
 */

import * as grpc from "grpc";
import {
    newApiServiceClient,
    Trie,
    KeyValue,
    TrieProof,
    stripCompoundKeyAnchorTriePart,
    Key,
    KeyValuesFilter,
    getEthTrieFromKeyValuesProof,
    VerifyProofReply,
  } from "../api";

import { Anchor, Batch } from "../protos/anchor/anchor_pb";
import _ from "lodash";
import { EthTrie } from "../proof/eth_trie";

const API_PROOFABLE_ENDPOINT="api.dev.proofable.io:443";
const VERIFY_PROOF_DOTGRAPH_FILE="proof.dot";
const VERIFY_SUBPROOF_DOTGRAPH_FILE="subproof_verify.dot";

// Values that need to be proved
const TRIE_KEY_VALUES = [
  KeyValue.from("balcony/wind/speed", "11km/h"),
  KeyValue.from("balcony/wind/direction", "N"),
  KeyValue.from("living_room/temp", "24.8℃"),
  KeyValue.from("living_room/Co2", "564ppm"),
];

// The key for which the subproof needs to be extracted
const SUBPROOF_KEY = "living_room/Co2";

const metadata = new grpc.Metadata();
metadata.add("authorization", "Bearer magic");
const client = newApiServiceClient(API_PROOFABLE_ENDPOINT, metadata);

const cleanup = async (id: string) => {
  try{
    await client.deleteTrie(id);
  }
  catch(err){
    console.error(err);
    return
  }
};


// you can use `npm run example` this run this
(async () => {

  // Create an empty trie
  let trie:Trie;

  trie = await client.createTrie();
  console.log("New trie -> ")
  console.log(trie.toObject());

  // Push values into trie
  try{
    trie = await client.setTrieKeyValues(
        trie.getId(),
        trie.getRoot(),
        TRIE_KEY_VALUES,
        );
    console.log("updated trie -> ")
    console.log(trie.toObject());

    // Create a proof for the existing values
    const trieProof: TrieProof = await client.createTrieProof(trie.getId(), trie.getRoot(), Anchor.Type.ETH);

    console.log("trieProof -> ")
    console.log(trieProof.toObject())

    // Subscribe to TrieProof
    const trieProofIterable: AsyncIterable<TrieProof> = client.subscribeTrieProof(trie.getId(), trieProof.getId(), null);
    let trieProofAnchored:TrieProof = new TrieProof();
    for await (const tp of trieProofIterable){
      console.log("Anchoring Proof: " + _.invert(Batch.Status)[tp.getStatus()]);
      trieProofAnchored = tp;
    }

    // Verify Proof
    for await(const val of client.verifyTrieProof(trie.getId(), trieProof.getId(), true, VERIFY_PROOF_DOTGRAPH_FILE)){
      if(val instanceof VerifyProofReply){
        if(!val.getVerified()){
          console.error(`falsified proof: ${val.getError()}`);
          return cleanup(trie.getId());
        }
        console.log("Proof Verified!");
      }
    }

    console.log("\nThe proof with a root hash of %s is anchored to %s in block %s with transaction %s on %s, which can be viewed at %s",
          trieProofAnchored.getRoot(),
          _.invert(Anchor.Type)[trieProofAnchored.getAnchorType()],
          trieProofAnchored.getBlockNumber(),
          trieProofAnchored.getTxnId(),
          (new Date(trieProofAnchored.getBlockTime() * 1000)).toUTCString(),
          trieProofAnchored.getTxnUri(),
        )
    console.log(`The proof's dot graph is saved to ${VERIFY_PROOF_DOTGRAPH_FILE}`);

    // extract a subproof for just one key value out of the proof
    await client.createKeyValuesProof(trie.getId(),trieProof.getId(), KeyValuesFilter.from([Key.from(SUBPROOF_KEY)]), SUBPROOF_KEY.replace("/", "-") + ".pxsubproof");
    console.log(`\nThe subproof for the key ${SUBPROOF_KEY} is saved to ${SUBPROOF_KEY.replace("/", "-")}.pxsubproof`)

    // verify the subproof independently
    for await ( const val of client.verifyKeyValuesProof(SUBPROOF_KEY.replace("/", "-") + ".pxsubproof", true, VERIFY_SUBPROOF_DOTGRAPH_FILE)){
      if (val instanceof KeyValue) {
        // within this branch, val is now narrowed down to KeyValue
        console.log(stripCompoundKeyAnchorTriePart(val).to("utf8", "utf8"));
      } else {
        // within this branch, val is now narrowed down to VerifyProofReply
        console.log("The subproof is", val.getVerified() ? "valid" : "invalid");
      }
    }
    const et:EthTrie = await getEthTrieFromKeyValuesProof(SUBPROOF_KEY.replace("/", "-") + ".pxsubproof")

    console.log("The subproof with a root hash of %s is anchored to %s in block %s with transaction %s on %s, which can be viewed at %s",
          et.root,
          et.anchorType,
          et.blockNumber,
          et.txnId,
          (new Date(et.blockTime * 1000)).toUTCString(),
          et.txnUri,
        )
    console.log(`The subproof's dot graph is saved to ${VERIFY_SUBPROOF_DOTGRAPH_FILE}`);

  }
  catch(err){
    console.log(err);
  }
  finally{
    cleanup(trie.getId());
  }
})();
