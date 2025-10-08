const { chromium } = require('playwright')

async function main() {
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })

  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' })
  await page.waitForTimeout(2000)

  const menuButton = await page.getByRole('button', { name: 'Menu' })
  await menuButton.click()

  await page.waitForTimeout(500)
  const chineseButton = await page.getByRole('button', { name: 'Chinese' })
  await chineseButton.click()

  await page.waitForSelector('text=\u5b66\u4e60\u65c5\u7a0b')
  await page.waitForSelector('text=\u9002\u5e94\u529b\u4e0e\u97e7\u6027')

  await page.screenshot({
    path: 'artifacts/nav-zh.png',
    fullPage: true,
  })

  await browser.close()
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
