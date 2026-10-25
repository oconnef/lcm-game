import {collides} from './scenes.mjs';
import {route} from './pathfinding.mjs';
const patrol=[{x:570,y:380},{x:570,y:200},{x:570,y:110},{x:300,y:110},{x:70,y:110},{x:70,y:190},{x:250,y:280},{x:300,y:380}];
export function enemyState(scene='yard'){return {x:550,y:110,dir:1,kind:scene==='graveyard'?'MONSTER':'HAROLD',mode:'patrol',cooldown:2,alert:0,waypoint:0,repath:0,path:[],stunned:0};}
export function visible(s,e){
 const scene=s.scene||'yard',distance=Math.hypot(s.x-e.x,s.y-e.y),range=scene==='graveyard'?185:170;
 if(distance>range)return false;
 const facing=e.facing||{x:0,y:e.dir};
 if(distance>26&&((s.x-e.x)*facing.x+(s.y-e.y)*facing.y)/distance<Math.cos(.67))return false;
 const n=Math.ceil(distance/6);for(let i=1;i<n;i++)if(collides(scene,e.x+(s.x-e.x)*i/n,e.y+(s.y-e.y)*i/n))return false;return true;
}
export function updateEnemy(s,e,dt,hidden){
 if(!['yard','graveyard'].includes(s.scene)||s.won)return null;
 e.cooldown=Math.max(0,e.cooldown-dt);e.stunned=Math.max(0,(e.stunned||0)-dt);
 if(e.stunned){e.mode='frightened';e.alert=0;return null;}
 const seen=!hidden&&visible(s,e);e.alert=seen?Math.min(1,e.alert+dt):Math.max(0,e.alert-dt*.45);
 e.mode=e.alert>=.6?'chase':e.alert>0?'suspicious':'patrol';
 if(seen)e.lastSeen={x:s.x,y:s.y};
 let target=s.scene==='graveyard'?patrol[e.waypoint]:{x:550,y:e.dir>0?390:110};
 if(e.mode==='chase'&&e.lastSeen&&!hidden)target=e.lastSeen;
 let next=target;
 if(s.scene==='graveyard'){
  e.repath-=dt;if(e.repath<=0){e.path=route('graveyard',e,target);if(e.path.length>1&&Math.hypot(e.path[0].x-e.x,e.path[0].y-e.y)<12)e.path.shift();e.repath=.35;}
  while(e.path.length>1&&Math.hypot(e.path[0].x-e.x,e.path[0].y-e.y)<5)e.path.shift();next=e.path[0]||target;
 }
 const d=Math.hypot(next.x-e.x,next.y-e.y)||1,speed=s.scene==='graveyard'?(e.mode==='chase'?132:78):(e.mode==='chase'?100:62),step=Math.min(d,speed*dt);
 const dx=(next.x-e.x)/d*step,dy=(next.y-e.y)/d*step;
 if(!collides(s.scene,e.x+dx,e.y))e.x+=dx;if(!collides(s.scene,e.x,e.y+dy))e.y+=dy;
 if(s.scene==='graveyard'&&(Math.abs(dx)+Math.abs(dy)>.01))e.facing={x:dx/step,y:dy/step};
 if(e.mode!=='chase'&&Math.hypot(e.x-target.x,e.y-target.y)<12){if(s.scene==='graveyard'){e.waypoint=(e.waypoint+1)%patrol.length;e.repath=0;}else e.dir*=-1;}
 if(!hidden&&Math.hypot(s.x-e.x,s.y-e.y)<26&&e.cooldown===0){
  s.hp--;e.cooldown=3;
  if(s.hp===0){s.hp=3;s.deaths=(s.deaths||0)+1;if(s.scene==='graveyard'){s.scene='chapel';s.x=320;s.y=380;return 'YOU|I made it back to the chapel. My puzzle progress is kept. I need to use the tarps and watch the Monster’s patrol before trying again.';}
   s.scene='diner';s.x=575;s.y=375;return 'BETTY|I pulled you back inside. You are safe. Your progress is kept. Try using the laundry hiding place and keep the pool between you and Harold.';
  }
  return `${e.kind||'HAROLD'}|${s.scene==='graveyard'?'It is too close. Break its line of sight and hide!':'Guests should stay in their rooms. Run or hide!'}`;
 }
 return null;
}
