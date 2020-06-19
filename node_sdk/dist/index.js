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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const grpc = __importStar(require("grpc"));
const api_1 = require("./api");
const metadata = new grpc.Metadata();
// metadata.add(
//   "authorization",
//   `Bearer ${
//     JSON.parse(
//       fs
//         .readFileSync(
//           "/Users/guiguan/Library/Application Support/ProvenDB/auth.json"
//         )
//         .toString()
//     ).authToken
//   }`
// );
metadata.add("authorization", "Bearer magic");
const client = api_1.newApiServiceClient("api.dev.proofable.io:443", metadata);
// const client = newApiServiceClient("localhost:10014", metadata, false);
// client
//   .getTries(new google_protobuf_empty_pb.Empty())
//   .on("data", (trie: Trie) => {
//     console.log(trie);
//   });
const tid = "tTe91wi91PwTqJSLQBQ6eZ6";
const cleanup = (id) => {
    console.log("cleaning up...");
    client.deleteTrie(id, (err) => {
        if (err) {
            console.error(err);
            return;
        }
    });
};
// client.importTrie(
//   tid,
//   path.join(__dirname, "../../test.proofable"),
//   (err, value) => {
//     if (err) {
//       console.error(err);
//       cleanup(tid);
//       return;
//     }
//     console.log("imported trie");
//     console.log(value!.toObject());
//     const tpr = new TrieProofRequest();
//     tpr.setTrieId(tid);
//     client.getTrieProof(tpr, (err, value) => {
//       if (err) {
//         console.error(err);
//         cleanup(tid);
//         return;
//       }
//       console.log("got trie proof");
//       console.log(value!.toObject());
//       // client.verifyTrieProof(
//       //   tid,
//       //   value!.getId(),
//       //   (err, value) => {
//       //     if (err) {
//       //       console.error(err);
//       //       cleanup(tid);
//       //       return;
//       //     }
//       //     console.log("verify trie proof result");
//       //     console.log(value!.toObject());
//       //     cleanup(tid);
//       //   },
//       //   undefined,
//       //   // (kv) => {
//       //   //   console.log(kv.toObject());
//       //   // },
//       //   "test.dot"
//       // );
//       const filter = new KeyValuesFilter();
//       filter.addKeys(Key.fromUtf8String("PS Playground/DSC00985.JPG"));
//       filter.addKeys(Key.fromUtf8String("Swifant.jpg"));
//       client.createKeyValuesProof(
//         tid,
//         value!.getId(),
//         filter,
//         "test.subproofable",
//         (err) => {
//           if (err) {
//             console.error(err);
//             cleanup(tid);
//             return;
//           }
//           console.log("created test.subproofable");
//           cleanup(tid);
//         }
//       );
//     });
//     // client.exportTrie(tid, "test.proofable", (err) => {
//     //   if (err) {
//     //     console.error(err);
//     //     cleanup(tid);
//     //     return;
//     //   }
//     //   cleanup(tid);
//     // });
//   }
// );
// client.verifyKeyValuesProof(
//   "test.subproofable",
//   (err, value) => {
//     if (err) {
//       console.error(err);
//       return;
//     }
//     console.log("verify key values proof result");
//     console.log(value!.toObject());
//   },
//   (kv) => {
//     kv = stripCompoundKeyAnchorTriePart(kv);
//     console.log(kv.to(undefined, "hex"));
//   },
//   "subtest.dot"
// );
(() => __awaiter(void 0, void 0, void 0, function* () {
    var e_1, _a;
    try {
        for (var _b = __asyncValues(client.verifyKeyValuesProof("test.subproofable", true, "subtest.dot")), _c; _c = yield _b.next(), !_c.done;) {
            const val = _c.value;
            console.log(val.toObject());
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) yield _a.call(_b);
        }
        finally { if (e_1) throw e_1.error; }
    }
}))();
//# sourceMappingURL=index.js.map