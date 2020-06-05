import { Metadata } from "grpc";
import { ServiceError, callErrorFromStatus } from "grpc/build/src/call";
import { Status } from "grpc/build/src/constants";

/**
 * Create a ServiceError out of an Error
 */
export function makeServiceError(
  err: Error,
  code = Status.INTERNAL,
  metadata = new Metadata()
): ServiceError {
  if ((err as ServiceError).code != undefined) {
    return err as ServiceError;
  }

  return callErrorFromStatus({
    code,
    details: err.message,
    metadata,
  });
}
