const params=new URLSearchParams(location.search);
const room=params.get('room');
const SIGNALING_URL=params.get('signal')||window.SIGNALING_URL||'wss://zyvora-camera-signaling.onrender.com';
const statusEl=document.getElementById('status'),video=document.getElementById('preview');
const sitePanel=document.getElementById('sitePanel'),siteFrame=document.getElementById('siteFrame');
const siteExternal=document.getElementById('siteExternal'),siteTitle=document.getElementById('siteTitle');
let siteUrl='';
try{const u=new URL(params.get('site')||'');if(['http:','https:'].includes(u.protocol)){siteUrl=u.href;siteExternal.href=siteUrl;siteTitle.textContent=u.hostname.toUpperCase()+' // CAMERA SESSION'}}catch{}
if(!room){statusEl.textContent='Missing room';statusEl.className='status error'}
if(siteUrl){sitePanel.hidden=false;siteFrame.src=siteUrl}else{sitePanel.hidden=true}
let ws,pc,stream,facing='environment',viewerReady=false;
const pendingIce=[];
async function addRemoteIce(candidate){if(!pc)return;if(!pc.remoteDescription){pendingIce.push(candidate);return}try{await pc.addIceCandidate(candidate)}catch{}}
async function flushRemoteIce(){while(pendingIce.length&&pc?.remoteDescription){const candidate=pendingIce.shift();try{await pc.addIceCandidate(candidate)}catch{}}}
const ice={iceServers:[{urls:'stun:stun.l.google.com:19302'}]};
function status(t,c=''){statusEl.textContent=t;statusEl.className='status '+c}
function send(x){if(ws?.readyState===1)ws.send(JSON.stringify(x))}
function connect(){
 if(!room){status('Missing room','error');return}
 ws=new WebSocket(SIGNALING_URL);
 ws.onopen=()=>{send({type:'join',room,role:'camera'});status(siteUrl?'Website loaded — tap Start Camera to share this phone':'Ready — tap Start Camera')};
 ws.onmessage=async e=>{const m=JSON.parse(e.data);if(m.type==='viewer-joined'){viewerReady=true;if(stream)await makeOffer();else status('Viewer connected — tap Start Camera')}if(m.type==='answer'&&pc){await pc.setRemoteDescription(m.sdp);await flushRemoteIce()}if(m.type==='ice'&&pc)await addRemoteIce(m.candidate);if(m.type==='control'){if(m.action==='stop')stopCamera(false);if(m.action==='switch')switchCamera()}};
 ws.onerror=()=>status('Signaling connection error','error');
 ws.onclose=()=>status('Disconnected','error');
}
function makePC(){pc=new RTCPeerConnection(ice);pc.onicecandidate=e=>e.candidate&&send({type:'ice',candidate:e.candidate});pc.onconnectionstatechange=()=>{if(['failed','disconnected','closed'].includes(pc.connectionState))status('Viewer disconnected')};stream?.getTracks().forEach(t=>pc.addTrack(t,stream))}
async function makeOffer(){if(!stream||!viewerReady||ws?.readyState!==1)return;if(!pc)makePC();const offer=await pc.createOffer();await pc.setLocalDescription(offer);send({type:'offer',sdp:pc.localDescription})}
async function ensureCamera(){
 if(stream)return
 try{
  if(!navigator.mediaDevices?.getUserMedia)throw new Error('Camera requires HTTPS');
  stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:facing},audio:false});
  video.srcObject=stream;status('Camera ON — sharing','ok');makePC();if(viewerReady)await makeOffer();
 }catch(e){status(e.message==='Camera requires HTTPS'?'Open this page over HTTPS':'Camera permission denied or unavailable','error')}
}
async function switchCamera(){if(!stream)return ensureCamera();facing=facing==='environment'?'user':'environment';const old=stream.getVideoTracks()[0];try{const ns=await navigator.mediaDevices.getUserMedia({video:{facingMode:facing},audio:false});const nt=ns.getVideoTracks()[0];const sender=pc?.getSenders().find(s=>s.track?.kind==='video');if(sender)await sender.replaceTrack(nt);old?.stop();stream=new MediaStream([nt]);video.srcObject=stream;status('Camera switched','ok')}catch(e){status('Unable to switch camera','error')}}
function stopCamera(notify=true){if(notify)send({type:'camera-stopped'});stream?.getTracks().forEach(t=>t.stop());stream=null;video.srcObject=null;pc?.close();pc=null;status('Camera OFF')}
window.addEventListener('pagehide',()=>stream?.getTracks().forEach(t=>t.stop()));
connect();
// Request camera permission automatically when the camera link opens.
// The browser still requires the user to approve the permission prompt.
if(room)ensureCamera();
const switchButton=document.getElementById('switchCamera');
switchButton?.addEventListener('click',switchCamera);