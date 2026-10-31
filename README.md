# ZYVORA Camera

Consent-based two-phone WebRTC camera viewer.

## Flow

1. Open the GitHub Pages site.
2. Generate a session. It creates two unique links:
   - `camera.html?room=...` for Phone B
   - `viewer.html?room=...` for Phone A
3. Phone B opens its link, taps **Start Camera**, and explicitly grants browser camera permission.
4. Phone A opens its viewer link and receives the live peer-to-peer video.
5. Phone A can request **Stop Camera** or **Front / Back** switching.
6. Closing the camera page stops the local camera stream.

The camera is never designed to be hidden. Browser permission and an on-page camera status remain visible to Phone B.

## Architecture

- Frontend: static HTML/CSS/JavaScript on GitHub Pages.
- Media: WebRTC peer-to-peer; the signaling server does not relay video.
- Signaling: Node.js + Express + WebSocket under `server/`.
- Hosting: deploy the signaling service on a free Render Web Service, then replace `YOUR-RENDER-SERVICE.onrender.com` in `camera.js` and `viewer.js` with the service hostname.

## Termux

```bash
pkg update && pkg upgrade -y
pkg install git nodejs -y
git clone https://github.com/teamzyvorax/as-web.git
cd as-web
```

The signaling server can be tested locally:

```bash
cd server
npm install
npm start
```

It listens on `0.0.0.0:$PORT` (default 10000) and exposes `/health`.

## GitHub Pages

Enable **Settings → Pages → GitHub Actions** in the repository. The included workflow deploys the static site.

## Signaling URL

After Render deployment, edit these two files:

- `camera.js`
- `viewer.js`

Set `SIGNALING_URL` to your Render WebSocket URL, for example `wss://your-service.onrender.com`.

GitHub Pages and the signaling service must be HTTPS/WSS so browser camera APIs work correctly.

## Security note

A room token is a session identifier, not a full authentication system. Share viewer links only with trusted people. No video is intentionally stored by the signaling server.
