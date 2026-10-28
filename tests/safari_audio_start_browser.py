"""Regression for Safari-style resume promises that never settle."""
import asyncio,json
from playwright.async_api import async_playwright
async def main():
 async with async_playwright() as p:
  b=await p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
  for running in [False,True]:
   page=await b.new_page(viewport={'width':390,'height':844},has_touch=True,is_mobile=True)
   errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
   await page.add_init_script('const Native=window.AudioContext;window.testContexts=[];window.resumeCalls=0;window.AudioContext=class extends Native{constructor(...a){super(...a);testContexts.push(this);}get state(){return BLOCKED ? "suspended" : super.state;}resume(){resumeCalls++;if(BLOCKED){return new Promise(()=>{});}const actual=super.resume();return NEVER ? new Promise(()=>{}) : actual;}};'.replace('BLOCKED','resumeCalls<=2' if not running else 'false').replace('NEVER','true' if running else 'false'))
   await page.goto('http://127.0.0.1:8000/')
   # An unresolved touch-down attempt must not block the trusted touch-end retry.
   rect=await page.locator('#music').bounding_box();cdp=await page.context.new_cdp_session(page)
   point=dict(x=rect['x']+rect['width']/2,y=rect['y']+rect['height']/2,id=1)
   await cdp.send('Input.dispatchTouchEvent',dict(type='touchStart',touchPoints=[point]))
   await cdp.send('Input.dispatchTouchEvent',dict(type='touchEnd',touchPoints=[]))
   if running:
    await page.wait_for_function('document.querySelector("#music").getAttribute("aria-pressed")==="true"')
    assert await page.evaluate('testContexts[0].state')=='running'
   else:
    await page.wait_for_function('document.querySelector("#music").textContent.includes("RESUME")',timeout=4000)
    assert 'STARTING' not in await page.locator('#music').inner_text()
    await page.locator('#music').tap()
    await page.wait_for_function('testContexts[0].state==="running"')
    assert await page.locator('#music').get_attribute('aria-pressed')=='true'
   await page.locator('#music').tap()
   await page.wait_for_function('document.querySelector("#music").getAttribute("aria-pressed")==="false"')
   assert not errors,errors
   await page.context.close()
   print(json.dumps({'result':'PASS','resume_promise':'never settles','actual_context':'running' if running else 'suspended then retry','touchend_activation':True}))
  await b.close()
asyncio.run(main())
