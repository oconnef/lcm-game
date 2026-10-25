"""Complete playthrough through real controls. Fake clock accelerates waiting, not movement rules.
Requires the repository server on port 8000, Python Playwright and /usr/bin/chromium.
"""
import asyncio,json
from playwright.async_api import async_playwright

async def snapshot(page):
 return await page.evaluate('async()=> (await import("/source/night-shift/main.mjs")).snapshot()')

async def navigate(page,x,y,mobile):
 state=await snapshot(page)
 path=await page.evaluate('async ({scene,x,y,tx,ty}) => (await import("/source/night-shift/pathfinding.mjs")).route(scene,{x,y},{x:tx,y:ty})',dict(scene=state['scene'],x=state['x'],y=state['y'],tx=x,ty=y))
 assert path,(state,x,y)
 for node in path:
  for axis in ['x','y']:
   current=await snapshot(page);delta=node[axis]-current[axis]
   if abs(delta)<1.5:continue
   direction=('right' if delta>0 else 'left') if axis=='x' else ('down' if delta>0 else 'up')
   key={'right':'d','left':'a','down':'s','up':'w'}[direction]
   if mobile:
    button=page.locator('[data-move='+direction+']');await button.scroll_into_view_if_needed();r=await button.bounding_box();await page.mouse.move(r['x']+r['width']/2,r['y']+r['height']/2);await page.mouse.down()
   else:await page.keyboard.down(key)
   await page.clock.run_for(round(abs(delta)/155*1000))
   if mobile:await page.mouse.up()
   else:await page.keyboard.up(key)
   check=await snapshot(page)
   assert check['scene']==state['scene'],('caught during navigation',check)
 # Movement cannot be a substitute for interaction or a teleport.
 current=await snapshot(page)
 assert abs(current['x']-path[-1]['x'])<5 and abs(current['y']-path[-1]['y'])<5,(current,path[-1])

async def use(page,object_id,mobile):
 state=await snapshot(page)
 obj=await page.evaluate('async ({scene,id})=>(await import("/source/night-shift/scenes.mjs")).scenes[scene].objects.find(o=>o.id===id)',dict(scene=state['scene'],id=object_id))
 assert obj,(state,object_id)
 await navigate(page,obj['x'],obj['y'],mobile)
 assert await page.evaluate('async()=>{const s=(await import("/source/night-shift/main.mjs")).snapshot();return (await import("/source/night-shift/scenes.mjs")).nearby(s)?.id}')==object_id
 if mobile:await page.locator('#interact').tap()
 else:await page.keyboard.press('e')
 await page.clock.run_for(40)

async def code(page,value):
 await page.locator('#code').fill(value);await page.get_by_role('button',name='UNLOCK',exact=True).click();await page.clock.run_for(40)

async def main():
 async with async_playwright() as pw:
  browser=await pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
  for mobile in [False,True]:
   page=await browser.new_page(viewport={'width':390,'height':844} if mobile else {'width':1280,'height':1000},has_touch=mobile)
   page.set_default_timeout(5000)
   errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
   await page.clock.install(time=0);await page.clock.pause_at(1000)
   await page.goto('http://127.0.0.1:8000/');await page.clock.run_for(50)
   await use(page,'officeDoor',mobile);assert (await snapshot(page))['scene']=='office'
   await use(page,'bobbi',mobile);await use(page,'officeDoor',mobile)
   await use(page,'room07Door',mobile);assert (await snapshot(page))['scene']=='parking'
   await use(page,'room06Door',mobile);await use(page,'slip',mobile);await use(page,'drawer',mobile)
   await code(page,'0317');await use(page,'roomDoor',mobile);await use(page,'parkingOffice',mobile);await use(page,'bobbi',mobile);await use(page,'dinerDoor',mobile)
   await use(page,'betty',mobile);await use(page,'order',mobile);await use(page,'jukebox',mobile)
   for song in ['rose','moon','sun']:await page.locator('[data-song='+song+']').click()
   await page.clock.run_for(40);await use(page,'register',mobile);await use(page,'yardDoor',mobile)
   await use(page,'chapel',mobile);assert (await snapshot(page))['scene']=='chapel'
   await use(page,'organ',mobile);assert not await page.locator('#organ').is_visible()
   await use(page,'score',mobile);await use(page,'organ',mobile)
   for note in ['C']*8:await page.locator('[data-note='+note+']').click()
   await page.clock.run_for(40);assert not (await snapshot(page))['crank']
   await use(page,'organ',mobile)
   for note in ['G','C','C','C','G','D','B','C']:await page.locator('[data-note='+note+']').click()
   await page.clock.run_for(40);assert (await snapshot(page))['crank']
   await use(page,'chapelExit',mobile);await use(page,'graveyardDoor',mobile)
   await use(page,'casey',mobile)
   # Optional clue and garage are a real detour, not prerequisites for the keys.
   await use(page,'plate',mobile);await use(page,'garageDoor',mobile);await use(page,'garageLocker',mobile)
   await code(page,'0317');assert not (await snapshot(page))['garageReward']
   await use(page,'garageLocker',mobile);await code(page,'0617');assert (await snapshot(page))['garageReward']
   await use(page,'garageExit',mobile)
   await page.locator('#flare').click();await page.clock.run_for(40);assert (await snapshot(page))['flareUsed']
   await use(page,'fuse',mobile);await use(page,'winch',mobile);await use(page,'keyBox',mobile);assert (await snapshot(page))['carKeys']
   await page.clock.run_for(550);await page.reload();await page.clock.run_for(50)
   assert (await snapshot(page))['carKeys']
   await use(page,'graveyardExit',mobile);await use(page,'yardExit',mobile);await use(page,'dinerExit',mobile);await use(page,'officeDoor',mobile)
   await use(page,'room07Door',mobile);assert (await snapshot(page))['scene']=='parking'
   await use(page,'cadillac',mobile);assert (await snapshot(page))['won']
   assert await page.locator('#outcome').is_visible()
   assert await page.locator('#outcomeTitle').inner_text()=='YOU SURVIVED THE GAME.'
   assert await page.get_by_role('link',name='RENT OR BUY THE MOVIE').get_attribute('href')=='https://lastchancemotelmovie.com/'
   await page.screenshot(path=f'/tmp/escape-{"mobile" if mobile else "desktop"}.png',full_page=True)
   await page.reload();await page.clock.run_for(50);assert await page.locator('#outcome').is_visible()
   assert not errors,errors
   print(json.dumps({'viewport':'mobile' if mobile else 'desktop','result':'PASS','route':'fresh check-in → Room 06 → diner → chapel organ → garage → Monster maze → Cadillac → saved ending','errors':errors}),flush=True)
   await page.close()
  await browser.close()
if __name__=='__main__':asyncio.run(main())
