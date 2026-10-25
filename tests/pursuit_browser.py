"""Verify the escape chase indoors, across doors/reloads, pause and flare behavior."""
import asyncio,json
from playwright.async_api import async_playwright
from full_game_browser import snapshot,use
async def threat(page):return await page.evaluate('async()=>(await import("/source/night-shift/main.mjs")).pursuitSnapshot()')
async def open_seed(browser,scene,x,y,flare=False):
 page=await browser.new_page();page.set_default_timeout(5000)
 state=dict(scene=scene,x=x,y=y,key=True,clue=True,voucher=True,completed=True,betty=True,order=True,token=True,chapelKey=True,escaped=True,score=True,crank=True,graveyardUnlocked=True,fuse=True,winchPowered=True,carKeys=True,hp=3,garageClue=flare,garageOpen=flare,garageReward=flare)
 await page.add_init_script('if(!sessionStorage.getItem("seeded")){localStorage.setItem("lcm-night-shift-v1",'+json.dumps(json.dumps(state))+');sessionStorage.setItem("seeded","1");}')
 await page.clock.install(time=0);await page.clock.pause_at(1000)
 await page.goto('http://127.0.0.1:8000/');await page.clock.run_for(40)
 return page
async def main():
 async with async_playwright() as p:
  b=await p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
  page=await open_seed(b,'office',520,340)
  errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  assert 'ESCAPE PURSUIT' in await page.locator('#danger').inner_text()
  await page.clock.run_for(2400)
  assert (await snapshot(page))['hp']==2
  assert {e['kind'] for e in (await threat(page))['enemies']}=={'HAROLD','MONSTER'}
  await page.locator('#pause').click();frozen=await threat(page)
  await page.clock.run_for(4000);assert await threat(page)==frozen
  await page.locator('#pause').click();await use(page,'officeDoor',False)
  assert (await snapshot(page))['scene']=='parking'
  assert (await threat(page))['scene']=='parking'
  assert all(e['arrival']>0 for e in (await threat(page))['enemies'])
  await page.reload();await page.clock.run_for(40)
  assert 'ESCAPE PURSUIT' in await page.locator('#danger').inner_text()
  await use(page,'cadillac',False)
  assert (await snapshot(page))['won']
  assert await page.get_by_role('link',name='RENT OR BUY THE MOVIE').get_attribute('href')=='https://lastchancemotelmovie.com/#watch'
  assert not errors,errors
  await page.close()
  page=await open_seed(b,'graveyard',300,380,True)
  page.on('pageerror',lambda e:errors.append(str(e)))
  await use(page,'hideSouth',False)
  assert 'No time to hide' in await page.locator('#dialogue').inner_text()
  await page.locator('#flare').click();await page.clock.run_for(40)
  assert (await snapshot(page))['flareUsed']
  assert all(e['stunned']>7 for e in (await threat(page))['enemies'])
  await use(page,'graveyardExit',False);assert all(e['stunned']>0 for e in (await threat(page))['enemies'])
  assert not errors,errors
  await b.close()
  print(json.dumps({'result':'PASS','checks':'both enemies indoors; contact damage; pause; doorway follow; reload; Cadillac win; #watch CTA; no hiding; flare survives doors','errors':errors}))
if __name__=='__main__':asyncio.run(main())
