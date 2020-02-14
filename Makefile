# @Author: guiguan
# @Date:   2019-06-03T13:42:50+10:00
# @Last modified by:   guiguan
# @Last modified time: 2020-02-14T11:11:57+11:00


APP_NAME := cli
PLAYGROUND_NAME := playground
PKGS := $(shell go list ./cmd/... ./pkg/...)

all: build

.PHONY: run build build-regen generate test test-dev clean playground doc grpcc

run:
	go run ./cmd/$(APP_NAME)
build:
	go build ./cmd/$(APP_NAME)
build-regen: generate build
generate:
	go generate $(PKGS)
test:
	go test $(PKGS)
test-dev:
	# -test.v verbose
	go test -count=1 -test.v $(PKGS)
clean:
	go clean -testcache $(PKGS)
	rm -f $(APP_NAME)* $(PLAYGROUND_NAME)*
playground:
	go run ./cmd/$(PLAYGROUND_NAME)/.
doc:
	# godoc doesn't support go module yet, so create a symlink in GOPATH as a workaround
	mkdir -p $(GOPATH)/src/github.com/SouthbankSoftware
	ln -sf $(PWD) $(GOPATH)/src/github.com/SouthbankSoftware
	godoc -http=:6060
