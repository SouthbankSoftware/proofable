"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripCompoundKeyAnchorTriePart = exports.ANCHOR_KEY_SEP_LEN = void 0;
/**
 * The length of the key separator for the top anchor trie. For normal Proof_ETH_TRIE format, it
 * should be 1; for signed Proof_ETH_TRIE_SIGNED, it should be 2
 */
exports.ANCHOR_KEY_SEP_LEN = 1;
/**
 * Strips away the anchor trie part from the compound key. The anchor trie part of a key is added by
 * Anchor Service after a successful anchoring
 */
function stripCompoundKeyAnchorTriePart(kv) {
    const ks = kv.getKeySepList();
    if (ks.length < exports.ANCHOR_KEY_SEP_LEN) {
        return kv;
    }
    kv.setKey(kv.getKey_asU8().slice(ks[exports.ANCHOR_KEY_SEP_LEN - 1]));
    kv.setKeySepList(ks.slice(exports.ANCHOR_KEY_SEP_LEN));
    return kv;
}
exports.stripCompoundKeyAnchorTriePart = stripCompoundKeyAnchorTriePart;
//# sourceMappingURL=util.js.map