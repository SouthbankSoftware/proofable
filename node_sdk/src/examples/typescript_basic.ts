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
 * @Date:   2020-07-02T23:16:27+10:00
 * @Last modified by:   guiguan
 * @Last modified time: 2020-07-08T10:51:09+10:00
 */

import _ from "lodash";
import {
  Anchor,
  dataToKeyValues,
  KeyValuesFilter,
  newAPIClient,
  sortKeyValues,
} from "../api";

// Data we want to prove
const DATA = {
  "balcony/wind/speed": "11km/h",
  "balcony/wind/direction": "N",
  "living_room/temp": "24.8℃",
  "living_room/Co2": "564ppm",
};
// Subset of the data we want to prove independently
const SUB_DATA = _.pick(DATA, ["balcony/wind/speed", "living_room/Co2"]);
const TRIE_PATH = "example_trie.proofable";
const KEY_VALUES_PROOF_PATH = "example_key_values_proof.subproofable";

// use `npm run example-basic` to run this example
(async () => {
  // create a Proofable API client. Make sure to use `proofable-cli auth` to sign in/up for the
  // first time
  const client = newAPIClient("api.proofable.io:443");

  let trieId: string | null = null;

  try {
    // converts our data object into a key-values array
    const keyValues = dataToKeyValues(DATA);

    // creates a trie from the key-values iterable
    const trie = await client.createTrieFromKeyValues(keyValues);

    console.dir(trie.toObject());
    trieId = trie.getId();

    // anchors the trie to Ethereum Testnet
    const trieProof = await client.anchorTrie(trie, Anchor.Type.ETH);

    console.dir(trieProof.toObject());

    // exports the trie for later use
    await client.exportTrie(trieId, TRIE_PATH);
  } catch (err) {
    console.error(err);
  } finally {
    // optionally cleanup the trie. If not, the API will eventually garbage collect inactive trie
    trieId && (await client.deleteTrie(trieId));
  }

  try {
    // sorts the original data. This sorting can be done efficiently in real world case, e.g. when
    // querying a database
    const sortedKeyValues = sortKeyValues(dataToKeyValues(DATA));

    // imports and verifies the trie we just exported. The sorted key-values iterable could be a
    // stream
    const result = await client.importAndVerifyTrieWithSortedKeyValues(
      TRIE_PATH,
      sortedKeyValues,
      undefined,
      TRIE_PATH + ".dot"
    );

    console.dir(result);
    trieId = result.trie!.id;

    // converts a subset of our data object into a key-values array
    const subKeyValues = dataToKeyValues(SUB_DATA);

    // creates a key-values proof for the data subset directly from the already proved trie
    await client.createKeyValuesProof(
      trieId,
      result.proof.id!,
      // `KeyValue` can be used as `Key`
      KeyValuesFilter.from(subKeyValues),
      KEY_VALUES_PROOF_PATH
    );
  } catch (err) {
    console.error(err);
  } finally {
    // optionally cleanup the trie. If not, the API will eventually garbage collect inactive trie
    trieId && (await client.deleteTrie(trieId));
  }

  try {
    // sorts the subset of the original data
    const sortedSubKeyValues = sortKeyValues(dataToKeyValues(SUB_DATA));

    // independently verifies the key-values proof we just created. No trie is created
    const result = await client.verifyKeyValuesProofWithSortedKeyValues(
      KEY_VALUES_PROOF_PATH,
      sortedSubKeyValues,
      KEY_VALUES_PROOF_PATH + ".dot"
    );

    console.dir(result);
  } catch (err) {
    console.error(err);
  }
})();
