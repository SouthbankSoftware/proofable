import { Metadata } from "grpc";
import { ServiceError } from "grpc/build/src/call";
import { Status } from "grpc/build/src/constants";
/**
 * Create a ServiceError out of an Error
 */
export declare function makeServiceError(err: Error, code?: Status, metadata?: Metadata): ServiceError;
