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
Anchor detail


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| type | [Anchor.Type](#anchor.Anchor.Type) |  | anchor type |
| status | [Anchor.Status](#anchor.Anchor.Status) |  | anchor status |
| error | [string](#string) |  | the error message when status is ERROR |
| supported_formats | [Proof.Format](#anchor.Proof.Format) | repeated | supported proof formats |






<a name="anchor.AnchorRequest"></a>

### AnchorRequest
Anchor request


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| type | [Anchor.Type](#anchor.Anchor.Type) |  | anchor type |






<a name="anchor.Batch"></a>

### Batch
Batch detail


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [string](#string) |  | batch ID |
| anchor_type | [Anchor.Type](#anchor.Anchor.Type) |  | anchor type |
| proof_format | [Proof.Format](#anchor.Proof.Format) |  | proof format. It determines how the merkle tree is constructed for the batch. |
| status | [Batch.Status](#anchor.Batch.Status) |  | batch status. FLOW: created_at -&gt; BATCHING -&gt; flushed_at -&gt; QUEUING -&gt; started_at -&gt; PROCESSING -&gt; submitted_at -&gt; PENDING -&gt; finalized_at -&gt; CONFIRMED / ERROR; * -&gt; ERROR; when a batch has not yet reached PENDING and its anchor has restarted, it will be put back to QUEUING |
| error | [string](#string) |  | error message when status is ERROR |
| size | [int64](#int64) |  | number of hashes |
| created_at | [google.protobuf.Timestamp](#google.protobuf.Timestamp) |  | created at timestamp. FLOW: created_at -&gt; BATCHING |
| flushed_at | [google.protobuf.Timestamp](#google.protobuf.Timestamp) |  | flushed at timestamp. FLOW: BATCHING -&gt; flushed_at -&gt; QUEUING |
| started_at | [google.protobuf.Timestamp](#google.protobuf.Timestamp) |  | started at timestamp. FLOW: QUEUING -&gt; started_at -&gt; PROCESSING |
| submitted_at | [google.protobuf.Timestamp](#google.protobuf.Timestamp) |  | submitted at timestamp. FLOW: PROCESSING -&gt; submitted_at -&gt; PENDING |
| finalized_at | [google.protobuf.Timestamp](#google.protobuf.Timestamp) |  | finalized at timestamp. FLOW: * -&gt; finalized_at -&gt; CONFIRMED / ERROR. NOTE: this is not the real block confirmed time, use the timestamp in the batch data instead. |
| hash | [string](#string) |  | batch root hash |
| data | [string](#string) |  | batch data in JSON |






<a name="anchor.BatchRequest"></a>

### BatchRequest
Batch request


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| batch_id | [string](#string) |  | batch ID |
| anchor_type | [Anchor.Type](#anchor.Anchor.Type) |  | anchor type |






<a name="anchor.Proof"></a>

### Proof
Proof detail


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| hash | [string](#string) |  | proof hash |
| batch_id | [string](#string) |  | proof&#39;s batch ID |
| anchor_type | [Anchor.Type](#anchor.Anchor.Type) |  | anchor type |
| batch_status | [Batch.Status](#anchor.Batch.Status) |  | proof status |
| format | [Proof.Format](#anchor.Proof.Format) |  | proof format |
| data | [string](#string) |  | proof data in base64 |
| batch | [Batch](#anchor.Batch) |  | proof&#39;s batch detail |






<a name="anchor.ProofRequest"></a>

### ProofRequest
Proof request


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| hash | [string](#string) |  | proof hash |
| batch_id | [string](#string) |  | proof batch ID |
| anchor_type | [Anchor.Type](#anchor.Anchor.Type) |  | anchor type |
| with_batch | [bool](#bool) |  | whether to include the proof&#39;s batch detail |






<a name="anchor.SubmitProofRequest"></a>

### SubmitProofRequest
Submit proof request


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| hash | [string](#string) |  | hash to be submitted |
| anchor_type | [Anchor.Type](#anchor.Anchor.Type) |  | anchor type |
| format | [Proof.Format](#anchor.Proof.Format) |  | proof format |
| skip_batching | [bool](#bool) |  | whether to skip batching and submit a proof for the hash directly |
| with_batch | [bool](#bool) |  | whether to include the batch detail in the reply |






<a name="anchor.SubscribeBatchesRequest"></a>

### SubscribeBatchesRequest
Subscribe batches request


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| filter | [BatchRequest](#anchor.BatchRequest) |  | batch filter. When nil, all batches will be subscribed; otherwise, only the given anchor&#39;s batches will be subscribed; if batch_id is non-empty, only the matched batch will be subscribed |






<a name="anchor.VerifyProofReply"></a>

### VerifyProofReply
Verify proof reply


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| verified | [bool](#bool) |  | whether the proof is verified |
| error | [string](#string) |  | the error message when the proof is falsified |
| provenHash | [string](#string) |  | provenHash is the hash that is proven by current proof |






<a name="anchor.VerifyProofRequest"></a>

### VerifyProofRequest
Verify proof request


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| anchor_type | [Anchor.Type](#anchor.Anchor.Type) |  | anchor type |
| format | [Proof.Format](#anchor.Proof.Format) |  | proof format. If skipping the signature checking is desired, please use the corresponding non-signed format, eg. use CHP_PATH instead of CHP_PATH_SIGNED in request |
| data | [string](#string) |  | proof data in base64 |





 


<a name="anchor.Anchor.Status"></a>

### Anchor.Status


| Name | Number | Description |
| ---- | ------ | ----------- |
| ERROR | 0 | error |
| STOPPED | 1 | stopped |
| RUNNING | 2 | running |



<a name="anchor.Anchor.Type"></a>

### Anchor.Type


| Name | Number | Description |
| ---- | ------ | ----------- |
| ETH | 0 | ethereum |
| ETH_MAINNET | 3 | ethereum mainnet |
| ETH_ELASTOS | 4 | ethereum elastos |
| BTC | 1 | bitcoin |
| BTC_MAINNET | 5 | bitcoin mainnet |
| CHP | 2 | chainpoint |



<a name="anchor.Batch.Status"></a>

### Batch.Status


| Name | Number | Description |
| ---- | ------ | ----------- |
| ERROR | 0 | error. FLOW: * -&gt; ERROR |
| BATCHING | 1 | batching for more hashes. FLOW: created_at -&gt; BATCHING -&gt; flushed_at |
| QUEUING | 2 | queuing to be processed. FLOW: flushed_at -&gt; QUEUING -&gt; started_at |
| PROCESSING | 3 | constructing the merkle roots and submitting hashes. FLOW: started_at -&gt; PROCESSING -&gt; submitted_at |
| PENDING | 4 | batch root hash is pending to be confirmed. FLOW: submitted_at -&gt; PENDING -&gt; finalized_at |
| CONFIRMED | 5 | batch root hash is confirmed by the anchor. FLOW: finalized_at -&gt; CONFIRMED |



<a name="anchor.Proof.Format"></a>

### Proof.Format


| Name | Number | Description |
| ---- | ------ | ----------- |
| CHP_PATH | 0 | chainpoint path |
| ETH_TRIE | 1 | ethereum trie |
| CHP_PATH_SIGNED | 2 | signed chainpoint path |
| ETH_TRIE_SIGNED | 3 | signed ethereum trie |


 

 


<a name="anchor.AnchorService"></a>

### AnchorService
ProvenDB Anchor Service gRPC API

| Method Name | Request Type | Response Type | Description |
| ----------- | ------------ | ------------- | ------------|
| GetAnchors | [.google.protobuf.Empty](#google.protobuf.Empty) | [Anchor](#anchor.Anchor) stream | get all anchors |
| GetAnchor | [AnchorRequest](#anchor.AnchorRequest) | [Anchor](#anchor.Anchor) | get an anchor |
| GetProof | [ProofRequest](#anchor.ProofRequest) | [Proof](#anchor.Proof) | get a proof |
| SubmitProof | [SubmitProofRequest](#anchor.SubmitProofRequest) | [Proof](#anchor.Proof) | submit a proof for the given hash |
| VerifyProof | [VerifyProofRequest](#anchor.VerifyProofRequest) | [VerifyProofReply](#anchor.VerifyProofReply) | verify the given proof. When the proof is unverifiable, an exception is thrown |
| GetBatch | [BatchRequest](#anchor.BatchRequest) | [Batch](#anchor.Batch) | get a batch |
| SubscribeBatches | [SubscribeBatchesRequest](#anchor.SubscribeBatchesRequest) | [Batch](#anchor.Batch) stream | subscribe to batches |

 



## Scalar Value Types

| .proto Type | Notes | C++ Type | Java Type | Python Type |
| ----------- | ----- | -------- | --------- | ----------- |
| <a name="double" /> double |  | double | double | float |
| <a name="float" /> float |  | float | float | float |
| <a name="int32" /> int32 | Uses variable-length encoding. Inefficient for encoding negative numbers – if your field is likely to have negative values, use sint32 instead. | int32 | int | int |
| <a name="int64" /> int64 | Uses variable-length encoding. Inefficient for encoding negative numbers – if your field is likely to have negative values, use sint64 instead. | int64 | long | int/long |
| <a name="uint32" /> uint32 | Uses variable-length encoding. | uint32 | int | int/long |
| <a name="uint64" /> uint64 | Uses variable-length encoding. | uint64 | long | int/long |
| <a name="sint32" /> sint32 | Uses variable-length encoding. Signed int value. These more efficiently encode negative numbers than regular int32s. | int32 | int | int |
| <a name="sint64" /> sint64 | Uses variable-length encoding. Signed int value. These more efficiently encode negative numbers than regular int64s. | int64 | long | int/long |
| <a name="fixed32" /> fixed32 | Always four bytes. More efficient than uint32 if values are often greater than 2^28. | uint32 | int | int |
| <a name="fixed64" /> fixed64 | Always eight bytes. More efficient than uint64 if values are often greater than 2^56. | uint64 | long | int/long |
| <a name="sfixed32" /> sfixed32 | Always four bytes. | int32 | int | int |
| <a name="sfixed64" /> sfixed64 | Always eight bytes. | int64 | long | int/long |
| <a name="bool" /> bool |  | bool | boolean | boolean |
| <a name="string" /> string | A string must always contain UTF-8 encoded or 7-bit ASCII text. | string | String | str/unicode |
| <a name="bytes" /> bytes | May contain any arbitrary sequence of bytes. | string | ByteString | str |

