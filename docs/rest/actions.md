# Actions

- [AnchorTrie](#anchortrie)
- [CreateTrie](#createtrie)
- [DeleteItem](#deleteitem)
- [DeleteProof](#deleteproof)
- [DeleteTrie](#deletetrie)
- [GetItem](#getitem)
- [GetItems](#getitems)
- [GetProof](#getproof)
- [GetProofs](#getproofs)
- [GetRoots](#getroots)
- [GetTrie](#gettrie)
- [Prove](#prove)
- [PutItem](#putitem)
- [PutItems](#putitems)
- [Verify](#verify)
- [VerifyProof](#verifyproof)

## AnchorTrie

Creates a new [TrieProof](./types.md#trieproof-type) by submitting the trie for blockchain anchoring.

### HTTP Request

```
POST /tries/{trie-id}/anchor
```

#### Request Query Parameters

| Property | Type | Description |
| :------- | :--- | :---------- |
| anchorType | string | The anchor type. |

#### Response Body

If successful, this method returns a `200 OK` response code and the following properties in the response body.

| Property | Type | Description |
| :------- | :--- | :---------- |
| proof | [TrieProof](./types.md#trieproof-type) | The trie proof submitted for anchoring. |

### Example

#### Request

```
POST /tries/tHYF4XwaujFCO3NBFbPAF0/anchor?anchorType=ETH
```

#### Response

```json
{
    "proof": {
        "id": "pokEUxLX8lswgjjT3OVnWs",
        "trieId": "tHYF4XwaujFCO3NBFbPAF0",
        "root": "0000000000000000000000000000000000000000000000000000000000000000",
        "createdAt": "2020-10-07T06:43:07.700472507Z",
        "status": "BATCHING",
        "anchorType": "ETH",
        "proofRoot": "0000000000000000000000000000000000000000000000000000000000000000"
    }
}
```

## CreateTrie

Creates a new trie.

### HTTP Request

```
POST /tries
```

### Request Body

No request body required.

### Response Body

If successful, this method returns a `201 CREATED` response code.

#### Properties

| Property | Type | Description |
| :------- | :--- | :---------- |
| trie | [Trie](./types.md#trie-type) | The created trie. |

### Example

#### Response

```json
{
    "trie" : {
        "id": "thBGjbeaX3nVh2Zxl3z5gt",
        "root": "0000000000000000000000000000000000000000000000000000000000000000"
    }
}
```

## DeleteItem

Deletes a single [TrieItem](./types.md#trieitem-type) from a trie.

### HTTP Request

```
DELETE /tries/{trie-id}/items/{item-key}
```

### Response Body

If successful, this method returns a `200 OK` response code and the following properties in the response body.

#### Properties

| Property | Type | Description |
| :------- | :--- | :---------- |
| updatedRoot | string | The new root of the trie. |

### Example

#### Request

```
DELETE /tries/tBnXlLjoCI-WgFzjaDxgae/items/key-1
```

#### Response

```json
{
    "updatedRoot": "b28935cba5c8b49d255a9ed59a950179688e79345b5af16f4df7b0abdf4f370b"
}
```

## DeleteProof

Deletes a [TrieProof](./types.md#trieproof-type).

### HTTP Request

```
DELETE /tries/{trie-id}/proofs/{proof-id}
```

### Response Body

If successful, this method returns a `200 OK` response code and the following properties in the response body.

| Property | Type | Description |
| :------- | :--- | :---------- |
| proof | [TrieProof](./types.md#trieproof-type) | The deleted trie proof. |

### Example

### Request

```
DELETE /tries/tAgYKIN6lQ7zIFRD8pCteg/proofs/pekk6DlPqz0QaHzPMuOGcB
```

### Response

```json
{
    "proof": {
        "id": "pekk6DlPqz0QaHzPMuOGcB",
        "trieId": "tAgYKIN6lQ7zIFRD8pCteg",
        "root": "c745c59d907512f3d023ed6e1e654e72e1dfba5422691c434bc3c2432f1472dd",
        "createdAt": "2020-10-07T22:09:53.717798766Z",
        "status": "CONFIRMED",
        "anchorType": "ETH",
        "txnId": "ee2bf8ca4d4000ea39cf8e184319b81f86a0e50fc0034bcfef7f62aebc467d81",
        "txnUri": "https://rinkeby.etherscan.io/tx/0xee2bf8ca4d4000ea39cf8e184319b81f86a0e50fc0034bcfef7f62aebc467d81",
        "blockTime": 1602108624,
        "blockNumber": 7330146,
        "proofRoot": "dad814e53cb616d51ed5a389a8e9a91812051b4102535446c4898131158ed916"
    }
}
```

## DeleteTrie

Deletes a [Trie](./types.md#trie).

### HTTP Request

```
DELETE /tries/{trie-id}
```

### Response Body

If successful, this method returns a `200 OK` response code.

#### Properties

| Property | Type | Description |
| :------- | :--- | :---------- |
| trie | [Trie](./types.md#trie-type) | The deleted trie. |

### Example

#### Response

```json
{
    "trie" : {
        "id": "thBGjbeaX3nVh2Zxl3z5gt",
        "root": "0000000000000000000000000000000000000000000000000000000000000000"
    }
}
``` 

## GetItem

Retrieves a single [TrieItem](./types.md#trieitem-type) from a specific trie.

### HTTP Request

```
GET /tries/{trie-id}/items/{item-key}
```

### Response Body

If successful, this method returns a `200 OK` response code.

#### Properties

| Property | Type | Description |
| :------- | :--- | :---------- |
| item | [TrieItem](./types.md#trie-type) | The trie item. |

### Example

#### Response

```json
{
    "item": [
        {
            "key": "Hello, World!",
            "value": "SGVsbG8sIFdvcmxkIQ=="
        }
    ]
}
```

## GetItems

Retrieves all [TrieItem](./types.md#trieitem-type)'s from a specific trie.

### HTTP Request

```
GET /tries/{trie-id}/items
```

### Response Body

If successful, this method returns a `200 OK` response code and the following properties in the response body.

| Property | Type | Description |
| :------- | :--- | :---------- |
| items | [ ] [TrieItem](./types.md#trie-type) | An array of trie items. |

### Example

#### Response

```json
{
    "items": [
        {
            "key": "Hello, World!",
            "value": "SGVsbG8sIFdvcmxkIQ=="
        }
    ]
}
```

## GetProof

Retrieves a [TrieProof](./types.md#trieproof-type).

### HTTP Request

```
GET /tries/{trie-id}/proofs/{proof-id}
```

### Response Body

If successful, this method returns a `200 OK` response code and the following properties in the response body.

| Property | Type | Description |
| :------- | :--- | :---------- |
| proof | [TrieProof](./types.md#trieproof-type) | The trie proof. |

### Example

### Request

```
GET /tries/tBnXlLjoCI-WgFzjaDxgae/proofs/p1K2Nn0P010xEgzaV524Hk
```

### Response

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

## GetProofs

Retrieve all [TrieProof](./types.md#trieproof-type)'s for a given trie.

### HTTP Request

```
GET /tries/{trie-id}/proofs
```

### Response Body

If successful, this method returns a `200 OK` response code and the following properties in the response body.

| Property | Type | Description |
| :------- | :--- | :---------- |
| proofs | [ ] [TrieProof](./types.md#trieproof-type) | An array of trie proofs for the given trie. |

### Example

#### Request

```
GET /tries/tVoXJnrmXW-BQTQsN-TQjW/proofs
```

#### Response 

```json
{
    "proofs": [
        {
            "id": "p0633loCr2bMfGFSkEw8i-",
            "trieId": "tVoXJnrmXW-BQTQsN-TQjW",
            "root": "3c74322c9dfe3aa6d82f9d5b3642eab9195ad0a25b7e1d28b8d338899a6f338c",
            "createdAt": "2020-09-18T02:11:12.09027431Z",
            "status": "CONFIRMED",
            "anchorType": "ETH",
            "txnId": "291c1e13108c62fc5f4e1c0c09929f1d36259f6386f096882ab92a08bc7b2cea",
            "txnUri": "https://rinkeby.etherscan.io/tx/0x291c1e13108c62fc5f4e1c0c09929f1d36259f6386f096882ab92a08bc7b2cea",
            "blockTime": 1600395098,
            "blockNumber": 7215935,
            "proofRoot": "7ab109a79c9721e6e199cd4545cd5de95bef8ee7032808ae44ec44c4c13dd9cb"
        }
    ]
}
```

## GetRoots

### HTTP Request

```
GET /tries/{trie-id}/roots
```

### Response Body

If successful, this method returns a `200 OK` response code and the following properties.

| Property | Type | Description |
| :------- | :--- | :---------- |
| roots | [ ] [TrieRoot](./types.md#trieroot-type) | An array of roots the trie has. |

### Example

#### Request

```
GET /tries/thBGjbeaX3nVh2Zxl3z5gt/roots
```

#### Response

```json
{
    "roots": [
        {
            "root": "3c74322c9dfe3aa6d82f9d5b3642eab9195ad0a25b7e1d28b8d338899a6f338c",
            "createdAt": "2020-09-17T23:42:04.385479769Z"
        }
    ]
}
```

## GetTrie

Retrieves a [Trie](./types.md#trie-type).

### HTTP Request

```
GET /tries/{trie-id}
```

### Response Body

If successful, this method returns a `200 OK` response code.

#### Properties

| Property | Type | Description |
| :------- | :--- | :---------- |
| trie | [Trie](./types.md#trie-type) | The trie. |


### Example

#### Response

```json
{
    "trie" : {    
        "id": "thBGjbeaX3nVh2Zxl3z5gt",
        "root": "3c74322c9dfe3aa6d82f9d5b3642eab9195ad0a25b7e1d28b8d338899a6f338c"
    }
}
```

## Prove

Anchors a set of key/values to the blockchain and returns a [TrieProof](./types.md#trieproof-type).

### HTTP Request

```
POST /prove
```

### Request Body

#### JSON Representation

```json
{
    "anchorType" : "string",
    "items" : [
        { "key" : "string", "value" : "string (base64)" }
    ]
}
```

#### Properties

| Property | Type | Description |
| :------- | :--- | :---------- |
| anchorType | string | The blockchain anchor type to submit the proof to. One of [ ]. Defaults to **ETH**. |
| items | [ ] [TrieItem](./types.md#trieitem-type) | The array of items to create a proof for. Minimum of 1 item. |

### Response Body

If successful, this method returns a `200 OK` response code and the following properties in the response body.

| Property | Type | Description |
| :------- | :--- | :---------- |
| proof | [TrieProof](./types.md#trieproof-type) | The proof created. |

### Example

#### Request

```
POST /prove
```

```json
{
    "anchorType" : "ETH",
    "items" : [
        { "key" : "Hello, World!", "value" : "SGVsbG8sIFdvcmxkIQ==" }
    ]
}
```

#### Response

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

## PutItem

Adds a single [TrieItem](./types.md#trieitem-type) to a trie.

### HTTP Request

```
POST /tries/{trie-id}/items/{item-key}
```

### Request Body

#### JSON Representation

```json
{
    "value" : "string"
}
```

#### Properties

| Property | Type | Description |
| :------- | :--- | :---------- |
| value | string | The base64 encoded value to add. |

### Response Body

If successful, this method returns a `201 CREATED` response code and the following properties in the response body.

#### Properties

| Property | Type | Description |
| :------- | :--- | :---------- |
| updatedRoot | string | The new root of the trie. |

### Example

```
POST /tries/tBnXlLjoCI-WgFzjaDxgae/items/key-1
```

#### Request

```json
{
    "value" : "SGVsbG8sIFdvcmxkIQ=="
}
```

#### Response

```json
{
    "updatedRoot": "b28935cba5c8b49d255a9ed59a950179688e79345b5af16f4df7b0abdf4f370b"
}
```

## PutItems

Adds [TrieItem](./types.md#trieitem-type)'s to a trie.

### HTTP Request

```
POST /tries/{trie-id}/items
```

### Request Body

#### JSON Representation

```json
{
    "items" : [
        { "key" : "string", "value" : "string (base64)" },
        { "key" : "string", "value" : "string (base64)" }
    ]
}
```

#### Properties

| Property | Type | Description |
| :------- | :--- | :---------- |
| items | [ ] [TrieItem](./types.md#trieitem-type) | An array of items to add. |

### Response Body

If successful, this method returns a `201 CREATED` response code and the following properties in the response body.

#### Properties

| Property | Type | Description |
| :------- | :--- | :---------- |
| updatedRoot | string | The new root of the trie. |

### Example

#### Request

```json
{
    "items" : [
        { "key" : "key-1", "value" : "SGVsbG8s" },
        { "key" : "key-2", "value" : "V29ybGQh" }
    ]
}
```

#### Response

```json
{
    "updatedRoot": "b28935cba5c8b49d255a9ed59a950179688e79345b5af16f4df7b0abdf4f370b"
}
```

## Verify

Verifies an anchored [TrieProof](./types.md#trieproof-type). 

### HTTP Request

```
POST /verify
```

### Request Body

#### JSON Representation

```json
{
    "proofId" : "string",
    "trieId" : "string",
    "outputItems" : true
}
```

#### Properties

| Property | Type | Description |
| :------- | :--- | :---------- |
| outputItems | bool | Optional. Return the items contained in the proof. |
| proofId | string | The anchored proof id of the trie. |
| trieId | string | The trie ID the proof was created for. |

### Response Body

If successful, this method returns a `200 OK` response code and the following properties in the response body.

| Property | Type | Description |
| :------- | :--- | :---------- |
| error | string | An error message if the proof failed verification. |
| items | [ ] [TrieItem](./types.md#trieitem-type) | The array of items that are contained in the proof. |
| proof | [TrieProof](./types.md#trieproof-type) | The proof verified. |
| verified | bool | The status of the proof. |

### Example

#### Request

```json
{
    "proofId" : "p1K2Nn0P010xEgzaV524Hk",
    "trieId" : "tBnXlLjoCI-WgFzjaDxgae",
    "outputItems" : true
}
```

#### Response

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

## VerifyProof

Verifies an anchored [TrieProof](./types.md#trieproof-type).

### HTTP Request

```
GET /tries/{trie-id}/verify/{proof-id}
```

### Optional Query Parameters

| Property | Type | Description |
| :------- | :--- | :---------- |
| outputItems | bool | Optional. Return the items belonging the proof. |

### Response Body

If successful, this method returns a `200 OK` response code and the following properties in the response body.

| Property | Type | Description |
| :------- | :--- | :---------- |
| error | string | An error message if the proof failed verification. |
| items | [ ] [TrieItem](./types.md#trieitem-type) | The array of items that are contained in the proof. |
| proof | [TrieProof](./types.md#trieproof-type) | The proof verified. |
| verified | bool | The status of the proof. |

### Example

#### Request

```
GET /tries/tBnXlLjoCI-WgFzjaDxgae/verify/p1K2Nn0P010xEgzaV524Hk?outputItems=true
```

#### Response

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