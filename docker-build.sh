#!/bin/bash

# Build usando Docker (se cargo-build-sbf não estiver disponível)

echo "Building Solana program using Docker..."

docker build -f Dockerfile.build -t tipchain-build .

docker run --rm -v $(pwd)/target:/workspace/target tipchain-build

echo "Build complete! Check target/deploy/"
