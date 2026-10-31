#!/data/data/com.termux/files/usr/bin/bash
set -e
SITE_URL="${ZYVORA_SITE_URL:-https://teamzyvorax.github.io/as-web}"
ROOM="$(od -An -N16 -tx1 /dev/urandom | tr -d ' \n')"
CAMERA="${SITE_URL%/}/camera.html?room=${ROOM}"
VIEWER="${SITE_URL%/}/viewer.html?room=${ROOM}"
printf '\n\033[1;36mZYVORA CAMERA SESSION\033[0m\n\n'
printf 'Room: %s\n\n' "$ROOM"
printf '\033[1;32mPHONE B — CAMERA\033[0m\n%s\n\n' "$CAMERA"
printf '\033[1;35mPHONE A — VIEWER\033[0m\n%s\n\n' "$VIEWER"
printf 'Phone B: open Camera link → Start Camera → Allow permission.\n'
printf 'Phone A: open Viewer link → Live video → Stop / Front-Back controls.\n\n'
printf 'Camera must remain open on Phone B; this system does not hide camera use.\n\n'
