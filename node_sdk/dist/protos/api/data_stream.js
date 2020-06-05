"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pipeToWritableStream = exports.pipeFromReadableStream = exports.MAX_DATA_CHUNK_SIZE = void 0;
const lodash_1 = __importDefault(require("lodash"));
const api_pb_1 = require("./api_pb");
const util_1 = require("./util");
/**
 * The buffer size used in data stream handling
 */
exports.MAX_DATA_CHUNK_SIZE = 1024;
/**
 * Pipe the readable stream to the gRPC writable data stream
 *
 * @param onFirstDataChunk callback function when the first DataChunk is about to be generated. Use
 * this for setting any necessary metadata for this gRPC call
 * @param onEnd callback function when the pipe operation is ended. Use this to close the writer. If
 * the `err` is not undefined, it means an error has happened during the operation
 * @returns a [[`CleanupFn`]] for external logic to interrupt and cleanup the pipe operation
 */
function pipeFromReadableStream(from, to, onFirstDataChunk, onEnd) {
    let er;
    // make sure to only cleanup once
    const cleanup = lodash_1.default.once((err) => {
        er = er || err;
        onEnd && onEnd(er);
        if (er) {
            // cleanup
            from.destroyed || from.destroy();
            to.cancel();
            to.destroyed || to.destroy();
        }
    });
    const handleError = (err) => {
        er = er || util_1.makeServiceError(err);
        cleanup();
    };
    let first = true;
    from
        .on("error", handleError)
        .on("readable", () => {
        let chunk;
        while (null !== (chunk = from.read(exports.MAX_DATA_CHUNK_SIZE))) {
            const dc = new api_pb_1.DataChunk();
            dc.setData(chunk);
            if (first) {
                first = false;
                onFirstDataChunk && onFirstDataChunk(dc);
            }
            to.write(dc);
        }
    })
        .on("end", cleanup);
    to.on("error", handleError);
    return cleanup;
}
exports.pipeFromReadableStream = pipeFromReadableStream;
/**
 * Pipe the gRPC readable data stream to the writable stream
 *
 * @param onFirstDataChunk callback function when the first DataChunk is received. Use
 * this to access any metadata in this gRPC call reply
 * @param onEnd callback function when the pipe operation is ended. Use this to close the writer. If
 * the `err` is not undefined, it means an error has happened during the operation
 * @returns a [[`CleanupFn`]] for external logic to interrupt and cleanup the pipe operation
 */
function pipeToWritableStream(from, to, onFirstDataChunk, onEnd) {
    let er;
    // make sure to only cleanup once
    const cleanup = lodash_1.default.once((err) => {
        er = er || err;
        onEnd && onEnd(er);
        if (er) {
            // cleanup
            from.cancel();
            from.destroyed || from.destroy();
            to.destroyed || to.destroy();
        }
    });
    const handleError = (err) => {
        er = er || util_1.makeServiceError(err);
        cleanup();
    };
    let first = true;
    from
        .on("error", handleError)
        .on("data", (dc) => {
        if (first) {
            first = false;
            onFirstDataChunk && onFirstDataChunk(dc);
        }
        to.write(dc.getData());
    })
        .on("end", cleanup);
    to.on("error", handleError);
    return cleanup;
}
exports.pipeToWritableStream = pipeToWritableStream;
//# sourceMappingURL=data_stream.js.map