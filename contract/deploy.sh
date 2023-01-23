#!/bin/sh

./build.sh

if [ $? -ne 0 ]; then
  echo ">> Error building contract"
  exit 1
fi

echo ">> Deploying contract"

# https://docs.near.org/tools/near-cli#near-dev-deploy
near dev-deploy --wasmFile build/ipfs_near.wasm

CONTRACT_ADDRESS=`cat ./neardev/dev-account`

cd ../frontend

touch .env.local

echo NEXT_PUBLIC_CONTRACT_NAME=$CONTRACT_ADDRESS >> .env.local