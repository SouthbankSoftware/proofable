"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyProofReplyStream = void 0;
const events_1 = require("events");
const api_pb_1 = require("./api_pb");
const util_1 = require("./util");
class VerifyProofReplyStream {
    constructor(stream, callback, onKeyValue) {
        let emitter = new events_1.EventEmitter();
        let er, reply;
        const destroy = () => {
            if (!emitter) {
                return;
            }
            emitter.removeAllListeners();
            emitter = null;
            callback(er, reply);
            if (er) {
                stream.cancel();
                stream.destroyed || stream.destroy();
            }
        };
        const handleError = (err) => {
            er = er || util_1.makeServiceError(err);
            emitter === null || emitter === void 0 ? void 0 : emitter.emit("error", er);
            destroy();
        };
        stream = stream
            .on("error", handleError)
            .on("data", (rc) => {
            const { DataCase } = api_pb_1.VerifyProofReplyChunk;
            switch (rc.getDataCase()) {
                case DataCase.DOT_GRAPH_CHUNK: {
                    emitter === null || emitter === void 0 ? void 0 : emitter.emit("data", rc.getDotGraphChunk());
                    break;
                }
                case DataCase.KEY_VALUE: {
                    onKeyValue && onKeyValue(rc.getKeyValue());
                    break;
                }
                case DataCase.REPLY: {
                    reply = rc.getReply();
                    break;
                }
                default:
                    throw new Error(`unexpected \`VerifyProofReplyChunk.DataCase\`: ${rc.getDataCase()}`);
            }
        })
            .on("end", () => {
            emitter === null || emitter === void 0 ? void 0 : emitter.emit("end");
            destroy();
        });
        this.dataStream = {
            get destroyed() {
                return emitter == null;
            },
            destroy,
            cancel: destroy,
            on(event, listener) {
                emitter === null || emitter === void 0 ? void 0 : emitter.on(event, listener);
                return this;
            },
        };
    }
}
exports.VerifyProofReplyStream = VerifyProofReplyStream;
//# sourceMappingURL=verify_proof_reply_stream.js.map