# Protocol Documentation

<a name="top"></a>

## Table of Contents

- [api/api.proto](#api/api.proto)
  - [CreateKeyValuesProofRequest](#api.CreateKeyValuesProofRequest)
  - [CreateTrieProofRequest](#api.CreateTrieProofRequest)
  - [DataChunk](#api.DataChunk)
  - [DeleteTrieProofRequest](#api.DeleteTrieProofRequest)
  - [Key](#api.Key)
  - [KeyValue](#api.KeyValue)
  - [KeyValuesFilter](#api.KeyValuesFilter)
  - [RootFilter](#api.RootFilter)
  - [SetTrieRootRequest](#api.SetTrieRootRequest)
  - [Trie](#api.Trie)
  - [TrieKeyValueRequest](#api.TrieKeyValueRequest)
  - [TrieKeyValuesRequest](#api.TrieKeyValuesRequest)
  - [TrieProof](#api.TrieProof)
  - [TrieProofRequest](#api.TrieProofRequest)
  - [TrieProofsRequest](#api.TrieProofsRequest)
  - [TrieRequest](#api.TrieRequest)
  - [TrieRoot](#api.TrieRoot)
  - [TrieRootsRequest](#api.TrieRootsRequest)
  - [VerifyKeyValuesProofRequest](#api.VerifyKeyValuesProofRequest)
  - [VerifyProofReply](#api.VerifyProofReply)
  - [VerifyProofReplyChunk](#api.VerifyProofReplyChunk)
  - [VerifyTrieProofRequest](#api.VerifyTrieProofRequest)

```
- [APIService](#api.APIService)
```

- [Scalar Value Types](#scalar-value-types)

<a name="api/api.proto"></a>

<p align="right"><a href="#top">Top</a></p>

## api/api.proto

<a name="api.CreateKeyValuesProofRequest"></a>

### CreateKeyValuesProofRequest

CreateKeyValuesProofRequest represents a create key-values proof request

| Field    | Type                                                  | Label | Description                                                                                         |
| -------- | ----------------------------------------------------- | ----- | --------------------------------------------------------------------------------------------------- |
| trie_id  | [string](#string)                                     |       | TrieId is the trie ID                                                                               |
| proof_id | [string](#string)                                     |       | ProofId is the trie proof id                                                                        |
| request  | [CreateTrieProofRequest](#api.CreateTrieProofRequest) |       | Request is the request to create a new trie proof that is going to prove the key-values             |
| filter   | [KeyValuesFilter](#api.KeyValuesFilter)               |       | Filter is the key-values filter (optional). When zero, all key-values will be included in the proof |

<a name="api.CreateTrieProofRequest"></a>

### CreateTrieProofRequest

CreateTrieProofRequest represents a create trie proof request

| Field   | Type              | Label | Description                                                                                                                                                                                 |
| ------- | ----------------- | ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| trie_id | [string](#string) |       | TrieId is the trie ID                                                                                                                                                                       |
| root    | [string](#string) |       | Root is the root hash (optional). When zero, the current root hash of the trie will be used to create the TrieProof, and the request will be blocked until all ongoing updates are finished |

<a name="api.DataChunk"></a>

### DataChunk

DataChunk represents a data chunk

| Field                           | Type                                                            | Label | Description                                                             |
| ------------------------------- | --------------------------------------------------------------- | ----- | ----------------------------------------------------------------------- |
| data                            | [bytes](#bytes)                                                 |       | Data is the data within the DataChunk                                   |
| trie_request                    | [TrieRequest](#api.TrieRequest)                                 |       | TrieRequest is the trie request                                         |
| verify_key_values_proof_request | [VerifyKeyValuesProofRequest](#api.VerifyKeyValuesProofRequest) |       | VerifyKeyValuesProofRequest is the request to verify a key-values proof |

<a name="api.DeleteTrieProofRequest"></a>

### DeleteTrieProofRequest

DeleteTrieProofRequest represents a delete trie proof request

| Field    | Type              | Label | Description                  |
| -------- | ----------------- | ----- | ---------------------------- |
| trie_id  | [string](#string) |       | TrieId is the trie ID        |
| proof_id | [string](#string) |       | ProofId is the trie proof ID |

<a name="api.Key"></a>

### Key

Key represents a key

| Field   | Type              | Label    | Description                                    |
| ------- | ----------------- | -------- | ---------------------------------------------- |
| key     | [bytes](#bytes)   |          | Key is the key of the key-value                |
| key_sep | [uint32](#uint32) | repeated | KeySep is the key separators for chained tries |

<a name="api.KeyValue"></a>

### KeyValue

KeyValue represents a key-value

| Field                   | Type                                              | Label    | Description                                                  |
| ----------------------- | ------------------------------------------------- | -------- | ------------------------------------------------------------ |
| key                     | [bytes](#bytes)                                   |          | Key is the key of the key-value                              |
| key_sep                 | [uint32](#uint32)                                 | repeated | KeySep is the key separators for chained tries               |
| value                   | [bytes](#bytes)                                   |          | Value is the value of the key-value                          |
| trie_key_values_request | [TrieKeyValuesRequest](#api.TrieKeyValuesRequest) |          | TrieKeyValuesRequest is the request to set or get key-values |

<a name="api.KeyValuesFilter"></a>

### KeyValuesFilter

KeyValuesFilter represents a key-value filter

| Field | Type            | Label    | Description                                                                                                                                                                 |
| ----- | --------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| keys  | [Key](#api.Key) | repeated | Keys are the keys of key-values that should be included in a key-value proof. Only those trie nodes are on the merkle paths of the given keys will be included in the proof |

<a name="api.RootFilter"></a>

### RootFilter

RootFilter represents a root filter to query a proof

| Field      | Type                                                    | Label | Description                                                                                                                                                                        |
| ---------- | ------------------------------------------------------- | ----- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| root       | [string](#string)                                       |       | Root is the root hash. When zero, the current root hash of the trie will be used to retrieve the TrieProof, and the request will be blocked until all ongoing updates are finished |
| not_before | [google.protobuf.Timestamp](#google.protobuf.Timestamp) |       | NotBefore is the not before timestamp. When nil, this constraint is not used; when zero, the latest TrieProof for the root hash will be returned                                   |

<a name="api.SetTrieRootRequest"></a>

### SetTrieRootRequest

SetTrieRootRequest represents a set trie root request

| Field   | Type              | Label | Description                     |
| ------- | ----------------- | ----- | ------------------------------- |
| trie_id | [string](#string) |       | TrieId is the trie ID           |
| root    | [string](#string) |       | Root is the root hash to set to |

<a name="api.Trie"></a>

### Trie

Trie represents a trie

| Field | Type              | Label | Description                       |
| ----- | ----------------- | ----- | --------------------------------- |
| id    | [string](#string) |       | Id is the trie ID                 |
| root  | [string](#string) |       | Root is the root hash of the trie |

<a name="api.TrieKeyValueRequest"></a>

### TrieKeyValueRequest

TrieKeyValueRequest represents a trie key-value request

| Field   | Type              | Label | Description                                                                                                                                                                                       |
| ------- | ----------------- | ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| trie_id | [string](#string) |       | TrieId is the trie ID                                                                                                                                                                             |
| root    | [string](#string) |       | Root is the root hash (optional). When zero, the current root hash of the trie will be used to retrieve the TrieKeyValues, and the request will be blocked until all ongoing updates are finished |
| key     | [Key](#api.Key)   |       | Key is the key of the key-value                                                                                                                                                                   |

<a name="api.TrieKeyValuesRequest"></a>

### TrieKeyValuesRequest

TrieKeyValuesRequest represents a trie key-values request. The returned
KeyValues are ordered by the keys alphabetically

| Field   | Type              | Label | Description                                                                                                                                                                                       |
| ------- | ----------------- | ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| trie_id | [string](#string) |       | TrieId is the trie ID                                                                                                                                                                             |
| root    | [string](#string) |       | Root is the root hash (optional). When zero, the current root hash of the trie will be used to retrieve the TrieKeyValues, and the request will be blocked until all ongoing updates are finished |

<a name="api.TrieProof"></a>

### TrieProof

TrieProof represents a trie proof

| Field        | Type                                                    | Label | Description                                                                                              |
| ------------ | ------------------------------------------------------- | ----- | -------------------------------------------------------------------------------------------------------- |
| id           | [string](#string)                                       |       | Id is the ID of the trie proof                                                                           |
| trie_id      | [string](#string)                                       |       | Id is the trie ID                                                                                        |
| root         | [string](#string)                                       |       | Root is the root hash of the trie proven by this proof                                                   |
| created_at   | [google.protobuf.Timestamp](#google.protobuf.Timestamp) |       | CreatedAt is the created at timestamp. The timestamp when the proof is created                           |
| status       | [anchor.Batch.Status](#anchor.Batch.Status)             |       | Status is the anchor batch status of the trie proof                                                      |
| error        | [string](#string)                                       |       | Error is the error message when status is ERROR                                                          |
| anchor_type  | [anchor.Anchor.Type](#anchor.Anchor.Type)               |       | AnchorType is the anchor type the trie proof has been submitted to                                       |
| txn_id       | [string](#string)                                       |       | TxnId is the Blockchain transaction ID                                                                   |
| txn_uri      | [string](#string)                                       |       | TxnUri is the explorer URI for the Blockchain transaction                                                |
| block_time   | [uint64](#uint64)                                       |       | BlockTime is the Blockchain's block time                                                                 |
| block_number | [uint64](#uint64)                                       |       | BlockNumber is the Blockchain's block number                                                             |
| proof_root   | [string](#string)                                       |       | ProofRoot is the root hash of the trie proof, which is the anchor batch's root hash the proof belongs to |

<a name="api.TrieProofRequest"></a>

### TrieProofRequest

TrieProofRequest represents a trie proof request

| Field       | Type                          | Label | Description                                                      |
| ----------- | ----------------------------- | ----- | ---------------------------------------------------------------- |
| trie_id     | [string](#string)             |       | TrieId is the trie ID                                            |
| proof_id    | [string](#string)             |       | ProofId is the trie proof ID                                     |
| root_filter | [RootFilter](#api.RootFilter) |       | RootFilter is the root filter. A nil filter equals a zero filter |

<a name="api.TrieProofsRequest"></a>

### TrieProofsRequest

TrieProofsRequest represents a trie proofs request. The returned TrieProofs
are ordered by root alphabetically then by created at timestamp
chronologically

| Field       | Type                          | Label | Description                                                                         |
| ----------- | ----------------------------- | ----- | ----------------------------------------------------------------------------------- |
| trie_id     | [string](#string)             |       | TrieId is the trie ID                                                               |
| root_filter | [RootFilter](#api.RootFilter) |       | RootFilter is the root filter (optional). When nil, all TrieProofs will be returned |

<a name="api.TrieRequest"></a>

### TrieRequest

TrieRequest represents a trie request

| Field   | Type              | Label | Description           |
| ------- | ----------------- | ----- | --------------------- |
| trie_id | [string](#string) |       | TrieId is the trie ID |

<a name="api.TrieRoot"></a>

### TrieRoot

TrieRoot represents a trie root

| Field      | Type                                                    | Label | Description                                                                   |
| ---------- | ------------------------------------------------------- | ----- | ----------------------------------------------------------------------------- |
| root       | [string](#string)                                       |       | Root is the root hash of the trie                                             |
| created_at | [google.protobuf.Timestamp](#google.protobuf.Timestamp) |       | CreatedAt is the created at timestamp. The timestamp when the root is created |

<a name="api.TrieRootsRequest"></a>

### TrieRootsRequest

TrieRootsRequest represents a trie roots request. The returned TrieRoots are
in chronological order

| Field       | Type                          | Label | Description                                                                        |
| ----------- | ----------------------------- | ----- | ---------------------------------------------------------------------------------- |
| trie_id     | [string](#string)             |       | TrieId is the trie ID                                                              |
| root_filter | [RootFilter](#api.RootFilter) |       | RootFilter is the root filter (optional). When nil, all TrieRoots will be returned |

<a name="api.VerifyKeyValuesProofRequest"></a>

### VerifyKeyValuesProofRequest

VerifyKeyValuesProofRequest represents a verify key-values proof request

| Field             | Type          | Label | Description                                                                           |
| ----------------- | ------------- | ----- | ------------------------------------------------------------------------------------- |
| output_key_values | [bool](#bool) |       | OutputKeyValues indicates whether to output key-values contained in the trie          |
| output_dot_graph  | [bool](#bool) |       | OutputDotGraph indicates whether to output a Graphviz dot graph to visualize the trie |

<a name="api.VerifyProofReply"></a>

### VerifyProofReply

VerifyProofReply represents a verify proof reply

| Field    | Type              | Label | Description                                            |
| -------- | ----------------- | ----- | ------------------------------------------------------ |
| verified | [bool](#bool)     |       | Verified indicates whether the proof is verified       |
| error    | [string](#string) |       | Error is the error message when the proof is falsified |

<a name="api.VerifyProofReplyChunk"></a>

### VerifyProofReplyChunk

VerifyProofReplyChunk represents a verify proof reply chunk

| Field           | Type                                      | Label | Description                                                                                            |
| --------------- | ----------------------------------------- | ----- | ------------------------------------------------------------------------------------------------------ |
| key_value       | [KeyValue](#api.KeyValue)                 |       | KeyValue is one of the key-values contained in the trie when the OutputKeyValues is true               |
| dot_graph_chunk | [DataChunk](#api.DataChunk)               |       | DotGraphChunk is a chunk of the Graphviz dot graph for the trie when the OutputDotGraph is true        |
| reply           | [VerifyProofReply](#api.VerifyProofReply) |       | VerifyProofReply is the verify proof reply, which should be the data in the last VerifyProofReplyChunk |

<a name="api.VerifyTrieProofRequest"></a>

### VerifyTrieProofRequest

VerifyTrieProofRequest represents a verify trie proof request

| Field             | Type              | Label | Description                                                                           |
| ----------------- | ----------------- | ----- | ------------------------------------------------------------------------------------- |
| trie_id           | [string](#string) |       | TrieId is the trie ID                                                                 |
| proof_id          | [string](#string) |       | ProofId is the trie proof ID                                                          |
| output_key_values | [bool](#bool)     |       | OutputKeyValues indicates whether to output key-values contained in the trie          |
| output_dot_graph  | [bool](#bool)     |       | OutputDotGraph indicates whether to output a Graphviz dot graph to visualize the trie |

<a name="api.APIService"></a>

### APIService

APIService represents an API service

| Method Name          | Request Type                                                    | Response Type                                              | Description                                                                                                                                       |
| -------------------- | --------------------------------------------------------------- | ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| GetTries             | [.google.protobuf.Empty](#google.protobuf.Empty)                | [Trie](#api.Trie) stream                                   | GetTries gets all tries. Admin privilege is required                                                                                              |
| GetTrie              | [TrieRequest](#api.TrieRequest)                                 | [Trie](#api.Trie)                                          | GetTrie gets a trie                                                                                                                               |
| ImportTrie           | [DataChunk](#api.DataChunk) stream                              | [Trie](#api.Trie)                                          | ImportTrie creates a new trie from existing trie data. If the trie ID is not provided in the metadata, a new one will be generated                |
| ExportTrie           | [TrieRequest](#api.TrieRequest)                                 | [DataChunk](#api.DataChunk) stream                         | ExportTrie exports a trie's data                                                                                                                  |
| CreateTrie           | [.google.protobuf.Empty](#google.protobuf.Empty)                | [Trie](#api.Trie)                                          | CreateTrie creates an empty trie                                                                                                                  |
| DeleteTrie           | [TrieRequest](#api.TrieRequest)                                 | [Trie](#api.Trie)                                          | DeleteTrie deletes a trie. This destroys everything of a trie                                                                                     |
| GetTrieKeyValues     | [TrieKeyValuesRequest](#api.TrieKeyValuesRequest)               | [KeyValue](#api.KeyValue) stream                           | GetTrieKeyValues gets key-values of a trie                                                                                                        |
| GetTrieKeyValue      | [TrieKeyValueRequest](#api.TrieKeyValueRequest)                 | [KeyValue](#api.KeyValue)                                  | GetTrieKeyValue gets a key-value of a trie                                                                                                        |
| SetTrieKeyValues     | [KeyValue](#api.KeyValue) stream                                | [Trie](#api.Trie)                                          | SetTrieKeyValues sets key-values of a trie. Set an empty value for a key to remove that key. Modifications to a trie will change its root hash    |
| GetTrieRoots         | [TrieRootsRequest](#api.TrieRootsRequest)                       | [TrieRoot](#api.TrieRoot) stream                           | GetTrieRoots gets roots of a trie. This is a series of roots showing the modification history of a trie                                           |
| SetTrieRoot          | [SetTrieRootRequest](#api.SetTrieRootRequest)                   | [Trie](#api.Trie)                                          | SetTrieRoot sets the root of a trie to the given one. This will add an entry in the root history                                                  |
| GetTrieProofs        | [TrieProofsRequest](#api.TrieProofsRequest)                     | [TrieProof](#api.TrieProof) stream                         | GetTrieProofs gets proofs of a trie                                                                                                               |
| GetTrieProof         | [TrieProofRequest](#api.TrieProofRequest)                       | [TrieProof](#api.TrieProof)                                | GetTrieProof gets a proof of a trie. When not_before is not provided (either nil or zero), the latest proof will be returned                      |
| SubscribeTrieProof   | [TrieProofRequest](#api.TrieProofRequest)                       | [TrieProof](#api.TrieProof) stream                         | SubscribeTrieProof subscribes to proof changes of a trie. When not_before is not provided (either nil or zero), the latest proof will be returned |
| CreateTrieProof      | [CreateTrieProofRequest](#api.CreateTrieProofRequest)           | [TrieProof](#api.TrieProof)                                | CreateTrieProof creates a proof for a trie root                                                                                                   |
| DeleteTrieProof      | [DeleteTrieProofRequest](#api.DeleteTrieProofRequest)           | [TrieProof](#api.TrieProof)                                | DeleteTrieProof deletes a proof of a trie                                                                                                         |
| VerifyTrieProof      | [VerifyTrieProofRequest](#api.VerifyTrieProofRequest)           | [VerifyProofReplyChunk](#api.VerifyProofReplyChunk) stream | VerifyTrieProof verifies a proof for a trie root                                                                                                  |
| CreateKeyValuesProof | [CreateKeyValuesProofRequest](#api.CreateKeyValuesProofRequest) | [DataChunk](#api.DataChunk) stream                         | CreateKeyValuesProof creates a proof for the provided key-values. The proof is self-contained and can be verified independently                   |
| VerifyKeyValuesProof | [DataChunk](#api.DataChunk) stream                              | [VerifyProofReplyChunk](#api.VerifyProofReplyChunk) stream | VerifyKeyValuesProof verifies a key-values proof                                                                                                  |

## Scalar Value Types

| .proto Type                    | Notes                                                                                                                                           | C++ Type | Java Type  | Python Type |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ---------- | ----------- |
| <a name="double" /> double     |                                                                                                                                                 | double   | double     | float       |
| <a name="float" /> float       |                                                                                                                                                 | float    | float      | float       |
| <a name="int32" /> int32       | Uses variable-length encoding. Inefficient for encoding negative numbers – if your field is likely to have negative values, use sint32 instead. | int32    | int        | int         |
| <a name="int64" /> int64       | Uses variable-length encoding. Inefficient for encoding negative numbers – if your field is likely to have negative values, use sint64 instead. | int64    | long       | int/long    |
| <a name="uint32" /> uint32     | Uses variable-length encoding.                                                                                                                  | uint32   | int        | int/long    |
| <a name="uint64" /> uint64     | Uses variable-length encoding.                                                                                                                  | uint64   | long       | int/long    |
| <a name="sint32" /> sint32     | Uses variable-length encoding. Signed int value. These more efficiently encode negative numbers than regular int32s.                            | int32    | int        | int         |
| <a name="sint64" /> sint64     | Uses variable-length encoding. Signed int value. These more efficiently encode negative numbers than regular int64s.                            | int64    | long       | int/long    |
| <a name="fixed32" /> fixed32   | Always four bytes. More efficient than uint32 if values are often greater than 2^28.                                                            | uint32   | int        | int         |
| <a name="fixed64" /> fixed64   | Always eight bytes. More efficient than uint64 if values are often greater than 2^56.                                                           | uint64   | long       | int/long    |
| <a name="sfixed32" /> sfixed32 | Always four bytes.                                                                                                                              | int32    | int        | int         |
| <a name="sfixed64" /> sfixed64 | Always eight bytes.                                                                                                                             | int64    | long       | int/long    |
| <a name="bool" /> bool         |                                                                                                                                                 | bool     | boolean    | boolean     |
| <a name="string" /> string     | A string must always contain UTF-8 encoded or 7-bit ASCII text.                                                                                 | string   | String     | str/unicode |
| <a name="bytes" /> bytes       | May contain any arbitrary sequence of bytes.                                                                                                    | string   | ByteString | str         |
