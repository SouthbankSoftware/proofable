"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.newApiServiceClient = exports.APIServiceClient = void 0;
const grpc = __importStar(require("grpc"));
const api_grpc_pb_1 = require("../protos/api/api_grpc_pb");
const api_pb_1 = require("../protos/api/api_pb");
const api_1 = require("./api");
api_pb_1.TrieRequest.from = (id) => {
    const tr = new api_pb_1.TrieRequest();
    tr.setTrieId(id);
    return tr;
};
api_pb_1.TrieKeyValueRequest.from = (id, root, key) => {
    const r = new api_pb_1.TrieKeyValueRequest();
    r.setTrieId(id);
    r.setRoot(root);
    r.setKey(key);
    return r;
};
api_pb_1.TrieKeyValuesRequest.from = (id, root) => {
    const r = new api_pb_1.TrieKeyValuesRequest();
    r.setTrieId(id);
    r.setRoot(root);
    return r;
};
api_pb_1.Key.from = (key, keyEncoding) => {
    const k = new api_pb_1.Key();
    k.setKey(Buffer.from(key, keyEncoding !== null && keyEncoding !== void 0 ? keyEncoding : "utf8"));
    return k;
};
api_pb_1.KeyValue.from = (key, val, keyEncoding, valEncoding) => {
    const kv = new api_pb_1.KeyValue();
    kv.setKey(Buffer.from(key, keyEncoding !== null && keyEncoding !== void 0 ? keyEncoding : "utf8"));
    kv.setValue(Buffer.from(val, valEncoding !== null && valEncoding !== void 0 ? valEncoding : "utf8"));
    return kv;
};
api_pb_1.KeyValue.prototype.to = function (keyEncoding, valEncoding) {
    return {
        key: Buffer.from(this.getKey_asU8()).toString(keyEncoding !== null && keyEncoding !== void 0 ? keyEncoding : "utf8"),
        val: Buffer.from(this.getValue_asU8()).toString(valEncoding !== null && valEncoding !== void 0 ? valEncoding : "utf8"),
    };
};
class APIServiceClient extends api_grpc_pb_1.APIServiceClient {
    createTrie(arg1, arg2, arg3, arg4) {
        if (!arg1) {
            return api_1.createTriePromise(this);
        }
        else if (typeof arg1 === "function") {
            return api_1.createTrie(this, arg1);
        }
        return super.createTrie(arg1, arg2, arg3, arg4);
    }
    deleteTrie(arg1, arg2, arg3, arg4) {
        if (typeof arg1 === "string") {
            return api_1.deleteTrie(this, arg1, arg2);
        }
        return super.deleteTrie(arg1, arg2, arg3, arg4);
    }
    importTrie(arg1, arg2, arg3) {
        if (typeof arg1 === "string") {
            return api_1.importTrie(this, arg1, arg2, arg3);
        }
        return super.importTrie(arg1, arg2, arg3);
    }
    exportTrie(arg1, arg2, arg3) {
        if (typeof arg1 === "string") {
            return api_1.exportTrie(this, arg1, arg2, arg3);
        }
        return super.exportTrie(arg1, arg2, arg3);
    }
    setTrieKeyValues(arg1, arg2, arg3, arg4) {
        if (typeof arg1 === "string") {
            return api_1.setTrieKeyValues(this, arg1, arg2, arg3, arg4);
        }
        return super.setTrieKeyValues(arg1, arg2, arg3);
    }
    createKeyValuesProof(arg1, arg2, arg3, arg4, arg5) {
        if (typeof arg1 === "string") {
            return api_1.createKeyValuesProof(this, arg1, arg2, arg3, arg4, arg5);
        }
        return super.createKeyValuesProof(arg1, arg2, arg3);
    }
    verifyTrieProof(arg1, arg2, arg3, arg4, arg5) {
        if (typeof arg1 === "string") {
            return api_1.verifyTrieProof(this, arg1, arg2, arg3, arg4, arg5);
        }
        return super.verifyTrieProof(arg1, arg2, arg3);
    }
    verifyKeyValuesProof(arg1, arg2, arg3, arg4) {
        if (typeof arg1 === "string") {
            return api_1.verifyKeyValuesProof(this, arg1, arg2, arg3, arg4);
        }
        return super.verifyKeyValuesProof(arg1, arg2);
    }
}
exports.APIServiceClient = APIServiceClient;
/**
 * Creates a new API Service client
 */
function newApiServiceClient(hostPort, metadata, secure = true) {
    const callCreds = grpc.credentials.createFromMetadataGenerator((args, callback) => {
        callback(null, metadata);
    });
    let creds;
    if (secure) {
        creds = grpc.credentials.combineChannelCredentials(grpc.credentials.createSsl(), callCreds);
    }
    else {
        creds = grpc.credentials.createInsecure();
        // they don't have a public API to do this: https://github.com/grpc/grpc-node/issues/543
        creds.callCredentials = callCreds;
    }
    return new APIServiceClient(hostPort, creds);
}
exports.newApiServiceClient = newApiServiceClient;
//# sourceMappingURL=client.js.map