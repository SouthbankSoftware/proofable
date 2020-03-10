module github.com/SouthbankSoftware/provenx-cli

go 1.13

require (
	github.com/SouthbankSoftware/proven-cli v0.0.0-20200310044743-251326860e09
	github.com/SouthbankSoftware/provendb-tree v0.0.0-20200206025712-a21dbf2dd11f
	github.com/SouthbankSoftware/provendb-trie v0.0.0-20200220141434-383dded17254
	github.com/SouthbankSoftware/provenx-api v0.0.0-20200306132704-4e1d057664df
	github.com/djherbis/times v1.2.0
	github.com/fatih/color v1.7.0
	github.com/golang/protobuf v1.3.2
	github.com/google/go-cmp v0.4.0
	github.com/karrick/godirwalk v1.15.3
	github.com/korovkin/limiter v0.0.0-20170610225302-6b837f5fd496
	github.com/mitchellh/gox v1.0.1
	github.com/skratchdot/open-golang v0.0.0-20200116055534-eef842397966
	github.com/spf13/cobra v0.0.5
	github.com/spf13/viper v1.6.2
	golang.org/x/sync v0.0.0-20190911185100-cd5d95a43a6e
	google.golang.org/grpc v1.26.0
)

replace github.com/karrick/godirwalk => github.com/SouthbankSoftware/godirwalk v1.15.4-0.20200219064549-47f5e8f24e04
