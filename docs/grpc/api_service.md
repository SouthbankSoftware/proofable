# API Service
API Service is a general purpose proving service that is fast and effective.
It provides a set of APIs to manipulate trie structures and generate
blockchain proofs for any digital assets. A trie is a dictionary of
key-values that can be built incrementally, whose root hash at any given time
can be also dervied efficiently. Once the root hash is proven to a
blockchain, every key-value is also proven, so as the digital asset stored in
that key-value

Protobuf definition: [api/api.proto](https://github.com/SouthbankSoftware/proofable/blob/master/pkg/protos/api/api.proto)

## Table of Contents
- [APIService](#apiservice)
- [CreateKeyValuesProofRequest](#createkeyvaluesproofrequest)
- [CreateTrieProofRequest](#createtrieproofrequest)
- [CreateTrieRequest](#createtrierequest)
- [DataChunk](#datachunk)
- [DeleteTrieProofRequest](#deletetrieproofrequest)
- [ImportTrieRequest](#importtrierequest)
- [Key](#key)
- [KeyValue](#keyvalue)
- [KeyValuesFilter](#keyvaluesfilter)
- [RootFilter](#rootfilter)
- [SetTrieRootRequest](#settrierootrequest)
- [SetTrieStorageTypeRequest](#settriestoragetyperequest)
- [Trie](#trie)
- [TrieKeyValueRequest](#triekeyvaluerequest)
- [TrieKeyValuesRequest](#triekeyvaluesrequest)
- [TrieProof](#trieproof)
- [TrieProofRequest](#trieproofrequest)
- [TrieProofsRequest](#trieproofsrequest)
- [TrieRequest](#trierequest)
- [TrieRoot](#trieroot)
- [TrieRootsRequest](#trierootsrequest)
- [VerifyKeyValuesProofRequest](#verifykeyvaluesproofrequest)
- [VerifyProofReply](#verifyproofreply)
- [VerifyProofReplyChunk](#verifyproofreplychunk)
- [VerifyTrieProofRequest](#verifytrieproofrequest)
- [Trie.StorageType](#triestoragetype)
- [Scalar Value Types](#scalar-value-types)


### APIService


| Method Name | Request Type | Response Type | Description |
| ----------- | ------------ | ------------- | ------------|
| GetTries | [google.protobuf.Empty](https://developers.google.com/protocol-buffers/docs/reference/google.protobuf#google.protobuf.Empty) | [Trie](#trie) stream | GetTries gets all tries. Admin privilege is required |
| GetTrie | [TrieRequest](#trierequest) | [Trie](#trie) | GetTrie gets a trie |
| ImportTrie | [DataChunk](#datachunk) stream | [Trie](#trie) | ImportTrie creates a new trie from existing trie data. If the trie ID is not provided in the metadata, a new one will be generated |
| ExportTrie | [TrieRequest](#trierequest) | [DataChunk](#datachunk) stream | ExportTrie exports a trie's data |
| CreateTrie | [CreateTrieRequest](#createtrierequest) | [Trie](#trie) | CreateTrie creates an empty trie |
| DeleteTrie | [TrieRequest](#trierequest) | [Trie](#trie) | DeleteTrie deletes a trie. This destroys everything of a trie |
| GetTrieKeyValues | [TrieKeyValuesRequest](#triekeyvaluesrequest) | [KeyValue](#keyvalue) stream | GetTrieKeyValues gets key-values of a trie. The returned KeyValues are ordered by the keys lexicographically |
| GetTrieKeyValue | [TrieKeyValueRequest](#triekeyvaluerequest) | [KeyValue](#keyvalue) | GetTrieKeyValue gets a key-value of a trie |
| SetTrieKeyValues | [KeyValue](#keyvalue) stream | [Trie](#trie) | SetTrieKeyValues sets key-values of a trie. Set an empty value for a key to remove that key. Modifications to a trie will change its root hash |
| GetTrieRoots | [TrieRootsRequest](#trierootsrequest) | [TrieRoot](#trieroot) stream | GetTrieRoots gets roots of a trie. This is a series of roots showing the modification history of a trie |
| SetTrieRoot | [SetTrieRootRequest](#settrierootrequest) | [Trie](#trie) | SetTrieRoot sets the root of a trie to the given one. This will add an entry in the root history |
| SetTrieStorageType | [SetTrieStorageTypeRequest](#settriestoragetyperequest) | [Trie](#trie) | SetTrieStorageType sets the storage type of a trie |
| GetTrieProofs | [TrieProofsRequest](#trieproofsrequest) | [TrieProof](#trieproof) stream | GetTrieProofs gets proofs of a trie |
| GetTrieProof | [TrieProofRequest](#trieproofrequest) | [TrieProof](#trieproof) | GetTrieProof gets a proof of a trie. When not_before is not provided (either nil or zero), the latest proof will be returned |
| SubscribeTrieProof | [TrieProofRequest](#trieproofrequest) | [TrieProof](#trieproof) stream | SubscribeTrieProof subscribes to proof changes of a trie. When not_before is not provided (either nil or zero), the latest proof will be returned |
| CreateTrieProof | [CreateTrieProofRequest](#createtrieproofrequest) | [TrieProof](#trieproof) | CreateTrieProof creates a proof for a trie root |
| DeleteTrieProof | [DeleteTrieProofRequest](#deletetrieproofrequest) | [TrieProof](#trieproof) | DeleteTrieProof deletes a proof for a trie root |
| VerifyTrieProof | [VerifyTrieProofRequest](#verifytrieproofrequest) | [VerifyProofReplyChunk](#verifyproofreplychunk) stream | VerifyTrieProof verifies a proof for a trie root |
| CreateKeyValuesProof | [CreateKeyValuesProofRequest](#createkeyvaluesproofrequest) | [DataChunk](#datachunk) stream | CreateKeyValuesProof creates a proof for the provided key-values out of a trie proof. The new proof is self-contained and can be verified independently |
| VerifyKeyValuesProof | [DataChunk](#datachunk) stream | [VerifyProofReplyChunk](#verifyproofreplychunk) stream | VerifyKeyValuesProof verifies a key-values proof |

 <!-- end services -->


### CreateKeyValuesProofRequest
CreateKeyValuesProofRequest represents a create key-values proof request


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| trie_id | [string](#string) |  | TrieId is the trie ID |
| proof_id | [string](#string) |  | ProofId is the trie proof id |
| request | [CreateTrieProofRequest](#createtrieproofrequest) |  | Request is the request to create a new trie proof that is going to prove the key-values |
| filter | [KeyValuesFilter](#keyvaluesfilter) |  | Filter is the key-values filter (optional). When zero, all key-values will be included in the proof |





### CreateTrieProofRequest
CreateTrieProofRequest represents a create trie proof request


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| trie_id | [string](#string) |  | TrieId is the trie ID |
| root | [string](#string) |  | Root is the root hash (optional). When zero, the current root hash of the trie will be used to create the TrieProof, and the request will be blocked until all ongoing updates are finished |
| anchor_type | [anchor.Anchor.Type](anchor_service.html#anchortype) |  | AnchorType is the anchor type the trie proof should be submitted to. Default to ETH |





### CreateTrieRequest
CreateTrieRequest represents a create trie request


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| storage_type | [Trie.StorageType](#triestoragetype) |  | StorageType is the storage type of the trie to be created |





### DataChunk
DataChunk represents a chunk of data transmitted in a gRPC stream


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| data | [bytes](#bytes) |  | Data is the data within the DataChunk |
| import_trie_request | [ImportTrieRequest](#importtrierequest) |  | ImportTrieRequest is the import trie request |
| verify_key_values_proof_request | [VerifyKeyValuesProofRequest](#verifykeyvaluesproofrequest) |  | VerifyKeyValuesProofRequest is the request to verify a key-values proof |





### DeleteTrieProofRequest
DeleteTrieProofRequest represents a delete trie proof request


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| trie_id | [string](#string) |  | TrieId is the trie ID |
| proof_id | [string](#string) |  | ProofId is the trie proof ID |





### ImportTrieRequest
ImportTrieRequest represents an import trie request


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| trie_id | [string](#string) |  | TrieId is the trie ID |
| storage_type | [Trie.StorageType](#triestoragetype) |  | StorageType is the storage type of the trie |





### Key
Key represents a key of a key-value pair


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| key | [bytes](#bytes) |  | Key is the key of the key-value |
| key_sep | [uint32](#uint32) | repeated | KeySep is the key separators for chained tries |





### KeyValue
KeyValue represents a key-value


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| key | [bytes](#bytes) |  | Key is the key of the key-value |
| key_sep | [uint32](#uint32) | repeated | KeySep is the key separators for chained tries |
| value | [bytes](#bytes) |  | Value is the value of the key-value |
| trie_key_values_request | [TrieKeyValuesRequest](#triekeyvaluesrequest) |  | TrieKeyValuesRequest is the request to set or get key-values |





### KeyValuesFilter
KeyValuesFilter represents a key-value filter


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| keys | [Key](#key) | repeated | Keys are the keys of key-values that should be included in a key-value proof. Only those trie nodes are on the merkle paths of the given keys will be included in the proof |





### RootFilter
RootFilter represents a root filter to query a proof


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| root | [string](#string) |  | Root is the root hash. When zero, the current root hash of the trie will be used to retrieve the TrieProof, and the request will be blocked until all ongoing updates are finished |
| not_before | [google.protobuf.Timestamp](https://developers.google.com/protocol-buffers/docs/reference/google.protobuf#google.protobuf.Timestamp) |  | NotBefore is the not before timestamp. When nil, this constraint is not used; when zero, the latest TrieProof for the root hash will be returned |





### SetTrieRootRequest
SetTrieRootRequest represents a set trie root request


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| trie_id | [string](#string) |  | TrieId is the trie ID |
| root | [string](#string) |  | Root is the root hash to set to |





### SetTrieStorageTypeRequest
SetTrieStorageTypeRequest represents a set trie storage type request


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| trie_id | [string](#string) |  | TrieId is the trie ID |
| storage_type | [Trie.StorageType](#triestoragetype) |  | StorageType is the storage type of the trie to be updated to |





### Trie
Trie represents a dictionary of key-values that can be built incrementally,
whose root hash at any given time can be also dervied efficiently. Once the
root hash is proven to a blockchain, every key-value is also proven


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [string](#string) |  | Id is the trie ID |
| root | [string](#string) |  | Root is the root hash of the trie |
| storage_type | [Trie.StorageType](#triestoragetype) |  | StorageType is the storage type of the trie |





### TrieKeyValueRequest
TrieKeyValueRequest represents a trie key-value request


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| trie_id | [string](#string) |  | TrieId is the trie ID |
| root | [string](#string) |  | Root is the root hash (optional). When zero, the current root hash of the trie will be used to retrieve the TrieKeyValues, and the request will be blocked until all ongoing updates are finished |
| key | [Key](#key) |  | Key is the key of the key-value |





### TrieKeyValuesRequest
TrieKeyValuesRequest represents a trie key-values request. The returned
KeyValues are ordered by the keys lexicographically


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| trie_id | [string](#string) |  | TrieId is the trie ID |
| root | [string](#string) |  | Root is the root hash (optional). When zero, the current root hash of the trie will be used to retrieve the TrieKeyValues, and the request will be blocked until all ongoing updates are finished |





### TrieProof
TrieProof represents a proof for a trie at a certain root, which can be
viewed as a snapshot of all the key-values contained in the trie


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [string](#string) |  | Id is the ID of the trie proof |
| trie_id | [string](#string) |  | TrieId is the trie ID |
| root | [string](#string) |  | Root is the root hash of the trie proven by this proof |
| created_at | [google.protobuf.Timestamp](https://developers.google.com/protocol-buffers/docs/reference/google.protobuf#google.protobuf.Timestamp) |  | CreatedAt is the created at timestamp. The timestamp when the proof is created |
| status | [anchor.Batch.Status](anchor_service.html#batchstatus) |  | Status is the anchor batch status of the trie proof |
| error | [string](#string) |  | Error is the error message when status is ERROR |
| anchor_type | [anchor.Anchor.Type](anchor_service.html#anchortype) |  | AnchorType is the anchor type the trie proof has been submitted to |
| txn_id | [string](#string) |  | TxnId is the blockchain transaction ID |
| txn_uri | [string](#string) |  | TxnUri is the explorer URI for the blockchain transaction |
| block_time | [uint64](#uint64) |  | BlockTime is the blockchain's block consensus timestamp in seconds |
| block_time_nano | [uint64](#uint64) |  | BlockTimeNano is the Blockcahin's block consensus timestamp's nano part. For most traditional blockchains, this will be zero. For Hedera, this will be the nano part of the transaction's consensus timestamp |
| block_number | [uint64](#uint64) |  | BlockNumber is the blockchain's block number. For Hedera, this will be zero as there is no block concept and each transaction has its own consensus timestamp which defines the transaction order |
| proof_root | [string](#string) |  | ProofRoot is the root hash of the trie proof, which is the anchor batch's root hash the proof belongs to |





### TrieProofRequest
TrieProofRequest represents a trie proof request


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| trie_id | [string](#string) |  | TrieId is the trie ID |
| proof_id | [string](#string) |  | ProofId is the trie proof ID |
| root_filter | [RootFilter](#rootfilter) |  | RootFilter is the root filter. A nil filter equals a zero filter |





### TrieProofsRequest
TrieProofsRequest represents a trie proofs request. The returned TrieProofs
are ordered by root lexicographically then by created at timestamp
chronologically


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| trie_id | [string](#string) |  | TrieId is the trie ID |
| root_filter | [RootFilter](#rootfilter) |  | RootFilter is the root filter (optional). When nil, all TrieProofs will be returned |





### TrieRequest
TrieRequest represents a trie request


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| trie_id | [string](#string) |  | TrieId is the trie ID |





### TrieRoot
TrieRoot represents a root of a trie. Each modification made to the trie will
lead to a new trie root


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| root | [string](#string) |  | Root is the root hash of the trie |
| created_at | [google.protobuf.Timestamp](https://developers.google.com/protocol-buffers/docs/reference/google.protobuf#google.protobuf.Timestamp) |  | CreatedAt is the created at timestamp. The timestamp when the root is created |





### TrieRootsRequest
TrieRootsRequest represents a trie roots request. The returned TrieRoots are
in chronological order


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| trie_id | [string](#string) |  | TrieId is the trie ID |
| root_filter | [RootFilter](#rootfilter) |  | RootFilter is the root filter (optional). When nil, all TrieRoots will be returned |





### VerifyKeyValuesProofRequest
VerifyKeyValuesProofRequest represents a verify key-values proof request


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| output_key_values | [bool](#bool) |  | OutputKeyValues indicates whether to output key-values contained in the trie |
| output_dot_graph | [bool](#bool) |  | OutputDotGraph indicates whether to output a Graphviz dot graph to visualize the trie |





### VerifyProofReply
VerifyProofReply represents a verify proof reply


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| verified | [bool](#bool) |  | Verified indicates whether the proof is verified |
| error | [string](#string) |  | Error is the error message when the proof is falsified |





### VerifyProofReplyChunk
VerifyProofReplyChunk represents a chunk of data in the verify proof reply
stream


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| key_value | [KeyValue](#keyvalue) |  | KeyValue is one of the key-values contained in the trie when the OutputKeyValues is true |
| dot_graph_chunk | [DataChunk](#datachunk) |  | DotGraphChunk is a chunk of the Graphviz dot graph for the trie when the OutputDotGraph is true |
| reply | [VerifyProofReply](#verifyproofreply) |  | VerifyProofReply is the verify proof reply, which should be the data in the last VerifyProofReplyChunk |





### VerifyTrieProofRequest
VerifyTrieProofRequest represents a verify trie proof request


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| trie_id | [string](#string) |  | TrieId is the trie ID |
| proof_id | [string](#string) |  | ProofId is the trie proof ID |
| output_key_values | [bool](#bool) |  | OutputKeyValues indicates whether to output key-values contained in the trie |
| output_dot_graph | [bool](#bool) |  | OutputDotGraph indicates whether to output a Graphviz dot graph to visualize the trie |




 <!-- end messages -->


### Trie.StorageType
StorageType represents a trie storage type

| Name | Number | Description |
| ---- | ------ | ----------- |
| LOCAL | 0 | LOCAL means the trie is stored temporarily on API Service's local disk |
| CLOUD | 1 | CLOUD means the trie is stored persistently on a cloud storage provider |

 <!-- end enums -->

 <!-- end HasExtensions -->

 <!-- end files -->

## Scalar Value Types

| .proto Type | Notes | C++ | Java | Python | Go | C# | PHP | Ruby |
| ----------- | ----- | --- | ---- | ------ | -- | -- | --- | ---- |
| <a name="double" /> double |  | double | double | float | float64 | double | float | Float |
| <a name="float" /> float |  | float | float | float | float32 | float | float | Float |
| <a name="int32" /> int32 | Uses variable-length encoding. Inefficient for encoding negative numbers – if your field is likely to have negative values, use sint32 instead. | int32 | int | int | int32 | int | integer | Bignum or Fixnum (as required) |
| <a name="int64" /> int64 | Uses variable-length encoding. Inefficient for encoding negative numbers – if your field is likely to have negative values, use sint64 instead. | int64 | long | int/long | int64 | long | integer/string | Bignum |
| <a name="uint32" /> uint32 | Uses variable-length encoding. | uint32 | int | int/long | uint32 | uint | integer | Bignum or Fixnum (as required) |
| <a name="uint64" /> uint64 | Uses variable-length encoding. | uint64 | long | int/long | uint64 | ulong | integer/string | Bignum or Fixnum (as required) |
| <a name="sint32" /> sint32 | Uses variable-length encoding. Signed int value. These more efficiently encode negative numbers than regular int32s. | int32 | int | int | int32 | int | integer | Bignum or Fixnum (as required) |
| <a name="sint64" /> sint64 | Uses variable-length encoding. Signed int value. These more efficiently encode negative numbers than regular int64s. | int64 | long | int/long | int64 | long | integer/string | Bignum |
| <a name="fixed32" /> fixed32 | Always four bytes. More efficient than uint32 if values are often greater than 2^28. | uint32 | int | int | uint32 | uint | integer | Bignum or Fixnum (as required) |
| <a name="fixed64" /> fixed64 | Always eight bytes. More efficient than uint64 if values are often greater than 2^56. | uint64 | long | int/long | uint64 | ulong | integer/string | Bignum |
| <a name="sfixed32" /> sfixed32 | Always four bytes. | int32 | int | int | int32 | int | integer | Bignum or Fixnum (as required) |
| <a name="sfixed64" /> sfixed64 | Always eight bytes. | int64 | long | int/long | int64 | long | integer/string | Bignum |
| <a name="bool" /> bool |  | bool | boolean | boolean | bool | bool | boolean | TrueClass/FalseClass |
| <a name="string" /> string | A string must always contain UTF-8 encoded or 7-bit ASCII text. | string | String | str/unicode | string | string | string | String (UTF-8) |
| <a name="bytes" /> bytes | May contain any arbitrary sequence of bytes. | string | ByteString | str | []byte | ByteString | string | String (ASCII-8BIT) |

