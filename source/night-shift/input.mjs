export function input(action,pause,flare=()=>{}) {
 let stick={x:0,y:0},activePointer=null;const joystick=document.getElementById('joystick');
 const resetStick=()=>{stick={x:0,y:0};activePointer=null;joystick.style.setProperty('--stick-x','0px');joystick.style.setProperty('--stick-y','0px');};
 const setStick=e=>{const r=joystick.getBoundingClientRect(),dx=e.clientX-r.x-r.width/2,dy=e.clientY-r.y-r.height/2,length=Math.hypot(dx,dy),radius=Math.min(r.width,r.height)*.32,scale=Math.min(1,radius/(length||1));stick=length<radius*.2?{x:0,y:0}:{x:dx*scale/radius,y:dy*scale/radius};joystick.style.setProperty('--stick-x',dx*scale+'px');joystick.style.setProperty('--stick-y',dy*scale+'px');};
 joystick.addEventListener('pointerdown',e=>{if(activePointer!==null)return;e.preventDefault();activePointer=e.pointerId;joystick.setPointerCapture(e.pointerId);setStick(e);});
 joystick.addEventListener('pointermove',e=>{if(e.pointerId===activePointer){e.preventDefault();setStick(e);}});
 for(const event of ['pointerup','pointercancel','lostpointercapture'])joystick.addEventListener(event,e=>{if(e.pointerId===activePointer)resetStick();});
 const held=new Set(),directions={w:'up',ArrowUp:'up',s:'down',ArrowDown:'down',a:'left',ArrowLeft:'left',d:'right',ArrowRight:'right'};
 document.addEventListener('keydown',e=>{if(e.target.matches('input,textarea')||(e.key===' '&&e.target.matches('button')))return;const k=e.key.length===1?e.key.toLowerCase():e.key;if(directions[k]){e.preventDefault();held.add(directions[k]);}if((k==='e'||k===' ')&&!e.repeat){e.preventDefault();action();}if(k==='f'&&!e.repeat){e.preventDefault();flare();}if(k==='Escape')pause();});
 document.addEventListener('keyup',e=>held.delete(directions[e.key.length===1?e.key.toLowerCase():e.key]));
 const clear=(keepTouch=false)=>{held.clear();if(keepTouch!==true)resetStick();};window.addEventListener('blur',clear);window.addEventListener('resize',clear);document.addEventListener('visibilitychange',()=>{if(document.hidden)clear();});document.getElementById('controlStyle').addEventListener('change',e=>{clear();document.documentElement.dataset.movementStyle=e.target.value;});
 document.querySelectorAll('[data-move]').forEach(b=>{b.addEventListener('pointerdown',e=>{e.preventDefault();held.add(b.dataset.move);b.setPointerCapture(e.pointerId);});for(const ev of ['pointerup','pointercancel','lostpointercapture'])b.addEventListener(ev,()=>held.delete(b.dataset.move));});
 return {clear,vector:()=>{let x=Number(held.has('right'))-Number(held.has('left'))+stick.x,y=Number(held.has('down'))-Number(held.has('up'))+stick.y;const n=Math.max(1,Math.hypot(x,y));return {x:x/n,y:y/n};}};
}
