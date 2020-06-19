"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyKeyValuesProofPromise = exports.verifyKeyValuesProof = exports.verifyTrieProof = exports.createKeyValuesProof = exports.setTrieKeyValues = exports.exportTrie = exports.importTrie = exports.deleteTrie = exports.createTriePromise = exports.createTrie = void 0;
const lodash_1 = __importDefault(require("lodash"));
const fs_1 = __importDefault(require("fs"));
const empty_pb_1 = require("google-protobuf/google/protobuf/empty_pb");
const event_iterator_1 = require("event-iterator");
const api_1 = require("../protos/api");
function createTrie(cli, callback) {
    return cli.createTrie(new empty_pb_1.Empty(), callback);
}
exports.createTrie = createTrie;
function createTriePromise(cli) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            createTrie(cli, (err, value) => {
                if (err) {
                    reject(err);
                }
                resolve(value);
            });
        });
    });
}
exports.createTriePromise = createTriePromise;
function deleteTrie(cli, id, callback) {
    return cli.deleteTrie(api_1.TrieRequest.from(id), callback);
}
exports.deleteTrie = deleteTrie;
function importTrie(cli, id, path, callback) {
    const inFile = fs_1.default.createReadStream(path);
    // we use the first error
    let cleanup, er;
    const stream = cli.importTrie((err, value) => {
        // the error could come from here
        er = er || err;
        if (er) {
            cleanup(er);
            callback(er);
            return;
        }
        callback(null, value);
    });
    cleanup = api_1.pipeFromReadableStream(inFile, stream, (dc) => {
        dc.setTrieRequest(api_1.TrieRequest.from(id));
    }, (err) => {
        // and here
        er = er || err;
        stream.end();
    });
    return stream;
}
exports.importTrie = importTrie;
function exportTrie(cli, id, outputPath, callback) {
    const outFile = fs_1.default.createWriteStream(outputPath);
    const stream = cli.exportTrie(api_1.TrieRequest.from(id));
    api_1.pipeToWritableStream(stream, outFile, undefined, (err) => {
        outFile.end();
        callback(err);
    });
    return stream;
}
exports.exportTrie = exportTrie;
function setTrieKeyValues(cli, id, root, iter, callback) {
    const stream = cli.setTrieKeyValues(callback);
    let first = true;
    for (const kv of iter) {
        if (first) {
            first = false;
            kv.setTrieKeyValuesRequest(api_1.TrieKeyValuesRequest.from(id, root));
        }
        stream.write(kv);
    }
    stream.end();
    return stream;
}
exports.setTrieKeyValues = setTrieKeyValues;
function createKeyValuesProof(cli, trieId, proofId, filter, outputPath, callback) {
    const outFile = fs_1.default.createWriteStream(outputPath);
    const request = new api_1.CreateKeyValuesProofRequest();
    request.setTrieId(trieId);
    if (filter) {
        request.setFilter(filter);
    }
    if (proofId) {
        request.setProofId(proofId);
    }
    else {
        const r = new api_1.CreateTrieProofRequest();
        r.setTrieId(trieId);
        request.setRequest(r);
    }
    const stream = cli.createKeyValuesProof(request);
    api_1.pipeToWritableStream(stream, outFile, undefined, (err) => {
        outFile.end();
        callback(err);
    });
    return stream;
}
exports.createKeyValuesProof = createKeyValuesProof;
function verifyTrieProof(cli, trieId, proofId, callback, onKeyValue, dotGraphOutputPath) {
    const request = new api_1.VerifyTrieProofRequest();
    request.setTrieId(trieId);
    request.setProofId(proofId);
    onKeyValue && request.setOutputKeyValues(true);
    dotGraphOutputPath && request.setOutputDotGraph(true);
    const stream = cli.verifyTrieProof(request);
    const rs = new api_1.VerifyProofReplyStream(stream, callback, onKeyValue);
    if (dotGraphOutputPath) {
        const outFile = fs_1.default.createWriteStream(dotGraphOutputPath);
        api_1.pipeToWritableStream(rs.dataStream, outFile, undefined, () => {
            outFile.end();
        });
    }
    return stream;
}
exports.verifyTrieProof = verifyTrieProof;
function verifyKeyValuesProof(cli, path, callback, onKeyValue, dotGraphOutputPath) {
    const inFile = fs_1.default.createReadStream(path);
    const stream = cli.verifyKeyValuesProof();
    callback = lodash_1.default.once(callback);
    api_1.pipeFromReadableStream(inFile, stream, (dc) => {
        const request = new api_1.VerifyKeyValuesProofRequest();
        onKeyValue && request.setOutputKeyValues(true);
        dotGraphOutputPath && request.setOutputDotGraph(true);
        dc.setVerifyKeyValuesProofRequest(request);
    }, (err) => {
        if (err) {
            callback(err);
            return;
        }
        stream.end();
    });
    const rs = new api_1.VerifyProofReplyStream(stream, callback, onKeyValue);
    if (dotGraphOutputPath) {
        const outFile = fs_1.default.createWriteStream(dotGraphOutputPath);
        api_1.pipeToWritableStream(rs.dataStream, outFile, undefined, () => {
            outFile.end();
        });
    }
    return stream;
}
exports.verifyKeyValuesProof = verifyKeyValuesProof;
function verifyKeyValuesProofPromise(cli, path, outputKeyValues = false, dotGraphOutputPath) {
    return new event_iterator_1.EventIterator((queue) => {
        const sc = verifyKeyValuesProof(cli, path, (err, reply) => {
            if (err) {
                queue.fail(err);
                return;
            }
            queue.push(reply);
            queue.stop();
        }, outputKeyValues ? queue.push : undefined, dotGraphOutputPath);
        return sc.cancel;
    });
}
exports.verifyKeyValuesProofPromise = verifyKeyValuesProofPromise;
//# sourceMappingURL=api.js.map