# ProvenX

## API Service

API Service is a general purpose proving service that is fast and effective. It provides a set of APIs to manipulate trie structures and generate blockchain proofs for any digital assets. A trie is a dictionary of key-values that can be built incrementally, whose root hash at any given time can be also dervied efficiently. Once the root hash is proven to a Blockchain, every key-value is also proven, so as the digital asset stored in that key-value

[gRPC API](api.html)

## Anchor Service

Anchor Service continuously anchors hashes to Blockchains, which is similar to what Chainpoint does, but with much better performance and flexibility. It supports multiple anchor types and proof formats. Digital signing can be also done at the Merkle root level

[gRPC API](anchor.html)
