export const scenes={
 office:{name:'MOTEL OFFICE',spawn:{x:320,y:360},furniture:[{x:140,y:125,w:270,h:58,label:'RECEPTION'},{x:36,y:240,w:110,h:90,label:'SOFA'},{x:440,y:120,w:140,h:70,label:'KEY RACK'}],objects:[{id:'bobbi',x:285,y:205,label:'Talk to Bobbi',speaker:'BOBBI LOVE'},{id:'officeDoor',x:565,y:345,label:'Enter Room 06'}]},
 room:{name:'ROOM 06',spawn:{x:320,y:370},furniture:[{x:65,y:130,w:160,h:130,label:'BED'},{x:270,y:140,w:110,h:65,label:'TABLE'},{x:445,y:150,w:110,h:65,label:'DRAWER'},{x:445,y:250,w:140,h:55,label:'BATHROOM'}],objects:[{id:'slip',x:325,y:230,label:'Read registration slip'},{id:'drawer',x:500,y:240,label:'Inspect locked drawer'},{id:'roomDoor',x:320,y:395,label:'Return to office'}]}
};
export function collides(scene,x,y) {return x<26||x>614||y<96||y>420||scenes[scene].furniture.some(r=>x+10>r.x&&x-10<r.x+r.w&&y+10>r.y&&y-10<r.y+r.h);}
export function move(s,dx,dy) {if(!collides(s.scene,s.x+dx,s.y))s.x+=dx;if(!collides(s.scene,s.x,s.y+dy))s.y+=dy;}
export function nearby(s) {return scenes[s.scene].objects.filter(o=>Math.hypot(o.x-s.x,o.y-s.y)<58).sort((a,b)=>Math.hypot(a.x-s.x,a.y-s.y)-Math.hypot(b.x-s.x,b.y-s.y))[0];}
