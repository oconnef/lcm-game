"""Verify key pickup increases real movement speed and the horizon CTA is usable."""
import asyncio,json
from playwright.async_api import async_playwright
from full_game_browser import snapshot,use
async def open_state(browser,state,mobile):
 page=await browser.new_page(viewport={'width':390,'height':844} if mobile else {'width':1280,'height':1000},has_touch=mobile)
 await page.add_init_script('localStorage.setItem("lcm-night-shift-v1",'+json.dumps(json.dumps(state))+');')
 await page.clock.install(time=0);await page.clock.pause_at(1000)
 await page.goto('http://127.0.0.1:8000/');await page.clock.run_for(40)
 return page
async def distance(page):
 start=await snapshot(page)
 await page.keyboard.down('a');await page.clock.run_for(160);await page.keyboard.up('a')
 return start['x']-(await snapshot(page))['x']
async def main():
 async with async_playwright() as p:
  b=await p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
  base=dict(scene='graveyard',x=570,y=200,key=True,clue=True,voucher=True,completed=True,betty=True,order=True,token=True,chapelKey=True,escaped=True,score=True,crank=True,graveyardUnlocked=True,fuse=True,winchPowered=True,hp=3)
  for mobile in [False,True]:
   page=await open_state(b,base,mobile)
   errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
   assert await page.locator('#escapeWatch').is_hidden()
   normal=await distance(page)
   await use(page,'keyBox',mobile)
   assert (await snapshot(page))['carKeys']
   boosted=await distance(page)
   assert boosted>normal*1.15,(normal,boosted)
   assert abs(normal-24.8)<2 and abs(boosted-29.6)<2,(normal,boosted)
   assert not errors,errors
   await page.close()
   page=await open_state(b,{**base,'scene':'escape','x':320,'y':360,'carKeys':True,'won':True},mobile)
   page.on('pageerror',lambda e:errors.append(str(e)))
   await page.locator('#finish').click();await page.clock.run_for(40)
   link=page.locator('#escapeWatch');assert await link.is_visible()
   assert await link.get_attribute('href')=='https://lastchancemotelmovie.com/#watch'
   canvas=await page.locator('#game').bounding_box();button=await link.bounding_box()
   assert canvas['x']<=button['x'] and button['x']+button['width']<=canvas['x']+canvas['width']
   assert abs((button['y']+button['height']/2-canvas['y'])/canvas['height']-.48)<.02
   if not mobile:await page.locator('.screen').screenshot(path='docs/screenshots/escape.png')
   await page.context.route('https://lastchancemotelmovie.com/**',lambda route:route.fulfill(status=200,body='<h1>Watch destination test stub</h1>'))
   async with page.expect_popup() as popup_info:
    if mobile:await link.tap()
    else:await link.click()
   popup=await popup_info.value;await popup.wait_for_load_state()
   assert popup.url=='https://lastchancemotelmovie.com/#watch'
   assert not errors,errors
   await page.context.close()
   print(json.dumps({'viewport':'mobile' if mobile else 'desktop','result':'PASS','normal_distance':normal,'boosted_distance':boosted,'CTA':'horizon link opens #watch (network stub)'}))
  await b.close()
asyncio.run(main())
