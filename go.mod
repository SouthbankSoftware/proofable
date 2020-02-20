module github.com/SouthbankSoftware/provenx-cli

go 1.13

require (
	github.com/SouthbankSoftware/provendb-trie v0.0.0-20200219060512-36059a13c545
	github.com/SouthbankSoftware/provenx-api v0.0.0-20200212060654-5b18c8134017
	github.com/fatih/color v1.7.0
	github.com/golang/protobuf v1.3.2
	github.com/google/go-cmp v0.4.0
	github.com/karrick/godirwalk v1.15.3
	github.com/korovkin/limiter v0.0.0-20170610225302-6b837f5fd496
	github.com/mitchellh/gox v1.0.1
	github.com/spf13/cobra v0.0.5
	github.com/spf13/viper v1.6.2
	golang.org/x/sync v0.0.0-20190911185100-cd5d95a43a6e
	google.golang.org/grpc v1.26.0
)

replace github.com/karrick/godirwalk => github.com/SouthbankSoftware/godirwalk v1.15.4-0.20200219064549-47f5e8f24e04
