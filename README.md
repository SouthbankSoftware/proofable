# [Proofable](https://github.com/SouthbankSoftware/proofable)

<!-- ANCHOR: introduction -->
[![go.dev reference](https://img.shields.io/badge/go.dev-reference-007d9c?logo=go&logoColor=white&style=flat-square)](https://pkg.go.dev/github.com/SouthbankSoftware/proofable/pkg/api?tab=doc)
[![Go Report Card](https://goreportcard.com/badge/github.com/SouthbankSoftware/proofable?style=flat-square)](https://goreportcard.com/report/github.com/SouthbankSoftware/proofable)
[![NPM Package](https://img.shields.io/npm/v/proofable?style=flat-square)](https://www.npmjs.com/package/proofable)
[![Proofable Test Status](https://concourse.provendb.com/api/v1/teams/main/pipelines/proofable-test/jobs/test/badge?title=pr)](http://concourse.provendb.com/teams/main/pipelines/proofable-test)
[![Proofable CLI Deploy Status](https://concourse.provendb.com/api/v1/teams/main/pipelines/proofable-deploy/jobs/build-and-deploy/badge?title=cli)](http://concourse.provendb.com/teams/main/pipelines/proofable-deploy)

Proofable is a general purpose proving framework for certifying digital assets to public blockchains. Overall, it consists:

- [**CLI** (`proofable-cli`)](https://docs.proofable.io/cli): the command-line interface (CLI) for API Service (`proofable-api`). At the moment, it supports proving a file-system to a blockchain

- [**API Service** (`proofable-api`)](https://docs.proofable.io/grpc/api_service.html): the general purpose proving service that is fast and effective. It provides a set of APIs to manipulate [trie structures](https://docs.proofable.io/concepts/trie.html) and generate blockchain proofs for any digital asset. A [trie](https://docs.proofable.io/concepts/trie.html) is a dictionary of ordered key-values that can be built incrementally, whose root hash at any given time can be derived efficiently. Once the root hash is proven to a blockchain, every key-value is proven, so as the digital asset stored in that key-value

- [**Anchor Service** (`provendb-anchor`)](https://docs.proofable.io/grpc/anchor_service.html): the service continuously anchors hashes to blockchains, which is similar to what Chainpoint does, but with much better performance and flexibility. It supports multiple anchor types and proof formats. Digital signing can be also done at the Merkle root level. It is consumed by `proofable-api`, which is not directly public-accessible at the moment
<!-- ANCHOR_END: introduction -->

Please checkout the [documentation](https://docs.proofable.io) or [website](https://www.proofable.io) for more details
