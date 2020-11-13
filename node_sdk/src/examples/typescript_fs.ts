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
 * @Date:   2020-11-13T17:27:56+11:00
 * @Last modified by:   guiguan
 * @Last modified time: 2020-11-13T17:34:12+11:00
 */

import fs from "fs";
import path from "path";
import { sha3 } from "../hasher"; // from "proofable/dist/hasher"
import { Anchor, newAPIClient, sortKeyValues, KeyValue } from "../api"; // from "proofable"

const DIR_PATH = "src/examples";
const PROOF_PATH = "mydir.proofable";

function hashDirectory(dirPath: string): KeyValue[] {
  const keyValues: KeyValue[] = [];

  // hash the files in the directory into key-value pairs where each key is a file path and each
  // value is the file's SHA3 hash
  fs.readdirSync(dirPath).forEach((f) => {
    const filePath = path.join(dirPath, f);
    const fileData = fs.readFileSync(filePath);
    const fileHash = sha3(fileData);

    keyValues.push(KeyValue.from(filePath, fileHash, "utf8", "hex"));
  });

  return keyValues;
}

// use `npm run example-fs` to run this example
(async () => {
  // create a Proofable API client. Make sure to use `proofable-cli auth` to sign in/up for the
  // first time
  const client = newAPIClient("api.proofable.io:443");

  let trieId: string | null = null;

  if (!fs.existsSync(PROOF_PATH)) {
    // create a proof for the directory if it doesn't exist yet
    try {
      const keyValues = hashDirectory(DIR_PATH);

      // creates a trie from the key-values iterable
      const trie = await client.createTrieFromKeyValues(keyValues);

      console.dir(trie.toObject());
      trieId = trie.getId();

      // anchors the trie to Ethereum Testnet
      const trieProof = await client.anchorTrie(trie, Anchor.Type.ETH);

      console.dir(trieProof.toObject());

      // exports the trie for later use
      await client.exportTrie(trieId, PROOF_PATH);
    } catch (err) {
      console.error(err);
    } finally {
      // optionally cleanup the trie. If not, the API will eventually garbage collect inactive trie
      trieId && (await client.deleteTrie(trieId));
    }
  }

  trieId = null;

  // anytime in the future, you can use the following logic to verify the proof for the directory
  try {
    // rehash the directory, which will be used to compare with the information stored in the proof
    let keyValues = hashDirectory(DIR_PATH);

    // make sure we sort it
    keyValues = sortKeyValues(keyValues);

    // imports and verifies the key values against the proof
    const result = await client.importAndVerifyTrieWithSortedKeyValues(
      PROOF_PATH,
      keyValues,
      undefined,
      PROOF_PATH + ".dot"
    );

    console.dir(result);
    trieId = result.trie!.id;
  } catch (err) {
    console.error(err);
  } finally {
    // optionally cleanup the trie. If not, the API will eventually garbage collect inactive trie
    trieId && (await client.deleteTrie(trieId));
  }
})();
