import {freshState,objective,interact,load,save} from './state.mjs';
import {scenes,nearby,move,collides} from './scenes.mjs';
import {input} from './input.mjs';
import {portrait} from './art.mjs';
import {render} from './render.mjs';
import {enemyState,updateEnemy} from './enemy.mjs';
import {music} from './audio.mjs';
const $=id=>document.getElementById(id),g=$('game').getContext('2d');g.imageSmoothingEnabled=false;
let storage;try{storage=localStorage;}catch{storage={getItem:()=>null,setItem:()=>{throw Error();}};}
let state=load(storage),bubble=null,until=0,paused=false,last=0,dirty=false,saveAt=0,enemy=enemyState(),hidden=false,songs=[],motion={facing:'down',walking:false,time:0};
if(collides(state.scene,state.x,state.y))Object.assign(state,scenes[state.scene].spawn);
function persist(){ $('saveStatus').textContent=save(storage,state)?'Progress saved on this browser':'Saving unavailable — progress lasts this session';dirty=false; }
function hud(){ $('location').textContent=scenes[state.scene].name;$('mission').textContent=objective(state);$('inventory').textContent=[state.key?'Room 06 key':'',state.clue?'Arrival: 03:17':'',state.voucher?'Diner voucher':'',state.token?'Brass token':'',state.chapelKey?'Chapel key':''].filter(Boolean).join(' · ')||'Empty';$('health').textContent='♥ '.repeat(state.hp)+'♡ '.repeat(3-state.hp);$('chapter').hidden=!state.escaped;$('chapter').textContent='COURTYARD CLEARED · Your chapel key and progress are saved. The chapel interior and graveyard are next.';$('journal').textContent=[state.clue?'Room slip: arrival 03:17.':'Check in to start your investigation.',state.betty?'Betty: the register needs a jukebox token.':'',state.order?'Song order: ROSE → MOON → SUN.':'',state.chapelKey?'Chapel key acquired. Cross the courtyard; the laundry cart offers cover.':''].filter(Boolean).join(' '); }
function say(line){const [speaker,message]=line.split('|');bubble={speaker,message};until=performance.now()+12000;$('dialogue').textContent=speaker+': '+message;portrait($('portrait'),speaker);const item=document.createElement('li');item.textContent=speaker+': '+message;$('conversationHistory').append(item);while($('conversationHistory').children.length>16)$('conversationHistory').firstElementChild.remove();}
function act(){if(paused||$('lock').open||$('restartDialog').open||$('songs').open)return;const o=nearby(state);if(!o){say('YOU|Walk closer to a person, door, or clue.');return;}if(o.id==='hide'){hidden=!hidden;controls.clear();say(hidden?'YOU|Hidden beside the laundry. Wait for Harold to pass; interact again to leave.':'YOU|Leaving cover.');return;}if(o.id==='jukebox'&&state.order&&!state.token){controls.clear();songs=[];$('songSequence').textContent='No songs selected';$('songs').showModal();return;}if(o.id==='drawer'&&state.clue&&!state.voucher){controls.clear();$('lock').showModal();$('code').value='';$('code').focus();return;}const previous=state.scene;say(interact(state,o.id));if(previous!==state.scene){enemy=enemyState();hidden=false;bubble=null;controls.clear();}hud();persist();}
function pause(){if($('lock').open||$('restartDialog').open||$('songs').open)return;paused=!paused;controls.clear();$('pause').textContent=paused?'RESUME':'PAUSE';$('paused').hidden=!paused;}
const controls=input(act,pause);
$('interact').onclick=()=>{act();$('interact').blur();};$('pause').onclick=()=>{pause();$('pause').blur();};
$('unlock').onsubmit=e=>{e.preventDefault();say(interact(state,'drawer',$('code').value));$('lock').close();hud();persist();};
$('cancelLock').onclick=()=>$('lock').close();
$('restart').onclick=()=>{controls.clear();$('restartDialog').showModal();};
$('cancelRestart').onclick=()=>$('restartDialog').close();
$('confirmRestart').onclick=()=>{state=freshState();enemy=enemyState();hidden=false;bubble=null;paused=false;portrait($('portrait'),'YOU');$('conversationHistory').replaceChildren();$('paused').hidden=true;$('pause').textContent='PAUSE';$('dialogue').textContent='New shift. Speak to Bobbi at reception.';$('restartDialog').close();hud();persist();};
for(const dialog of document.querySelectorAll('dialog'))dialog.addEventListener('close',()=>{controls.clear();document.activeElement?.blur();});
document.querySelectorAll('[data-song]').forEach(b=>b.onclick=()=>{songs.push(b.dataset.song);$('songSequence').textContent=songs.join(' → ').toUpperCase();if(songs.length===3){say(interact(state,'jukebox',songs.join(',')));$('songs').close();hud();persist();}});
$('cancelSongs').onclick=()=>$('songs').close();
music($('music'));hud();portrait($('portrait'),'YOU');if(state.key)$('dialogue').textContent='Shift resumed. '+objective(state)+'. Open the mission log to review your clues.';
$('saveStatus').textContent='Progress saves automatically after interactions and movement';
window.addEventListener('pagehide',persist);
function frame(t){const dt=Math.min(.04,(t-last)/1000||0);last=t;if(!paused&&!$('lock').open&&!$('restartDialog').open&&!$('songs').open){const v=controls.vector();motion.walking=!!(v.x||v.y)&&!hidden;if(motion.walking){motion.facing=Math.abs(v.x)>Math.abs(v.y)?(v.x>0?'right':'left'):(v.y>0?'down':'up');move(state,v.x*155*dt,v.y*155*dt);dirty=true;}const warning=updateEnemy(state,enemy,dt,hidden);if(warning){say(warning);hud();persist();}if(state.scene==='yard'){$('danger').textContent=state.escaped?'CHAPEL GATE UNLOCKED':hidden?'HIDDEN · Wait for patrol':enemy.mode==='chase'?'HAROLD IS CHASING · Run or hide':enemy.mode==='suspicious'?'HAROLD IS SUSPICIOUS':'HAROLD PATROLLING · Stay behind cover';}else $('danger').textContent='';}if(dirty&&t>saveAt){persist();saveAt=t+500;}const n=nearby(state);$('interact').textContent=n?n.label+' · E / Space':'Move closer to interact';motion.time=t;if(paused||$('lock').open||$('restartDialog').open||$('songs').open)motion.walking=false;render(g,state,t<until?bubble:null,n,enemy,hidden,motion);requestAnimationFrame(frame);}requestAnimationFrame(frame);
