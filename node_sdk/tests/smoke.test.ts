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
 * @Date:   2020-06-24T12:34:35+10:00
 * @Last modified by:   guiguan
 * @Last modified time: 2020-07-02T22:50:53+10:00
 */

import fs from "fs";
import {
  APIClient,
  Trie,
  KeyValue,
  TrieProof,
  Anchor,
  Batch,
  VerifyProofReply,
  KeyValuesFilter,
  Key,
  stripCompoundKeyAnchorTriePart,
} from "../src";
import { getTestClient } from "./util";

const SMOKE_PROOF_FILE = "smoke.proofable";
const SMOKE_SUBPROOF_FILE = "smoke.subproofable";

function deleteFile(path: string) {
  try {
    fs.unlinkSync(path);
  } catch {}
}

describe("smoke test", () => {
  let client: APIClient;

  beforeAll(() => {
    client = getTestClient();
  });

  let trie: Trie;

  afterAll(async () => {
    if (client) {
      trie && (await client.deleteTrie(trie.getId()));

      client.close();
    }

    deleteFile(SMOKE_PROOF_FILE);
    deleteFile(SMOKE_SUBPROOF_FILE);
  });

  test("create trie", async () => {
    trie = await client.createTrie();
  });

  test("set trie key-values", async () => {
    trie = await client.setTrieKeyValues(trie.getId(), trie.getRoot(), [
      KeyValue.from("balcony/wind/speed", "11km/h"),
      KeyValue.from("balcony/wind/direction", "N"),
      KeyValue.from("living_room/temp", "24.8℃"),
      KeyValue.from("living_room/Co2", "564ppm"),
    ]);
  });

  let trieProof: TrieProof;

  test("create trie proof", async () => {
    trieProof = await client.createTrieProof(
      trie.getId(),
      trie.getRoot(),
      Anchor.Type.ETH
    );
  });

  test("wait trie proof to be confirmed", async () => {
    for await (const tp of client.subscribeTrieProof(
      trie.getId(),
      trieProof.getId()
    )) {
      trieProof = tp;
    }

    expect(trieProof.getStatus()).toBe(Batch.Status.CONFIRMED);
  }, 60000);

  test("export trie", async () => {
    await client.exportTrie(trie.getId(), SMOKE_PROOF_FILE);
  });

  test("delete trie", async () => {
    await client.deleteTrie(trie.getId());
  });

  test("import trie", async () => {
    await client.importTrie(trie.getId(), SMOKE_PROOF_FILE);
  });

  test("verify trie proof", async () => {
    for await (const val of client.verifyTrieProof(
      trie.getId(),
      trieProof.getId()
    )) {
      if (val instanceof VerifyProofReply) {
        expect(val.getVerified()).toBe(true);
      } else {
        fail("no key-values should be returned");
      }
    }
  });

  test("extract key-value `balcony/wind/speed -> 11km/h` as a subproof", async () => {
    await client.createKeyValuesProof(
      trie.getId(),
      trieProof.getId(),
      KeyValuesFilter.from([Key.from("balcony/wind/speed")]),
      SMOKE_SUBPROOF_FILE
    );
  });

  test("verify subproof", async () => {
    for await (const val of client.verifyKeyValuesProof(
      SMOKE_SUBPROOF_FILE,
      true
    )) {
      if (val instanceof VerifyProofReply) {
        expect(val.getVerified()).toBe(true);
      } else {
        expect(stripCompoundKeyAnchorTriePart(val).to()).toEqual({
          key: "balcony/wind/speed",
          val: "11km/h",
        });
      }
    }
  });
});
