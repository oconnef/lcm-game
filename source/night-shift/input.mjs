export function input(action,pause) {
 const held=new Set(),directions={w:'up',ArrowUp:'up',s:'down',ArrowDown:'down',a:'left',ArrowLeft:'left',d:'right',ArrowRight:'right'};
 document.addEventListener('keydown',e=>{if(e.target.matches('input,button'))return;const k=e.key.length===1?e.key.toLowerCase():e.key;if(directions[k]){e.preventDefault();held.add(directions[k]);}if((k==='e'||k===' ')&&!e.repeat){e.preventDefault();action();}if(k==='Escape')pause();});
 document.addEventListener('keyup',e=>held.delete(directions[e.key.length===1?e.key.toLowerCase():e.key]));
 window.addEventListener('blur',()=>held.clear());
 document.querySelectorAll('[data-move]').forEach(b=>{b.addEventListener('pointerdown',e=>{e.preventDefault();held.add(b.dataset.move);b.setPointerCapture(e.pointerId);});for(const ev of ['pointerup','pointercancel','lostpointercapture'])b.addEventListener(ev,()=>held.delete(b.dataset.move));});
 return {clear:()=>held.clear(),vector:()=>{let x=Number(held.has('right'))-Number(held.has('left')),y=Number(held.has('down'))-Number(held.has('up'));const n=Math.hypot(x,y)||1;return {x:x/n,y:y/n};}};
}
