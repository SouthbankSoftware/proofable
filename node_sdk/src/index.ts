import * as grpc from "grpc";
import path from "path";
import fs from "fs";
import {
  newApiServiceClient,
  Trie,
  TrieProofRequest,
  KeyValuesFilter,
  Key,
  TrieRequest,
  stripCompoundKeyAnchorTriePart,
  KeyValue,
  TrieKeyValuesRequest,
} from "./api";

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

const client = newApiServiceClient("api.dev.proofable.io:443", metadata);
// const client = newApiServiceClient("localhost:10014", metadata, false);

// client
//   .getTries(new google_protobuf_empty_pb.Empty())
//   .on("data", (trie: Trie) => {
//     console.log(trie);
//   });

const tid = "tTe91wi91PwTqJSLQBQ6eZ6";

const cleanup = (id: string) => {
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

(async () => {
  try {
    // for await (const val of client.verifyKeyValuesProof(
    //   "test.subproofable",
    //   true,
    //   "subtest.dot"
    // )) {
    //   console.log(val.toObject());
    // }
    // const trie = await client.createTrie();
    // for await (const val of client.getTries()) {
    //   console.log(val.toObject());
    // }
    // cleanup(trie.getId());

    let trie = await client.createTrie();

    trie = await client.setTrieKeyValues(trie.getId(), trie.getRoot(), [
      KeyValue.from("key1", "value1"),
      KeyValue.from("key2", "value2"),
    ]);

    for await (const val of client.getTrieKeyValues(
      trie.getId(),
      trie.getRoot()
    )) {
      console.log(val.to());
    }

    cleanup(trie.getId());
  } catch (e) {
    console.error(e);
  }
})();
