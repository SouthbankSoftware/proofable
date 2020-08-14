/* eslint-disable @typescript-eslint/no-var-requires */
//
// Proofable SDK example
// Get some data from an Oracle database, anchor it to a blockchain
// tamper with the database and show that we can detect the tampering
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
 * @Author: Guy Harrison
 * @Date:   2020-07-01
 */

const oracledb = require("oracledb");

oracledb.autoCommit = true;
const proofable = require("proofable");

const anchorType = proofable.Anchor.Type;
const sortKeyValues = proofable.sortKeyValues;
const dataToKeyValues = proofable.dataToKeyValues;

// Define Oracle connections here or in enviroment variables
let ORACLE_USERNAME = "username";
let ORACLE_PASSWORD = "password";
let ORACLE_SERVICE = "oracleService";
if ("ORACLE_PASSWORD" in process.env) {
  ORACLE_PASSWORD = process.env.ORACLE_PASSWORD;
}
if ("ORACLE_USERNAME" in process.env) {
  ORACLE_USERNAME = process.env.ORACLE_USERNAME;
}
if ("ORACLE_SERVICE" in process.env) {
  ORACLE_SERVICE = process.env.ORACLE_SERVICE;
}

const verbose = false;

async function main() {
  try {
    const proofableClient = proofable.newAPIClient("api.proofable.io:443");
    const oraConnection = await oracledb.getConnection({
      user: ORACLE_USERNAME,
      password: ORACLE_PASSWORD,
      connectString: ORACLE_SERVICE,
    });

    const oracleData = await getOracleData(oraConnection);

    // Create a TRIE proof for some data
    const sortedOracleData = sortKeyValues(dataToKeyValues(oracleData));
    const trie = await proofableClient.createTrieFromKeyValues(
      sortedOracleData
    );

    // Anchor that proof to the blockchain
    const trieProof = await proofableClient.anchorTrie(trie, anchorType.HEDERA);
    console.log("trieProof->");
    console.log(trieProof.toObject());

    // Save the trie to disk for use later
    const trieFileName = trie.getId() + ".trie";
    await proofableClient.exportTrie(trieProof.getTrieId(), trieFileName);

    // Validate that proof
    const vp1 = await proofableClient.importAndVerifyTrieWithSortedKeyValues(
      trieFileName,
      sortedOracleData,
      undefined,
      trieFileName + ".dot"
    );

    console.log("Validated proof->", vp1);

    tamperWithTable(oraConnection); // Changes the underlying data
    const newOracleData = await getOracleData(oraConnection);
    const newOracleSortedData = sortKeyValues(dataToKeyValues(newOracleData));
    // Compare the new data to that in the trie
    const vp2 = await proofableClient.importAndVerifyTrieWithSortedKeyValues(
      trieFileName,
      newOracleSortedData,
      undefined,
      trieFileName + ".dot"
    );

    console.log("validate proof after tampering->", vp2);

    proofableClient.close();
  } catch (err) {
    console.log(err.stack);
  }
  process.exit(0);
}

//
// Get Some data from oracle
// NB: We are letting Oracle do the hashing which is not ideal
//
async function getOracleData(oraConnection) {
  const output = {};
  const sqlText = `SELECT to_char(id) id, to_char(ora_hash(concat(CONCAT(id,timestampx ),
                            concat(numdata,logmessagex)))) hash 
                       FROM auditLog`;
  const result = await oraConnection.execute(sqlText);
  // Get the data into the format we like
  result.rows.forEach((row) => {
    output[row[0]] = row[1];
  });
  console.log("Retrieved data from Oracle");
  return output;
}

//
// Change the Oracle data
//
async function tamperWithTable(oraConnection) {
  const sqlText = `
            begin
                update guy.auditLog set numdata=dbms_random.value() where id=1;
                insert into AUDITLOG 
                select  id+0.0000001, timestampx,numdata,logmessagex from GUY.AUDITLOG where id >=2 and id <3;
                delete from AUDITLOG where id >=2 and id <3 and rownum=1;
                commit work;
            end; `;

  const result = await oraConnection.execute(sqlText);
  if (verbose) console.log(result);
  return result;
}
main();
