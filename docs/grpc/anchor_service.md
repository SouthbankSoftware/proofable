# Anchor Service
Anchor Service continuously anchors hashes to blockchains, which is similar
to what Chainpoint does, but with much better performance and flexibility. It
supports multiple anchor types and proof formats. Digital signing can be also
done at the Merkle root level

Protobuf definition: [anchor/anchor.proto](https://github.com/SouthbankSoftware/proofable/blob/master/pkg/protos/anchor/anchor.proto)

## Table of Contents
- [AnchorService](#anchorservice)
- [Anchor](#anchor)
- [AnchorRequest](#anchorrequest)
- [Batch](#batch)
- [BatchRequest](#batchrequest)
- [Proof](#proof)
- [ProofRequest](#proofrequest)
- [SubmitProofRequest](#submitproofrequest)
- [SubscribeBatchesRequest](#subscribebatchesrequest)
- [VerifyProofReply](#verifyproofreply)
- [VerifyProofRequest](#verifyproofrequest)
- [Anchor.Status](#anchorstatus)
- [Anchor.Type](#anchortype)
- [Batch.Status](#batchstatus)
- [Proof.Format](#proofformat)
- [Scalar Value Types](#scalar-value-types)


### AnchorService


| Method Name | Request Type | Response Type | Description |
| ----------- | ------------ | ------------- | ------------|
| GetAnchors | [google.protobuf.Empty](https://developers.google.com/protocol-buffers/docs/reference/google.protobuf#google.protobuf.Empty) | [Anchor](#anchor) stream | GetAnchors gets all anchors |
| GetAnchor | [AnchorRequest](#anchorrequest) | [Anchor](#anchor) | GetAnchor gets an anchor |
| GetProof | [ProofRequest](#proofrequest) | [Proof](#proof) | GetProof gets a proof |
| SubmitProof | [SubmitProofRequest](#submitproofrequest) | [Proof](#proof) | SubmitProof submits a proof for the given hash |
| VerifyProof | [VerifyProofRequest](#verifyproofrequest) | [VerifyProofReply](#verifyproofreply) | VerifyProof verifies the given proof. When the proof is unverifiable, an exception is thrown |
| GetBatch | [BatchRequest](#batchrequest) | [Batch](#batch) | GetBatch gets a batch |
| SubscribeBatches | [SubscribeBatchesRequest](#subscribebatchesrequest) | [Batch](#batch) stream | SubscribeBatches subscribes to batch status updates |

 <!-- end services -->


### Anchor
Anchor represents an anchor of a blockchain, through which a hash can be
anchored to that blockchain


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| type | [Anchor.Type](#anchortype) |  | Type is the anchor type |
| status | [Anchor.Status](#anchorstatus) |  | Status is the anchor status |
| error | [string](#string) |  | Error is the error message when the anchor status is ERROR |
| supported_formats | [Proof.Format](#proofformat) | repeated | SupportedFormats are the supported proof formats of the anchor |





### AnchorRequest
AnchorRequest represents a request to get information for the given anchor
type


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| type | [Anchor.Type](#anchortype) |  | Type is the anchor type |





### Batch
Batch represents a batch of hashes. When hash stream comes in, Anchor Service
will try to process them in batches, just like blockchain processes
transactions in blocks. This makes utilization of expensive resources, such
as making Bitcoin transaction, more economic. Each batch's root hash will be
embedded in a transaction made to the blockchain


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [string](#string) |  | Id is the batch ID |
| anchor_type | [Anchor.Type](#anchortype) |  | AnchorType is the batch's anchor type |
| proof_format | [Proof.Format](#proofformat) |  | ProofFormat is the batch's proof format, which determines how the merkle tree is constructed for the batch. |
| status | [Batch.Status](#batchstatus) |  | Status is the batch status. FLOW: created_at -> BATCHING -> flushed_at -> QUEUING -> started_at -> PROCESSING -> submitted_at -> PENDING -> finalized_at -> CONFIRMED / ERROR; * -> ERROR; if a batch has not yet reached PENDING and its anchor has restarted, the batch will be put back to QUEUING |
| error | [string](#string) |  | Error is the error message when status is ERROR |
| size | [int64](#int64) |  | Size is the number of hashes contained in the batch |
| created_at | [google.protobuf.Timestamp](https://developers.google.com/protocol-buffers/docs/reference/google.protobuf#google.protobuf.Timestamp) |  | CreateAt is the batch's created at timestamp. FLOW: created_at -> BATCHING |
| flushed_at | [google.protobuf.Timestamp](https://developers.google.com/protocol-buffers/docs/reference/google.protobuf#google.protobuf.Timestamp) |  | FlushedAt is the batch's flushed at timestamp. FLOW: BATCHING -> flushed_at -> QUEUING |
| started_at | [google.protobuf.Timestamp](https://developers.google.com/protocol-buffers/docs/reference/google.protobuf#google.protobuf.Timestamp) |  | StartedAt is the batch's started at timestamp. FLOW: QUEUING -> started_at -> PROCESSING |
| submitted_at | [google.protobuf.Timestamp](https://developers.google.com/protocol-buffers/docs/reference/google.protobuf#google.protobuf.Timestamp) |  | SubmittedAt is the batch's submitted at timestamp. FLOW: PROCESSING -> submitted_at -> PENDING |
| finalized_at | [google.protobuf.Timestamp](https://developers.google.com/protocol-buffers/docs/reference/google.protobuf#google.protobuf.Timestamp) |  | FinalizedAt is the batch's finalized at timestamp. FLOW: * -> finalized_at -> CONFIRMED / ERROR. NOTE: this is not the real block confirmed time, use the timestamp in the batch data instead |
| hash | [string](#string) |  | Hash is the batch's root hash |
| data | [string](#string) |  | Data is the batch data in JSON |





### BatchRequest
BatchRequest represents a batch request


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| batch_id | [string](#string) |  | BatchId is the batch ID |
| anchor_type | [Anchor.Type](#anchortype) |  | AnchorType is the batch's anchor type |





### Proof
Proof represents a blockchain proof of a hash, which is a Merkle path from
the hash to the root hash of the proof's batch


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| hash | [string](#string) |  | Hash is the hash the proof is proving for |
| batch_id | [string](#string) |  | BatchId is the proof's batch ID |
| anchor_type | [Anchor.Type](#anchortype) |  | AnchorType is the proof's anchor type |
| batch_status | [Batch.Status](#batchstatus) |  | BatchStatus is the proof's batch status |
| format | [Proof.Format](#proofformat) |  | Format is the proof format |
| data | [string](#string) |  | Data is the proof data in base64 |
| batch | [Batch](#batch) |  | Batch is the proof's batch detail |





### ProofRequest
ProofRequest represents a proof request


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| hash | [string](#string) |  | Hash is the hash the proof is proving for |
| batch_id | [string](#string) |  | BatchId is the proof's batch ID |
| anchor_type | [Anchor.Type](#anchortype) |  | AnchorType is the proof's anchor type |
| with_batch | [bool](#bool) |  | WithBatch indicates whether to include the proof's batch detail |





### SubmitProofRequest
SubmitProofRequest represents a submit proof request


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| hash | [string](#string) |  | Hash is the hash to be submitted |
| anchor_type | [Anchor.Type](#anchortype) |  | AnchorType is the anchor type to be used |
| format | [Proof.Format](#proofformat) |  | Format is the proof format to be used |
| skip_batching | [bool](#bool) |  | SkipBatching indicates whether to skip batching and submit a proof for the hash directly |
| with_batch | [bool](#bool) |  | WithBatch indicates whether to include the batch detail in the reply |





### SubscribeBatchesRequest
SubscribeBatchesRequest represents a subscription request for batch
information


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| filter | [BatchRequest](#batchrequest) |  | Filter is the batch filter. When nil, all batches of all anchors will be subscribed; otherwise, only the batches of the given anchor will be subscribed; if batch_id is non-empty, only the matched batch will be subscribed |





### VerifyProofReply
VerifyProofReply represents a verify proof reply


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| verified | [bool](#bool) |  | Verified indicates whether the proof is verified |
| error | [string](#string) |  | Erorr is the error message when the proof is falsified |
| provenHash | [string](#string) |  | ProvenHash is the hash the proof is proving for |





### VerifyProofRequest
VerifyProofRequest represents a verify proof request


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| anchor_type | [Anchor.Type](#anchortype) |  | AnchorType is the proof's anchor type |
| format | [Proof.Format](#proofformat) |  | Format is the proof format. If skipping the signature checking is desired, please use the corresponding non-signed format, eg. use CHP_PATH instead of CHP_PATH_SIGNED in request |
| data | [string](#string) |  | Data is the proof data in base64 |




 <!-- end messages -->


### Anchor.Status
Status represents an anchor's status

| Name | Number | Description |
| ---- | ------ | ----------- |
| ERROR | 0 | Error means the anchor has an error |
| STOPPED | 1 | STOPPED means the anchor is stopped |
| RUNNING | 2 | RUNNING means the anchor is running |


### Anchor.Type
Type represents an anchor type. Please refer to this
[list](https://docs.proofable.io/concepts/anchor_types.html) for all
available anchor types

| Name | Number | Description |
| ---- | ------ | ----------- |
| ETH | 0 | [Ethereum](https://ethereum.org/) Rinkeby Testnet |
| ETH_MAINNET | 3 | Ethereum Mainnet. [Ethereum](https://ethereum.org/) is the second-largest cryptocurrency |
| ETH_ELASTOS | 4 | [Elastos](https://www.elastos.org/), which employs a "main chain-sidechain architecture" |
| ETH_GOCHAIN | 9 | [GoChain](https://gochain.io/), which is scalable, low cost and energy efficient |
| BTC | 1 | [Bitcoin](https://bitcoin.org/) Testnet |
| BTC_MAINNET | 5 | Bitcoin Mainnet. [Bitcoin](https://bitcoin.org/) is the largest cryptocurrency |
| CHP | 2 | [Chainpoint](https://chainpoint.org/) |
| HEDERA | 6 | Hedera Testnet |
| HEDERA_MAINNET | 7 | Hedera Mainnet. [Hedera](https://www.hedera.com/) is a DAG based blockchain that provides much better TPS than tranditional blockchains |
| HYPERLEDGER | 8 | [Hyperledger Fabric](https://www.hyperledger.org/use/fabric), which is a modular blockchain framework for private enterprises |


### Batch.Status
Status represents a batch's status

| Name | Number | Description |
| ---- | ------ | ----------- |
| ERROR | 0 | ERROR means the batch has an error. FLOW: * -> ERROR |
| BATCHING | 1 | BATCHING means the batch is batching for more hashes. FLOW: created_at -> BATCHING -> flushed_at |
| QUEUING | 2 | QUEUING means the batch is queuing to be processed. FLOW: flushed_at -> QUEUING -> started_at |
| PROCESSING | 3 | PROCESSING means the batch is constructing merkle roots and submitting hashes. FLOW: started_at -> PROCESSING -> submitted_at |
| PENDING | 4 | PENDING means the batch's root hash is pending to be confirmed. FLOW: submitted_at -> PENDING -> finalized_at |
| CONFIRMED | 5 | CONFIRMED means the batch's root hash is confirmed by the anchor's blockchain. FLOW: finalized_at -> CONFIRMED |


### Proof.Format
Format represents a proof format

| Name | Number | Description |
| ---- | ------ | ----------- |
| CHP_PATH | 0 | CHP_PATH means Chainpoint Path format, which is the format used by Chainpoint |
| ETH_TRIE | 1 | ETH_TRIE means Ethereum Trie format |
| CHP_PATH_SIGNED | 2 | CHP_PATH_SIGNED means signed Chainpoint Path format |
| ETH_TRIE_SIGNED | 3 | ETH_TRIE_SIGNED means signed Ethereum Trie format |

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

