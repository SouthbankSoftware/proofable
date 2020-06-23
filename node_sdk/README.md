# Proofable Node SDK

## Compile Protobuf Definitions

Go to `proofable` project root and `make generate`

## Example

This is a hello world example written in Go that demonstrates how to:

- authenticate with ProvenDB

- prove a bunch of key-values to Ethereum Testnet within a minute

- create a proof for them

- verify the proof

- extract a subproof for just one key-value out of the proof

- verify the subproof independently

The Node SDK is located [here](https://github.com/SouthbankSoftware/proofable/tree/master/node_sdk). It makes accessing `proofable-api` very convenient.

You can find the complete example source code [here](https://github.com/SouthbankSoftware/proofable/blob/master/node_sdk/src/examples/example.ts), which can be run as:

```shell
npm run example
```

### Step 1: Create a gRPC client

The following code creates a gRPC client. You can skip the authentication part while running the example using magic token as specified in the code below.

```typescript
const metadata = new grpc.Metadata();
metadata.add("authorization", "Bearer magic");
const client = newApiServiceClient(API_PROOFABLE_ENDPOINT, metadata);
```

### Step 2: Create an empty trie

This step creates an empty trie which only has a vlid trieID. The root for empty trie will always be `0000000000000000000000000000000000000000000000000000000000000000`

```typescript
let trie:Trie;
trie = await client.createTrie();
```

### Step 3: Set the key-values we want to prove

This step sets a bunch of key-values that we want to prove in the trie we have just created. In this example, the values are set here in this variable at the beginning `TRIE_KEY_VALUES`. Both key and value can be arbitrary binaries. They key order doesn't matter.

```typescript
trie = await client.setTrieKeyValues(
        trie.getId(),
        trie.getRoot(),
        TRIE_KEY_VALUES,
        );
```

When getting key-values from the trie, e.g. [`client.getTrieKeyValues`], they will always be sorted according to the key's alphabetical order. When setting key-values, you can also make multiple [`client.setTrieKeyValues`] calls as a way to build up a large trie incrementally

### Step 4: Create a proof for the key-values

This step creates a proof, a.k.a. trie proof, to prove the trie at the given root to Ethereum ([`ETH`](https://www.proofable.io/docs/anchor.html#anchor.Anchor.Type)). The trie at the given root contains all the key-values we want to prove. When the trie is proven, so are the key-values contained in

```typescript
const trieProof: TrieProof = await client.createTrieProof(trie.getId(), trie.getRoot(), Anchor.Type.ETH);
```

### Step 5: wait for the proof to be anchored to Ethereum

This step waits the proof we have just created until it is anchored to Ethereum testnet, during which we output the anchoring progress

```typescript
const trieProofIterable: AsyncIterable<TrieProof> = client.subscribeTrieProof(trie.getId(), trieProof.getId(), null);
    let trieProofAnchored:TrieProof = new TrieProof();
    for await (const tp of trieProofIterable){
      console.log("Anchoring Proof: " + _.invert(Batch.Status)[tp.getStatus()]);
      trieProofAnchored = tp;
    }
```

### Step 6: Verify the proof

This step verifies the proof we have just created. The verification is supposed to be run at any time after the proof has been created and when we want to make sure our proof is valid as well as retrieving information out from the proof

```typescript
for await(const val of client.verifyTrieProof(trie.getId(), trieProof.getId(), true, VERIFY_PROOF_DOTGRAPH_FILE)){
      if(val instanceof VerifyProofReply){
        if(!val.getVerified()){
          console.error(`falsified proof: ${val.getError()}`);
          return cleanup(trie.getId());
        }
        console.log("Proof Verified!");
      }
    }

    console.log("the proof with a root hash of %s is anchored to %s in block %s with transaction %s at %s, which can be viewed at %s",
          trieProofAnchored.getRoot(),
          _.invert(Anchor.Type)[trieProofAnchored.getAnchorType()],
          trieProofAnchored.getBlockNumber(),
          trieProofAnchored.getTxnId(),
          (new Date(trieProofAnchored.getBlockTime() * 1000)).toUTCString(),
          trieProofAnchored.getTxnUri(),
        )
    console.log(`The proof's dot graph is saved to ${VERIFY_PROOF_DOTGRAPH_FILE}`);
```

This step will output the summary of the proof

```zsh
the proof with a root hash of 9aa9f728c533ea7d7671e227e987b45bf49ae31986ad9c7923e987b518a3c1cf is anchored to ETH in block 6715256 with transaction 8acda892995cffd521a7f16eedadffc6756d198dff83f1c54ea1114d8156fca5 at Tue, 23 Jun 2020 03:51:54 GMT, which can be viewed at https://rinkeby.etherscan.io/tx/0x8acda892995cffd521a7f16eedadffc6756d198dff83f1c54ea1114d8156fca5
```

and a Graphviz Dot Graph (`proof.dot`):

![Proof Dot Graph](docs/images/example_proof.svg)

### Step 7: Extract a subproof for just one key-value out of the proof

This step extracts a subproof, a.k.a. key-values proof, out of the proof we have just created. The subproof proves the key `living_room/Co2` only and nothing else. A subproof file named `living_room_Co2.pxsubproof` will be created in current working directory. You could also create a subproof for multiple key-values

```typescript
const SUBPROOF_KEY = "living_room/Co2";
await client.createKeyValuesProof(trie.getId(),trieProof.getId(), KeyValuesFilter.from([Key.from(SUBPROOF_KEY)]), SUBPROOF_KEY.replace("/", "-") + ".pxsubproof");
```

### Step 9: verify the subproof independently

This step independently verifies the subproof we have just created. The only thing needed in order to verify the subproof is the subproof file itself. The verification is supposed to be run at any time after the subproof has been created and when we want to make sure our subproof is valid as well as retrieving information out from the subproof

```typescript
for await ( const val of client.verifyKeyValuesProof("living_room_Co2.pxsubproof", true, VERIFY_SUBPROOF_DOTGRAPH_FILE)){
      if (val instanceof KeyValue) {
        // within this branch, val is now narrowed down to KeyValue
        console.log(stripCompoundKeyAnchorTriePart(val).to("utf8", "utf8"));
      } else {
        // within this branch, val is now narrowed down to VerifyProofReply
        console.log("the subproof is", val.getVerified() ? "valid" : "invalid");
      }
    }
    console.log(`The subproof's dot graph is saved to ${VERIFY_SUBPROOF_DOTGRAPH_FILE}`);
```

This step will output the key-values contained in the subproof:

```zsh
{ key: 'living_room/Co2', val: '564ppm' }
```

with summary
```typescript
The subproof with a root hash of 4711b3b18e379dbdfabd6440428d20cae5784a518605acec48e126e33383f24e is anchored to undefined in block 6715676 with transaction 13ebc980694b231efee6cdf23c1880f2a790e464af04483bfc55f019f3b6f36f at Tue, 23 Jun 2020 05:36:54 GMT, which can be viewed at https://rinkeby.etherscan.io/tx/0x13ebc980694b231efee6cdf23c1880f2a790e464af04483bfc55f019f3b6f36f
```

and a Graphviz Dot Graph (`living_room_Co2_subproof.dot`):

![Subproof Dot Graph](docs/images/example_subproof.svg)