#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

REPO_DIR="$(cd "$(dirname "$0")/.." && pwd)"
PREFIX="${PREFIX:-/data/data/com.termux/files/usr}"
BIN_DIR="$PREFIX/bin"

if [[ ! -d "$BIN_DIR" ]]; then
  echo "This installer is intended for Termux." >&2
  exit 1
fi

mkdir -p "$BIN_DIR"
install -m 755 "$REPO_DIR/termux/zyvora-camera" "$BIN_DIR/zyvora-camera"
echo
echo "ZYVORA Camera command installed."
echo "Run: zyvora-camera"
