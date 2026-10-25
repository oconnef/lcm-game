"""Keyboard flare works while moving, respects pause/dialogs, and consumes once."""
import asyncio,json
from playwright.async_api import async_playwright
from pursuit_browser import open_seed,threat
from full_game_browser import snapshot
async def main():
 async with async_playwright() as p:
  b=await p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
  page=await open_seed(b,'graveyard',300,380,True)
  await page.locator('#pause').click();await page.keyboard.press('f')
  assert not (await snapshot(page))['flareUsed']
  await page.locator('#pause').click()
  await page.locator('#lock').evaluate('(d)=>d.showModal()');await page.locator('#code').focus();await page.keyboard.press('f')
  assert not (await snapshot(page))['flareUsed']
  await page.locator('#cancelLock').click();await page.clock.run_for(40)
  before=await snapshot(page)
  await page.keyboard.down('d');await page.clock.run_for(80);await page.keyboard.press('F');await page.clock.run_for(80);await page.keyboard.up('d')
  assert (await snapshot(page))['flareUsed']
  assert (await snapshot(page))['x']>before['x']
  first=(await threat(page))['enemies'][0]['stunned']
  await page.clock.run_for(200);await page.keyboard.press('f');await page.clock.run_for(40)
  assert (await threat(page))['enemies'][0]['stunned']<first
  assert await page.locator('#flare').is_hidden()
  await page.close()
  page=await open_seed(b,'graveyard',300,380,False)
  await page.keyboard.press('f');assert not (await snapshot(page))['flareUsed']
  await b.close()
  print(json.dumps({'result':'PASS','checks':'F/Shift-F while moving; pause and text fields block hotkey; consumed once; no flare means no effect'}))
if __name__=='__main__':asyncio.run(main())
