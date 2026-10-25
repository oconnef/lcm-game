export function music(button) {
 let ctx,timer,on=false,step=0;
 button.onclick=async()=>{try{ctx??=new AudioContext();if(!on){await ctx.resume();timer=setInterval(()=>{const osc=ctx.createOscillator(),gain=ctx.createGain(),t=ctx.currentTime;osc.type='triangle';osc.frequency.value=[164.81,196,220,196,146.83,174.61,196,130.81][step++%8];gain.gain.setValueAtTime(.035,t);gain.gain.exponentialRampToValueAtTime(.001,t+.25);osc.connect(gain).connect(ctx.destination);osc.start(t);osc.stop(t+.26);},280);}else{clearInterval(timer);await ctx.suspend();}on=!on;button.textContent=on?'♫ MUSIC ON':'♫ MUSIC OFF';button.setAttribute('aria-pressed',String(on));}catch{button.textContent='Audio unavailable';}};
}
