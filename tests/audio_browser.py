"""Verify synthesized audio, opt-in playback, mute and the chapel track in Chromium."""
import asyncio,json
from playwright.async_api import async_playwright
async def main():
 async with async_playwright() as p:
  b=await p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
  page=await b.new_page()
  errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  await page.add_init_script('''window.testAudioContexts=[];const NativeAudio=window.AudioContext;window.AudioContext=class extends NativeAudio{constructor(...args){super(...args);window.testAudioContexts.push(this);}};
  localStorage.setItem('lcm-night-shift-v1',JSON.stringify({scene:'chapel',x:320,y:380,key:true,clue:true,voucher:true,completed:true,betty:true,order:true,token:true,chapelKey:true,escaped:true,hp:3}));''')
  await page.goto('http://127.0.0.1:8000/')
  assert await page.evaluate('testAudioContexts.length')==0
  assert await page.locator('#musicTrack').get_attribute('data-track')=='chapel'
  await page.locator('#music').click();await page.wait_for_timeout(300)
  assert await page.locator('#music').get_attribute('aria-pressed')=='true'
  assert await page.evaluate('testAudioContexts[0].state')=='running'
  await page.locator('#music').click()
  assert await page.evaluate('testAudioContexts[0].state')=='suspended'
  rendered=await page.evaluate('''async()=>{const {TRACKS,scheduleNote}=await import('/source/night-shift/audio.mjs');const results=[];for(const [name,track] of Object.entries(TRACKS)){const ctx=new OfflineAudioContext(1,44100*4,44100);let time=.03;for(const [note,beats] of track.notes.slice(0,5)){scheduleNote(ctx,note,time,beats*.22);time+=beats*.24;}const output=(await ctx.startRendering()).getChannelData(0);const rms=Math.sqrt(output.reduce((a,x)=>a+x*x,0)/output.length);results.push({name,rms,finite:output.every(Number.isFinite)});}return results;}''')
  assert all(t['finite'] and t['rms']>.001 for t in rendered),rendered
  assert not errors,errors
  print(json.dumps({'result':'PASS','autoplay':'no context before click','mute':'suspended','chapel':'Bridal Chorus','offline_tracks':rendered}))
  await b.close()
asyncio.run(main())
