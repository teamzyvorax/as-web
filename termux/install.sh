#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

REPO_DIR="$(cd "$(dirname "$0")/.." && pwd)"
PREFIX="${PREFIX:-/data/data/com.termux/files/usr}"
BIN_DIR="$PREFIX/bin"
LIB_DIR="$PREFIX/lib/zyvora-camera"

if [[ ! -d "$BIN_DIR" ]]; then
  echo "This installer is intended for Termux." >&2
  exit 1
fi
command -v node >/dev/null 2>&1 || { echo "Install Node.js first: pkg install nodejs -y"; exit 1; }

mkdir -p "$BIN_DIR" "$LIB_DIR"
install -m 755 "$REPO_DIR/termux/zyvora-camera" "$BIN_DIR/zyvora-camera"
install -m 644 "$REPO_DIR/termux/local-host.js" "$LIB_DIR/local-host.js"

echo
echo "ZYVORA Camera installed successfully."
echo "Run: zyvora-camera"
