const params=new URLSearchParams(location.search);
const room=params.get('room');
const SIGNALING_URL=params.get('signal')||window.SIGNALING_URL||'wss://YOUR-RENDER-SERVICE.onrender.com';
const statusEl=document.getElementById('status'),video=document.getElementById('remote');
let ws,pc;
const pendingIce=[];\nasync function addRemoteIce(candidate){if(!pc)return;if(!pc.remoteDescription){pendingIce.push(candidate);return}try{await pc.addIceCandidate(candidate)}catch{}}\nasync function flushRemoteIce(){while(pendingIce.length&&pc?.remoteDescription){const candidate=pendingIce.shift();try{await pc.addIceCandidate(candidate)}catch{}}}
const ice={iceServers:[{urls:'stun:stun.l.google.com:19302'}]};
function status(t,c=''){statusEl.textContent=t;statusEl.className='status '+c}
function send(x){if(ws?.readyState===1)ws.send(JSON.stringify(x))}
function setup(){pc=new RTCPeerConnection(ice);pc.ontrack=e=>{video.srcObject=e.streams[0];video.play().catch(()=>{});status('LIVE','ok')};pc.onicecandidate=e=>e.candidate&&send({type:'ice',candidate:e.candidate});pc.onconnectionstatechange=()=>{if(pc.connectionState==='failed')status('Connection failed','error');if(pc.connectionState==='disconnected')status('Reconnecting…')}}
function connect(){
 if(!room){status('Missing room','error');return}
 if(SIGNALING_URL.includes('YOUR-RENDER-SERVICE')){status('Signaling server not configured','error');return}
 ws=new WebSocket(SIGNALING_URL);
 ws.onopen=()=>{send({type:'join',room,role:'viewer'});status('Waiting for camera…')};
 ws.onmessage=async e=>{const m=JSON.parse(e.data);if(m.type==='offer'){if(!pc)setup();await pc.setRemoteDescription(m.sdp);await flushRemoteIce();const answer=await pc.createAnswer();await pc.setLocalDescription(answer);send({type:'answer',sdp:pc.localDescription})}if(m.type==='ice'&&pc)await addRemoteIce(m.candidate);if(m.type==='camera-stopped'){status('Camera OFF');video.srcObject=null}if(m.type==='viewer-left')status('Camera phone disconnected')};
 ws.onerror=()=>status('Signaling connection error','error');
 ws.onclose=()=>status('Disconnected','error');
}
document.getElementById('stop').onclick=()=>{send({type:'control',action:'stop'});status('Stop requested');video.srcObject=null};
document.getElementById('switch').onclick=()=>send({type:'control',action:'switch'});
connect();