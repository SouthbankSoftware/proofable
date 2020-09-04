# Publish a new version

## Node SDK (NPM)

1. `npm login` (southbanksoftwareadmin)
2. `npm version patch` (or minor, major)
3. `npm publish`

## Go SDK & Proofable CLI

1. tag the commit using the version from CI
2. copy binaries from `dev` to `stg`

   ```zsh
   gsutil -m cp -ra public-read "gs://provendb-dev/proofable-cli/*" "gs://provendb-stg/proofable-cli"
   ```

3. copy binaries from `stg` to `prd`

   ```zsh
   gsutil -m cp -ra public-read "gs://provendb-stg/proofable-cli/*" "gs://provendb-prd/proofable-cli"
   ```

4. publish a new version to Proofable Homebrew tap

   ```zsh
   # prerequisite: brew tap southbanksoftware/proofable
   cd $(brew --repo southbanksoftware/proofable)
   code Formula/proofable-cli.rb
   # then: modify the `url` to new version and remove `sha256`
   brew fetch proofable-cli --build-from-source
   # then: record the new sha256 back to the `proofable-cli.rb`
   git commit -am "Release v0.2.8" # change v0.2.8 to the appropriate version number
   git push
   ```
