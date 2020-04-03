module github.com/SouthbankSoftware/proofable

go 1.13

require (
	github.com/SouthbankSoftware/provendb-verify v0.0.0-20191213041926-116747edc9ab
	github.com/dgrijalva/jwt-go v3.2.0+incompatible
	github.com/djherbis/times v1.2.0
	github.com/fatih/color v1.7.0
	github.com/golang/protobuf v1.3.2
	github.com/google/go-cmp v0.4.0
	github.com/karrick/godirwalk v1.15.3
	github.com/korovkin/limiter v0.0.0-20170610225302-6b837f5fd496
	github.com/manifoldco/promptui v0.6.0
	github.com/mitchellh/gox v1.0.1
	github.com/phayes/freeport v0.0.0-20180830031419-95f893ade6f2
	github.com/skratchdot/open-golang v0.0.0-20200116055534-eef842397966
	github.com/spf13/afero v1.2.1 // indirect
	github.com/spf13/cobra v0.0.5
	github.com/spf13/jwalterweatherman v1.1.0 // indirect
	github.com/spf13/viper v1.6.2
	golang.org/x/crypto v0.0.0-20200117160349-530e935923ad
	golang.org/x/lint v0.0.0-20190930215403-16217165b5de // indirect
	golang.org/x/net v0.0.0-20200114155413-6afb5195e5aa
	golang.org/x/sync v0.0.0-20190911185100-cd5d95a43a6e
	golang.org/x/sys v0.0.0-20190916202348-b4ddaad3f8a3 // indirect
	golang.org/x/text v0.3.2 // indirect
	golang.org/x/tools v0.0.0-20191029190741-b9c20aec41a5 // indirect
	google.golang.org/grpc v1.26.0
)

replace github.com/karrick/godirwalk => github.com/SouthbankSoftware/godirwalk v1.15.4-0.20200319040501-49f7c4f93f76
