#!/usr/bin/env bash
set -euo pipefail
TARGET="${1:-.}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
for dir in pages components lib styles; do
  mkdir -p "$TARGET/$dir"
  cp -R "$SCRIPT_DIR/$dir/." "$TARGET/$dir/"
done
echo "Patch Jooking AntiBooking V1 applied to: $TARGET"
