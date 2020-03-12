module github.com/SouthbankSoftware/provenx-cli

go 1.13

require (
	github.com/SouthbankSoftware/provendb-trie v0.0.0-20200220141434-383dded17254
	github.com/SouthbankSoftware/provenx-api v0.0.0-20200306132704-4e1d057664df
	github.com/dgrijalva/jwt-go v3.2.0+incompatible
	github.com/djherbis/times v1.2.0
	github.com/fatih/color v1.7.0
	github.com/golang/protobuf v1.3.2
	github.com/google/go-cmp v0.4.0
	github.com/karrick/godirwalk v1.15.3
	github.com/korovkin/limiter v0.0.0-20170610225302-6b837f5fd496
	github.com/manifoldco/promptui v0.6.0
	github.com/mattn/go-isatty v0.0.9 // indirect
	github.com/mitchellh/gox v1.0.1
	github.com/phayes/freeport v0.0.0-20180830031419-95f893ade6f2
	github.com/skratchdot/open-golang v0.0.0-20200116055534-eef842397966
	github.com/spf13/cobra v0.0.5
	github.com/spf13/viper v1.6.2
	golang.org/x/net v0.0.0-20200114155413-6afb5195e5aa
	golang.org/x/sync v0.0.0-20190911185100-cd5d95a43a6e
	google.golang.org/grpc v1.26.0
)

replace github.com/karrick/godirwalk => github.com/SouthbankSoftware/godirwalk v1.15.4-0.20200219064549-47f5e8f24e04
