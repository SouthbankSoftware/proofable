# provenx-cli

`provenx-cli` is a simple CLI for ProvenX API Service (`provenx-api`)

## TODO

- [ ] code and ux review
- [ ] Linux UAT
- [ ] Windows UAT

## Usage

### Download dev binaries

- [mac](https://storage.googleapis.com/provendb-dev/provenx-cli/provenx-cli_darwin_amd64)
- [linux](https://storage.googleapis.com/provendb-dev/provenx-cli/provenx-cli_linux_amd64)
- [windows](https://storage.googleapis.com/provendb-dev/provenx-cli/provenx-cli_windows_amd64.exe)

### Build your own binary

```bash
# generate the `provenx-cli` binary
make
```

### Examples

```bash
# for help
./provenx-cli -h

# authenticate with ProvenDB. You don't have to explicitly run this. When you execute a command that requires authentication, it will be automatically run
./provenx-cli auth

# remove existing authentication
./provenx-cli auth -d

# create a proof for a path
./provenx-cli create proof path/to/the/data

# create a proof for a path in a custom location
./provenx-cli create proof path/to/the/data -p path/to/output/the/proof.pxproof

# create a proof for a path including metadata
./provenx-cli create proof path/to/the/data --include-metadata

# verify a proof for a path
./provenx-cli verify proof path/to/the/data

# verify a proof for a path and output the proof's Graphviz Dot Graph
./provenx-cli verify proof path/to/the/data -d path/to/output/the/dot/graph.dot

# verify a proof for a path from a custom location
./provenx-cli verify proof path/to/the/data -p path/to/the/proof.pxproof

# create a subproof out of a proof
./provenx-cli create subproof key1_of_the_proof key2_of_the_proof -p path/to/the/proof.pxproof -s path/to/output/the/subproof.pxsubproof

# verify a subproof for a path
./provenx-cli verify subproof path/to/the/data -s path/to/the/subproof.pxsubproof

# verify a subproof for a path and output the subproof's Graphviz Dot Graph
./provenx-cli verify subproof path/to/the/data -s path/to/the/subproof.pxsubproof -d path/to/output/the/dot/graph.dot
```

## FAQ

### Error: "provenx-cli_darwin_amd64" cannot be opened because the developer cannot be verified

![Mac Cannot Open Issue](docs/mac_cannot_open_issue.png)

Use the following command to fix:

```bash
xattr -d com.apple.quarantine path/to/provenx-cli_darwin_amd64
```
