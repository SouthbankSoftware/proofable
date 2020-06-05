import { KeyValue } from "../protos/api/api_pb";
/**
 * The length of the key separator for the top anchor trie. For normal Proof_ETH_TRIE format, it
 * should be 1; for signed Proof_ETH_TRIE_SIGNED, it should be 2
 */
export declare let ANCHOR_KEY_SEP_LEN: number;
/**
 * Strips away the anchor trie part from the compound key. The anchor trie part of a key is added by
 * Anchor Service after a successful anchoring
 */
export declare function stripCompoundKeyAnchorTriePart(kv: KeyValue): KeyValue;
