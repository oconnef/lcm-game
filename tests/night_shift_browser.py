"""Start python3 -m http.server 8000, then run python3 tests/night_shift_browser.py."""
import asyncio, json
from playwright.async_api import async_playwright

async def hold(page,key,ms):
    await page.keyboard.down(key)
    await page.wait_for_timeout(ms)
    await page.keyboard.up(key)
    await page.wait_for_timeout(80)

async def main():
    async with async_playwright() as pw:
        browser=await pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
        for mobile in [False,True]:
            page=await browser.new_page(viewport={'width':390,'height':844} if mobile else {'width':1280,'height':1000},has_touch=mobile)
            errors=[]
            page.on('pageerror',lambda e:errors.append(str(e)))
            await page.goto('http://127.0.0.1:8000/')
            await page.wait_for_timeout(200)
            assert await page.locator('#location').inner_text()=='MOTEL OFFICE'
            assert await page.locator('#game').evaluate('(c)=>new Set(c.getContext("2d").getImageData(0,0,c.width,c.height).data).size')>30
            if mobile:
                await page.locator('.touch-settings summary').click()
                await page.locator('#controlStyle').select_option('buttons')
                await page.locator('.touch-settings summary').click()
            # Actual movement through keyboard or the on-screen pointer controls.
            async def walk(key,ms):
                if mobile:
                    names={'w':'up','s':'down','a':'left','d':'right'}
                    button=page.locator(f'[data-move="{names[key]}"]')
                    await button.scroll_into_view_if_needed()
                    rect=await button.bounding_box()
                    await page.mouse.move(rect['x']+rect['width']/2,rect['y']+rect['height']/2)
                    await page.mouse.down();await page.wait_for_timeout(ms);await page.mouse.up()
                    await page.wait_for_timeout(80)
                else: await hold(page,key,ms)
            async def act():
                if mobile: await page.locator('#interact').tap()
                else: await page.keyboard.press('e')
                await page.wait_for_timeout(100)
            await walk('d',1550)
            await act()
            assert await page.locator('#location').inner_text()=='MOTEL OFFICE'
            assert 'check in' in (await page.locator('#dialogue').inner_text()).lower()
            await walk('a',1550)
            await walk('w',800)
            await act()
            assert 'Room 06 key' in await page.locator('#inventory').inner_text()
            await walk('s',800);await walk('d',1550);await act()
            assert await page.locator('#location').inner_text()=='MOTEL PARKING LOT'
            await walk('a',1100);await act()
            assert await page.locator('#location').inner_text()=='MOTEL PARKING LOT'
            assert 'locked' in await page.locator('#dialogue').inner_text()
            await walk('a',1100);await act()
            assert await page.locator('#location').inner_text()=='ROOM 06'
            await walk('w',850);await act()
            assert '03:17' in await page.locator('#inventory').inner_text()
            await walk('d',1120);await act()
            assert await page.locator('#lock').is_visible()
            await page.locator('#code').fill('1234');await page.get_by_role('button',name='UNLOCK',exact=True).click()
            assert 'stays shut' in await page.locator('#dialogue').inner_text()
            assert 'Diner voucher' not in await page.locator('#inventory').inner_text()
            await act();await page.locator('#code').fill('0317');await page.get_by_role('button',name='UNLOCK',exact=True).click()
            assert 'Diner voucher' in await page.locator('#inventory').inner_text()
            await page.reload();await page.wait_for_timeout(200)
            assert 'Diner voucher' in await page.locator('#inventory').inner_text()
            assert await page.locator('#location').inner_text()=='ROOM 06'
            await walk('a',1120);await walk('s',1000);await act()
            assert await page.locator('#location').inner_text()=='MOTEL PARKING LOT'
            # Even after the drawer puzzle, Room 07 stays locked.
            await walk('d',1100);await act()
            assert 'locked' in await page.locator('#dialogue').inner_text()
            assert await page.locator('#location').inner_text()=='MOTEL PARKING LOT'
            await page.reload();await page.wait_for_timeout(150)
            assert await page.locator('#location').inner_text()=='MOTEL PARKING LOT'
            await walk('d',1380);await walk('s',800);await act()
            assert await page.locator('#location').inner_text()=='MOTEL OFFICE'
            await walk('a',1510);await walk('w',800);await act()
            assert 'left door' in await page.locator('#dialogue').inner_text()
            assert 'Visit the diner' in await page.locator('#mission').inner_text()
            await page.locator('#music').click();assert await page.locator('#music').get_attribute('aria-pressed')=='true'
            await page.locator('#music').click()
            await page.locator('#pause').click();assert await page.locator('#paused').is_visible()
            await page.locator('#pause').click();assert await page.locator('#paused').is_hidden()
            await page.screenshot(path=f'/tmp/night-shift-{"mobile" if mobile else "desktop"}.png',full_page=True)
            assert await page.evaluate('document.documentElement.scrollWidth<=innerWidth')
            await page.locator('#restart').click();await page.locator('#cancelRestart').click()
            assert 'Diner voucher' in await page.locator('#inventory').inner_text()
            await page.locator('#restart').click();await page.locator('#confirmRestart').click()
            assert await page.locator('#inventory').inner_text()=='Empty'
            await page.reload();assert await page.locator('#inventory').inner_text()=='Empty'
            assert not errors,errors
            print(json.dumps({'viewport':'mobile' if mobile else 'desktop','result':'PASS','checks':'locked door, check-in, parking lot, Room 07 stays locked, room entry, clue, incorrect/correct code, save/reload, return dialogue, music, pause, restart','errors':errors}))
            await page.close()
        await browser.close()
asyncio.run(main())
