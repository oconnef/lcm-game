import {collides} from './scenes.mjs';
// Small deterministic navigation grid shared by enemy AI and reachability tests.
export function route(scene,from,to){
 const nodes=[],step=scene==='room'?10:20;const clear=(x,y)=>!collides(scene,x,y)&&!collides(scene,x-2,y)&&!collides(scene,x+2,y)&&!collides(scene,x,y-2)&&!collides(scene,x,y+2);
 for(let y=100;y<=420;y+=step)for(let x=30;x<=610;x+=step)if(clear(x,y))nodes.push({x,y});
 const nearest=p=>nodes.reduce((best,n)=>!best||Math.hypot(n.x-p.x,n.y-p.y)<Math.hypot(best.x-p.x,best.y-p.y)?n:best,null);
 const start=nearest(from),goal=nearest(to);if(!start||!goal)return [];
 const key=p=>`${p.x},${p.y}`,map=new Map(nodes.map(n=>[key(n),n])),queue=[start],came=new Map([[key(start),null]]);
 for(let i=0;i<queue.length;i++){
  const p=queue[i];if(key(p)===key(goal))break;
  for(const [dx,dy] of [[step,0],[-step,0],[0,step],[0,-step]]){const n=map.get(`${p.x+dx},${p.y+dy}`);if(n&&!came.has(key(n))&&!collides(scene,p.x+dx/2,p.y+dy/2)){came.set(key(n),p);queue.push(n);}}
 }
 if(!came.has(key(goal)))return [];
 const result=[];let p=goal;while(p){result.push(p);p=came.get(key(p));}return result.reverse();
}
