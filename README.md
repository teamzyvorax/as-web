# ZYVORA Camera

Consent-based two-phone camera viewer using WebRTC.

## Termux setup on Phone A

```bash
pkg update && pkg upgrade -y
pkg install git nodejs openssl -y
git clone https://github.com/teamzyvorax/as-web.git
cd as-web
bash termux/install.sh
zyvora-camera
```

The command asks for the original website URL, the ZYVORA HTTPS frontend URL, and the Render WSS signaling URL. It creates a room ID, starts a local Termux session dashboard, and prints the Phone B camera link and Phone A viewer link.

## Phone flow

1. Phone B opens the original website link if desired.
2. Phone B opens the separate ZYVORA camera link, taps **Start Camera**, and explicitly grants permission.
3. Phone A opens the local Termux dashboard, then opens the secure live viewer link.
4. Phone A can request camera stop or front/back switching.

## Hosting

- Frontend: GitHub Pages (HTTPS).
- Signaling: Node.js + Express + WebSocket under `server/`, deploy with `render.yaml`.
- Media: peer-to-peer WebRTC; the signaling server does not relay or store video.
- Health check: `/health`.

Use the Render service's `wss://...` URL when running the Termux command.

## Important browser limitation

A plain LAN URL such as `http://192.168.x.x:8080` is not generally a secure browser context on another phone. Camera access and WebRTC therefore run on the HTTPS ZYVORA pages. The local Termux URL is the local session launcher/dashboard, and it links to the secure viewer.

An arbitrary third-party website (for example WhatsApp or Google) cannot be made to host a new `/camera.html` page by adding a path. The original website link is preserved with a `ZYVORA_ROOM` query parameter, but the camera permission page must be hosted by ZYVORA or a domain you control.

## Privacy

Phone B must tap **Start Camera** and grant browser permission. Camera status stays visible. Closing the camera page stops the local camera tracks. Share viewer links only with intended recipients.
