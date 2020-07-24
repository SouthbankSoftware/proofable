#!/bin/bash
set -eu

PLATFORM=$(uname)
ENV=${ENV:="prd"}
INSTALL_PATH=${INSTALL_PATH:="/usr/local/bin"}

if [[ "$PLATFORM" = "Darwin" ]]; then
    DOWNLOAD_LINK="https://storage.googleapis.com/provendb-$ENV/proofable-cli/proofable-cli_darwin_amd64.tar.gz"
elif [[ "$PLATFORM" = "Linux" ]]; then
    DOWNLOAD_LINK="https://storage.googleapis.com/provendb-$ENV/proofable-cli/proofable-cli_linux_amd64.tar.gz"
else
    echo "unsupported platform \`$PLATFORM\`, please try to build from source: https://github.com/SouthbankSoftware/proofable/tree/master/cmd/proofable-cli#build-your-own-binary"
    exit 1
fi

echo -e "installing from \`$DOWNLOAD_LINK\` to \`$INSTALL_PATH\`...\n"

if [[ $(command -v curl) ]]; then
    DOWNLOAD_CMD="curl \"$DOWNLOAD_LINK\""
elif [[ $(command -v wget) ]]; then
    DOWNLOAD_CMD="wget -O- \"$DOWNLOAD_LINK\""
else
    echo "neither \`curl\` nor \`wget\` is installed, please download and install the binary manually: https://github.com/SouthbankSoftware/proofable/tree/master/cmd/proofable-cli#download-prd-released-binaries"
    exit 1
fi

mkdir -p "$INSTALL_PATH"
eval "$DOWNLOAD_CMD" | tar -zxvC "$INSTALL_PATH" --no-same-owner
