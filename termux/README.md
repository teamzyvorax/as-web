# ZYVORA Camera — Termux link generator

## Install

From the cloned repository in Termux:

```bash
pkg update -y
pkg install git openssl -y
git clone https://github.com/teamzyvorax/as-web.git
cd as-web
bash termux/install.sh
```

Run:

```bash
zyvora-camera
```

Paste the **HTTPS base URL of your deployed ZYVORA Camera website**, for example:

```
https://your-site.example
```

The command creates one random room ID and prints two links:

- `/camera.html?room=ROOM_ID` — Phone B
- `/viewer.html?room=ROOM_ID` — Phone A

The supplied URL must actually host this project's `camera.html`, `viewer.html`, JavaScript and CSS files. A general URL such as Google.com cannot be used as a host for these pages.

## Important architecture note

This command generates links locally in Termux. It does **not** make a Termux-only localhost address reachable from another phone or from the internet. Both phones need a reachable HTTPS website, and the WebRTC signaling server must be reachable over WSS. For internet use, deploy the static frontend and signaling service; for a private LAN, use a trusted HTTPS-capable local hostname/tunnel. Camera access on a remote phone requires a secure browser context.

The camera is consent-based: Phone B must open the page, tap **Start Camera**, grant browser permission, and keep the page open. Phone A can request stop or front/back switching. Closing the camera page stops its stream.
