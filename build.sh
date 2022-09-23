#!/usr/bin/env bash
set -e
trap 'echo "❌ Build failed"' ERR

echo "Building @sqds/sdk..."
echo ">> Building TS files"
npx tsc
echo ">> TS files built"
echo ">> Copying Anchor IDL to lib/"
cp -r ../target/idl lib
echo ">> Copied"
echo "✅ Build successful"