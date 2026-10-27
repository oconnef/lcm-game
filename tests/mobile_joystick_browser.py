"""Real multi-touch joystick/action/flare, release/cancel safety, and phone layouts."""
import asyncio,json
from playwright.async_api import async_playwright
from full_game_browser import snapshot
async def center(locator):
 r=await locator.bounding_box();return {'x':r['x']+r['width']/2,'y':r['y']+r['height']/2}
async def touch(cdp,kind,points):
 await cdp.send('Input.dispatchTouchEvent',{'type':kind,'touchPoints':[dict(p,id=i+1,radiusX=5,radiusY=5,force=1) for i,p in enumerate(points)]})
async def main():
 async with async_playwright() as p:
  b=await p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
  for width,height in [(390,844),(320,568),(844,390)]:
   page=await b.new_page(viewport={'width':width,'height':height},has_touch=True,is_mobile=True)
   errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
   await page.clock.install(time=0);await page.clock.pause_at(1000)
   await page.goto('http://127.0.0.1:8000/');await page.clock.run_for(40)
   assert await page.locator('#joystick').is_visible()
   assert await page.locator('.dpad').is_hidden()
   stage=await page.locator('#game').bounding_box();dock=await page.locator('.controls').bounding_box()
   if width<height:assert stage['y']+stage['height']<=dock['y'],(stage,dock)
   else:assert stage['y']+stage['height']<=height,(stage,dock)
   action=await page.locator('#interact').bounding_box();assert action['y']>=0 and action['y']+action['height']<=height
   assert 'E / Space' not in await page.locator('#interact').inner_text()
   cdp=await page.context.new_cdp_session(page)
   stick=await center(page.locator('#joystick'));up={'x':stick['x'],'y':stick['y']-42}
   # The initial player is below reception: steer upward, then talk while holding.
   await touch(cdp,'touchStart',[stick]);await touch(cdp,'touchMove',[up]);await page.clock.run_for(780)
   before=await snapshot(page);assert before['y']<250,before
   actionpoint=await center(page.locator('#interact'))
   await touch(cdp,'touchStart',[up,actionpoint]);await touch(cdp,'touchEnd',[up]);await page.clock.run_for(40)
   assert (await snapshot(page))['key'],await page.locator('#dialogue').inner_text()
   await touch(cdp,'touchEnd',[]);await page.clock.run_for(40)
   stopped=await snapshot(page);await page.clock.run_for(250);assert (await snapshot(page))['y']==stopped['y']
   # Cancelled gestures must not leave the player walking.
   await touch(cdp,'touchStart',[stick]);await touch(cdp,'touchMove',[{'x':stick['x']+40,'y':stick['y']}]);await page.clock.run_for(50)
   await touch(cdp,'touchCancel',[]);await page.clock.run_for(40);stopped=await snapshot(page);await page.clock.run_for(200);assert (await snapshot(page))['x']==stopped['x']
   await page.locator('.touch-settings summary').click();await page.locator('#controlStyle').select_option('buttons');await page.locator('.touch-settings summary').click()
   assert await page.locator('.dpad').is_visible();assert await page.locator('#joystick').is_hidden()
   arrow=await center(page.locator('[data-move=right]'));start=await snapshot(page);await touch(cdp,'touchStart',[arrow]);await page.clock.run_for(80);await touch(cdp,'touchEnd',[]);assert (await snapshot(page))['x']>start['x']
   await page.locator('.touch-settings summary').click();await page.locator('#controlStyle').select_option('joystick');await page.locator('.touch-settings summary').click();await page.evaluate('window.scrollTo(0,0)')
   assert await page.locator('#joystick').is_visible()
   assert await page.evaluate('document.documentElement.scrollWidth<=innerWidth')
   await page.screenshot(path=f'/tmp/joystick-{width}x{height}.png',full_page=False)
   assert not errors,errors
   await page.context.close()
   print(json.dumps({'viewport':f'{width}x{height}','result':'PASS','controls':'native touch joystick + simultaneous action, release/cancel, visible playfield'}),flush=True)
  # The flare is part of the same dock, usable by a second finger while steering.
  page=await b.new_page(viewport={'width':390,'height':844},has_touch=True,is_mobile=True)
  state=dict(scene='graveyard',x=300,y=380,key=True,clue=True,voucher=True,completed=True,betty=True,order=True,token=True,chapelKey=True,escaped=True,score=True,crank=True,graveyardUnlocked=True,fuse=True,winchPowered=True,carKeys=True,garageClue=True,garageOpen=True,garageReward=True,hp=3)
  await page.add_init_script('localStorage.setItem("lcm-night-shift-v1",'+json.dumps(json.dumps(state))+');')
  await page.clock.install(time=0);await page.clock.pause_at(1000);await page.goto('http://127.0.0.1:8000/');await page.clock.run_for(40)
  assert await page.locator('.touch-actions #flare').is_visible()
  cdp=await page.context.new_cdp_session(page);stick=await center(page.locator('#joystick'));right={'x':stick['x']+40,'y':stick['y']}
  await touch(cdp,'touchStart',[stick]);await touch(cdp,'touchMove',[right]);await page.clock.run_for(80)
  flare=await center(page.locator('#flare'));await touch(cdp,'touchStart',[right,flare]);await touch(cdp,'touchEnd',[right]);await page.clock.run_for(80)
  assert (await snapshot(page))['flareUsed'];assert (await snapshot(page))['x']>310
  await touch(cdp,'touchEnd',[])
  await b.close();print('Mobile two-finger movement + flare: PASS')
asyncio.run(main())
