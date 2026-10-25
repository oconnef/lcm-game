"""Presentation/readability checks; run with the repository HTTP server on port 8000."""
import asyncio,json
from playwright.async_api import async_playwright

async def main():
 async with async_playwright() as pw:
  browser=await pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
  for mobile in [False,True]:
   for scene in ['office','room','parking','diner','yard']:
    page=await browser.new_page(viewport={'width':390,'height':844} if mobile else {'width':1280,'height':1000},has_touch=mobile)
    errors=[]
    page.on('pageerror',lambda e:errors.append(str(e)))
    state={'scene':scene,'x':320,'y':240 if scene=='diner' else 370,'key':True,'clue':True,'voucher':True,'completed':True,'betty':False,'order':False,'token':False,'chapelKey':False,'escaped':False,'hp':3}
    if scene=='yard':state.update(betty=True,order=True,token=True,chapelKey=True,x=70,y=380)
    await page.add_init_script('if(!sessionStorage.getItem("presentationSeeded")){localStorage.setItem("lcm-night-shift-v1",'+json.dumps(json.dumps(state))+');sessionStorage.setItem("presentationSeeded","1");}')
    await page.goto('http://127.0.0.1:8000/')
    await page.wait_for_timeout(200)
    if scene=='diner':
     await page.locator('#interact').click()
     assert 'voucher is real' in await page.locator('#dialogue').inner_text()
     dialogue=await page.locator('#dialogue').inner_text()
     # Text remains available when the old 12-second canvas bubble would expire.
     if not mobile:
      await page.wait_for_timeout(12200)
      assert await page.locator('#dialogue').inner_text()==dialogue
     await page.keyboard.down('d');await page.wait_for_timeout(1260);await page.keyboard.up('d')
     await page.keyboard.press('e')
     assert 'register needs' in await page.locator('#dialogue').inner_text()
     await page.locator('.conversation-history summary').click()
     assert 'voucher is real' in await page.locator('#conversationHistory').inner_text()
     assert 'register needs' in await page.locator('#conversationHistory').inner_text()
    canvas=await page.locator('#game').bounding_box();card=await page.locator('.dialogue-card').bounding_box()
    assert card['y']>=canvas['y']+canvas['height'],(canvas,card)
    assert await page.evaluate('document.documentElement.scrollWidth<=innerWidth')
    # Distinct face/shirt/background pixels confirm the portrait actually drew.
    assert await page.locator('#portrait').evaluate('(c)=>new Set(Array.from(c.getContext("2d").getImageData(0,0,64,64).data)).size')>20
    assert not errors,errors
    await page.screenshot(path=f'/tmp/presentation-{scene}-{"mobile" if mobile else "desktop"}.png',full_page=True)
    print(json.dumps({'scene':scene,'viewport':'mobile' if mobile else 'desktop','result':'PASS','errors':errors}))
    await page.close()
  await browser.close()
asyncio.run(main())
