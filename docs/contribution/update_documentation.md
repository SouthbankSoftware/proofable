# Update documentation

## Setup docs compiling environment

1. Make sure the following dependencies are installed:
   - Node: LTS version v12.16.3+
   - Rust: v1.46.0+
2. Install [`mdBook`](https://github.com/rust-lang/mdBook)

    ```zsh
    cargo install mdbook
    ```

3. Initialize docs compiling environment

    ```zsh
    make doc-init
    ```

   You can use `make doc-clean` to cleanup files generated in this step. If you want to redo the initialization, please do a cleanup first

## Update docs

1. Run docs dev server:

    ```zsh
    make doc-dev
    ```

   and a open browser tab at `http://localhost:3000`

2. Make changes to Markdown files in `docs` directory, which will trigger the dev server to hot-reload the docs in the browser. This is a good way for to preview the changes. Please note that anything other than a symbolic link or a Markdown file in `docs` will be copied to `docs_output/book/html` by `make doc-dev` or `mmake doc-build` then be synced to `docs_output/gh-pages` by `make doc-deploy` with extraneous files removed. So if you want to add a file to `gh-pages`, add to `docs` first, otherwise that file will be deleted during the syncing

3. If you have changed the Node SDK code, you need to regenerate the Node SDK reference at `docs_output/gh-pages/node_sdk/reference`

    ```zsh
    make doc-node
    ```

## Deploy updated docs

1. Make a production build of the docs

    ```zsh
    make doc-build
    ```

   this will generate the htmls in `docs_output/book`

2. Sync changes to the checked out `gh-pages` branch at `docs_output/gh-pages` from `docs_output/book/html`

    ```zsh
    make doc-deploy
    ```

3. Go to the `gh-pages` checkout: `cd docs_output/gh-pages`, review the changes and commit
