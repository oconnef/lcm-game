"""A second-finger music tap starts real audio while the joystick stays held."""
import asyncio,json
from playwright.async_api import async_playwright
async def main():
 async with async_playwright() as p:
  b=await p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
  page=await b.new_page(viewport={'width':390,'height':844},has_touch=True,is_mobile=True)
  errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  await page.add_init_script('''const Native=window.AudioContext;window.testContexts=[];window.AudioContext=class extends Native{constructor(...a){super(...a);testContexts.push(this);this.meter=this.createAnalyser();this.meter.connect(this.destination);}createGain(){const g=super.createGain(),connect=g.connect.bind(g);g.connect=(target,...args)=>connect(target===this.destination?this.meter:target,...args);return g;}};''')
  await page.goto('http://127.0.0.1:8000/')
  assert await page.evaluate('testContexts.length')==0
  assert 'TURN MUSIC ON' in await page.locator('#music').inner_text()
  cdp=await page.context.new_cdp_session(page)
  async def center(locator):
   r=await locator.bounding_box();return dict(x=r['x']+r['width']/2,y=r['y']+r['height']/2)
  async def touch(kind,points):await cdp.send('Input.dispatchTouchEvent',dict(type=kind,touchPoints=[dict(point,id=i+1) for i,point in enumerate(points)]))
  stick=await center(page.locator('#joystick'));music=await center(page.locator('#music'))
  await touch('touchStart',[stick]);await touch('touchStart',[stick,music]);await touch('touchEnd',[stick])
  await page.wait_for_function('testContexts.length===1 && testContexts[0].state==="running"')
  assert await page.locator('#music').get_attribute('aria-pressed')=='true'
  rms=[]
  for _ in range(16):
   await page.wait_for_timeout(40)
   rms.append(await page.evaluate('()=>{const c=testContexts[0],a=new Float32Array(c.meter.fftSize);c.meter.getFloatTimeDomainData(a);return Math.sqrt(a.reduce((sum,x)=>sum+x*x,0)/a.length);}'))
  assert max(rms)>.008,rms
  await touch('touchEnd',[])
  await page.locator('#music').tap()
  await page.wait_for_function('testContexts[0].state==="suspended"')
  assert await page.locator('#music').get_attribute('aria-pressed')=='false'
  # A browser interruption must produce an honest paused label and a retry tap.
  await page.locator('#music').tap();await page.wait_for_function('testContexts[0].state==="running"')
  await page.evaluate('testContexts[0].suspend()')
  await page.wait_for_function('document.querySelector("#music").textContent.includes("RESUME")')
  assert 'PLAYING' not in await page.locator('#musicTrack').inner_text()
  await page.locator('#music').tap();await page.wait_for_function('testContexts[0].state==="running"')
  assert not errors,errors
  print(json.dumps({'result':'PASS','checks':'opt-in; second finger starts sound; measured live waveform; mute; interrupted audio resume','peak_rms':max(rms)}))
  await b.close()
asyncio.run(main())
