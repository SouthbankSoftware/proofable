"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeServiceError = void 0;
const grpc_1 = require("grpc");
const call_1 = require("grpc/build/src/call");
const constants_1 = require("grpc/build/src/constants");
/**
 * Create a ServiceError out of an Error
 */
function makeServiceError(err, code = constants_1.Status.INTERNAL, metadata = new grpc_1.Metadata()) {
    if (err.code != undefined) {
        return err;
    }
    return call_1.callErrorFromStatus({
        code,
        details: err.message,
        metadata,
    });
}
exports.makeServiceError = makeServiceError;
//# sourceMappingURL=util.js.map