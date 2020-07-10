FROM alpine:3.10.3

RUN wget https://storage.googleapis.com/provendb-prd/proofable-cli/proofable-cli_linux_amd64 -O /bin/proofable-cli && \
    chmod a+x /bin/proofable-cli && \
    apk add --no-cache libc6-compat ca-certificates

CMD ["proofable-cli", "-h"]
