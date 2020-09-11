# proofable
# Copyright (C) 2020  Southbank Software Ltd.
# 
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU Affero General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
# 
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU Affero General Public License for more details.
# 
# You should have received a copy of the GNU Affero General Public License
# along with this program.  If not, see <http://www.gnu.org/licenses/>.
# 
# 
# @Author: guiguan
# @Date:   2019-06-03T13:42:50+10:00
# @Last modified by:   guiguan
# @Last modified time: 2020-09-10T23:59:57+10:00

PROJECT_NAME := proofable
PROJECT_IMPORT_PATH := github.com/SouthbankSoftware/$(PROJECT_NAME)
APP_NAME := $(PROJECT_NAME)-cli
APP_VERSION ?= 0.0.0
PLAYGROUND_NAME := playground
PKGS := $(shell go list ./cmd/... ./pkg/...)
LD_FLAGS := -ldflags \
"-X $(PROJECT_IMPORT_PATH)/cmd/$(APP_NAME)/cmd.version=$(APP_VERSION)"

all: build

run:
	go run $(LD_FLAGS) ./cmd/$(APP_NAME)
run-example:
	go run $(LD_FLAGS) ./docs/example.go
build:
	go build $(LD_FLAGS) ./cmd/$(APP_NAME)
build-regen: generate build
build-all:
	go run src.techknowlogick.com/xgo --deps=https://gmplib.org/download/gmp/gmp-6.0.0a.tar.bz2 --targets=linux/amd64,windows/amd64,darwin/amd64 --pkg cmd/$(APP_NAME) $(LD_FLAGS) $(PROJECT_IMPORT_PATH)
generate:
	go generate $(PKGS)
test:
	go test $(LD_FLAGS) $(PKGS)
test-dev:
	# -test.v verbose
	go test $(LD_FLAGS) -count=1 -test.v $(PKGS)
test-all: test-dev
	cd node_sdk && npm i && npm t
clean:
	go clean -testcache $(PKGS)
	rm -f $(APP_NAME)* $(PLAYGROUND_NAME)*
.PHONY: playground
playground:
	go run ./cmd/$(PLAYGROUND_NAME)/.

doc-init:
	mkdir -p docs_output
	cd docs_output && git clone https://github.com/SouthbankSoftware/proofable.git --single-branch --branch gh-pages gh-pages
	cd docs_output && git clone https://github.com/SouthbankSoftware/provendb-releases.git --single-branch --branch prd prd-releases
	cd node_sdk && npm install
	make doc-node
	ln -sf ../../docs_output/gh-pages/node_sdk/reference docs/node_sdk/
doc-dev:
	mdbook serve -n 0.0.0.0
doc-build:
	rm -rf docs_output/book
	mdbook build
doc-deploy:
	rsync -r --exclude=node_sdk/reference --exclude=.git --delete docs_output/book/html/ docs_output/gh-pages
doc-clean:
	rm -rf docs/node_sdk/reference
	rm -rf docs_output
# we use pkg.go.dev instead of this
doc-go:
	# godoc doesn't support go module yet, so create a symlink in GOPATH as a workaround
	mkdir -p $(GOPATH)/src/github.com/SouthbankSoftware
	ln -sf $(PWD) $(GOPATH)/src/github.com/SouthbankSoftware
	godoc -http=:6060
doc-node:
	cd node_sdk && npm run doc
doc-anchortypes:
	cd docs_output/prd-releases && git config pull.ff only
	go run ./tools/anchor-types-updater
