# REST

- [Getting Started](#getting-started)
    - [Quick Start](#quick-start)
- [Actions](./actions.md)
- [Types](./types.md)

## Getting Started

The endpoint for Proofable REST API is `https://api.proofable.io/rest`.

### Quick Start

Let's prove and verify **Hello, World!**.

#### [Prove](./actions.md#prove)

First, let's create a POST request to anchor our item to the Ethereum blockchain.
The value provided is the key name encoded in base64. All values that you want
to prove need to be **base64** encoded.
```
POST https://api.proofable.io/rest/prove
```

##### Request Body

```json
{
    "anchorType" : "ETH",
    "items" : [
        { "key" : "Hello, World!", "value" : "SGVsbG8sIFdvcmxkIQ==" }
    ],
}
```

##### Using `curl`

```
curl -d '{ "anchorType" : "ETH", "items" : [ { "key" : "Hello, World!", "value" : "SGVsbG8sIFdvcmxkIQ==" }] }' -H "Authorization: Bearer $YOUR_TOKEN" -H "Content-Type: application/json" -X POST https://api.proofable.io/rest/prove
```

##### Response Body

```json
{
    "proof": {
        "id": "p1K2Nn0P010xEgzaV524Hk",
        "trieId": "tBnXlLjoCI-WgFzjaDxgae",
        "root": "c745c59d907512f3d023ed6e1e654e72e1dfba5422691c434bc3c2432f1472dd",
        "createdAt": "2020-10-07T02:37:08.0056553Z",
        "status": "BATCHING",
        "anchorType": "ETH",
        "proofRoot": "0000000000000000000000000000000000000000000000000000000000000000"
    }
}
```

#### [GetProof](./actions.md#getproof)

In order to verify our newly created proof, we need to wait for it to be confirmed on the blockchain. Make a request to the following
endpoint with your `trieId` and `proofId`.

```
GET https://api.proofable.io/rest/tries/{trie-id}/proofs/{proof-id}
```

##### Using `curl`

```
curl -H "Authorization: Bearer $YOUR_TOKEN" -H "Content-Type: application/json" -X GET https://api.proofable.io/rest/tries/tBnXlLjoCI-WgFzjaDxgae/proofs/p1K2Nn0P010xEgzaV524Hk
```

##### Response Body

```json
{
    "proof": {
        "id": "p1K2Nn0P010xEgzaV524Hk",
        "trieId": "tBnXlLjoCI-WgFzjaDxgae",
        "root": "c745c59d907512f3d023ed6e1e654e72e1dfba5422691c434bc3c2432f1472dd",
        "createdAt": "2020-10-07T02:37:08.0056553Z",
        "status": "CONFIRMED",
        "anchorType": "ETH",
        "txnId": "dc4933c7bf4e4d0b584bed392a8b6067678a001e5137e4780cd55263377394a4",
        "txnUri": "https://rinkeby.etherscan.io/tx/0xdc4933c7bf4e4d0b584bed392a8b6067678a001e5137e4780cd55263377394a4",
        "blockTime": 1602038247,
        "blockNumber": 7325459,
        "proofRoot": "dad814e53cb616d51ed5a389a8e9a91812051b4102535446c4898131158ed916"
    }
}
```

#### [Verify](./actions.md#verify)

Once your proof status is **CONFIRMED**, you a successfully anchored proof and you can now verify it! Simply make a POST request using the
`trieId` and `proofId` you received in the previous step, as well as the item we added, so we can validate
that the value hasn't changed.
 
```
POST https://api.proofable.io/rest/verify
```

##### Request Body

```json
{
    "proofId" : "p1K2Nn0P010xEgzaV524Hk",
    "trieId" : "tBnXlLjoCI-WgFzjaDxgae",
    "outputItems" : true
}
```

##### Using `curl`

```
curl -d '{ "proofId" : "p1K2Nn0P010xEgzaV524Hk", "trieId" : "tBnXlLjoCI-WgFzjaDxgae", "outputItems" : true }' -H "Authorization: Bearer $YOUR_TOKEN" -H "Content-Type: application/json" -X POST https://api.proofable.io/rest/verify
```

##### Response Body

```json
{
    "verified": true,
    "proof": {
        "id": "p1K2Nn0P010xEgzaV524Hk",
        "trieId": "tBnXlLjoCI-WgFzjaDxgae",
        "root": "c745c59d907512f3d023ed6e1e654e72e1dfba5422691c434bc3c2432f1472dd",
        "createdAt": "2020-10-07T02:37:08.0056553Z",
        "status": "CONFIRMED",
        "anchorType": "ETH",
        "txnId": "dc4933c7bf4e4d0b584bed392a8b6067678a001e5137e4780cd55263377394a4",
        "txnUri": "https://rinkeby.etherscan.io/tx/0xdc4933c7bf4e4d0b584bed392a8b6067678a001e5137e4780cd55263377394a4",
        "blockTime": 1602038247,
        "blockNumber": 7325459,
        "proofRoot": "dad814e53cb616d51ed5a389a8e9a91812051b4102535446c4898131158ed916"
    },
    "items": [
        {
            "key": "Hello, World!",
            "value": "SGVsbG8sIFdvcmxkIQ=="
        }
    ]
}
```

Congratulations! You've successfully anchored and verified **Hello, World!**