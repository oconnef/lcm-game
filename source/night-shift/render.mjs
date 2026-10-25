import {scenes} from './scenes.mjs';
import {rect,ellipse,text,surface,furniture,door,paper,person,register} from './art.mjs';

// Rendering never writes furniture labels over props. Detailed instructions live in
// the dialogue card; the scene only carries signs and one small interaction marker.
function details(g,s,time){
 if(s.scene==='office'){
  register(g,365,133);paper(g,175,137);
  for(const x of [215,230,245]){rect(g,x,136,8,12,'#d6b286');rect(g,x+2,138,4,7,'#f7dcb0');}
  door(g,565,313,'PARKING');door(g,65,355,'DINER');
  rect(g,207,279,185,100,'#4f4048');rect(g,212,284,175,90,'#8d5d63');
  for(let x=218;x<385;x+=12){rect(g,x,288,3,82,'#b58475');rect(g,x+4,293,2,73,'#6c4756');}
  text(g,'WELCOME, NIGHT OWLS',300,105,9,'#edb6a0');
 }
 if(s.scene==='room'){
  paper(g,314,157);rect(g,348,152,14,17,'#cfb390');ellipse(g,355,152,10,5,'#f0cfa0');
  rect(g,278,286,115,61,'#765365');rect(g,283,291,105,51,'#a0797c');for(let x=290;x<383;x+=12)rect(g,x,296,3,40,'#c3968a');
  door(g,320,374,'PARKING');
  rect(g,460,100,77,9,'#a37f74');rect(g,464,102,69,2,'#dcc298');
 }
 if(s.scene==='diner'){
  paper(g,112,157);register(g,510,137);
  for(const x of [360,388,416]){ellipse(g,x,167,8,5,'#dfdac1');ellipse(g,x,167,5,3,'#658e91');rect(g,x-4,158,8,8,'#f3e4c6');rect(g,x+4,159,3,4,'#dfd4b8');}
  rect(g,275,128,26,20,'#333b47');rect(g,278,131,20,11,'#c39771');rect(g,282,134,12,6,'#584a42');
  door(g,320,375,'RECEPTION');door(g,590,349,'COURTYARD');
  rect(g,190,99,260,16,'#252e3c');text(g,'NIGHT OWL · COFFEE UNTIL DAWN',320,110,9,'#f1b59e');
  // Stools and menu details remain within counter collision area.
  for(const x of [285,350,415,480]){rect(g,x-3,168,6,12,'#a5aaa3');ellipse(g,x,169,9,5,'#a94f6b');ellipse(g,x,167,8,4,'#d58894');}
 }
 if(s.scene==='parking'){
  rect(g,66,216,390,34,'#a49b88');for(let x=68;x<452;x+=32){rect(g,x,218,29,1,'#c1b49c');rect(g,x,218,1,30,'#807b74');}
  for(const x of [100,265,430]){rect(g,x,291,3,111,'#bfb494');rect(g,x+3,291,1,111,'#6c6b63');}
  rect(g,82,288,367,3,'#a29983');
  door(g,565,352,'OFFICE');
  for(let i=0;i<13;i++){const x=38+i*44,y=270+(i%3)*10;rect(g,x,y,9,1,'#2c333e');rect(g,x+8,y+1,3,2,'#2c333e');}
 }
 if(s.scene==='yard'){
  door(g,65,364,'DINER');door(g,55,115,'WEST GATE');text(g,'CHAPEL',440,115,9);text(g,'LAUNDRY',162,303,8,'#d5c8a2');
  for(let i=0;i<7;i++){ellipse(g,41+i*83,104+(i%2)*6,10,5,'#283d3c');rect(g,38+i*83,94+(i%2)*6,4,10,'#70805e');}
  // Still water highlights animate slowly, with no flashing.
  const shift=Math.floor(time/700)%3;for(let i=0;i<4;i++)rect(g,251+i*13+shift*2,218+i*16,17,1,'#c2e3ca');
 }
 if(s.scene==='escape'){
  const sky=g.createLinearGradient(0,88,0,270);sky.addColorStop(0,'#493550');sky.addColorStop(.6,'#c37b85');sky.addColorStop(1,'#e9b48d');g.fillStyle=sky;g.fillRect(14,88,612,180);
  ellipse(g,350,190,31,31,'#e8c598');
  for(let i=0;i<8;i++){g.fillStyle=i%2?'#705c6a':'#8c6b71';g.beginPath();g.moveTo(14+i*90,240);g.lineTo(70+i*90,175+(i%3)*12);g.lineTo(150+i*90,240);g.fill();}
  rect(g,14,240,612,198,'#9f826f');g.fillStyle='#444551';g.beginPath();g.moveTo(285,240);g.lineTo(355,240);g.lineTo(555,438);g.lineTo(85,438);g.fill();
  for(let i=0;i<5;i++){const yy=250+((i*43+time/35)%185),w=(yy-225)/13;rect(g,320-w/2,yy,w,14,'#d1b994');}
  g.save();g.translate(320,355);g.rotate(Math.PI/2);furniture(g,{x:-68,y:-27,w:136,h:55,label:'PINK CADILLAC'});g.restore();text(g,'CHECKED OUT. STILL ALIVE.',320,285,11,'#fff0cb');
 }
 if(s.scene==='chapel'){
  door(g,320,375,'COURTYARD');paper(g,310,126);
  rect(g,282,91,76,18,'#252b3b');for(let i=0;i<6;i++)rect(g,287+i*11,93,8,14,['#c98b9e','#73a5a2','#c5ae75'][i%3]);
  for(const x of [278,359]){rect(g,x,119,3,15,'#e3cf9d');rect(g,x-1,115,5,4,'#efc68b');}
  rect(g,272,235,96,110,'#79475b');rect(g,277,238,86,104,'#a77774');
 }
 if(s.scene==='graveyard'){
  for(let x=22;x<623;x+=18){rect(g,x,90,3,25,'#6c7773');rect(g,x,93,15,1,'#98a49a');rect(g,x,105,15,1,'#98a49a');}
  door(g,70,357,'WEST GATE');door(g,575,350,'GARAGE');
  for(const [x,y,label] of [[70,115,'FUSE'],[570,115,'KEY BOX'],[570,200,'WINCH']]){rect(g,x-14,y-9,28,18,'#8a8273');rect(g,x-11,y-6,22,10,'#424b4e');rect(g,x-23,y-24,46,11,'#242d39');text(g,label,x,y-16,7,'#d6c4a1');}
  for(const [x,y] of [[300,112],[300,380]]){rect(g,x-17,y-13,34,17,'#506f73');rect(g,x-14,y-11,3,13,'#8fa098');rect(g,x+5,y-11,3,13,'#738f89');text(g,'HIDE',x,y+17,7,'#bfcbb6');}
  paper(g,410,368);
 }
 if(s.scene==='garage'){
  door(g,320,375,'GRAVEYARD');rect(g,152,140,47,30,'#4b5d64');rect(g,158,146,35,19,'#8e9381');rect(g,172,149,8,8,'#d1b583');text(g,'EMERGENCY',180,124,8,'#e0bc97');
  for(const x of [300,325,350]){rect(g,x,125,18,25,'#637574');rect(g,x+3,129,12,3,'#b8b09a');}
 }

}
function lighting(g,scene){
 // Transparent pools of light preserve the pixel art and keep routes readable.
 const outside=['parking','yard','graveyard'].includes(scene);
 const sources=outside?[[180,215],[565,355]]:[[52,117],[585,117]];
 for(const [x,y] of sources){const light=g.createRadialGradient(x,y,3,x,y,outside?85:110);light.addColorStop(0,'#ffd79b1a');light.addColorStop(1,'#ffd79b00');g.fillStyle=light;g.fillRect(x-110,y-110,220,220);}
 const vignette=g.createRadialGradient(320,250,140,320,250,370);vignette.addColorStop(0,'#0e172000');vignette.addColorStop(1,'#0e17204d');g.fillStyle=vignette;g.fillRect(14,88,612,350);
}
export function render(g,s,bubble,near,enemy,hidden,motion={}){
 g.save();g.imageSmoothingEnabled=false;
 const time=motion.time||0;
 surface(g,s.scene);
 g.save();g.beginPath();g.rect(14,88,612,350);g.clip();
 for(const r of scenes[s.scene].furniture)furniture(g,r);
 details(g,s,time);
 const actors=[];
 if(s.scene==='office')actors.push({x:285,y:197,name:'BOBBI LOVE'});
 if(s.scene==='diner')actors.push({x:320,y:207,name:'BETTY'});
 if(s.scene==='graveyard')actors.push({x:45,y:350,name:'CASEY'});
 if(['yard','graveyard'].includes(s.scene)&&!s.won){
  g.save();g.fillStyle=enemy.mode==='chase'?'#f96e7d2b':'#f3ca7b1c';g.beginPath();g.moveTo(enemy.x,enemy.y);g.arc(enemy.x,enemy.y,s.scene==='graveyard'?185:170,Math.atan2(enemy.facing?.y??enemy.dir,enemy.facing?.x??0)-.67,Math.atan2(enemy.facing?.y??enemy.dir,enemy.facing?.x??0)+.67);g.closePath();g.fill();g.restore();
  actors.push({x:enemy.x,y:enemy.y,name:enemy.kind||'HAROLD',motion:{time,walking:true,facing:enemy.dir>0?'down':'up'}});
 }
 if(s.scene!=='escape')actors.push({x:s.x,y:s.y,name:'YOU',motion});
 actors.sort((a,b)=>a.y-b.y).forEach(a=>person(g,a.x,a.y,a.name,a.motion));
 if(hidden){ellipse(g,s.x,s.y+20,16,6,'#1d283488');text(g,'HIDDEN',s.x,s.y-31,8,'#bdd7c7');}
 lighting(g,s.scene);
 // One compact marker replaces the former dots and overwritten object names.
 if(near){const x=Math.max(28,Math.min(612,near.x)),y=Math.max(105,near.y-35);rect(g,x-7,y-7,14,12,'#202736');rect(g,x-6,y-6,12,10,'#d8ba81');text(g,'!',x,y+2,9,'#292b3b');}
 if(bubble&&bubble.speaker!=='YOU'){
  const actor=actors.find(a=>a.name===bubble.speaker);
  if(actor){const width=g.measureText(bubble.speaker).width+18,x=Math.max(20,Math.min(620-width,actor.x-width/2)),y=actor.y-49;rect(g,x,y,width,14,'#222936');text(g,bubble.speaker,x+width/2,y+10,8,'#f4c8af');}
 }
 g.restore();g.restore();
}
