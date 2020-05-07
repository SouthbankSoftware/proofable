// package: anchor
// file: anchor/anchor.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "grpc";
import * as anchor_anchor_pb from "../anchor/anchor_pb";
import * as google_protobuf_empty_pb from "google-protobuf/google/protobuf/empty_pb";
import * as google_protobuf_timestamp_pb from "google-protobuf/google/protobuf/timestamp_pb";

interface IAnchorServiceService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    getAnchors: IAnchorServiceService_IGetAnchors;
    getAnchor: IAnchorServiceService_IGetAnchor;
    getProof: IAnchorServiceService_IGetProof;
    submitProof: IAnchorServiceService_ISubmitProof;
    verifyProof: IAnchorServiceService_IVerifyProof;
    getBatch: IAnchorServiceService_IGetBatch;
    subscribeBatches: IAnchorServiceService_ISubscribeBatches;
}

interface IAnchorServiceService_IGetAnchors extends grpc.MethodDefinition<google_protobuf_empty_pb.Empty, anchor_anchor_pb.Anchor> {
    path: string; // "/anchor.AnchorService/GetAnchors"
    requestStream: boolean; // false
    responseStream: boolean; // true
    requestSerialize: grpc.serialize<google_protobuf_empty_pb.Empty>;
    requestDeserialize: grpc.deserialize<google_protobuf_empty_pb.Empty>;
    responseSerialize: grpc.serialize<anchor_anchor_pb.Anchor>;
    responseDeserialize: grpc.deserialize<anchor_anchor_pb.Anchor>;
}
interface IAnchorServiceService_IGetAnchor extends grpc.MethodDefinition<anchor_anchor_pb.AnchorRequest, anchor_anchor_pb.Anchor> {
    path: string; // "/anchor.AnchorService/GetAnchor"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestSerialize: grpc.serialize<anchor_anchor_pb.AnchorRequest>;
    requestDeserialize: grpc.deserialize<anchor_anchor_pb.AnchorRequest>;
    responseSerialize: grpc.serialize<anchor_anchor_pb.Anchor>;
    responseDeserialize: grpc.deserialize<anchor_anchor_pb.Anchor>;
}
interface IAnchorServiceService_IGetProof extends grpc.MethodDefinition<anchor_anchor_pb.ProofRequest, anchor_anchor_pb.Proof> {
    path: string; // "/anchor.AnchorService/GetProof"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestSerialize: grpc.serialize<anchor_anchor_pb.ProofRequest>;
    requestDeserialize: grpc.deserialize<anchor_anchor_pb.ProofRequest>;
    responseSerialize: grpc.serialize<anchor_anchor_pb.Proof>;
    responseDeserialize: grpc.deserialize<anchor_anchor_pb.Proof>;
}
interface IAnchorServiceService_ISubmitProof extends grpc.MethodDefinition<anchor_anchor_pb.SubmitProofRequest, anchor_anchor_pb.Proof> {
    path: string; // "/anchor.AnchorService/SubmitProof"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestSerialize: grpc.serialize<anchor_anchor_pb.SubmitProofRequest>;
    requestDeserialize: grpc.deserialize<anchor_anchor_pb.SubmitProofRequest>;
    responseSerialize: grpc.serialize<anchor_anchor_pb.Proof>;
    responseDeserialize: grpc.deserialize<anchor_anchor_pb.Proof>;
}
interface IAnchorServiceService_IVerifyProof extends grpc.MethodDefinition<anchor_anchor_pb.VerifyProofRequest, anchor_anchor_pb.VerifyProofReply> {
    path: string; // "/anchor.AnchorService/VerifyProof"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestSerialize: grpc.serialize<anchor_anchor_pb.VerifyProofRequest>;
    requestDeserialize: grpc.deserialize<anchor_anchor_pb.VerifyProofRequest>;
    responseSerialize: grpc.serialize<anchor_anchor_pb.VerifyProofReply>;
    responseDeserialize: grpc.deserialize<anchor_anchor_pb.VerifyProofReply>;
}
interface IAnchorServiceService_IGetBatch extends grpc.MethodDefinition<anchor_anchor_pb.BatchRequest, anchor_anchor_pb.Batch> {
    path: string; // "/anchor.AnchorService/GetBatch"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestSerialize: grpc.serialize<anchor_anchor_pb.BatchRequest>;
    requestDeserialize: grpc.deserialize<anchor_anchor_pb.BatchRequest>;
    responseSerialize: grpc.serialize<anchor_anchor_pb.Batch>;
    responseDeserialize: grpc.deserialize<anchor_anchor_pb.Batch>;
}
interface IAnchorServiceService_ISubscribeBatches extends grpc.MethodDefinition<anchor_anchor_pb.SubscribeBatchesRequest, anchor_anchor_pb.Batch> {
    path: string; // "/anchor.AnchorService/SubscribeBatches"
    requestStream: boolean; // false
    responseStream: boolean; // true
    requestSerialize: grpc.serialize<anchor_anchor_pb.SubscribeBatchesRequest>;
    requestDeserialize: grpc.deserialize<anchor_anchor_pb.SubscribeBatchesRequest>;
    responseSerialize: grpc.serialize<anchor_anchor_pb.Batch>;
    responseDeserialize: grpc.deserialize<anchor_anchor_pb.Batch>;
}

export const AnchorServiceService: IAnchorServiceService;

export interface IAnchorServiceServer {
    getAnchors: grpc.handleServerStreamingCall<google_protobuf_empty_pb.Empty, anchor_anchor_pb.Anchor>;
    getAnchor: grpc.handleUnaryCall<anchor_anchor_pb.AnchorRequest, anchor_anchor_pb.Anchor>;
    getProof: grpc.handleUnaryCall<anchor_anchor_pb.ProofRequest, anchor_anchor_pb.Proof>;
    submitProof: grpc.handleUnaryCall<anchor_anchor_pb.SubmitProofRequest, anchor_anchor_pb.Proof>;
    verifyProof: grpc.handleUnaryCall<anchor_anchor_pb.VerifyProofRequest, anchor_anchor_pb.VerifyProofReply>;
    getBatch: grpc.handleUnaryCall<anchor_anchor_pb.BatchRequest, anchor_anchor_pb.Batch>;
    subscribeBatches: grpc.handleServerStreamingCall<anchor_anchor_pb.SubscribeBatchesRequest, anchor_anchor_pb.Batch>;
}

export interface IAnchorServiceClient {
    getAnchors(request: google_protobuf_empty_pb.Empty, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<anchor_anchor_pb.Anchor>;
    getAnchors(request: google_protobuf_empty_pb.Empty, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<anchor_anchor_pb.Anchor>;
    getAnchor(request: anchor_anchor_pb.AnchorRequest, callback: (error: grpc.ServiceError | null, response: anchor_anchor_pb.Anchor) => void): grpc.ClientUnaryCall;
    getAnchor(request: anchor_anchor_pb.AnchorRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: anchor_anchor_pb.Anchor) => void): grpc.ClientUnaryCall;
    getAnchor(request: anchor_anchor_pb.AnchorRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: anchor_anchor_pb.Anchor) => void): grpc.ClientUnaryCall;
    getProof(request: anchor_anchor_pb.ProofRequest, callback: (error: grpc.ServiceError | null, response: anchor_anchor_pb.Proof) => void): grpc.ClientUnaryCall;
    getProof(request: anchor_anchor_pb.ProofRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: anchor_anchor_pb.Proof) => void): grpc.ClientUnaryCall;
    getProof(request: anchor_anchor_pb.ProofRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: anchor_anchor_pb.Proof) => void): grpc.ClientUnaryCall;
    submitProof(request: anchor_anchor_pb.SubmitProofRequest, callback: (error: grpc.ServiceError | null, response: anchor_anchor_pb.Proof) => void): grpc.ClientUnaryCall;
    submitProof(request: anchor_anchor_pb.SubmitProofRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: anchor_anchor_pb.Proof) => void): grpc.ClientUnaryCall;
    submitProof(request: anchor_anchor_pb.SubmitProofRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: anchor_anchor_pb.Proof) => void): grpc.ClientUnaryCall;
    verifyProof(request: anchor_anchor_pb.VerifyProofRequest, callback: (error: grpc.ServiceError | null, response: anchor_anchor_pb.VerifyProofReply) => void): grpc.ClientUnaryCall;
    verifyProof(request: anchor_anchor_pb.VerifyProofRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: anchor_anchor_pb.VerifyProofReply) => void): grpc.ClientUnaryCall;
    verifyProof(request: anchor_anchor_pb.VerifyProofRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: anchor_anchor_pb.VerifyProofReply) => void): grpc.ClientUnaryCall;
    getBatch(request: anchor_anchor_pb.BatchRequest, callback: (error: grpc.ServiceError | null, response: anchor_anchor_pb.Batch) => void): grpc.ClientUnaryCall;
    getBatch(request: anchor_anchor_pb.BatchRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: anchor_anchor_pb.Batch) => void): grpc.ClientUnaryCall;
    getBatch(request: anchor_anchor_pb.BatchRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: anchor_anchor_pb.Batch) => void): grpc.ClientUnaryCall;
    subscribeBatches(request: anchor_anchor_pb.SubscribeBatchesRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<anchor_anchor_pb.Batch>;
    subscribeBatches(request: anchor_anchor_pb.SubscribeBatchesRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<anchor_anchor_pb.Batch>;
}

export class AnchorServiceClient extends grpc.Client implements IAnchorServiceClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: object);
    public getAnchors(request: google_protobuf_empty_pb.Empty, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<anchor_anchor_pb.Anchor>;
    public getAnchors(request: google_protobuf_empty_pb.Empty, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<anchor_anchor_pb.Anchor>;
    public getAnchor(request: anchor_anchor_pb.AnchorRequest, callback: (error: grpc.ServiceError | null, response: anchor_anchor_pb.Anchor) => void): grpc.ClientUnaryCall;
    public getAnchor(request: anchor_anchor_pb.AnchorRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: anchor_anchor_pb.Anchor) => void): grpc.ClientUnaryCall;
    public getAnchor(request: anchor_anchor_pb.AnchorRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: anchor_anchor_pb.Anchor) => void): grpc.ClientUnaryCall;
    public getProof(request: anchor_anchor_pb.ProofRequest, callback: (error: grpc.ServiceError | null, response: anchor_anchor_pb.Proof) => void): grpc.ClientUnaryCall;
    public getProof(request: anchor_anchor_pb.ProofRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: anchor_anchor_pb.Proof) => void): grpc.ClientUnaryCall;
    public getProof(request: anchor_anchor_pb.ProofRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: anchor_anchor_pb.Proof) => void): grpc.ClientUnaryCall;
    public submitProof(request: anchor_anchor_pb.SubmitProofRequest, callback: (error: grpc.ServiceError | null, response: anchor_anchor_pb.Proof) => void): grpc.ClientUnaryCall;
    public submitProof(request: anchor_anchor_pb.SubmitProofRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: anchor_anchor_pb.Proof) => void): grpc.ClientUnaryCall;
    public submitProof(request: anchor_anchor_pb.SubmitProofRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: anchor_anchor_pb.Proof) => void): grpc.ClientUnaryCall;
    public verifyProof(request: anchor_anchor_pb.VerifyProofRequest, callback: (error: grpc.ServiceError | null, response: anchor_anchor_pb.VerifyProofReply) => void): grpc.ClientUnaryCall;
    public verifyProof(request: anchor_anchor_pb.VerifyProofRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: anchor_anchor_pb.VerifyProofReply) => void): grpc.ClientUnaryCall;
    public verifyProof(request: anchor_anchor_pb.VerifyProofRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: anchor_anchor_pb.VerifyProofReply) => void): grpc.ClientUnaryCall;
    public getBatch(request: anchor_anchor_pb.BatchRequest, callback: (error: grpc.ServiceError | null, response: anchor_anchor_pb.Batch) => void): grpc.ClientUnaryCall;
    public getBatch(request: anchor_anchor_pb.BatchRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: anchor_anchor_pb.Batch) => void): grpc.ClientUnaryCall;
    public getBatch(request: anchor_anchor_pb.BatchRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: anchor_anchor_pb.Batch) => void): grpc.ClientUnaryCall;
    public subscribeBatches(request: anchor_anchor_pb.SubscribeBatchesRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<anchor_anchor_pb.Batch>;
    public subscribeBatches(request: anchor_anchor_pb.SubscribeBatchesRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<anchor_anchor_pb.Batch>;
}
