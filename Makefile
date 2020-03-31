# provenx
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
# @Last modified time: 2020-03-31T17:03:20+11:00

APP_NAME := provenx-cli
APP_VERSION ?= 0.0.0
PROJECT_IMPORT_PATH := github.com/SouthbankSoftware/$(APP_NAME)
PLAYGROUND_NAME := playground
PKGS := $(shell go list ./cmd/... ./pkg/...)
LD_FLAGS := -ldflags \
"-X $(PROJECT_IMPORT_PATH)/cmd/$(APP_NAME)/cmd.version=$(APP_VERSION)"

all: build

.PHONY: run build build-regen generate test test-dev clean playground doc grpcc

run:
	go run $(LD_FLAGS) ./cmd/$(APP_NAME)
run-example:
	go run $(LD_FLAGS) ./docs/example.go
build:
	go build $(LD_FLAGS) ./cmd/$(APP_NAME)
build-regen: generate build
build-all:
	go run github.com/mitchellh/gox -osarch="linux/amd64 windows/amd64 darwin/amd64" $(LD_FLAGS) ./cmd/$(APP_NAME)
generate:
	go generate $(PKGS)
test:
	go test $(LD_FLAGS) $(PKGS)
test-dev:
	# -test.v verbose
	go test $(LD_FLAGS) -count=1 -test.v $(PKGS)
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
