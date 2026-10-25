import {collides} from './scenes.mjs';
export function enemyState(){return {x:550,y:110,dir:1,mode:'patrol',cooldown:2,alert:0};}
export function visible(s,e){if(Math.hypot(s.x-e.x,s.y-e.y)>170)return false;const distance=Math.hypot(s.x-e.x,s.y-e.y);if(distance>26&&(s.y-e.y)*e.dir/distance<Math.cos(.67))return false;const n=Math.ceil(Math.hypot(s.x-e.x,s.y-e.y)/6);for(let i=1;i<n;i++)if(collides('yard',e.x+(s.x-e.x)*i/n,e.y+(s.y-e.y)*i/n))return false;return true;}
export function updateEnemy(s,e,dt,hidden){
 if(s.scene!=='yard'||s.escaped)return null;
 e.cooldown=Math.max(0,e.cooldown-dt);
 const seen=!hidden&&visible(s,e);e.alert=seen?Math.min(1,e.alert+dt):Math.max(0,e.alert-dt*.6);
 e.mode=e.alert>=.6?'chase':e.alert>0?'suspicious':'patrol';
 let tx=550,ty=e.dir>0?390:110;
 if(e.mode==='chase'&&!hidden){tx=s.x;ty=s.y;}
 const d=Math.hypot(tx-e.x,ty-e.y)||1,speed=e.mode==='chase'?100:62;
 const dx=(tx-e.x)/d*speed*dt,dy=(ty-e.y)/d*speed*dt;
 if(!collides('yard',e.x+dx,e.y))e.x+=dx;if(!collides('yard',e.x,e.y+dy))e.y+=dy;
 if(e.mode!=='chase'&&Math.abs(e.y-ty)<8)e.dir*=-1;
 if(!hidden&&Math.hypot(s.x-e.x,s.y-e.y)<26&&e.cooldown===0){s.hp--;e.cooldown=3;if(s.hp===0){s.hp=3;s.scene='diner';s.x=575;s.y=375;return 'BETTY|I pulled you back inside. You are safe. Your progress is kept. Try using the laundry hiding place and keep the pool between you and Harold.';}return 'HAROLD|Guests should stay in their rooms. Run or hide!';}
 return null;
}
