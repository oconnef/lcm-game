"""Exercise a real Monster catch/retry and prove the garage is optional."""
import asyncio,json
from playwright.async_api import async_playwright
from full_game_browser import snapshot,use

async def main():
 async with async_playwright() as p:
  b=await p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
  base=dict(scene='graveyard',x=450,y=260,key=True,clue=True,voucher=True,completed=True,betty=True,order=True,token=True,chapelKey=True,escaped=True,score=True,crank=True,graveyardUnlocked=True,hp=1)
  page=await b.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  await page.clock.install(time=0);await page.clock.pause_at(1000)
  await page.add_init_script('if(!sessionStorage.getItem("checkpointSeeded")){localStorage.setItem("lcm-night-shift-v1",'+json.dumps(json.dumps(base))+');sessionStorage.setItem("checkpointSeeded","1");}')
  await page.goto('http://127.0.0.1:8000/');await page.clock.run_for(3200)
  state=await snapshot(page)
  assert state['scene']=='chapel' and state['hp']==3 and state['deaths']==1,state
  assert await page.locator('#outcome').is_visible()
  assert await page.locator('#outcomeTitle').inner_text()=='NO VACANCY. EVER.'
  await page.clock.run_for(10000);assert (await snapshot(page))['deaths']==1
  await page.locator('#retry').click();await page.clock.run_for(40)
  assert not await page.locator('#outcome').is_visible()
  await use(page,'chapelExit',False);await use(page,'graveyardDoor',False)
  await use(page,'fuse',False);await use(page,'hideNorth',False)
  assert 'HIDDEN' in await page.locator('#danger').inner_text()
  await page.clock.run_for(1200);await use(page,'hideNorth',False)
  await use(page,'winch',False);await use(page,'keyBox',False)
  assert (await snapshot(page))['carKeys']
  assert not (await snapshot(page))['garageReward']
  await use(page,'graveyardExit',False);await use(page,'yardExit',False);await use(page,'dinerExit',False);await use(page,'officeDoor',False);await use(page,'cadillac',False)
  assert (await snapshot(page))['won']
  assert not errors,errors
  print(json.dumps({'result':'PASS','checks':'Monster catch → loss dialog → safe retry; hiding; full escape without garage or flare','errors':errors}))
  await b.close()
asyncio.run(main())
