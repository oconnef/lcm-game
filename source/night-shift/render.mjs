import {scenes} from './scenes.mjs';
function box(g,x,y,w,h,c){g.fillStyle=c;g.fillRect(x,y,w,h);}
function person(g,x,y,c){box(g,x-9,y-4,18,20,c);box(g,x-7,y-18,14,14,'#e8b69d');box(g,x-8,y-19,16,5,'#382134');box(g,x-8,y+16,6,8,'#151326');box(g,x+2,y+16,6,8,'#151326');}
function wrap(g,text,width){const lines=[];let line='';for(const word of text.split(' ')){if(g.measureText(line+' '+word).width>width&&line){lines.push(line);line=word;}else line+=(line?' ':'')+word;}if(line)lines.push(line);return lines;}
export function render(g,s,bubble,near){
 box(g,0,0,640,448,'#180f23');box(g,14,72,612,366,'#864f68');
 for(let y=88;y<430;y+=24)for(let x=24;x<620;x+=24)box(g,x,y,23,23,(x+y)%48?'#71495e':'#795065');
 box(g,14,72,612,15,'#ff8dbd');g.textAlign='center';g.font='bold 19px monospace';g.fillStyle='#ffe3b7';g.fillText(scenes[s.scene].name,320,45);
 for(const r of scenes[s.scene].furniture){box(g,r.x+4,r.y+5,r.w,r.h,'#25172c');box(g,r.x,r.y,r.w,r.h,'#be7a92');box(g,r.x+5,r.y+5,r.w-10,r.h-10,'#593650');g.font='11px monospace';g.fillStyle='#ffe0bc';g.fillText(r.label,r.x+r.w/2,r.y+r.h/2+4);}
 if(s.scene==='office'){person(g,285,145,'#ff68a5');box(g,548,306,35,78,'#392a41');g.fillStyle='#ffe0af';g.font='12px monospace';g.fillText('ROOM 06',565,298);}else{box(g,294,420,52,16,'#ffd2a0');box(g,315,161,20,25,'#fff0cd');box(g,493,174,14,12,s.voucher?'#9edab8':'#fbc773');}
 for(const o of scenes[s.scene].objects){g.font='12px monospace';g.fillStyle=o===near?'#fff1c5':'#e8a9c6';g.fillText(o===near?'▼':'·',o.x,o.y-28);}
 person(g,s.x,s.y,'#92d5dc');
 if(bubble){const o=bubble.speaker==='BOBBI LOVE'?{x:285,y:145}:s;g.font='12px monospace';const lines=wrap(g,bubble.message,304),h=34+lines.length*17;const x=Math.max(20,Math.min(300,o.x-164)),y=Math.max(80,Math.min(430-h,o.y-h-32));box(g,x-2,y-2,332,h+4,'#ffd7b4');box(g,x,y,328,h,'#28182f');g.fillStyle='#ffd7b4';g.beginPath();g.moveTo(o.x-5,y+h+2);g.lineTo(o.x+5,y+h+2);g.lineTo(o.x,y+h+10);g.fill();g.textAlign='left';g.fillStyle='#ff91c1';g.fillText(bubble.speaker,x+12,y+19);g.fillStyle='#fff0d8';lines.forEach((l,i)=>g.fillText(l,x+12,y+38+i*17));}
}
