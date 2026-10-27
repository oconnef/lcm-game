import {freshState,objective,interact,load,save} from './state.mjs';
import {scenes,nearby,move,collides,playerSpeed} from './scenes.mjs';
import {input} from './input.mjs';
import {portrait} from './art.mjs';
import {render} from './render.mjs';
import {enemyState,updateEnemy} from './enemy.mjs';
import {finaleJournal,ORGAN_SEQUENCE} from './finale.mjs';
import {pursuitActive,startPursuit,followThroughDoor,updatePursuit} from './pursuit.mjs';
import {music} from './audio.mjs';
const $=id=>document.getElementById(id),g=$('game').getContext('2d');g.imageSmoothingEnabled=false;
let storage;try{storage=localStorage;}catch{storage={getItem:()=>null,setItem:()=>{throw Error();}};}
let state=load(storage),bubble=null,until=0,paused=false,last=0,dirty=false,saveAt=0,enemy=enemyState(state.scene),hidden=false,songs=[],organNotes=[],lockTarget='drawer',motion={facing:'down',walking:false,time:0},lastMode='patrol';
if(collides(state.scene,state.x,state.y))Object.assign(state,scenes[state.scene].spawn);
let chase=pursuitActive(state)?startPursuit(state):null;
const mobileControls=matchMedia('(pointer: coarse), (max-width: 700px)');
function placeTouchControls(){const flare=$('flare');(mobileControls.matches?document.querySelector('.touch-actions'):document.querySelector('.toolbar')).append(flare);flare.textContent=mobileControls.matches?'FLARE':'FLARE · F';$('game').setAttribute('aria-label',mobileControls.matches?'Motel game. Drag the thumb joystick to move, then tap the action button to interact.':'Motel game. Move with WASD or arrows. Press E or Space to interact.');}
placeTouchControls();mobileControls.addEventListener('change',()=>{placeTouchControls();controls.clear();});
const sound=music($('music'),()=>state.won?'won':state.scene);
function persist(){ $('saveStatus').textContent=save(storage,state)?'Progress saved on this browser':'Saving unavailable — progress lasts this session';dirty=false; }
function blocked(){return paused||state.won||!!document.querySelector('dialog[open]');}
function hud(){
 $('escapeWatch').hidden=!(state.won&&state.scene==='escape');$('location').textContent=scenes[state.scene].name;$('mission').textContent=objective(state);
 $('inventory').textContent=[state.key?'Room 06 key':'',state.voucher?'Diner voucher':'',state.token?'Brass token':'',state.chapelKey?'Chapel key':'',state.crank?'Gate crank':'',state.fuse?'Winch fuse':'',state.carKeys?'Cadillac keys':'',state.garageReward&&!state.flareUsed?'Emergency flare':''].filter(Boolean).join(' · ')||'Empty';
 // Retain the first clue in inventory for existing saves and the walkthrough.
 if(state.clue)$('inventory').textContent+=' · Arrival: 03:17';
 $('health').textContent='♥ '.repeat(state.hp)+'♡ '.repeat(3-state.hp);
 $('chapter').hidden=!state.won;$('chapter').textContent='YOU SURVIVED THE NIGHT SHIFT · '+(state.garageReward?'Secret garage discovered. ':'')+'Caught '+state.deaths+' time(s).';
 $('journal').textContent=[state.clue?'Room slip: arrival 03:17.':'Check in to start your investigation.',state.betty?'Betty: the register needs a jukebox token.':'',state.order?'Song order: ROSE → MOON → SUN.':'',state.chapelKey?'Chapel key acquired. Cross the courtyard; the laundry cart offers cover.':'',...finaleJournal(state)].filter(Boolean).join(' ');
 $('flare').hidden=!state.garageReward||state.flareUsed;
 sound.update(state.won?'won':pursuitActive(state)?'graveyard':state.scene,pursuitActive(state)||enemy.mode==='chase');
}
function say(line){
 const [speaker,message]=line.split('|');bubble={speaker,message};until=performance.now()+12000;$('dialogue').textContent=speaker+': '+message;portrait($('portrait'),speaker);
 const item=document.createElement('li');item.textContent=speaker+': '+message;$('conversationHistory').append(item);while($('conversationHistory').children.length>16)$('conversationHistory').firstElementChild.remove();
}
function resetActors(keepTouch=false){enemy=enemyState(state.scene);hidden=false;lastMode='patrol';controls.clear(keepTouch);if(pursuitActive(state)&&chase)followThroughDoor(chase,state);}
function outcome(won){
 controls.clear();$('outcomeTitle').textContent=won?'YOU SURVIVED THE GAME.':'NO VACANCY. EVER.';
 $('outcomeBody').textContent=won?'The Cadillac carries you onto the desert road. Can you survive the movie? '+(state.garageReward?'You also found the secret garage. ':'')+'Times caught: '+state.deaths+'.':state.carKeys?'You still have the Cadillac keys. The pursuit resumes when you retry. Run through the diner and office to the parking lot.':'You got caught. Your clues and keys are kept, and you have recovered at a safe checkpoint. Try cover, hiding, or the optional garage flare.';
 $('retry').hidden=won;$('finish').hidden=!won;$('outcome').showModal();
}
function apply(id,code=''){
 const previous=state.scene,hadKeys=state.carKeys;say(interact(state,id,code));if(!hadKeys&&state.carKeys){chase=startPursuit(state,enemy);hidden=false;sound.cue();}if(previous!==state.scene)resetActors(true);hud();persist();if(state.won)outcome(true);
}
function act(){
 if(blocked())return;const o=nearby(state);if(!o){say('YOU|Walk closer to a person, door, or clue.');return;}
 if(o.id.startsWith('hide')){if(pursuitActive(state)){say('YOU|They saw me take the keys. No time to hide—run for the Cadillac!');return;}hidden=!hidden;controls.clear();say(hidden?'YOU|Hidden. Wait for the patrol to pass; interact again to leave.':'YOU|Leaving cover.');return;}
 if(o.id==='jukebox'&&state.order&&!state.token){controls.clear();songs=[];$('songSequence').textContent='No songs selected';$('songs').showModal();return;}
 if(o.id==='organ'&&state.score&&!state.crank){controls.clear();organNotes=[];$('organSequence').textContent='Score: '+ORGAN_SEQUENCE.join(' → ');$('organ').showModal();return;}
 if((o.id==='drawer'&&state.clue&&!state.voucher)||(o.id==='garageLocker'&&state.garageClue&&!state.garageReward)){
  controls.clear();lockTarget=o.id;$('lockTitle').textContent=lockTarget==='drawer'?'The bedside drawer':'The emergency locker';$('lockHint').textContent=lockTarget==='drawer'?'Four digits. “The drawer remembers your arrival.”':'Four digits. Room number, then arrival minute.';$('lock').showModal();$('code').value='';$('code').focus();return;
 }
 apply(o.id);
}
function pause(){if(document.querySelector('dialog[open]')||state.won)return;paused=!paused;controls.clear();$('pause').textContent=paused?'RESUME':'PAUSE';$('paused').hidden=!paused;}
const controls=input(act,pause,useFlare);
function touchButton(button,action){let lastTouch=-Infinity;button.addEventListener('pointerdown',e=>{if(e.pointerType==='touch'){e.preventDefault();lastTouch=performance.now();action();}});button.onclick=e=>{if(e.detail!==0&&performance.now()-lastTouch<700)return;action();};}
touchButton($('interact'),()=>{act();$('interact').blur();});touchButton($('pause'),()=>{pause();$('pause').blur();});
$('unlock').onsubmit=e=>{e.preventDefault();$('lock').close();apply(lockTarget,$('code').value);};$('cancelLock').onclick=()=>$('lock').close();
$('restart').onclick=()=>{controls.clear();$('restartDialog').showModal();};$('cancelRestart').onclick=()=>$('restartDialog').close();
$('confirmRestart').onclick=()=>{
 state=freshState();chase=null;resetActors();bubble=null;paused=false;portrait($('portrait'),'YOU');$('conversationHistory').replaceChildren();$('paused').hidden=true;$('pause').textContent='PAUSE';$('dialogue').textContent='New shift. Speak to Bobbi at reception.';for(const d of document.querySelectorAll('dialog[open]'))d.close();hud();persist();
};
for(const dialog of document.querySelectorAll('dialog'))dialog.addEventListener('close',()=>{controls.clear();document.activeElement?.blur();});
document.querySelectorAll('[data-song]').forEach(b=>b.onclick=()=>{songs.push(b.dataset.song);$('songSequence').textContent=songs.join(' → ').toUpperCase();if(songs.length===3){$('songs').close();apply('jukebox',songs.join(','));}});$('cancelSongs').onclick=()=>$('songs').close();
document.querySelectorAll('[data-note]').forEach(b=>b.onclick=()=>{const n=b.dataset.note;organNotes.push(n);sound.note({G:67,C:72,D:74,B:71}[n]);$('organSequence').textContent=organNotes.join(' → ');if(organNotes.length===8){$('organ').close();apply('organ',organNotes.join(','));}});$('cancelOrgan').onclick=()=>$('organ').close();
function useFlare(){if(blocked()||!state.garageReward||state.flareUsed||state.scene!=='graveyard'&&!pursuitActive(state))return;state.flareUsed=true;enemy.stunned=8;if(chase)chase.enemies.forEach(e=>{e.stunned=8;});enemy.alert=0;sound.cue();say('YOU|The flare burns steady red. The pursuers back away. Eight seconds to move.');hud();persist();}
touchButton($('flare'),useFlare);
$('retry').onclick=()=>{$('outcome').close();resetActors();};$('finish').onclick=()=>$('outcome').close();
$('outcome').addEventListener('cancel',e=>{if(!state.won)e.preventDefault();});
hud();portrait($('portrait'),'YOU');if(state.key)$('dialogue').textContent='Shift resumed. '+objective(state)+'. Open the mission log to review your clues.';
$('saveStatus').textContent='Progress saves automatically after interactions and movement';window.addEventListener('pagehide',persist);
if(state.won)outcome(true);
function frame(t){
 const dt=Math.min(.04,(t-last)/1000||0);last=t;motion.time=t;motion.walking=false;
 if(!blocked()){
  const v=controls.vector();motion.walking=!!(v.x||v.y)&&!hidden;
  if(motion.walking){motion.facing=Math.abs(v.x)>Math.abs(v.y)?(v.x>0?'right':'left'):(v.y>0?'down':'up');move(state,v.x*playerSpeed(state)*dt,v.y*playerSpeed(state)*dt);dirty=true;}
  const previous=state.scene,deaths=state.deaths,warning=pursuitActive(state)?updatePursuit(state,chase??=startPursuit(state),dt):updateEnemy(state,enemy,dt,hidden);
  if(enemy.mode==='chase'&&lastMode!=='chase')sound.cue();lastMode=enemy.mode;
  if(warning){say(warning);if(previous!==state.scene)resetActors();hud();persist();if(state.deaths>deaths)outcome(false);}
 }
 if(pursuitActive(state))$('danger').textContent='ESCAPE PURSUIT · HAROLD & MONSTER · RUN TO THE CADILLAC';else if(['yard','graveyard'].includes(state.scene))$('danger').textContent=hidden?'HIDDEN · Wait for patrol':enemy.stunned?'FLARE · Monster held back':`${enemy.kind} ${enemy.mode==='chase'?'IS CHASING · Run or hide':enemy.mode==='suspicious'?'IS SUSPICIOUS':'PATROLLING · Stay behind cover'}`;else $('danger').textContent='';
 sound.update(state.won?'won':pursuitActive(state)?'graveyard':state.scene,pursuitActive(state)||enemy.mode==='chase');
 if(dirty&&t>saveAt){persist();saveAt=t+500;}
 const n=nearby(state);$('interact').textContent=n?n.label+(mobileControls.matches?'':' · E / Space'):(mobileControls.matches?'Walk closer':'Move closer to interact');
 render(g,state,t<until?bubble:null,n,enemy,hidden,motion,chase?.enemies||[]);requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
// Read-only runtime snapshot for browser integration checks; never exposes mutators.
export function snapshot(){return structuredClone(state);}
export function pursuitSnapshot(){return structuredClone(chase);}
