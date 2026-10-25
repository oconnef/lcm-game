// Original procedural pixel art. Drawing stays inside the existing collision footprints.
export const rect = (g,x,y,w,h,color) => {g.fillStyle=color;g.fillRect(Math.round(x),Math.round(y),w,h);};
export function ellipse(g,x,y,rx,ry,color){g.fillStyle=color;g.beginPath();g.ellipse(x,y,rx,ry,0,0,Math.PI*2);g.fill();}
export function text(g,value,x,y,size=10,color='#ffe5bc',align='center'){
 g.font=`bold ${size}px monospace`;g.textAlign=align;g.fillStyle='#151322';g.fillText(value,x+1,y+1);g.fillStyle=color;g.fillText(value,x,y);
}
const grain=(x,y)=>((Math.imul(x+13,374761393)^Math.imul(y+7,668265263))>>>0)%97;
export function surface(g,scene){
 const outdoor=['parking','yard'].includes(scene);
 rect(g,0,0,640,448,'#141824');
 // Upper wall has a cornice, patterned wallpaper/brick and a raised skirting board.
 rect(g,14,72,612,366,outdoor?'#39484a':'#41414b');
 for(let y=88,row=0;y<438;y+=20,row++)for(let x=14,col=0;x<626;x+=20,col++){
  let c;
  if(scene==='diner')c=(row+col)%2?'#81938c':'#354c53';
  else if(scene==='parking')c=['#41464e','#454952','#3d434c'][grain(col,row)%3];
  else if(scene==='yard')c=['#4e5c51','#546253','#495c50'][grain(col,row)%3];
  else if(scene==='room')c=['#796354','#806859','#735d51'][grain(col,row)%3];
  else c=(row+col)%2?'#686052':'#62584e';
  rect(g,x,y,19,19,c);
  if(scene==='room'){rect(g,x,y+17,19,1,'#56463f');rect(g,x+2,y+6,10,1,'#9b7a61');}
  if(scene==='parking'||scene==='yard'){const n=grain(col,row);rect(g,x+n%14+2,y+n%13+2,2,1,outdoor?'#79816a':'#8d7961');}
  if(scene==='diner'){rect(g,x+1,y+1,17,1,(row+col)%2?'#a4ada0':'#47636b');rect(g,x+17,y+2,1,15,'#25384033');}
 }
 rect(g,14,72,612,18,'#231e30');rect(g,16,72,608,3,'#e18aab');rect(g,18,76,604,2,'#ffd3b8');rect(g,18,84,604,3,'#835b73');
 for(let x=26;x<616;x+=32){rect(g,x,92,2,18,outdoor?'#77726b':'#b4857f');rect(g,x+3,94,7,2,'#302e3a');}
 rect(g,14,432,612,6,'#222732');
 // Art on the walls and warm lamps; light is deliberately subtle and steady.
 if(!outdoor){for(const x of [46,590]){rect(g,x-12,100,24,27,'#261e2d');rect(g,x-9,103,18,20,'#b87569');rect(g,x-7,110,14,11,'#546d72');rect(g,x-6,107,6,3,'#ebbc84');}}
 text(g,scenesTitle[scene],320,40,16,'#ffd6ab');text(g,outdoor?'DESERT AIR · NO VACANCY':'LAST CHANCE MOTEL · NIGHT SHIFT',320,58,8,'#bba6a6');
}
const scenesTitle={office:'MOTEL RECEPTION',room:'ROOM 06',parking:'MOTEL PARKING LOT',diner:'THE NIGHT OWL DINER',yard:'COURTYARD · AFTER HOURS'};
function shadow(g,r){rect(g,r.x+6,r.y+9,r.w,r.h,'#10172366');}
function wood(g,x,y,w,h){rect(g,x,y,w,h,'#704735');rect(g,x,y,w,4,'#c39364');rect(g,x,y+4,3,h-4,'#95643e');rect(g,x+w-3,y+4,3,h-4,'#472d2c');for(let i=10;i<h-4;i+=9){rect(g,x+5,y+i,w-10,1,'#946444');rect(g,x+13+(i%17),y+i+2,Math.min(26,w-20),1,'#563c32');}}
export function paper(g,x,y){rect(g,x+2,y+2,19,22,'#302a3599');rect(g,x,y,19,22,'#f0d9ab');rect(g,x+3,y+4,12,2,'#9c635f');for(let i=9;i<19;i+=4)rect(g,x+3,y+i,10,1,'#8c8270');}
export function door(g,x,y,label,locked=false){
 rect(g,x-22,y-4,44,70,'#161c28');rect(g,x-21,y-3,42,65,'#d4ae8c');rect(g,x-17,y,34,61,locked?'#343546':'#6a4a4c');
 for(let i=6;i<54;i+=22){rect(g,x-12,y+i,23,17,locked?'#292b3c':'#533b43');rect(g,x-11,y+i,21,2,locked?'#484353':'#926163');}
 rect(g,x+9,y+34,3,4,'#f5c678');rect(g,x-22,y+61,44,4,'#bd9e82');
 rect(g,x-24,y-19,48,12,'#201e2c');text(g,label,x,y-10,8,locked?'#d8989a':'#f9d7a4');
 if(locked){rect(g,x-6,y+27,12,4,'#b0a0a2');rect(g,x+2,y+29,5,8,'#d0b38c');}
}
function booth(g,r){
 shadow(g,r);rect(g,r.x,r.y,r.w,r.h,'#252b36');
 for(const x of [r.x+3,r.x+r.w-28]){rect(g,x,r.y+3,25,r.h-6,'#742f4b');rect(g,x+2,r.y+3,20,5,'#ce728a');for(let y=r.y+12;y<r.y+r.h-8;y+=12){rect(g,x+3,y,18,1,'#a34d66');rect(g,x+8,y+3,2,2,'#452d3a');}rect(g,x+3,r.y+r.h-8,19,4,'#421f34');}
 rect(g,r.x+31,r.y+13,r.w-62,r.h-25,'#c5b29b');rect(g,r.x+33,r.y+15,r.w-66,r.h-30,'#f2ddbb');rect(g,r.x+33,r.y+16,r.w-66,2,'#fff0d0');
 ellipse(g,r.x+r.w/2,r.y+r.h/2,13,9,'#bcbaa5');ellipse(g,r.x+r.w/2,r.y+r.h/2-1,10,7,'#fff0ce');rect(g,r.x+39,r.y+20,6,7,'#6c8788');rect(g,r.x+40,r.y+19,4,2,'#d9ded0');
}
function counter(g,r){
 shadow(g,r);rect(g,r.x,r.y,r.w,r.h,'#364550');rect(g,r.x+2,r.y+5,r.w-4,r.h-11,'#59817e');
 for(let x=r.x+9;x<r.x+r.w-7;x+=20){rect(g,x,r.y+9,13,r.h-22,'#496b70');rect(g,x,r.y+9,2,r.h-22,'#81a299');}
 rect(g,r.x-2,r.y-1,r.w+4,14,'#2b323c');rect(g,r.x,r.y,r.w,9,'#d5bba1');rect(g,r.x+2,r.y+2,r.w-4,2,'#fff0c7');rect(g,r.x,r.y+r.h-5,r.w,3,'#da9f9e');
}
function jukebox(g,r){
 shadow(g,r);rect(g,r.x+8,r.y,r.w-16,r.h,'#252636');rect(g,r.x+3,r.y+12,r.w-6,r.h-16,'#8e614d');rect(g,r.x+9,r.y+5,r.w-18,r.h-11,'#deaa6d');rect(g,r.x+14,r.y+9,r.w-28,r.h-18,'#313e50');
 for(let i=0;i<3;i++){rect(g,r.x+19+i*21,r.y+15,15,18,['#e785a9','#80bab0','#edc776'][i]);rect(g,r.x+22+i*21,r.y+19,9,1,'#fbe3b1');}
 for(let y=r.y+40;y<r.y+r.h-7;y+=4)rect(g,r.x+20,y,r.w-40,1,'#bd8d68');
 rect(g,r.x+6,r.y+18,3,r.h-24,'#ffb7a4');rect(g,r.x+r.w-9,r.y+18,3,r.h-24,'#ffb7a4');
}
function car(g,r,pink){
 shadow(g,r);const body=pink?'#ca6c8c':'#587b83',hi=pink?'#f1a8ba':'#92b5b5';rect(g,r.x+3,r.y+8,r.w-6,r.h-13,body);rect(g,r.x+10,r.y+3,r.w-20,r.h-7,body);rect(g,r.x+13,r.y+5,r.w-26,3,hi);
 rect(g,r.x+35,r.y+7,39,r.h-15,'#263b4b');rect(g,r.x+38,r.y+9,32,8,'#7eacb4');rect(g,r.x+38,r.y+20,32,14,hi);rect(g,r.x+38,r.y+35,32,3,'#587b8d');
 for(const x of [r.x+17,r.x+r.w-26]){rect(g,x,r.y+1,13,4,'#171e2a');rect(g,x,r.y+r.h-5,13,4,'#171e2a');}
 rect(g,r.x+4,r.y+11,3,9,'#ffdf98');rect(g,r.x+4,r.y+r.h-24,3,9,'#ffdf98');rect(g,r.x+r.w-7,r.y+12,3,8,'#de6475');rect(g,r.x+1,r.y+9,2,r.h-17,'#bfbdab');
}
function facade(g,r,locked){
 shadow(g,r);rect(g,r.x,r.y,r.w,r.h,'#a17f75');for(let y=r.y+6;y<r.y+r.h;y+=9){rect(g,r.x,y,r.w,1,'#6e5b61');for(let x=r.x+(y%18);x<r.x+r.w;x+=24)rect(g,x,y-6,1,6,'#c09b86');}
 rect(g,r.x-3,r.y-8,r.w+6,13,'#483849');rect(g,r.x-3,r.y-8,r.w+6,3,'#bd758d');
 rect(g,r.x+13,r.y+20,47,37,'#d5b29a');rect(g,r.x+16,r.y+23,41,31,locked?'#242b3d':'#e9bf82');for(let x=r.x+20;x<r.x+54;x+=6)rect(g,x,r.y+23,2,31,locked?'#4a3e53':'#b88771');rect(g,r.x+35,r.y+23,2,31,'#edc59b');
 door(g,r.x+Math.min(100,r.w-28),r.y+r.h-64,locked?'07 · LOCKED':'ROOM 06',locked);
}
export function furniture(g,r){
 const {x,y,w,h,label}=r;
 if(label.startsWith('BOOTH'))return booth(g,r);
 if(label==='COUNTER'||label==='RECEPTION')return counter(g,r);
 if(label==='JUKEBOX')return jukebox(g,r);
 if(label==='GUEST CAR'||label==='PINK CADILLAC')return car(g,r,label==='PINK CADILLAC');
 if(label==='ROOM 06'||label==='ROOM 07')return facade(g,r,label==='ROOM 07');
 shadow(g,r);
 if(label==='BED'){wood(g,x,y,w,h);rect(g,x+6,y+8,w-12,h-17,'#bdb5a2');rect(g,x+11,y+13,w-22,32,'#f0dfbd');rect(g,x+13,y+17,53,23,'#fff0d3');rect(g,x+85,y+17,53,23,'#fff0d3');rect(g,x+8,y+49,w-16,h-61,'#688a88');for(let yy=y+55;yy<y+h-15;yy+=12){rect(g,x+10,yy,w-20,2,'#8faaa0');for(let xx=x+15;xx<x+w-12;xx+=18)rect(g,xx,yy+3,2,7,'#527575');}return;}
 if(label==='SOFA'){rect(g,x,y,w,h,'#42303f');rect(g,x+4,y+5,w-8,h-10,'#657d70');for(let xx=x+12;xx<x+w-12;xx+=30){rect(g,xx,y+10,24,h-28,'#83947c');rect(g,xx+2,y+14,20,2,'#abb08e');}rect(g,x+3,y+5,8,h-10,'#465c59');rect(g,x+w-11,y+5,8,h-10,'#465c59');return;}
 if(label==='KEY RACK'){wood(g,x,y,w,h);for(let yy=y+16;yy<y+h-5;yy+=21)for(let xx=x+15;xx<x+w-8;xx+=20){rect(g,xx,yy,3,3,'#231f2b');rect(g,xx+1,yy+3,2,8,'#d6b071');rect(g,xx,yy+9,6,2,'#ead09b');}return;}
 if(label==='TABLE'||label==='DRAWER'){wood(g,x,y,w,h);if(label==='DRAWER')for(let yy=y+12;yy<y+h-4;yy+=18){rect(g,x+6,yy,w-12,1,'#422e2f');rect(g,x+w/2-7,yy+5,14,3,'#c6ad7a');}return;}
 if(label==='BATHROOM'){rect(g,x,y,w,h,'#cdc7b1');for(let yy=y+3;yy<y+h;yy+=12)for(let xx=x+3;xx<x+w;xx+=12)rect(g,xx,yy,10,10,'#8cafa6');ellipse(g,x+28,y+25,18,16,'#e5dfc9');ellipse(g,x+28,y+25,10,9,'#648e92');rect(g,x+w-42,y+8,32,35,'#ddd8c1');ellipse(g,x+w-26,y+25,11,10,'#86acaa');return;}
 if(label==='FISH POOL'){rect(g,x,y,w,h,'#b4a98f');ellipse(g,x+w/2+8,y+h/2,65,53,'#ddd4b4');ellipse(g,x+w/2+8,y+h/2,59,47,'#306f85');ellipse(g,x+w/2+8,y+h/2-2,54,42,'#4b9ca5');g.fillStyle='#76bdba';g.beginPath();g.moveTo(x+40,y+h/2);g.lineTo(x+9,y+23);g.lineTo(x+9,y+h-23);g.fill();for(let yy=y+33;yy<y+h-25;yy+=13)rect(g,x+62+(yy%17),yy,28,2,'#9ed4c6');return;}
 if(label==='HEDGE'){rect(g,x,y,w,h,'#283e3b');for(let yy=y+2;yy<y+h-3;yy+=7)for(let xx=x+2;xx<x+w-3;xx+=9)rect(g,xx,yy,7,5,['#527657','#78905e','#3b624e'][grain(xx,yy)%3]);return;}
 if(label==='LAUNDRY'){rect(g,x+5,y+4,w-10,h-8,'#99a3a0');rect(g,x+9,y+7,w-18,h-14,'#596d70');for(let xx=x+12;xx<x+w-12;xx+=9)rect(g,xx,y+10,3,h-20,'#b5b5a1');for(let i=0;i<5;i++)rect(g,x+9+i*12,y+2+(i%2)*4,17,12,i%2?'#cfb4aa':'#d8d3b9');rect(g,x+12,y+h-4,8,6,'#202833');rect(g,x+w-20,y+h-4,8,6,'#202833');return;}
 if(label==='CHAPEL'){facade(g,r,false);rect(g,x+37,y-10,4,24,'#e0c9a3');rect(g,x+30,y-2,18,4,'#e0c9a3');return;}
 wood(g,x,y,w,h);
}
export const characters={
 YOU:{skin:'#d5a480',light:'#f3c8a0',hair:'#302c38',shirt:'#559ea8',trim:'#8ac5c2',legs:'#303f56'},
 'BOBBI LOVE':{skin:'#d9a185',light:'#f8c6a0',hair:'#d8ad70',shirt:'#a84970',trim:'#ef93b0',legs:'#53374f'},
 BETTY:{skin:'#bd886c',light:'#e6b58e',hair:'#744637',shirt:'#507e79',trim:'#e4d4b4',legs:'#364354'},
 HAROLD:{skin:'#bc947b',light:'#dab497',hair:'#65616a',shirt:'#914f58',trim:'#bf7f77',legs:'#393b4b'}
};
export function person(g,x,y,name='YOU',motion={}){
 const p=characters[name]||characters.YOU,walking=motion.walking,step=walking?Math.sin((motion.time||0)/95)*2:0;
 x=Math.round(x);y=Math.round(y);
 ellipse(g,x+2,y+20,13,4,'#141b2890');
 rect(g,x-8,y+8,7,12+step,'#202b3d');rect(g,x+2,y+8,7,12-step,'#202b3d');rect(g,x-9,y+19+step,9,4,'#151c2a');rect(g,x+2,y+19-step,9,4,'#151c2a');
 rect(g,x-11,y-5,22,18,'#222736');rect(g,x-9,y-5,18,17,p.shirt);rect(g,x-8,y-3,4,13,p.trim);rect(g,x-2,y-5,4,5,p.light);rect(g,x-2,y+1,4,2,p.trim);
 rect(g,x-14,y-2-step,4,13,p.shirt);rect(g,x+10,y-2+step,4,13,p.shirt);rect(g,x-14,y+9-step,4,4,p.skin);rect(g,x+10,y+9+step,4,4,p.light);
 rect(g,x-9,y-22,18,18,'#282634');rect(g,x-7,y-20,14,16,p.skin);rect(g,x-5,y-18,11,11,p.light);
 rect(g,x-9,y-23,18,6,p.hair);rect(g,x-9,y-18,3,11,p.hair);rect(g,x+6,y-18,3,7,p.hair);rect(g,x-6,y-24,11,2,p.hair);
 if(motion.facing!=='up'){rect(g,x-4,y-14,3,2,'#282c3b');rect(g,x+3,y-14,3,2,'#282c3b');rect(g,x-3,y-14,1,1,'#fbe6cd');rect(g,x+4,y-14,1,1,'#fbe6cd');rect(g,x+1,y-11,2,3,p.skin);rect(g,x-2,y-6,5,1,'#975f62');}
 else rect(g,x-6,y-18,12,10,p.hair);
 if(name==='BOBBI LOVE'){rect(g,x-10,y-16,3,15,p.hair);rect(g,x+7,y-16,3,15,p.hair);rect(g,x-10,y-5,2,2,'#f6dc88');rect(g,x+8,y-5,2,2,'#f6dc88');}
 if(name==='BETTY'){rect(g,x-6,y+3,13,9,p.trim);rect(g,x-4,y+4,9,1,'#fff0ca');}
 if(name==='HAROLD'){rect(g,x-10,y-24,20,5,'#686373');rect(g,x-11,y-20,23,3,'#8d7b82');rect(g,x-5,y-8,11,4,'#8b7771');}
}
export function portrait(canvas,name='YOU'){
 const g=canvas.getContext('2d');g.imageSmoothingEnabled=false;
 rect(g,0,0,64,64,'#263a47');for(let y=0;y<64;y+=8)rect(g,0,y,64,1,'#3d5056');
 g.save();g.translate(32,48);g.scale(2,2);person(g,0,0,name);g.restore();
 rect(g,0,61,64,3,'#cc8a9b');
}
export function register(g,x,y){rect(g,x,y,28,18,'#383e49');rect(g,x+2,y+2,24,6,'#b4bf9a');for(let xx=x+3;xx<x+25;xx+=5)rect(g,xx,y+11,3,3,'#d4bea1');rect(g,x-2,y+18,32,4,'#c9ada0');}
