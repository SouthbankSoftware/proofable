# [proofable-cli](https://github.com/SouthbankSoftware/proofable/tree/master/cmd/proofable-cli) <!-- omit in toc -->

<!-- ANCHOR: introduction -->
[![Proofable CLI Deploy Status](https://concourse.provendb.com/api/v1/teams/main/pipelines/proofable-deploy/jobs/build-and-deploy/badge?title=cli)](http://concourse.provendb.com/teams/main/pipelines/proofable-deploy)

`proofable-cli` is the command-line interface (CLI) for [Proofable](https://docs.proofable.io/) API Service (`proofable-api`). At the moment, it supports certifying a file-system to blockchains
<!-- ANCHOR_END: introduction -->

#### Table of contents  <!-- omit in toc -->
- [Usage](#usage)
  - [For macOS users](#for-macos-users)
    - [Install via Homebrew](#install-via-homebrew)
    - [Install directly](#install-directly)
  - [For Linux users](#for-linux-users)
    - [Install via Homebrew](#install-via-homebrew-1)
    - [Install directly](#install-directly-1)
  - [For Windows users](#for-windows-users)
    - [Install directly](#install-directly-2)
    - [Install directly in Windows Subsystem for Linux (WSL)](#install-directly-in-windows-subsystem-for-linux-wsl)
  - [Build your own binary](#build-your-own-binary)
  - [Examples](#examples)
- [Binaries](#binaries)
  - [Dev (cutting-edge) binaries](#dev-cutting-edge-binaries)
  - [Prd (released) binaries](#prd-released-binaries)
- [Development](#development)
- [FAQ](#faq)

## Usage

<!-- ANCHOR: installation -->
### For macOS users

#### Install via [Homebrew](https://brew.sh/)

1. `brew tap southbanksoftware/proofable`
2. `brew install proofable-cli`

Later on, you can upgrade to the latest version using: `brew upgrade proofable-cli`

#### Install directly

Copy and paste the following bash command in a [macOS Terminal](https://support.apple.com/en-au/guide/terminal/welcome/mac):

```bash
bash -c "$(eval "$(if [[ $(command -v curl) ]]; then echo "curl -fsSL"; else echo "wget -qO-"; fi) https://raw.githubusercontent.com/SouthbankSoftware/proofable/master/cmd/proofable-cli/install.sh")"
```

Then hit return to run, which will install the latest `proofable-cli` binary into `/usr/local/bin`. Then you can use the CLI as:

```bash
proofable-cli -h
```

If you want to install the latest dev (cutting edge) binary, using:

```bash
ENV=dev bash -c "$(eval "$(if [[ $(command -v curl) ]]; then echo "curl -fsSL"; else echo "wget -qO-"; fi) https://raw.githubusercontent.com/SouthbankSoftware/proofable/master/cmd/proofable-cli/install.sh")"
```

To upgrade, simply repeat the installation steps

### For Linux users

#### Install via [Homebrew](https://brew.sh/)

1. `brew tap southbanksoftware/proofable`
2. `brew install proofable-cli`

Later on, you can upgrade to the latest version using: `brew upgrade proofable-cli`

#### Install directly

Copy and paste the following bash command in a [Linux shell prompt](https://ubuntu.com/tutorials/command-line-for-beginners#1-overview):

```bash
sudo bash -c "$(eval "$(if [[ $(command -v curl) ]]; then echo "curl -fsSL"; else echo "wget -qO-"; fi) https://raw.githubusercontent.com/SouthbankSoftware/proofable/master/cmd/proofable-cli/install.sh")"
```

Then hit return to run, which will install the latest `proofable-cli` binary into `/usr/local/bin`. Then you can use the CLI as:

```bash
proofable-cli -h
```

If you want to install the latest dev (cutting edge) binary, using:

```bash
sudo ENV=dev bash -c "$(eval "$(if [[ $(command -v curl) ]]; then echo "curl -fsSL"; else echo "wget -qO-"; fi) https://raw.githubusercontent.com/SouthbankSoftware/proofable/master/cmd/proofable-cli/install.sh")"
```

To upgrade, simply repeat the installation steps

### For Windows users

#### Install directly

Copy and paste the following PowerShell command in a [PowerShell prompt](https://docs.microsoft.com/en-us/powershell/scripting/overview?view=powershell-7):

```powershell
& ([ScriptBlock]::Create((New-Object Net.WebClient).DownloadString('https://raw.githubusercontent.com/SouthbankSoftware/proofable/master/cmd/proofable-cli/install.ps1')))
```

Then hit return to run, which will install the latest `proofable-cli.exe` binary into your current directory. Then you can use the CLI as:

```powershell
.\proofable-cli.exe -h
```

If you want to install the latest dev (cutting edge) binary, using:

```bash
& ([ScriptBlock]::Create((New-Object Net.WebClient).DownloadString('https://raw.githubusercontent.com/SouthbankSoftware/proofable/master/cmd/proofable-cli/install.ps1'))) "dev"
```

To upgrade, simply repeat the installation steps

#### Install directly in Windows Subsystem for Linux (WSL)

Follow the [same steps](#for-linux-users) for Linux users

### Build your own binary

1. make sure the latest golang is installed
2. clone this repo
3. `cd cmd/proofable-cli && make`
<!-- ANCHOR_END: installation -->

### Examples

<!-- ANCHOR: examples -->
```bash
# for help
./proofable-cli -h

# authenticate with ProvenDB. You don't have to explicitly run this. When you execute a command that requires authentication, it will be automatically run
./proofable-cli auth

# remove existing authentication
./proofable-cli auth -d

# create a proof for a path
./proofable-cli create proof path/to/the/data

# create a proof for a path in a custom location
./proofable-cli create proof path/to/the/data -p path/to/output/the/proof.proofable

# create a proof for a path including metadata
./proofable-cli create proof path/to/the/data --include-metadata

# verify a proof for a path
./proofable-cli verify proof path/to/the/data

# verify a proof for a path and output the proof's Graphviz Dot Graph
./proofable-cli verify proof path/to/the/data -d path/to/output/the/dot/graph.dot

# verify a proof for a path from a custom location
./proofable-cli verify proof path/to/the/data -p path/to/the/proof.proofable

# create a subproof out of a proof
./proofable-cli create subproof key1_of_the_proof key2_of_the_proof -p path/to/the/proof.proofable -s path/to/output/the/subproof.subproofable

# verify a subproof for a path
./proofable-cli verify subproof path/to/the/data -s path/to/the/subproof.subproofable

# verify a subproof for a path and output the subproof's Graphviz Dot Graph
./proofable-cli verify subproof path/to/the/data -s path/to/the/subproof.subproofable -d path/to/output/the/dot/graph.dot

# offline verify a subproof
./proofable-cli offline path/to/the/subproof.subproofable
```
<!-- ANCHOR_END: examples -->

## Binaries

<!-- ANCHOR: binaries -->
### Dev (cutting-edge) binaries

- [mac](https://storage.googleapis.com/provendb-dev/proofable-cli/proofable-cli_darwin_amd64.tar.gz)
- [linux](https://storage.googleapis.com/provendb-dev/proofable-cli/proofable-cli_linux_amd64.tar.gz)
- [windows](https://storage.googleapis.com/provendb-dev/proofable-cli/proofable-cli_windows_amd64.zip)

### Prd (released) binaries

- [mac](https://storage.googleapis.com/provendb-prd/proofable-cli/proofable-cli_darwin_amd64.tar.gz)
- [linux](https://storage.googleapis.com/provendb-prd/proofable-cli/proofable-cli_linux_amd64.tar.gz)
- [windows](https://storage.googleapis.com/provendb-prd/proofable-cli/proofable-cli_windows_amd64.zip)
<!-- ANCHOR_END: binaries -->

## Development

### Run installation scripts locally <!-- omit in toc -->

- `install.sh`:
  
  ```bash
  ENV=dev bash install.sh
  ```

- `install.ps1`:

  ```powershell
  & ([ScriptBlock]::Create((Get-Content ./install.ps1 -Raw))) "dev"
  ```

## FAQ

### Error: "proofable-cli_darwin_amd64" cannot be opened because the developer cannot be verified <!-- omit in toc -->

![Mac Cannot Open Issue](https://docs.proofable.io/images/mac_cannot_open_issue.png)

Use the following command to fix:

```bash
xattr -d com.apple.quarantine path/to/proofable-cli_darwin_amd64
```
