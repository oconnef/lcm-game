// MIDI note numbers, synthesized locally. No recordings or third-party audio assets.
// Bridal Chorus: Richard Wagner, Lohengrin (1850), public-domain composition.
// Wedding March: Felix Mendelssohn, A Midsummer Night’s Dream (1842), public domain.
// Both short MIDI-style arrangements are original to this game.
export const TRACKS={
 night:{title:'Night Shift · original theme',notes:[[57,1],[60,1],[64,1],[67,1],[62,1],[65,1],[69,1],[64,1],[55,2],[62,1],[60,1],[57,2],[0,2]],bass:45},
 chapel:{title:'Bridal Chorus · MIDI-style organ',notes:[[67,1],[72,1.5],[72,.5],[72,2],[67,1],[74,1],[71,1],[72,3],[67,1],[72,1.5],[76,.5],[79,2],[76,1],[72,1],[74,1],[72,3],[0,2]],bass:48},
 graveyard:{title:'Between the Wrecks · original theme',notes:[[45,1],[0,1],[46,.5],[52,.5],[45,1],[0,1],[48,1],[43,2]],bass:33},
 garage:{title:'Forgotten Garage · original theme',notes:[[52,1],[55,1],[59,2],[57,1],[55,1],[52,2],[0,2]],bass:40},
 escape:{title:'Wedding March · MIDI-style recessional',notes:[[67,.33],[67,.33],[67,.34],[72,2],[72,1],[72,1],[76,2],[74,1],[72,1],[71,2],[72,1],[74,1],[72,3],[0,1],[67,.33],[67,.33],[67,.34],[72,2],[76,1],[79,1],[77,2],[76,1],[74,1],[72,4],[0,2]],bass:48}
};
export function scheduleNote(ctx,midi,start,duration,volume=.04,type='triangle'){
 if(!midi)return;
 const osc=ctx.createOscillator(),gain=ctx.createGain();osc.type=type;osc.frequency.value=440*2**((midi-69)/12);
 gain.gain.setValueAtTime(.0001,start);gain.gain.exponentialRampToValueAtTime(volume,start+.015);gain.gain.exponentialRampToValueAtTime(.0001,start+Math.max(.04,duration));osc.connect(gain).connect(ctx.destination);osc.start(start);osc.stop(start+duration+.04);
}
export function music(button,readScene=()=> 'office'){
 let ctx,on=false,track='night',step=0,next=0,scene='office',danger=false,timer,lastTouch=-Infinity,busy=false,attempt=0,watch,deadline,touchWasPlaying=false;
 const playing=()=>on&&ctx?.state==='running';
 const label=()=>{button.textContent=playing()?'♫ MUSIC ON':on?'TAP TO RESUME MUSIC':'♫ TURN MUSIC ON';button.setAttribute('aria-pressed',String(playing()));};
 const select=()=>scene==='won'?'escape':scene==='chapel'?'chapel':scene==='graveyard'?'graveyard':scene==='garage'?'garage':'night';
 const describe=()=>{const element=document.getElementById('musicTrack');if(element){const title=(playing()?'PLAYING · ':on?'AUDIO PAUSED · ':'TAP MUSIC TO LISTEN · ')+TRACKS[track].title;if(element.textContent!==title)element.textContent=title;if(element.dataset.track!==track)element.dataset.track=track;}};
 function tick(){if(!on||!ctx||ctx.state!=='running')return;while(next<ctx.currentTime+.12){const t=TRACKS[track],note=t.notes[step%t.notes.length],beat=track==='chapel'?.43:track==='escape'?.4:danger?.24:.34,duration=note[1]*beat;
  scheduleNote(ctx,note[0],Math.max(next,ctx.currentTime),duration*.87,.10,track==='chapel'||track==='escape'?'sine':'triangle');
  if(step%4===0)scheduleNote(ctx,t.bass,next,Math.max(.1,duration),.06,'triangle');
  if((track==='chapel'||track==='escape')&&note[0])scheduleNote(ctx,note[0]+12,next,duration*.85,.025,'sine');
  next+=duration;step++;
 }}
 function toggle(){
  const id=++attempt;clearInterval(watch);clearTimeout(deadline);
  try{
   const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)throw Error('Unsupported');
   try{if(navigator.audioSession)navigator.audioSession.type='playback';}catch{}
   if(!ctx){ctx=new Audio();ctx.addEventListener('statechange',()=>{label();describe();});}
   if(playing()){
    on=false;busy=false;clearInterval(timer);label();describe();
    Promise.resolve(ctx.suspend()).catch(()=>{});return;
   }
   on=true;busy=true;let started=false;button.textContent='STARTING MUSIC…';
   const finish=()=>{
    if(id!==attempt)return;
    busy=false;clearInterval(watch);clearTimeout(deadline);
    if(ctx.state==='running'&&!started){started=true;clearInterval(timer);next=ctx.currentTime+.03;timer=setInterval(tick,70);tick();}
    label();describe();button.blur();
   };
   const check=()=>{if(id===attempt&&ctx.state==='running')finish();};
   // Do not await resume: Safari can leave its promise pending indefinitely,
   // including when the context has already started. State is authoritative.
   const resumed=ctx.resume();
   // Prime Web Audio synchronously inside the trusted touchend/click gesture.
   const unlock=ctx.createBufferSource();unlock.buffer=ctx.createBuffer(1,1,ctx.sampleRate);unlock.connect(ctx.destination);unlock.start(0);
   watch=setInterval(check,50);deadline=setTimeout(finish,2000);
   Promise.resolve(resumed).then(check).catch(()=>{if(id===attempt)finish();});
   check();
  }catch{busy=false;on=false;clearInterval(watch);clearTimeout(deadline);clearInterval(timer);button.textContent='TAP TO RETRY AUDIO';button.setAttribute('aria-pressed','false');}
 }
 // Try both gesture edges: Safari may require touchend, while other browsers
 // unlock earlier. A stalled touch-down request never blocks the touchend retry.
 button.addEventListener('pointerdown',e=>{if(e.pointerType==='touch'){touchWasPlaying=playing();lastTouch=performance.now();if(!touchWasPlaying)toggle();}});
 button.addEventListener('touchend',e=>{
  const r=button.getBoundingClientRect(),touch=Array.from(e.changedTouches).find(t=>t.clientX>=r.left&&t.clientX<=r.right&&t.clientY>=r.top&&t.clientY<=r.bottom);
  if(!touch)return;e.preventDefault();lastTouch=performance.now();if(touchWasPlaying||!playing())toggle();
 },{passive:false});
 button.onclick=e=>{if(e.detail!==0&&performance.now()-lastTouch<700)return;toggle();};
 const update=(nextScene,isDanger=false)=>{scene=nextScene;danger=isDanger;const desired=select();if(track!==desired){track=desired;step=0;next=ctx?ctx.currentTime+.08:0;}describe();};
 const note=midi=>{if(on&&ctx?.state==='running')scheduleNote(ctx,midi,ctx.currentTime,.35,.045,'sine');};
 const cue=()=>{if(on&&ctx?.state==='running'){scheduleNote(ctx,36,ctx.currentTime,.35,.055,'sawtooth');scheduleNote(ctx,37,ctx.currentTime+.16,.3,.035,'triangle');}};
 document.addEventListener('visibilitychange',()=>{if(!ctx||!on)return;if(document.hidden)ctx.suspend();else{next=ctx.currentTime+.05;ctx.resume().catch(()=>{label();describe();});}});
 label();update(readScene());return {update,note,cue};
}
