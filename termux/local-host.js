const http = require('node:http');
const { URL } = require('node:url');

const APP_URL = (process.env.ZYVORA_APP_URL || 'https://teamzyvorax.github.io/as-web').replace(/\/$/, '');
const SIGNAL_URL = process.env.ZYVORA_SIGNAL_URL || '';
const PORT = Number(process.env.ZYVORA_PORT || 8080);

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (url.pathname === '/health') {
    res.writeHead(200, {'content-type':'application/json'});
    return res.end(JSON.stringify({ok:true,service:'zyvora-termux-session-host'}));
  }

  const room = url.searchParams.get('room') || '';
  let viewer = '';
  try {
    const candidate = url.searchParams.get('viewer') || '';
    const parsed = new URL(candidate);
    if (parsed.protocol === 'https:') viewer = parsed.href;
  } catch {}

  const safeRoom = escapeHtml(room || 'No session selected');
  const safeViewer = escapeHtml(viewer);
  const page = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>ZYVORA Local Session Host</title>
<style>
*{box-sizing:border-box}body{margin:0;min-height:100vh;background:#07090d;color:#eef2ff;font:16px system-ui;display:grid;place-items:center;padding:18px}
main{width:min(720px,100%);padding:28px;border:1px solid #273244;border-radius:22px;background:#0d1119;box-shadow:0 20px 70px #0008}
.brand{font-weight:900;letter-spacing:4px;color:#62f5c7}h1{font-size:clamp(28px,6vw,44px);margin:18px 0 8px}p{color:#aab4c8;line-height:1.6}.room{padding:14px;border-radius:12px;background:#05070b;border:1px solid #303747;font-size:20px;letter-spacing:2px;overflow-wrap:anywhere}
a,button{display:inline-block;margin-top:16px;padding:14px 18px;border:0;border-radius:12px;background:#62f5c7;color:#06100d;font-weight:800;text-decoration:none;cursor:pointer}
small{display:block;margin-top:16px;color:#8995a8}
</style></head><body><main><div class="brand">ZYVORA CAM / LOCAL HOST</div><h1>Session ready</h1><p>Phone A local Termux host is running. Open the secure viewer to watch the camera stream.</p>
<div class="room">${safeRoom}</div>
${viewer ? `<a href="${safeViewer}" rel="noopener">Open Secure Live Viewer</a><button id="copy">Copy viewer link</button><script>document.getElementById('copy').onclick=()=>navigator.clipboard.writeText(${JSON.stringify(viewer)}).then(()=>document.getElementById('copy').textContent='Copied');</script>` : '<p>Missing or invalid secure viewer link. Run zyvora-camera again to create a session.</p>'}
<small>Keep both phones on the same Wi-Fi to reach this local host. The actual camera and WebRTC viewer pages use HTTPS for browser security.</small>
</main></body></html>`;

  res.writeHead(200, {'content-type':'text/html; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff'});
  res.end(page);
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`ZYVORA local session host listening on 0.0.0.0:${PORT}`);
});
