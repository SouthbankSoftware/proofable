# provenx-cli

`provenx-cli` is a simple CLI for ProvenX API Service (`provenx-api`)

## Usage

_**Currently**_, `provenx-cli` connects directly to the dev `provenx-api` with TLS and magic auth token. File metadata is not included in generation.

```bash
# generate the `provenx-cli` binary
make

# for help
./provenx-cli -h

# create a trie for a path
./provenx-cli create trie path/to/the/data

# verify a trie for a path
./provenx-cli verify trie path/to/the/data

# verify a trie for a path and output the trie's Graphviz Dot Graph
./provenx-cli verify trie path/to/the/data -d path/to/output/the/dot/graph
```
