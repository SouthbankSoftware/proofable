FROM alpine:3.10.3

RUN wget https://storage.googleapis.com/provendb-dev/provenx-cli/provenx-cli_linux_amd64 -O /bin/provenx-cli && \
    chmod a+x /bin/provenx-cli && \
    apk add --no-cache libc6-compat ca-certificates

CMD ["provenx-cli", "-h"]
