import {route} from './pathfinding.mjs';
import {collides} from './scenes.mjs';
export function pursuitActive(s){return s.carKeys&&!s.won;}
function follower(kind,s,delay){return {kind,x:s.x,y:s.y,mode:'chase',arrival:delay,path:[],repath:0,stunned:0};}
export function startPursuit(s,monster){
 const enemies=[follower('MONSTER',s,1.6),follower('HAROLD',s,2.2)];
 if(s.scene==='graveyard'&&monster&&!collides(s.scene,monster.x,monster.y)){enemies[0].x=monster.x;enemies[0].y=monster.y;enemies[0].arrival=0;enemies[0].stunned=monster.stunned||0;}
 return {enemies,cooldown:2,scene:s.scene};
}
export function followThroughDoor(chase,s){
 chase.scene=s.scene;
 // They follow through the same entrance, with a short crossing delay. Their
 // identities and flare effect persist; the chase never becomes a fresh patrol.
 chase.enemies.forEach((e,i)=>Object.assign(e,{x:s.x,y:s.y,arrival:1.3+i*.5,path:[],repath:0}));
 chase.cooldown=Math.max(chase.cooldown,1.5);
}
export function updatePursuit(s,chase,dt){
 if(!pursuitActive(s))return null;
 chase.cooldown=Math.max(0,chase.cooldown-dt);
 for(const e of chase.enemies){
  e.stunned=Math.max(0,e.stunned-dt);if(e.stunned){e.mode='frightened';continue;}
  e.mode='chase';e.arrival=Math.max(0,e.arrival-dt);if(e.arrival>0)continue;
  e.repath-=dt;
  if(e.repath<=0){e.path=route(s.scene,e,s);if(e.path.length>1&&Math.hypot(e.path[0].x-e.x,e.path[0].y-e.y)<12)e.path.shift();e.repath=.2;}
  while(e.path.length>1&&Math.hypot(e.path[0].x-e.x,e.path[0].y-e.y)<4)e.path.shift();
  const target=e.path[0]||s,dx=target.x-e.x,dy=target.y-e.y,d=Math.hypot(dx,dy),step=Math.min(d,(e.kind==='MONSTER'?195:180)*dt);
  if(d>.01){const mx=dx/d*step,my=dy/d*step;if(!collides(s.scene,e.x+mx,e.y))e.x+=mx;if(!collides(s.scene,e.x,e.y+my))e.y+=my;e.facing={x:dx/d,y:dy/d};}
  if(Math.hypot(s.x-e.x,s.y-e.y)<25&&chase.cooldown===0){
   s.hp--;chase.cooldown=2.5;
   if(s.hp<=0){Object.assign(s,{hp:3,deaths:s.deaths+1,scene:'yard',x:65,y:175});followThroughDoor(chase,s);chase.enemies.forEach(e=>e.arrival+=1.5);return 'YOU|I slipped back through the west gate. I still have the Cadillac keys. They are right behind me—straight through the diner and office, then into the car!';}
   return `${e.kind}|They are gaining. Keep running for the Cadillac!`;
  }
 }
 return null;
}
