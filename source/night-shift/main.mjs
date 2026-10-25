import {freshState,objective,interact,load,save} from './state.mjs';
import {scenes,nearby,move,collides} from './scenes.mjs';
import {input} from './input.mjs';
import {render} from './render.mjs';
import {music} from './audio.mjs';
const $=id=>document.getElementById(id),g=$('game').getContext('2d');g.imageSmoothingEnabled=false;
let storage;try{storage=localStorage;}catch{storage={getItem:()=>null,setItem:()=>{throw Error();}};}
let state=load(storage),bubble=null,until=0,paused=false,last=0,dirty=false,saveAt=0;
if(collides(state.scene,state.x,state.y))Object.assign(state,scenes[state.scene].spawn);
function persist(){ $('saveStatus').textContent=save(storage,state)?'Progress saved on this browser':'Saving unavailable — progress lasts this session';dirty=false; }
function hud(){ $('location').textContent=scenes[state.scene].name;$('mission').textContent=objective(state);$('inventory').textContent=[state.key?'Room 06 key':'',state.clue?'Arrival: 03:17':'',state.voucher?'Diner voucher':''].filter(Boolean).join(' · ')||'Empty';$('health').textContent='♥ ♥ ♥';$('chapter').hidden=!state.voucher;$('chapter').textContent=state.completed?'CHAPTER COMPLETE · Your diner lead is saved. The next chapter is coming.':'Diner lead discovered. Show Bobbi the voucher to finish this chapter.'; }
function say(line){const [speaker,message]=line.split('|');bubble={speaker,message};until=performance.now()+12000;$('dialogue').textContent=speaker+': '+message;}
function act(){if(paused||$('lock').open||$('restartDialog').open)return;const o=nearby(state);if(!o){say('YOU|Walk closer to a person, door, or clue.');return;}if(o.id==='drawer'&&state.clue&&!state.voucher){controls.clear();$('lock').showModal();$('code').value='';$('code').focus();return;}say(interact(state,o.id));hud();persist();}
function pause(){if($('lock').open||$('restartDialog').open)return;paused=!paused;controls.clear();$('pause').textContent=paused?'RESUME':'PAUSE';$('paused').hidden=!paused;}
const controls=input(act,pause);
$('interact').onclick=()=>{act();$('interact').blur();};$('pause').onclick=()=>{pause();$('pause').blur();};
$('unlock').onsubmit=e=>{e.preventDefault();say(interact(state,'drawer',$('code').value));$('lock').close();hud();persist();};
$('cancelLock').onclick=()=>$('lock').close();
$('restart').onclick=()=>{controls.clear();$('restartDialog').showModal();};
$('cancelRestart').onclick=()=>$('restartDialog').close();
$('confirmRestart').onclick=()=>{state=freshState();bubble=null;paused=false;$('paused').hidden=true;$('pause').textContent='PAUSE';$('dialogue').textContent='New shift. Speak to Bobbi at reception.';$('restartDialog').close();hud();persist();};
for(const dialog of document.querySelectorAll('dialog'))dialog.addEventListener('close',()=>{controls.clear();document.activeElement?.blur();});
music($('music'));hud();
$('saveStatus').textContent='Progress saves automatically after interactions and movement';
window.addEventListener('pagehide',persist);
function frame(t){const dt=Math.min(.04,(t-last)/1000||0);last=t;if(!paused&&!$('lock').open&&!$('restartDialog').open){const v=controls.vector();if(v.x||v.y){move(state,v.x*155*dt,v.y*155*dt);dirty=true;}}if(dirty&&t>saveAt){persist();saveAt=t+500;}const n=nearby(state);$('interact').textContent=n?n.label+' · E / Space':'Move closer to interact';render(g,state,t<until?bubble:null,n);requestAnimationFrame(frame);}requestAnimationFrame(frame);
