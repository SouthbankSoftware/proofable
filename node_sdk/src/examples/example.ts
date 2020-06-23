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
 * @Last modified time: 2020-06-23T10:29:27+10:00
 */

import * as grpc from "grpc";
import {
    newApiServiceClient,
    Trie,
    KeyValue,
    TrieProof,
    stripCompoundKeyAnchorTriePart,
    Key,
    RootFilter,
    KeyValuesFilter,
    getEthTrieFromKeyValuesProof,
  } from "../api";

import { Anchor, Batch } from "../protos/anchor/anchor_pb";
import _, { toPairs, keys } from "lodash";
import { stringify } from "querystring";
import { EthTrie } from "../proof/eth_trie";

const metadata = new grpc.Metadata();
metadata.add("authorization", "Bearer magic");
const client = newApiServiceClient("api.dev.proofable.io:443", metadata);

// Delete trie
const cleanup = (id: string) => {
  console.log("cleaning up...");
  client.deleteTrie(id, (err) => {
    if (err) {
      console.error(err);
      return;
    }
});
};


// you can use `npm run example` this run this
(async () => {

  // Create an empty trie
  let trie:Trie;
  try{
      trie = await client.createTrie();
  }
  catch(err){
      console.error(err);
      return;
  }

  console.log("New trie -> ")
  console.log(trie.toObject());

  // Push values into trie
  try{
  trie = await client.setTrieKeyValues(
      trie.getId(),
      trie.getRoot(),
      [
          KeyValue.from("balcony/wind/speed", "11km/h"),
          KeyValue.from("balcony/wind/direction", "N"),
          KeyValue.from("living_room/temp", "24.8℃"),
          KeyValue.from("living_room/Co2", "564ppm"),
        ]
      )
  }
  catch(err){
      console.error(err);
      return cleanup(trie.getId());
  }

  console.log("updated trie -> ")
  console.log(trie.toObject());

  // Create a proof for the existing values
  let trieProof: TrieProof;
  try{
      trieProof = await client.createTrieProof(trie.getId(), trie.getRoot(), Anchor.Type.ETH);
  }
  catch(error){
      console.error(error);
      return cleanup(trie.getId());
  }

  console.log("trieProof -> ")
  console.log(trieProof.toObject())

  // Subscribe to TrieProof
  let trieProofIterable: AsyncIterable<TrieProof>
  try{
    trieProofIterable = client.subscribeTrieProof(trie.getId(), trieProof.getId(), null);
  }
  catch(err){
    console.error(err);
    return cleanup(trie.getId());
  }

  // let trieProofAnchored:TrieProof | undefined;
  for await (const tp of trieProofIterable){
    console.log("Anchoring: " + _.invert(Batch.Status)[tp.getStatus()]);
  //   let trieProofAnchored = tp;
  }
  console.log("end");

  // const iterator = trieProofIterable[Symbol.asyncIterator]()
  // let tp:TrieProof = (await iterator.next()).value as any as TrieProof;
  // console.log("Anchoring: " + _.invert(Batch.Status)[tp.getStatus()]);
  // tp = (await iterator.next()).value as any as TrieProof;
  // console.log("Anchoring: " + _.invert(Batch.Status)[tp.getStatus()]);
  // tp = (await iterator.next()).value as any as TrieProof;
  // console.log("Anchoring: " + _.invert(Batch.Status)[tp.getStatus()]);
  // tp = (await iterator.next()).value as any as TrieProof;
  // console.log("Anchoring: " + _.invert(Batch.Status)[tp.getStatus()]);
  // tp = (await iterator.next()).value as any as TrieProof;
  // console.log("Anchoring: " + _.invert(Batch.Status)[tp.getStatus()]);

  // // verify the proof
  // let verifyProofReply;
  // try{
  //     verifyProofReply = client.verifyTrieProof(
  //         trie.getId(),
  //         trieProof.getId(),
  //         true,
  //         "verify.dot");
  //     }
  // catch(error){
  //     console.error(error);
  //     cleanup(trie.getId());
  // }

  // if(typeof verifyProofReply === "undefined"){
  //   console.error("Got 'undefined` response from verifyTrieProof");
  //   return cleanup(trie.getId());
  // }

  // let verifyProof: any
  // for await (verifyProof of verifyProofReply);

  // if(!verifyProof.getVerified()){
  //   console.error(`falsified proof: ${verifyProof.getError()}`);
  //   return cleanup(trie.getId());
  // }

  // console.log("Proof verified!")
  // console.log("the proof with a root hash of %s is anchored to %s in block %s with transaction %s at %s, which can be viewed at %s",
  //       tp.getProofRoot(),
  //       _.invert(Anchor.Type)[tp.getAnchorType()],
  //       tp.getBlockNumber(),
  //       tp.getTxnId(),
  //       (new Date(tp.getBlockTime() * 1000)).toUTCString(),
  //       tp.getTxnUri(),
  //     )
  // console.log("The proof's dot graph is saved to verify.dot");

  // // extract a subproof for just one key value out of the proof
  // try{
  //   await client.createKeyValuesProof(trie.getId(),trieProof.getId(), KeyValuesFilter.from([Key.from("living_room/Co2")]), "living_room_Co2.pxsubproof");
  // }
  // catch(error){
  //   console.error(error);
  //   return cleanup(trie.getId());
  // }

  // console.log("the subproof for the key `living_room/Co2` is saved to `living_room_Co2.pxsubproof`")

  // // verify the subproof independently
  // for await ( const val of client.verifyKeyValuesProof("living_room_Co2.pxsubproof", true, "living_room_Co2_subproof.dot")){
  //   if (val instanceof KeyValue) {
  //     // within this branch, val is now narrowed down to KeyValue
  //     console.log(stripCompoundKeyAnchorTriePart(val).to("utf8", "utf8"));
  //   } else {
  //     // within this branch, val is now narrowed down to VerifyProofReply
  //     console.log("the subproof is", val.getVerified() ? "valid" : "invalid");
  //   }
  // }

  // let et:EthTrie = await getEthTrieFromKeyValuesProof("living_room_Co2.pxsubproof");
  // console.log(et.trieNodes[0]);
})();
