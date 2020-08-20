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
// @Date:   2019-08-05T10:53:28+10:00
// @Last modified by:   guiguan
// @Last modified time: 2020-08-20T13:18:45+10:00
//
'use strict';
var grpc = require('grpc');
var anchor_anchor_pb = require('../anchor/anchor_pb.js');
var google_protobuf_empty_pb = require('google-protobuf/google/protobuf/empty_pb.js');
var google_protobuf_timestamp_pb = require('google-protobuf/google/protobuf/timestamp_pb.js');

function serialize_anchor_Anchor(arg) {
  if (!(arg instanceof anchor_anchor_pb.Anchor)) {
    throw new Error('Expected argument of type anchor.Anchor');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_anchor_Anchor(buffer_arg) {
  return anchor_anchor_pb.Anchor.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_anchor_AnchorRequest(arg) {
  if (!(arg instanceof anchor_anchor_pb.AnchorRequest)) {
    throw new Error('Expected argument of type anchor.AnchorRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_anchor_AnchorRequest(buffer_arg) {
  return anchor_anchor_pb.AnchorRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_anchor_Batch(arg) {
  if (!(arg instanceof anchor_anchor_pb.Batch)) {
    throw new Error('Expected argument of type anchor.Batch');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_anchor_Batch(buffer_arg) {
  return anchor_anchor_pb.Batch.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_anchor_BatchRequest(arg) {
  if (!(arg instanceof anchor_anchor_pb.BatchRequest)) {
    throw new Error('Expected argument of type anchor.BatchRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_anchor_BatchRequest(buffer_arg) {
  return anchor_anchor_pb.BatchRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_anchor_Proof(arg) {
  if (!(arg instanceof anchor_anchor_pb.Proof)) {
    throw new Error('Expected argument of type anchor.Proof');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_anchor_Proof(buffer_arg) {
  return anchor_anchor_pb.Proof.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_anchor_ProofRequest(arg) {
  if (!(arg instanceof anchor_anchor_pb.ProofRequest)) {
    throw new Error('Expected argument of type anchor.ProofRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_anchor_ProofRequest(buffer_arg) {
  return anchor_anchor_pb.ProofRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_anchor_SubmitProofRequest(arg) {
  if (!(arg instanceof anchor_anchor_pb.SubmitProofRequest)) {
    throw new Error('Expected argument of type anchor.SubmitProofRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_anchor_SubmitProofRequest(buffer_arg) {
  return anchor_anchor_pb.SubmitProofRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_anchor_SubscribeBatchesRequest(arg) {
  if (!(arg instanceof anchor_anchor_pb.SubscribeBatchesRequest)) {
    throw new Error('Expected argument of type anchor.SubscribeBatchesRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_anchor_SubscribeBatchesRequest(buffer_arg) {
  return anchor_anchor_pb.SubscribeBatchesRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_anchor_VerifyProofReply(arg) {
  if (!(arg instanceof anchor_anchor_pb.VerifyProofReply)) {
    throw new Error('Expected argument of type anchor.VerifyProofReply');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_anchor_VerifyProofReply(buffer_arg) {
  return anchor_anchor_pb.VerifyProofReply.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_anchor_VerifyProofRequest(arg) {
  if (!(arg instanceof anchor_anchor_pb.VerifyProofRequest)) {
    throw new Error('Expected argument of type anchor.VerifyProofRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_anchor_VerifyProofRequest(buffer_arg) {
  return anchor_anchor_pb.VerifyProofRequest.deserializeBinary(new Uint8Array(buffer_arg));
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


// AnchorService continuously anchors hashes to Blockchains, which is similar to
// what Chainpoint does, but with much better performance and flexibility. It
// supports multiple anchor types and proof formats. Digital signing can be also
// done at the Merkle root level.
var AnchorServiceService = exports.AnchorServiceService = {
  // GetAnchors gets all anchors
getAnchors: {
    path: '/anchor.AnchorService/GetAnchors',
    requestStream: false,
    responseStream: true,
    requestType: google_protobuf_empty_pb.Empty,
    responseType: anchor_anchor_pb.Anchor,
    requestSerialize: serialize_google_protobuf_Empty,
    requestDeserialize: deserialize_google_protobuf_Empty,
    responseSerialize: serialize_anchor_Anchor,
    responseDeserialize: deserialize_anchor_Anchor,
  },
  // GetAnchor gets an anchor
getAnchor: {
    path: '/anchor.AnchorService/GetAnchor',
    requestStream: false,
    responseStream: false,
    requestType: anchor_anchor_pb.AnchorRequest,
    responseType: anchor_anchor_pb.Anchor,
    requestSerialize: serialize_anchor_AnchorRequest,
    requestDeserialize: deserialize_anchor_AnchorRequest,
    responseSerialize: serialize_anchor_Anchor,
    responseDeserialize: deserialize_anchor_Anchor,
  },
  // GetProof gets a proof
getProof: {
    path: '/anchor.AnchorService/GetProof',
    requestStream: false,
    responseStream: false,
    requestType: anchor_anchor_pb.ProofRequest,
    responseType: anchor_anchor_pb.Proof,
    requestSerialize: serialize_anchor_ProofRequest,
    requestDeserialize: deserialize_anchor_ProofRequest,
    responseSerialize: serialize_anchor_Proof,
    responseDeserialize: deserialize_anchor_Proof,
  },
  // SubmitProof submits a proof for the given hash
submitProof: {
    path: '/anchor.AnchorService/SubmitProof',
    requestStream: false,
    responseStream: false,
    requestType: anchor_anchor_pb.SubmitProofRequest,
    responseType: anchor_anchor_pb.Proof,
    requestSerialize: serialize_anchor_SubmitProofRequest,
    requestDeserialize: deserialize_anchor_SubmitProofRequest,
    responseSerialize: serialize_anchor_Proof,
    responseDeserialize: deserialize_anchor_Proof,
  },
  // VerifyProof verifies the given proof. When the proof is unverifiable, an
// exception is thrown
verifyProof: {
    path: '/anchor.AnchorService/VerifyProof',
    requestStream: false,
    responseStream: false,
    requestType: anchor_anchor_pb.VerifyProofRequest,
    responseType: anchor_anchor_pb.VerifyProofReply,
    requestSerialize: serialize_anchor_VerifyProofRequest,
    requestDeserialize: deserialize_anchor_VerifyProofRequest,
    responseSerialize: serialize_anchor_VerifyProofReply,
    responseDeserialize: deserialize_anchor_VerifyProofReply,
  },
  // GetBatch gets a batch
getBatch: {
    path: '/anchor.AnchorService/GetBatch',
    requestStream: false,
    responseStream: false,
    requestType: anchor_anchor_pb.BatchRequest,
    responseType: anchor_anchor_pb.Batch,
    requestSerialize: serialize_anchor_BatchRequest,
    requestDeserialize: deserialize_anchor_BatchRequest,
    responseSerialize: serialize_anchor_Batch,
    responseDeserialize: deserialize_anchor_Batch,
  },
  // SubscribeBatches subscribes to batch status updates
subscribeBatches: {
    path: '/anchor.AnchorService/SubscribeBatches',
    requestStream: false,
    responseStream: true,
    requestType: anchor_anchor_pb.SubscribeBatchesRequest,
    responseType: anchor_anchor_pb.Batch,
    requestSerialize: serialize_anchor_SubscribeBatchesRequest,
    requestDeserialize: deserialize_anchor_SubscribeBatchesRequest,
    responseSerialize: serialize_anchor_Batch,
    responseDeserialize: deserialize_anchor_Batch,
  },
};

exports.AnchorServiceClient = grpc.makeGenericClientConstructor(AnchorServiceService);
