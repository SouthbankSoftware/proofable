# Types

- [Trie](#trie-type)
- [TrieItem](#trieitem-type)
- [TrieProof](#trieproof-type)
- [TrieRoot](#trieroot-type)

## Trie type

Here is a JSON representation of a **Trie**.

### JSON Representation

```json
{
  "id" : "string",
  "root" : "string"
}
```

### Properties

| Property | Type | Description |
| :------- | :--- | :---------- |
| id | string | The unique trie id. Read-only. |
| root | string | The current root hash of the trie. Read-write. |

## TrieItem type

### JSON Representation

Here is a JSON representation of a **TrieItem**.

```json
{
    "key" : "string",
    "value" : "string (base64)"
}
```

### Properties

| Property | Type | Description |
| :------- | :--- | :---------- |
| key | string | The unique key. Read-write. |
| value | string | The value assigned to the key. Base64 encoded. Read-write. |

## TrieProof type

### JSON Representation

Here is a JSON representation of a **TrieProof**.

```json
{
    "id": "string",
    "trieId": "string",
    "root": "string",
    "createdAt": "string",
    "status": "string",
    "anchorType": "string",
    "txnId": "string",
    "txnUri": "string",
    "blockTime": 1601931891,
    "blockNumber": 7318373,
    "proofRoot": "string"
}
```

### Properties

| Property | Type | Description |
| :------- | :--- | :---------- |
| id | string | The unique proof id. Read-only. |
| trieId | string | The unique trie id this proof was created on. Read-only. |
| root | string | The root hash of the trie proven by this proof. Read-only. |
| createdAt | string | The timestamp the proof was created at. RFC3339 Format. Read-only. |
| status | string | The proof status. One of \[STARTED, CONFIRMED]. |
| error | string | The error message when status is ERROR. |
| anchorType | string | The anchor type the trie proof has been submitted to. |
| txnId | string | The blockchain transaction ID - once status is CONFIRMED. |
| txnUri | string | The explorer URI for the blockchain transaction - once status is CONFIRMED |
| blockTime | uint64 | The blockchain's block consensus timestamp in seconds - once status is CONFIRMED |
| blockTimeNano | uint64 | The bockcahin's block consensus timestamp's nano part. For most traditional blockchains, this will be zero. For Hedera, this will be the nano part of the transaction's consensus timestamp. |
| blockNumber | uint64 | The blockchain's block number. For Hedera, this will be zero as there is no block concept and each transaction has its own consensus timestamp which defines the transaction order. |
| proofRoot | string | The root hash of the trie proof, which is the anchor batch's root hash the proof belongs to. |

## TrieRoot type

### JSON Representation

Here is a JSON representation of a **TrieRoot**.

```json
{
    "root": "string",
    "createdAt": "string"
}
```

### Properties

| Property | Type | Description |
| :------- | :--- | :---------- |
| root | string | The root hash. Read-only. |
| createdAt | string | The time the root was created. RFC3339 Format. Read-only. |

