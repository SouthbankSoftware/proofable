# TypeScript Example

This is a detailed example written in TypeScript that demonstrates how to:

- create a Proofable API client

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

## Step 1: authenticate with ProvenDB

This step will authenticate with ProvenDB so you can access `proofable-api`. When you are successfully authenticated, an access token will be saved to a global location on your machine. On Mac, it is located at `~/Library/Application\ Support/ProvenDB/auth.json`. You can find more etails from [here](https://docs.proofable.io/node_sdk/reference/index.html#getauthmetadata). Please note that this authenticaton method is temporary, which will be replaced by an API key soon

1. download [`proofable-cli`](../cli/installation.md)
2. sign in/up to ProvenDB: `./proofable-cli auth`
3. you are all set. You only need to do this once

## Step 2: create a Proofable API client

This step creates a Proofable API gRPC [`client`](https://docs.proofable.io/node_sdk/reference/classes/_index_.apiclient.html). After using the client, you can destroy the client using [`client.close()`](https://docs.proofable.io/node_sdk/reference/classes/_index_.apiclient.html#close)

```typescript
const client = newAPIClient("api.proofable.io:443");
```

## Step 3: create an empty trie

This step creates an empty [trie](../concepts/trie.md) with root `0000000000000000000000000000000000000000000000000000000000000000`, which is a dictionary that can hold key-values. After using the trie, you can destroy the trie using [`deleteTrie`](https://docs.proofable.io/node_sdk/reference/classes/_index_.apiclient.html#deletetrie) or wait for `proofable-api` to garbage collect it

This creates a local trie (`Trie.StorageType.LOCAL`), which is temporarily persisted in each Proofable API service instance. You can also choose to create a cloud trie with `client.createTrie(Trie.StorageType.CLOUD)`, which will be persisted in Proofable cloud storage. The cloud trie has a much longer retention period and supports high-availability and large data volume. Also, you don't have to consistently export and import cloud tries for manipulations. Proofable talks directly to the cloud storage for you, which is ideal for incrementally building and storing large tries

```typescript
let trie = await client.createTrie();
```

## Step 4: set the key-values we want to prove

This step sets a bunch of key-values that we want to prove in the trie we have just created. In the example, they are my home sensor readings. Both key and value can be arbitrary binaries. They key order doesn't matter. When getting key-values from the trie, e.g. [`getTrieKeyValues`](https://docs.proofable.io/node_sdk/reference/classes/_index_.apiclient.html#gettriekeyvalues), they will always be sorted according to the key's alphabetical order. When setting key-values, you can also make multiple [`setTrieKeyValues`](https://docs.proofable.io/node_sdk/reference/classes/_index_.apiclient.html#settriekeyvalues) calls as a way to build up a large trie incrementally

```typescript
trie = await client.setTrieKeyValues(trie.getId(), trie.getRoot(), [
  KeyValue.from("balcony/wind/speed", "11km/h"),
  KeyValue.from("balcony/wind/direction", "N"),
  KeyValue.from("living_room/temp", "24.8℃"),
  KeyValue.from("living_room/Co2", "564ppm"),
]);
```

## Step 5: create a proof for the key-values

This step creates a proof, a.k.a. trie proof, to prove the trie at the given root to Ethereum ([`ETH`](../grpc/anchor_service.html#anchortype)). Please refer to [this](../concepts/anchor_types.md) for all available anchor types. The trie at the given root contains all the key-values we want to prove. When the trie is proven, so are the key-values contained in

```typescript
let trieProof = await client.createTrieProof(
  trie.getId(),
  trie.getRoot(),
  Anchor.Type.ETH
);
```

## Step 6: wait for the proof to be anchored to Ethereum

This step waits for the proof we have just created until it is anchored to Ethereum, during which we output the anchoring progress

```typescript
for await (const tp of client.subscribeTrieProof(
  trie.getId(),
  trieProof.getId()
)) {
  console.log("Anchoring proof: %s", Batch.StatusName[tp.getStatus()]);
  trieProof = tp;

  if (tp.getStatus() === Batch.Status.ERROR) {
    throw new Error(tp.getError());
  }
}
```

## Step 7: verify the proof

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

## Step 8: extract a subproof for just one key-value out of the proof

This step extracts a subproof, a.k.a. key-values proof, out of the proof we have just created. The subproof proves the key `living_room/Co2` only and nothing else. A subproof file named `living_room_Co2.subproofable` will be created in current working directory. You could also create a subproof for multiple key-values

```typescript
await client.createKeyValuesProof(
  trie.getId(),
  trieProof.getId(),
  KeyValuesFilter.from([Key.from("living_room/Co2")]),
  "living_room_Co2.subproofable"
);
```

## Step 9: verify the subproof independently

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
