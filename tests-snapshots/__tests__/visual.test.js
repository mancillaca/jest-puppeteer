const puppeteer = require('puppeteer')
const { toMatchImageSnapshot } = require('jest-image-snapshot')

expect.extend({ toMatchImageSnapshot })

describe('Visual regression tests', () => {
    let browser
    let page

    beforeAll(async function () {
        browser = await puppeteer.launch({ headless: false })
        page = await browser.newPage()
    })

    afterAll(async function () {
        await browser.close()
    })

    test.only('Captura de pantalla completa', async () => {
        await page.goto('https://example.com')
        await page.waitForSelector('h1')
        const image = await page.screenshot()
        expect(Buffer.from(image)).toMatchImageSnapshot({
            failureThresholdType: 'pixel',
            failureThreshold: 500,
        })
    })

    test('Captura de pantalla de un elemento especifico', async () => {
        await page.goto('https://example.com')
        const h1 = await page.waitForSelector('h1')
        const image = await page.screenshot({ type: 'png' })
        expect(Buffer.from(image)).toMatchImageSnapshot({
            failureThreshold: 0.01,
            failureThresholdType: 'percent',
        })
    })

    test('Captura de pantalla removiendo un elemento especifico', async () => {
        await page.goto('https://example.com')
        await page.evaluate(() => {
            (document.querySelectorAll('h1') || []).forEach((el) => el.remove())
        })
        //await page.waitForTimeout(5000)
    })

    test('iPhone Snapshot', async () => {
        await page.goto('https://example.com')
        await page.waitForSelector('h1')
        await page.emulate(puppeteer.devices['iPhone X'])
        const image = await page.screenshot()
        expect(Buffer.from(image)).toMatchImageSnapshot({
            failureThresholdType: 'pixel',
            failureThreshold: 500,
        })
    })
})