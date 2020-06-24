// GENERATED CODE -- DO NOT EDIT!

// package: anchor
// file: anchor/anchor.proto

import * as anchor_anchor_pb from "../anchor/anchor_pb";
import * as google_protobuf_empty_pb from "google-protobuf/google/protobuf/empty_pb";
import * as grpc from "grpc";

interface IAnchorServiceService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
  getAnchors: grpc.MethodDefinition<google_protobuf_empty_pb.Empty, anchor_anchor_pb.Anchor>;
  getAnchor: grpc.MethodDefinition<anchor_anchor_pb.AnchorRequest, anchor_anchor_pb.Anchor>;
  getProof: grpc.MethodDefinition<anchor_anchor_pb.ProofRequest, anchor_anchor_pb.Proof>;
  submitProof: grpc.MethodDefinition<anchor_anchor_pb.SubmitProofRequest, anchor_anchor_pb.Proof>;
  verifyProof: grpc.MethodDefinition<anchor_anchor_pb.VerifyProofRequest, anchor_anchor_pb.VerifyProofReply>;
  getBatch: grpc.MethodDefinition<anchor_anchor_pb.BatchRequest, anchor_anchor_pb.Batch>;
  subscribeBatches: grpc.MethodDefinition<anchor_anchor_pb.SubscribeBatchesRequest, anchor_anchor_pb.Batch>;
}

export const AnchorServiceService: IAnchorServiceService;

export class AnchorServiceClient extends grpc.Client {
  constructor(address: string, credentials: grpc.ChannelCredentials, options?: object);
  getAnchors(argument: google_protobuf_empty_pb.Empty, metadataOrOptions?: grpc.Metadata | grpc.CallOptions | null): grpc.ClientReadableStream<anchor_anchor_pb.Anchor>;
  getAnchors(argument: google_protobuf_empty_pb.Empty, metadata?: grpc.Metadata | null, options?: grpc.CallOptions | null): grpc.ClientReadableStream<anchor_anchor_pb.Anchor>;
  getAnchor(argument: anchor_anchor_pb.AnchorRequest, callback: grpc.requestCallback<anchor_anchor_pb.Anchor>): grpc.ClientUnaryCall;
  getAnchor(argument: anchor_anchor_pb.AnchorRequest, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<anchor_anchor_pb.Anchor>): grpc.ClientUnaryCall;
  getAnchor(argument: anchor_anchor_pb.AnchorRequest, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<anchor_anchor_pb.Anchor>): grpc.ClientUnaryCall;
  getProof(argument: anchor_anchor_pb.ProofRequest, callback: grpc.requestCallback<anchor_anchor_pb.Proof>): grpc.ClientUnaryCall;
  getProof(argument: anchor_anchor_pb.ProofRequest, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<anchor_anchor_pb.Proof>): grpc.ClientUnaryCall;
  getProof(argument: anchor_anchor_pb.ProofRequest, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<anchor_anchor_pb.Proof>): grpc.ClientUnaryCall;
  submitProof(argument: anchor_anchor_pb.SubmitProofRequest, callback: grpc.requestCallback<anchor_anchor_pb.Proof>): grpc.ClientUnaryCall;
  submitProof(argument: anchor_anchor_pb.SubmitProofRequest, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<anchor_anchor_pb.Proof>): grpc.ClientUnaryCall;
  submitProof(argument: anchor_anchor_pb.SubmitProofRequest, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<anchor_anchor_pb.Proof>): grpc.ClientUnaryCall;
  verifyProof(argument: anchor_anchor_pb.VerifyProofRequest, callback: grpc.requestCallback<anchor_anchor_pb.VerifyProofReply>): grpc.ClientUnaryCall;
  verifyProof(argument: anchor_anchor_pb.VerifyProofRequest, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<anchor_anchor_pb.VerifyProofReply>): grpc.ClientUnaryCall;
  verifyProof(argument: anchor_anchor_pb.VerifyProofRequest, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<anchor_anchor_pb.VerifyProofReply>): grpc.ClientUnaryCall;
  getBatch(argument: anchor_anchor_pb.BatchRequest, callback: grpc.requestCallback<anchor_anchor_pb.Batch>): grpc.ClientUnaryCall;
  getBatch(argument: anchor_anchor_pb.BatchRequest, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<anchor_anchor_pb.Batch>): grpc.ClientUnaryCall;
  getBatch(argument: anchor_anchor_pb.BatchRequest, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<anchor_anchor_pb.Batch>): grpc.ClientUnaryCall;
  subscribeBatches(argument: anchor_anchor_pb.SubscribeBatchesRequest, metadataOrOptions?: grpc.Metadata | grpc.CallOptions | null): grpc.ClientReadableStream<anchor_anchor_pb.Batch>;
  subscribeBatches(argument: anchor_anchor_pb.SubscribeBatchesRequest, metadata?: grpc.Metadata | null, options?: grpc.CallOptions | null): grpc.ClientReadableStream<anchor_anchor_pb.Batch>;
}
