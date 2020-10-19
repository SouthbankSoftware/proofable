// GENERATED CODE -- DO NOT EDIT!

// Original file comments:
//
// proofable
// Copyright (C) 2020  Southbank Software Ltd.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.
//
//
// @Author: guiguan
// @Date:   2020-01-03T14:55:49+11:00
// @Last modified by:   guiguan
// @Last modified time: 2020-10-05T17:05:35+11:00
//
// API Service is a general purpose proving service that is fast and effective.
// It provides a set of APIs to manipulate trie structures and generate
// blockchain proofs for any digital assets. A trie is a dictionary of
// key-values that can be built incrementally, whose root hash at any given time
// can be also dervied efficiently. Once the root hash is proven to a
// blockchain, every key-value is also proven, so as the digital asset stored in
// that key-value
'use strict';
var grpc = require('grpc');
var api_api_pb = require('../api/api_pb.js');
var google_protobuf_empty_pb = require('google-protobuf/google/protobuf/empty_pb.js');
var google_protobuf_timestamp_pb = require('google-protobuf/google/protobuf/timestamp_pb.js');
var anchor_anchor_pb = require('../anchor/anchor_pb.js');

function serialize_api_CreateKeyValuesProofRequest(arg) {
  if (!(arg instanceof api_api_pb.CreateKeyValuesProofRequest)) {
    throw new Error('Expected argument of type api.CreateKeyValuesProofRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_api_CreateKeyValuesProofRequest(buffer_arg) {
  return api_api_pb.CreateKeyValuesProofRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_api_CreateTrieProofRequest(arg) {
  if (!(arg instanceof api_api_pb.CreateTrieProofRequest)) {
    throw new Error('Expected argument of type api.CreateTrieProofRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_api_CreateTrieProofRequest(buffer_arg) {
  return api_api_pb.CreateTrieProofRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_api_CreateTrieRequest(arg) {
  if (!(arg instanceof api_api_pb.CreateTrieRequest)) {
    throw new Error('Expected argument of type api.CreateTrieRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_api_CreateTrieRequest(buffer_arg) {
  return api_api_pb.CreateTrieRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_api_DataChunk(arg) {
  if (!(arg instanceof api_api_pb.DataChunk)) {
    throw new Error('Expected argument of type api.DataChunk');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_api_DataChunk(buffer_arg) {
  return api_api_pb.DataChunk.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_api_DeleteTrieProofRequest(arg) {
  if (!(arg instanceof api_api_pb.DeleteTrieProofRequest)) {
    throw new Error('Expected argument of type api.DeleteTrieProofRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_api_DeleteTrieProofRequest(buffer_arg) {
  return api_api_pb.DeleteTrieProofRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_api_KeyValue(arg) {
  if (!(arg instanceof api_api_pb.KeyValue)) {
    throw new Error('Expected argument of type api.KeyValue');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_api_KeyValue(buffer_arg) {
  return api_api_pb.KeyValue.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_api_SetTrieRootRequest(arg) {
  if (!(arg instanceof api_api_pb.SetTrieRootRequest)) {
    throw new Error('Expected argument of type api.SetTrieRootRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_api_SetTrieRootRequest(buffer_arg) {
  return api_api_pb.SetTrieRootRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_api_SetTrieStorageTypeRequest(arg) {
  if (!(arg instanceof api_api_pb.SetTrieStorageTypeRequest)) {
    throw new Error('Expected argument of type api.SetTrieStorageTypeRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_api_SetTrieStorageTypeRequest(buffer_arg) {
  return api_api_pb.SetTrieStorageTypeRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_api_Trie(arg) {
  if (!(arg instanceof api_api_pb.Trie)) {
    throw new Error('Expected argument of type api.Trie');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_api_Trie(buffer_arg) {
  return api_api_pb.Trie.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_api_TrieKeyValueRequest(arg) {
  if (!(arg instanceof api_api_pb.TrieKeyValueRequest)) {
    throw new Error('Expected argument of type api.TrieKeyValueRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_api_TrieKeyValueRequest(buffer_arg) {
  return api_api_pb.TrieKeyValueRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_api_TrieKeyValuesRequest(arg) {
  if (!(arg instanceof api_api_pb.TrieKeyValuesRequest)) {
    throw new Error('Expected argument of type api.TrieKeyValuesRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_api_TrieKeyValuesRequest(buffer_arg) {
  return api_api_pb.TrieKeyValuesRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_api_TrieProof(arg) {
  if (!(arg instanceof api_api_pb.TrieProof)) {
    throw new Error('Expected argument of type api.TrieProof');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_api_TrieProof(buffer_arg) {
  return api_api_pb.TrieProof.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_api_TrieProofRequest(arg) {
  if (!(arg instanceof api_api_pb.TrieProofRequest)) {
    throw new Error('Expected argument of type api.TrieProofRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_api_TrieProofRequest(buffer_arg) {
  return api_api_pb.TrieProofRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_api_TrieProofsRequest(arg) {
  if (!(arg instanceof api_api_pb.TrieProofsRequest)) {
    throw new Error('Expected argument of type api.TrieProofsRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_api_TrieProofsRequest(buffer_arg) {
  return api_api_pb.TrieProofsRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_api_TrieRequest(arg) {
  if (!(arg instanceof api_api_pb.TrieRequest)) {
    throw new Error('Expected argument of type api.TrieRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_api_TrieRequest(buffer_arg) {
  return api_api_pb.TrieRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_api_TrieRoot(arg) {
  if (!(arg instanceof api_api_pb.TrieRoot)) {
    throw new Error('Expected argument of type api.TrieRoot');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_api_TrieRoot(buffer_arg) {
  return api_api_pb.TrieRoot.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_api_TrieRootsRequest(arg) {
  if (!(arg instanceof api_api_pb.TrieRootsRequest)) {
    throw new Error('Expected argument of type api.TrieRootsRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_api_TrieRootsRequest(buffer_arg) {
  return api_api_pb.TrieRootsRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_api_VerifyProofReplyChunk(arg) {
  if (!(arg instanceof api_api_pb.VerifyProofReplyChunk)) {
    throw new Error('Expected argument of type api.VerifyProofReplyChunk');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_api_VerifyProofReplyChunk(buffer_arg) {
  return api_api_pb.VerifyProofReplyChunk.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_api_VerifyTrieProofRequest(arg) {
  if (!(arg instanceof api_api_pb.VerifyTrieProofRequest)) {
    throw new Error('Expected argument of type api.VerifyTrieProofRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_api_VerifyTrieProofRequest(buffer_arg) {
  return api_api_pb.VerifyTrieProofRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_google_protobuf_Empty(arg) {
  if (!(arg instanceof google_protobuf_empty_pb.Empty)) {
    throw new Error('Expected argument of type google.protobuf.Empty');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_google_protobuf_Empty(buffer_arg) {
  return google_protobuf_empty_pb.Empty.deserializeBinary(new Uint8Array(buffer_arg));
}


var APIServiceService = exports.APIServiceService = {
  // GetTries gets all tries. Admin privilege is required
getTries: {
    path: '/api.APIService/GetTries',
    requestStream: false,
    responseStream: true,
    requestType: google_protobuf_empty_pb.Empty,
    responseType: api_api_pb.Trie,
    requestSerialize: serialize_google_protobuf_Empty,
    requestDeserialize: deserialize_google_protobuf_Empty,
    responseSerialize: serialize_api_Trie,
    responseDeserialize: deserialize_api_Trie,
  },
  // GetTrie gets a trie
getTrie: {
    path: '/api.APIService/GetTrie',
    requestStream: false,
    responseStream: false,
    requestType: api_api_pb.TrieRequest,
    responseType: api_api_pb.Trie,
    requestSerialize: serialize_api_TrieRequest,
    requestDeserialize: deserialize_api_TrieRequest,
    responseSerialize: serialize_api_Trie,
    responseDeserialize: deserialize_api_Trie,
  },
  // ImportTrie creates a new trie from existing trie data. If the trie ID is
// not provided in the metadata, a new one will be generated
importTrie: {
    path: '/api.APIService/ImportTrie',
    requestStream: true,
    responseStream: false,
    requestType: api_api_pb.DataChunk,
    responseType: api_api_pb.Trie,
    requestSerialize: serialize_api_DataChunk,
    requestDeserialize: deserialize_api_DataChunk,
    responseSerialize: serialize_api_Trie,
    responseDeserialize: deserialize_api_Trie,
  },
  // ExportTrie exports a trie's data
exportTrie: {
    path: '/api.APIService/ExportTrie',
    requestStream: false,
    responseStream: true,
    requestType: api_api_pb.TrieRequest,
    responseType: api_api_pb.DataChunk,
    requestSerialize: serialize_api_TrieRequest,
    requestDeserialize: deserialize_api_TrieRequest,
    responseSerialize: serialize_api_DataChunk,
    responseDeserialize: deserialize_api_DataChunk,
  },
  // CreateTrie creates an empty trie
createTrie: {
    path: '/api.APIService/CreateTrie',
    requestStream: false,
    responseStream: false,
    requestType: api_api_pb.CreateTrieRequest,
    responseType: api_api_pb.Trie,
    requestSerialize: serialize_api_CreateTrieRequest,
    requestDeserialize: deserialize_api_CreateTrieRequest,
    responseSerialize: serialize_api_Trie,
    responseDeserialize: deserialize_api_Trie,
  },
  // DeleteTrie deletes a trie. This destroys everything of a trie
deleteTrie: {
    path: '/api.APIService/DeleteTrie',
    requestStream: false,
    responseStream: false,
    requestType: api_api_pb.TrieRequest,
    responseType: api_api_pb.Trie,
    requestSerialize: serialize_api_TrieRequest,
    requestDeserialize: deserialize_api_TrieRequest,
    responseSerialize: serialize_api_Trie,
    responseDeserialize: deserialize_api_Trie,
  },
  // GetTrieKeyValues gets key-values of a trie. The returned KeyValues are
// ordered by the keys lexicographically
getTrieKeyValues: {
    path: '/api.APIService/GetTrieKeyValues',
    requestStream: false,
    responseStream: true,
    requestType: api_api_pb.TrieKeyValuesRequest,
    responseType: api_api_pb.KeyValue,
    requestSerialize: serialize_api_TrieKeyValuesRequest,
    requestDeserialize: deserialize_api_TrieKeyValuesRequest,
    responseSerialize: serialize_api_KeyValue,
    responseDeserialize: deserialize_api_KeyValue,
  },
  // GetTrieKeyValue gets a key-value of a trie
getTrieKeyValue: {
    path: '/api.APIService/GetTrieKeyValue',
    requestStream: false,
    responseStream: false,
    requestType: api_api_pb.TrieKeyValueRequest,
    responseType: api_api_pb.KeyValue,
    requestSerialize: serialize_api_TrieKeyValueRequest,
    requestDeserialize: deserialize_api_TrieKeyValueRequest,
    responseSerialize: serialize_api_KeyValue,
    responseDeserialize: deserialize_api_KeyValue,
  },
  // SetTrieKeyValues sets key-values of a trie. Set an empty value for a key to
// remove that key. Modifications to a trie will change its root hash
setTrieKeyValues: {
    path: '/api.APIService/SetTrieKeyValues',
    requestStream: true,
    responseStream: false,
    requestType: api_api_pb.KeyValue,
    responseType: api_api_pb.Trie,
    requestSerialize: serialize_api_KeyValue,
    requestDeserialize: deserialize_api_KeyValue,
    responseSerialize: serialize_api_Trie,
    responseDeserialize: deserialize_api_Trie,
  },
  // GetTrieRoots gets roots of a trie. This is a series of roots showing the
// modification history of a trie
getTrieRoots: {
    path: '/api.APIService/GetTrieRoots',
    requestStream: false,
    responseStream: true,
    requestType: api_api_pb.TrieRootsRequest,
    responseType: api_api_pb.TrieRoot,
    requestSerialize: serialize_api_TrieRootsRequest,
    requestDeserialize: deserialize_api_TrieRootsRequest,
    responseSerialize: serialize_api_TrieRoot,
    responseDeserialize: deserialize_api_TrieRoot,
  },
  // SetTrieRoot sets the root of a trie to the given one. This will add an
// entry in the root history
setTrieRoot: {
    path: '/api.APIService/SetTrieRoot',
    requestStream: false,
    responseStream: false,
    requestType: api_api_pb.SetTrieRootRequest,
    responseType: api_api_pb.Trie,
    requestSerialize: serialize_api_SetTrieRootRequest,
    requestDeserialize: deserialize_api_SetTrieRootRequest,
    responseSerialize: serialize_api_Trie,
    responseDeserialize: deserialize_api_Trie,
  },
  // SetTrieStorageType sets the storage type of a trie
setTrieStorageType: {
    path: '/api.APIService/SetTrieStorageType',
    requestStream: false,
    responseStream: false,
    requestType: api_api_pb.SetTrieStorageTypeRequest,
    responseType: api_api_pb.Trie,
    requestSerialize: serialize_api_SetTrieStorageTypeRequest,
    requestDeserialize: deserialize_api_SetTrieStorageTypeRequest,
    responseSerialize: serialize_api_Trie,
    responseDeserialize: deserialize_api_Trie,
  },
  // GetTrieProofs gets proofs of a trie
getTrieProofs: {
    path: '/api.APIService/GetTrieProofs',
    requestStream: false,
    responseStream: true,
    requestType: api_api_pb.TrieProofsRequest,
    responseType: api_api_pb.TrieProof,
    requestSerialize: serialize_api_TrieProofsRequest,
    requestDeserialize: deserialize_api_TrieProofsRequest,
    responseSerialize: serialize_api_TrieProof,
    responseDeserialize: deserialize_api_TrieProof,
  },
  // GetTrieProof gets a proof of a trie. When not_before is not provided
// (either nil or zero), the latest proof will be returned
getTrieProof: {
    path: '/api.APIService/GetTrieProof',
    requestStream: false,
    responseStream: false,
    requestType: api_api_pb.TrieProofRequest,
    responseType: api_api_pb.TrieProof,
    requestSerialize: serialize_api_TrieProofRequest,
    requestDeserialize: deserialize_api_TrieProofRequest,
    responseSerialize: serialize_api_TrieProof,
    responseDeserialize: deserialize_api_TrieProof,
  },
  // SubscribeTrieProof subscribes to proof changes of a trie. When not_before
// is not provided (either nil or zero), the latest proof will be returned
subscribeTrieProof: {
    path: '/api.APIService/SubscribeTrieProof',
    requestStream: false,
    responseStream: true,
    requestType: api_api_pb.TrieProofRequest,
    responseType: api_api_pb.TrieProof,
    requestSerialize: serialize_api_TrieProofRequest,
    requestDeserialize: deserialize_api_TrieProofRequest,
    responseSerialize: serialize_api_TrieProof,
    responseDeserialize: deserialize_api_TrieProof,
  },
  // CreateTrieProof creates a proof for a trie root
createTrieProof: {
    path: '/api.APIService/CreateTrieProof',
    requestStream: false,
    responseStream: false,
    requestType: api_api_pb.CreateTrieProofRequest,
    responseType: api_api_pb.TrieProof,
    requestSerialize: serialize_api_CreateTrieProofRequest,
    requestDeserialize: deserialize_api_CreateTrieProofRequest,
    responseSerialize: serialize_api_TrieProof,
    responseDeserialize: deserialize_api_TrieProof,
  },
  // DeleteTrieProof deletes a proof for a trie root
deleteTrieProof: {
    path: '/api.APIService/DeleteTrieProof',
    requestStream: false,
    responseStream: false,
    requestType: api_api_pb.DeleteTrieProofRequest,
    responseType: api_api_pb.TrieProof,
    requestSerialize: serialize_api_DeleteTrieProofRequest,
    requestDeserialize: deserialize_api_DeleteTrieProofRequest,
    responseSerialize: serialize_api_TrieProof,
    responseDeserialize: deserialize_api_TrieProof,
  },
  // VerifyTrieProof verifies a proof for a trie root
verifyTrieProof: {
    path: '/api.APIService/VerifyTrieProof',
    requestStream: false,
    responseStream: true,
    requestType: api_api_pb.VerifyTrieProofRequest,
    responseType: api_api_pb.VerifyProofReplyChunk,
    requestSerialize: serialize_api_VerifyTrieProofRequest,
    requestDeserialize: deserialize_api_VerifyTrieProofRequest,
    responseSerialize: serialize_api_VerifyProofReplyChunk,
    responseDeserialize: deserialize_api_VerifyProofReplyChunk,
  },
  // CreateKeyValuesProof creates a proof for the provided key-values out of a
// trie proof. The new proof is self-contained and can be verified
// independently
createKeyValuesProof: {
    path: '/api.APIService/CreateKeyValuesProof',
    requestStream: false,
    responseStream: true,
    requestType: api_api_pb.CreateKeyValuesProofRequest,
    responseType: api_api_pb.DataChunk,
    requestSerialize: serialize_api_CreateKeyValuesProofRequest,
    requestDeserialize: deserialize_api_CreateKeyValuesProofRequest,
    responseSerialize: serialize_api_DataChunk,
    responseDeserialize: deserialize_api_DataChunk,
  },
  // VerifyKeyValuesProof verifies a key-values proof
verifyKeyValuesProof: {
    path: '/api.APIService/VerifyKeyValuesProof',
    requestStream: true,
    responseStream: true,
    requestType: api_api_pb.DataChunk,
    responseType: api_api_pb.VerifyProofReplyChunk,
    requestSerialize: serialize_api_DataChunk,
    requestDeserialize: deserialize_api_DataChunk,
    responseSerialize: serialize_api_VerifyProofReplyChunk,
    responseDeserialize: deserialize_api_VerifyProofReplyChunk,
  },
};

exports.APIServiceClient = grpc.makeGenericClientConstructor(APIServiceService);
