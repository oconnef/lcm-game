"""Run with Python Playwright and Chromium installed; start the README static server first."""
import asyncio, json
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as pw:
        browser = await pw.chromium.launch(executable_path='/usr/bin/chromium', headless=True, args=['--no-sandbox'])
        for label, viewport in [('desktop', {'width':1280,'height':900}), ('mobile', {'width':390,'height':844})]:
            page = await browser.new_page(viewport=viewport)
            errors = []
            page.on('pageerror', lambda error: errors.append(str(error)))
            response = await page.goto('http://127.0.0.1:8000/source/last_chance_motel_v3.html')
            assert response.status == 200
            await page.locator('#play').click()
            await page.wait_for_timeout(300)
            assert await page.locator('#overlay').is_hidden()
            pixels = await page.locator('#game').evaluate('(c) => new Set(c.getContext("2d").getImageData(0,0,c.width,c.height).data).size')
            assert pixels > 30, pixels
            if label == 'desktop':
                await page.keyboard.down('w')
                await page.wait_for_timeout(180)
                await page.keyboard.up('w')
                await page.keyboard.press('e')
                await page.wait_for_timeout(100)
                assert await page.locator('#mission').inner_text() == 'Recover the 3 guest items'
            else:
                assert await page.locator('#touchAction').is_visible()
                assert await page.locator('[data-move="up"]').is_visible()
            await page.locator('#musicToggle').click()
            assert await page.locator('#musicToggle').get_attribute('aria-pressed') == 'true'
            await page.locator('#musicToggle').click()
            await page.locator('#restart').click()
            assert await page.locator('#overlay').is_visible()
            assert await page.locator('#mission').inner_text() == 'Check in with Bobbi Love'
            assert not errors, errors
            print(json.dumps({'viewport':label,'status':'passed','page_errors':errors,'canvas_color_values':pixels}))
            await page.close()
        await browser.close()
asyncio.run(main())
