# Protocol Documentation
<a name="top"></a>

## Table of Contents

- [anchor/anchor.proto](#anchor/anchor.proto)
    - [Anchor](#anchor.Anchor)
    - [AnchorRequest](#anchor.AnchorRequest)
    - [Batch](#anchor.Batch)
    - [BatchRequest](#anchor.BatchRequest)
    - [Proof](#anchor.Proof)
    - [ProofRequest](#anchor.ProofRequest)
    - [SubmitProofRequest](#anchor.SubmitProofRequest)
    - [SubscribeBatchesRequest](#anchor.SubscribeBatchesRequest)
    - [VerifyProofReply](#anchor.VerifyProofReply)
    - [VerifyProofRequest](#anchor.VerifyProofRequest)
  
    - [Anchor.Status](#anchor.Anchor.Status)
    - [Anchor.Type](#anchor.Anchor.Type)
    - [Batch.Status](#anchor.Batch.Status)
    - [Proof.Format](#anchor.Proof.Format)
  
    - [AnchorService](#anchor.AnchorService)
  
- [Scalar Value Types](#scalar-value-types)



<a name="anchor/anchor.proto"></a>
<p align="right"><a href="#top">Top</a></p>

## anchor/anchor.proto



<a name="anchor.Anchor"></a>

### Anchor
Anchor represents an anchor of a Blockchain, through which a hash can be
anchored to that Blockchain


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| type | [Anchor.Type](#anchor.Anchor.Type) |  | Type is the anchor type |
| status | [Anchor.Status](#anchor.Anchor.Status) |  | Status is the anchor status |
| error | [string](#string) |  | Error is the error message when the anchor status is ERROR |
| supported_formats | [Proof.Format](#anchor.Proof.Format) | repeated | SupportedFormats are the supported proof formats of the anchor |






<a name="anchor.AnchorRequest"></a>

### AnchorRequest
AnchorRequest represents a request to get information for the given anchor
type


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| type | [Anchor.Type](#anchor.Anchor.Type) |  | Type is the anchor type |






<a name="anchor.Batch"></a>

### Batch
Batch represents a batch of hashes. When hash stream comes in, Anchor Service
will try to process them in batches, just like Blockchain processes
transactions in blocks. This makes utilization of expensive resources, such
as making Bitcoin transaction, more economic. Each batch&#39;s root hash will be
embedded in a transaction made to the Blockchain


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [string](#string) |  | Id is the batch ID |
| anchor_type | [Anchor.Type](#anchor.Anchor.Type) |  | AnchorType is the batch&#39;s anchor type |
| proof_format | [Proof.Format](#anchor.Proof.Format) |  | ProofFormat is the batch&#39;s proof format, which determines how the merkle tree is constructed for the batch. |
| status | [Batch.Status](#anchor.Batch.Status) |  | Status is the batch status. FLOW: created_at -&gt; BATCHING -&gt; flushed_at -&gt; QUEUING -&gt; started_at -&gt; PROCESSING -&gt; submitted_at -&gt; PENDING -&gt; finalized_at -&gt; CONFIRMED / ERROR; * -&gt; ERROR; if a batch has not yet reached PENDING and its anchor has restarted, the batch will be put back to QUEUING |
| error | [string](#string) |  | Error is the error message when status is ERROR |
| size | [int64](#int64) |  | Size is the number of hashes contained in the batch |
| created_at | [google.protobuf.Timestamp](#google.protobuf.Timestamp) |  | CreateAt is the batch&#39;s created at timestamp. FLOW: created_at -&gt; BATCHING |
| flushed_at | [google.protobuf.Timestamp](#google.protobuf.Timestamp) |  | FlushedAt is the batch&#39;s flushed at timestamp. FLOW: BATCHING -&gt; flushed_at -&gt; QUEUING |
| started_at | [google.protobuf.Timestamp](#google.protobuf.Timestamp) |  | StartedAt is the batch&#39;s started at timestamp. FLOW: QUEUING -&gt; started_at -&gt; PROCESSING |
| submitted_at | [google.protobuf.Timestamp](#google.protobuf.Timestamp) |  | SubmittedAt is the batch&#39;s submitted at timestamp. FLOW: PROCESSING -&gt; submitted_at -&gt; PENDING |
| finalized_at | [google.protobuf.Timestamp](#google.protobuf.Timestamp) |  | FinalizedAt is the batch&#39;s finalized at timestamp. FLOW: * -&gt; finalized_at -&gt; CONFIRMED / ERROR. NOTE: this is not the real block confirmed time, use the timestamp in the batch data instead |
| hash | [string](#string) |  | Hash is the batch&#39;s root hash |
| data | [string](#string) |  | Data is the batch data in JSON |






<a name="anchor.BatchRequest"></a>

### BatchRequest
BatchRequest represents a batch request


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| batch_id | [string](#string) |  | BatchId is the batch ID |
| anchor_type | [Anchor.Type](#anchor.Anchor.Type) |  | AnchorType is the batch&#39;s anchor type |






<a name="anchor.Proof"></a>

### Proof
Proof represents a Blockchain proof of a hash, which is a Merkle path from
the hash to the root hash of the proof&#39;s batch


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| hash | [string](#string) |  | Hash is the hash the proof is proving for |
| batch_id | [string](#string) |  | BatchId is the proof&#39;s batch ID |
| anchor_type | [Anchor.Type](#anchor.Anchor.Type) |  | AnchorType is the proof&#39;s anchor type |
| batch_status | [Batch.Status](#anchor.Batch.Status) |  | BatchStatus is the proof&#39;s batch status |
| format | [Proof.Format](#anchor.Proof.Format) |  | Format is the proof format |
| data | [string](#string) |  | Data is the proof data in base64 |
| batch | [Batch](#anchor.Batch) |  | Batch is the proof&#39;s batch detail |






<a name="anchor.ProofRequest"></a>

### ProofRequest
ProofRequest represents a proof request


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| hash | [string](#string) |  | Hash is the hash the proof is proving for |
| batch_id | [string](#string) |  | BatchId is the proof&#39;s batch ID |
| anchor_type | [Anchor.Type](#anchor.Anchor.Type) |  | AnchorType is the proof&#39;s anchor type |
| with_batch | [bool](#bool) |  | WithBatch indicates whether to include the proof&#39;s batch detail |






<a name="anchor.SubmitProofRequest"></a>

### SubmitProofRequest
SubmitProofRequest represents a submit proof request


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| hash | [string](#string) |  | Hash is the hash to be submitted |
| anchor_type | [Anchor.Type](#anchor.Anchor.Type) |  | AnchorType is the anchor type to be used |
| format | [Proof.Format](#anchor.Proof.Format) |  | Format is the proof format to be used |
| skip_batching | [bool](#bool) |  | SkipBatching indicates whether to skip batching and submit a proof for the hash directly |
| with_batch | [bool](#bool) |  | WithBatch indicates whether to include the batch detail in the reply |






<a name="anchor.SubscribeBatchesRequest"></a>

### SubscribeBatchesRequest
SubscribeBatchesRequest represents a subscription request for batch
information


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| filter | [BatchRequest](#anchor.BatchRequest) |  | Filter is the batch filter. When nil, all batches of all anchors will be subscribed; otherwise, only the batches of the given anchor will be subscribed; if batch_id is non-empty, only the matched batch will be subscribed |






<a name="anchor.VerifyProofReply"></a>

### VerifyProofReply
VerifyProofReply represents a verify proof reply


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| verified | [bool](#bool) |  | Verified indicates whether the proof is verified |
| error | [string](#string) |  | Erorr is the error message when the proof is falsified |
| provenHash | [string](#string) |  | ProvenHash is the hash the proof is proving for |






<a name="anchor.VerifyProofRequest"></a>

### VerifyProofRequest
VerifyProofRequest represents a verify proof request


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| anchor_type | [Anchor.Type](#anchor.Anchor.Type) |  | AnchorType is the proof&#39;s anchor type |
| format | [Proof.Format](#anchor.Proof.Format) |  | Format is the proof format. If skipping the signature checking is desired, please use the corresponding non-signed format, eg. use CHP_PATH instead of CHP_PATH_SIGNED in request |
| data | [string](#string) |  | Data is the proof data in base64 |





 


<a name="anchor.Anchor.Status"></a>

### Anchor.Status
Status represents an anchor&#39;s status

| Name | Number | Description |
| ---- | ------ | ----------- |
| ERROR | 0 | Error means the anchor has an error |
| STOPPED | 1 | STOPPED means the anchor is stopped |
| RUNNING | 2 | RUNNING means the anchor is running |



<a name="anchor.Anchor.Type"></a>

### Anchor.Type
Type represents an anchor type

| Name | Number | Description |
| ---- | ------ | ----------- |
| ETH | 0 | ETH is the anchor type for Ethereum Testnet |
| ETH_MAINNET | 3 | ETH_MAINNET is the anchor type for Ethereum Mainnet |
| ETH_ELASTOS | 4 | ETH_ELASTOS is the anchor type for Elastos |
| ETH_GOCHAIN | 9 | ETH_GOCHAIN is the anchor type for GoChain |
| BTC | 1 | BTC is the anchor type for Bitcoin Testnet |
| BTC_MAINNET | 5 | BTC_MAINNET is the anchor type for Bitcoin Mainnet |
| CHP | 2 | CHP is the anchor type for Chainpoint (planned) |
| HEDERA | 6 | HEDERA is the anchor type for Hedera Testnet |
| HEDERA_MAINNET | 7 | HEDERA_MAINNET is the anchor type for Hedera Mainnet |
| HYPERLEDGER | 8 | HYPERLEDGER is the anchor type for Hyperledger Fabric |



<a name="anchor.Batch.Status"></a>

### Batch.Status
Status represents a batch&#39;s status

| Name | Number | Description |
| ---- | ------ | ----------- |
| ERROR | 0 | ERROR means the batch has an error. FLOW: * -&gt; ERROR |
| BATCHING | 1 | BATCHING means the batch is batching for more hashes. FLOW: created_at -&gt; BATCHING -&gt; flushed_at |
| QUEUING | 2 | QUEUING means the batch is queuing to be processed. FLOW: flushed_at -&gt; QUEUING -&gt; started_at |
| PROCESSING | 3 | PROCESSING means the batch is constructing merkle roots and submitting hashes. FLOW: started_at -&gt; PROCESSING -&gt; submitted_at |
| PENDING | 4 | PENDING means the batch&#39;s root hash is pending to be confirmed. FLOW: submitted_at -&gt; PENDING -&gt; finalized_at |
| CONFIRMED | 5 | CONFIRMED means the batch&#39;s root hash is confirmed by the anchor&#39;s Blockchain. FLOW: finalized_at -&gt; CONFIRMED |



<a name="anchor.Proof.Format"></a>

### Proof.Format
Format represents a proof format

| Name | Number | Description |
| ---- | ------ | ----------- |
| CHP_PATH | 0 | CHP_PATH means Chainpoint Path format, which is the format used by Chainpoint |
| ETH_TRIE | 1 | ETH_TRIE means Ethereum Trie format |
| CHP_PATH_SIGNED | 2 | CHP_PATH_SIGNED means signed Chainpoint Path format |
| ETH_TRIE_SIGNED | 3 | ETH_TRIE_SIGNED means signed Ethereum Trie format |


 

 


<a name="anchor.AnchorService"></a>

### AnchorService
AnchorService continuously anchors hashes to Blockchains, which is similar to
what Chainpoint does, but with much better performance and flexibility. It
supports multiple anchor types and proof formats. Digital signing can be also
done at the Merkle root level.

| Method Name | Request Type | Response Type | Description |
| ----------- | ------------ | ------------- | ------------|
| GetAnchors | [.google.protobuf.Empty](#google.protobuf.Empty) | [Anchor](#anchor.Anchor) stream | GetAnchors gets all anchors |
| GetAnchor | [AnchorRequest](#anchor.AnchorRequest) | [Anchor](#anchor.Anchor) | GetAnchor gets an anchor |
| GetProof | [ProofRequest](#anchor.ProofRequest) | [Proof](#anchor.Proof) | GetProof gets a proof |
| SubmitProof | [SubmitProofRequest](#anchor.SubmitProofRequest) | [Proof](#anchor.Proof) | SubmitProof submits a proof for the given hash |
| VerifyProof | [VerifyProofRequest](#anchor.VerifyProofRequest) | [VerifyProofReply](#anchor.VerifyProofReply) | VerifyProof verifies the given proof. When the proof is unverifiable, an exception is thrown |
| GetBatch | [BatchRequest](#anchor.BatchRequest) | [Batch](#anchor.Batch) | GetBatch gets a batch |
| SubscribeBatches | [SubscribeBatchesRequest](#anchor.SubscribeBatchesRequest) | [Batch](#anchor.Batch) stream | SubscribeBatches subscribes to batch status updates |

 



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

