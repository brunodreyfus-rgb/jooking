#!/usr/bin/env bash
set -euo pipefail

TARGET_DIR="${1:-.}"

cp -R components "$TARGET_DIR/"
cp -R lib "$TARGET_DIR/"
cp -R pages "$TARGET_DIR/"
cp -R styles "$TARGET_DIR/"

echo "Patch copied to $TARGET_DIR"
echo "Review MANIFEST.md for the list of updated/new files."
