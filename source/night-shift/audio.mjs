// MIDI note numbers, synthesized locally. No recordings or third-party audio assets.
// Bridal Chorus: Richard Wagner, Lohengrin (1850), public-domain composition.
// This short organ-style arrangement is original to this game.
export const TRACKS={
 night:{title:'Night Shift · original theme',notes:[[57,1],[60,1],[64,1],[67,1],[62,1],[65,1],[69,1],[64,1],[55,2],[62,1],[60,1],[57,2],[0,2]],bass:45},
 chapel:{title:'Bridal Chorus · MIDI-style organ',notes:[[67,1],[72,1.5],[72,.5],[72,2],[67,1],[74,1],[71,1],[72,3],[67,1],[72,1.5],[76,.5],[79,2],[76,1],[72,1],[74,1],[72,3],[0,2]],bass:48},
 graveyard:{title:'Between the Wrecks · original theme',notes:[[45,1],[0,1],[46,.5],[52,.5],[45,1],[0,1],[48,1],[43,2]],bass:33},
 garage:{title:'Forgotten Garage · original theme',notes:[[52,1],[55,1],[59,2],[57,1],[55,1],[52,2],[0,2]],bass:40},
 escape:{title:'Desert Dawn · original theme',notes:[[60,1],[64,1],[67,1],[72,2],[71,1],[67,1],[64,1],[60,3]],bass:48}
};
export function scheduleNote(ctx,midi,start,duration,volume=.04,type='triangle'){
 if(!midi)return;
 const osc=ctx.createOscillator(),gain=ctx.createGain();osc.type=type;osc.frequency.value=440*2**((midi-69)/12);
 gain.gain.setValueAtTime(.0001,start);gain.gain.exponentialRampToValueAtTime(volume,start+.015);gain.gain.exponentialRampToValueAtTime(.0001,start+Math.max(.04,duration));osc.connect(gain).connect(ctx.destination);osc.start(start);osc.stop(start+duration+.04);
}
export function music(button,readScene=()=> 'office'){
 let ctx,on=false,track='night',step=0,next=0,scene='office',danger=false,timer;
 const label=()=>{button.textContent=on?'♫ MUSIC ON':'♫ MUSIC OFF';button.setAttribute('aria-pressed',String(on));};
 const select=()=>scene==='won'?'escape':scene==='chapel'?'chapel':scene==='graveyard'?'graveyard':scene==='garage'?'garage':'night';
 const describe=()=>{const element=document.getElementById('musicTrack');if(element){const title=(on?'PLAYING · ':'MUSIC OFF · ')+TRACKS[track].title;if(element.textContent!==title)element.textContent=title;if(element.dataset.track!==track)element.dataset.track=track;}};
 function tick(){if(!on||!ctx||ctx.state!=='running')return;while(next<ctx.currentTime+.12){const t=TRACKS[track],note=t.notes[step%t.notes.length],beat=track==='chapel'?.43:danger?.24:.34,duration=note[1]*beat;
  scheduleNote(ctx,note[0],Math.max(next,ctx.currentTime),duration*.87,.028,track==='chapel'?'sine':'triangle');
  if(step%4===0)scheduleNote(ctx,t.bass,next,Math.max(.1,duration),.021,'triangle');
  if(track==='chapel'&&note[0])scheduleNote(ctx,note[0]+12,next,duration*.85,.009,'sine');
  next+=duration;step++;
 }}
 button.onclick=async()=>{try{ctx??=new AudioContext();if(!on){await ctx.resume();on=true;next=ctx.currentTime+.03;timer=setInterval(tick,70);tick();}else{on=false;clearInterval(timer);await ctx.suspend();}label();describe();button.blur();}catch{button.textContent='Audio unavailable';}};
 const update=(nextScene,isDanger=false)=>{scene=nextScene;danger=isDanger;const desired=select();if(track!==desired){track=desired;step=0;next=ctx?ctx.currentTime+.08:0;}describe();};
 const note=midi=>{if(on&&ctx?.state==='running')scheduleNote(ctx,midi,ctx.currentTime,.35,.045,'sine');};
 const cue=()=>{if(on&&ctx?.state==='running'){scheduleNote(ctx,36,ctx.currentTime,.35,.055,'sawtooth');scheduleNote(ctx,37,ctx.currentTime+.16,.3,.035,'triangle');}};
 document.addEventListener('visibilitychange',()=>{if(!ctx||!on)return;if(document.hidden)ctx.suspend();else{ctx.resume();next=ctx.currentTime+.05;}});
 update(readScene());return {update,note,cue};
}
