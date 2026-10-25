"""Browser continuation checks from a legacy completed chapter-one save."""
import asyncio,json
from playwright.async_api import async_playwright
async def main():
 async with async_playwright() as pw:
  browser=await pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
  for mobile in [False,True]:
   page=await browser.new_page(viewport={'width':390,'height':844} if mobile else {'width':1280,'height':1000},has_touch=mobile)
   errors=[]
   page.on('pageerror',lambda e:errors.append(str(e)))
   await page.add_init_script('if (!sessionStorage.getItem("seeded")) {localStorage.setItem("lcm-night-shift-v1",JSON.stringify({scene:"office",x:85,y:380,key:true,clue:true,voucher:true,completed:true,hp:3}));sessionStorage.setItem("seeded","1");}')
   await page.goto('http://127.0.0.1:8000/');await page.wait_for_timeout(200)
   async def walk(key,ms):
    if mobile:
     b=page.locator('[data-move="'+{'w':'up','s':'down','a':'left','d':'right'}[key]+'"]');await b.scroll_into_view_if_needed();r=await b.bounding_box();await page.mouse.move(r['x']+r['width']/2,r['y']+r['height']/2);await page.mouse.down();await page.wait_for_timeout(ms);await page.mouse.up()
    else:
     await page.keyboard.down(key);await page.wait_for_timeout(ms);await page.keyboard.up(key)
    await page.wait_for_timeout(80)
   async def act():
    if mobile:await page.locator('#interact').tap()
    else:await page.keyboard.press('e')
    await page.wait_for_timeout(100)
   await act();assert 'DINER' in await page.locator('#location').inner_text()
   await walk('d',1700);await act()
   assert 'locked' in await page.locator('#dialogue').inner_text()
   await walk('a',1700);await walk('w',1070);await act()
   assert 'Betty' in await page.locator('#mission').inner_text() or 'order slip' in await page.locator('#mission').inner_text()
   await walk('a',620);await act()
   assert 'ROSE' in await page.locator('#dialogue').inner_text()
   await walk('s',1000);await walk('d',1700);await act()
   assert await page.locator('#songs').is_visible()
   for song in ['sun','moon','rose']:await page.locator('[data-song='+song+']').click()
   assert 'not our song' in await page.locator('#dialogue').inner_text()
   await act()
   assert await page.locator('#songs').is_visible(), await page.locator('#dialogue').inner_text()
   for song in ['rose','moon','sun']:await page.locator('[data-song='+song+']').click()
   await page.wait_for_timeout(150)
   assert 'Brass token' in await page.locator('#inventory').inner_text()
   await walk('d',650);await walk('w',1000);await walk('a',450);await act()
   assert 'Chapel key' in await page.locator('#inventory').inner_text(), (await page.locator('#dialogue').inner_text(),await page.evaluate('localStorage.getItem("lcm-night-shift-v1")'),await page.locator('#interact').inner_text())
   await walk('d',450);await walk('s',1000);await act()
   assert 'COURTYARD' in await page.locator('#location').inner_text()
   await walk('d',580);await act()
   assert 'HIDDEN' in await page.locator('#danger').inner_text()
   await page.locator('#pause').click()
   before=await page.locator('#health').inner_text();await page.wait_for_timeout(500);assert await page.locator('#health').inner_text()==before
   await page.locator('#pause').click();await act()
   await walk('d',1400);await walk('w',880);await walk('d',400);await act()
   assert 'Read the wedding score' in await page.locator('#mission').inner_text()
   await page.reload();await page.wait_for_timeout(200)
   assert 'Read the wedding score' in await page.locator('#mission').inner_text()
   await page.locator('.journal summary').click();assert await page.locator('#journal').is_visible()
   await page.screenshot(path=f'/tmp/diner-{"mobile" if mobile else "desktop"}.png',full_page=True)
   assert not errors,errors
   print(json.dumps({'viewport':'mobile' if mobile else 'desktop','result':'PASS','checks':'legacy save, courtyard lock, Betty, slip, wrong/right songs, token, register, courtyard, hiding, pause, chapel, save/reload','errors':errors}))
   await page.close()
  await browser.close()
asyncio.run(main())
