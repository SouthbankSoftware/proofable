# [Proofable Node SDK](https://github.com/SouthbankSoftware/proofable/tree/master/node_sdk)

[Proofable Node SDK](https://github.com/SouthbankSoftware/proofable/tree/master/node_sdk) provides a set of basic promise-based APIs as well as more advanced callback and stream based APIs. The promise-based APIs are convenient to be consumed in most use cases when dealing with the API Service in [Proofable Framework](https://www.proofable.io/), while the callback and stream based APIs support more advanced features such as canceling and per-call gRPC options.

## Example

This is a hello world example written in TypeScript that demonstrates how to:

- create a gRPC client

- prove a bunch of key-values to Ethereum Testnet within a minute

- create a proof for them

- verify the proof

- extract a subproof for just one key-value out of the proof

- verify the subproof independently

You can find the complete example source code [here](https://github.com/SouthbankSoftware/proofable/blob/master/node_sdk/src/examples/typescript.ts), which can be run as:

```zsh
npm run example
```

You can also find the Javascript version [here](https://github.com/SouthbankSoftware/proofable/blob/master/node_sdk/src/examples/javascript.js), which can be run as:

```zsh
npm run example-js
```

### Step 1: create a gRPC client

This step creates a gRPC [`client`](https://www.proofable.io/node_sdk/docs/classes/_api_client_.apiserviceclient.html). Note: here we use a magic token to authenticate with `proofable-api` for testing purpose, which will be changed soon

```typescript
const metadata = new grpc.Metadata();
metadata.add("authorization", "Bearer magic");

const client = newApiServiceClient(
  "https://apigateway.dev.provendb.com",
  metadata
);
```

### Step 2: create an empty trie

This step creates an empty trie with root `0000000000000000000000000000000000000000000000000000000000000000`, which is a dictionary that can hold key-values. After using the trie, you should destroy the trie using [`deleteTrie`](https://www.proofable.io/node_sdk/docs/classes/_api_client_.apiserviceclient.html#deletetrie) or wait for `proofable-api` to garbage collect it

```typescript
let trie = await client.createTrie();
```

### Step 3: set the key-values we want to prove

This step sets a bunch of key-values that we want to prove in the trie we have just created. In the example, they are my home sensor readings. Both key and value can be arbitrary binaries. They key order doesn't matter. When getting key-values from the trie, e.g. [`getTrieKeyValues`](https://www.proofable.io/node_sdk/docs/classes/_api_client_.apiserviceclient.html#gettriekeyvalues), they will always be sorted according to the key's alphabetical order. When setting key-values, you can also make multiple [`setTrieKeyValues`](https://www.proofable.io/node_sdk/docs/classes/_api_client_.apiserviceclient.html#settriekeyvalues) calls as a way to build up a large trie incrementally

```typescript
trie = await client.setTrieKeyValues(trie.getId(), trie.getRoot(), [
  KeyValue.from("balcony/wind/speed", "11km/h"),
  KeyValue.from("balcony/wind/direction", "N"),
  KeyValue.from("living_room/temp", "24.8℃"),
  KeyValue.from("living_room/Co2", "564ppm"),
]);
```

### Step 4: create a proof for the key-values

This step creates a proof, a.k.a. trie proof, to prove the trie at the given root to Ethereum ([`ETH`](https://www.proofable.io/docs/anchor.html#anchor.Anchor.Type)). The trie at the given root contains all the key-values we want to prove. When the trie is proven, so are the key-values contained in

```typescript
let trieProof = await client.createTrieProof(
  trie.getId(),
  trie.getRoot(),
  Anchor.Type.ETH
);
```

### Step 5: wait for the proof to be anchored to Ethereum

This step waits for the proof we have just created until it is anchored to Ethereum, during which we output the anchoring progress

```typescript
for await (const tp of client.subscribeTrieProof(
  trie.getId(),
  trieProof.getId(),
  null
)) {
  console.log("Anchoring proof: %s", Batch.StatusName[tp.getStatus()]);
  trieProof = tp;
}
```

### Step 6: verify the proof

This step verifies the proof we have just created. The verification is supposed to be run at any time after the proof has been created and when we want to make sure our proof is valid as well as retrieving information out from the proof

```typescript
for await (const val of client.verifyTrieProof(
  trie.getId(),
  trieProof.getId(),
  true,
  "proof.dot"
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
```

This step will output the key-values contained in the proof:

```zsh
balcony/wind/direction -> N
balcony/wind/speed -> 11km/h
living_room/Co2 -> 564ppm
living_room/temp -> 24.8℃
```

and a summary:

```zsh
the proof with a root hash of 4711b3b18e379dbdfabd6440428d20cae5784a518605acec48e126e33383f24e is anchored to ETH in block 6231667 with transaction 8e26def59e1a7289e6c322bc49ee4f23f015c17cebafa53c19b6e34561270232 at Tue, 31 Mar 2020 15:33:10 AEDT, which can be viewed at https://rinkeby.etherscan.io/tx/0x8e26def59e1a7289e6c322bc49ee4f23f015c17cebafa53c19b6e34561270232
```

and a Graphviz Dot Graph (`proof.dot`):

![Proof Dot Graph](https://github.com/SouthbankSoftware/proofable/raw/master/docs/images/example_proof.svg)

### Step 7: extract a subproof for just one key-value out of the proof

This step extracts a subproof, a.k.a. key-values proof, out of the proof we have just created. The subproof proves the key `living_room/Co2` only and nothing else. A subproof file named `living_room_Co2.subproofable` will be created in current working directory. You could also create a subproof for multiple key-values

```typescript
await client.createKeyValuesProof(
  trie.getId(),
  trieProof.getId(),
  KeyValuesFilter.from([Key.from("living_room/Co2")]),
  "living_room_Co2.subproofable"
);
```

### Step 8: verify the subproof independently

This step independently verifies the subproof we have just created. The only thing needed in order to verify the subproof is the subproof file itself. The verification is supposed to be run at any time after the subproof has been created and when we want to make sure our subproof is valid as well as retrieving information out from the subproof

```typescript
for await (const val of client.verifyKeyValuesProof(
  "living_room_Co2.subproofable",
  true,
  "living_room_Co2_subproof.dot"
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
  "living_room_Co2.subproofable"
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
```

This step will output the key-values contained in the subproof:

```zsh
living_room/Co2 -> 564ppm
```

and a summary:

```zsh
the subproof with a root hash of 4711b3b18e379dbdfabd6440428d20cae5784a518605acec48e126e33383f24e is anchored to ETH in block 6231667 with transaction 8e26def59e1a7289e6c322bc49ee4f23f015c17cebafa53c19b6e34561270232 at Tue, 31 Mar 2020 15:33:10 AEDT, which can be viewed at https://rinkeby.etherscan.io/tx/0x8e26def59e1a7289e6c322bc49ee4f23f015c17cebafa53c19b6e34561270232
```

and a Graphviz Dot Graph (`living_room_Co2_subproof.dot`):

![Subproof Dot Graph](https://github.com/SouthbankSoftware/proofable/raw/master/docs/images/example_subproof.svg)
