const puppeteer = require('puppeteer');
const fs = require('fs');
const injectCode = fs.readFileSync('./inject.js', 'utf8');

(async () => {
  const browser = await puppeteer.launch({ headless: false, args: ['--use-fake-ui-for-media-stream'] });
  const page = await browser.newPage();
  
  // Navigate to the game
  await page.goto('https://67speed.com/', { waitUntil: 'networkidle2' });
  
  // Wait for the Start button, click it, allow camera when prompted
  await page.waitForSelector('button:contains("Start")', { timeout: 10000 }).catch(() => null);
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.toLowerCase().includes('start'));
    if (btn) btn.click();
  });
  
  // Wait for the 3-second countdown or camera permission (puppeteer auto-accepts with flag)
  await page.waitForTimeout(5000);
  
  // Inject the score-locking script
  await page.evaluate(injectCode);
  
  console.log('✅ Script injected. Score will be forced to 899.');
  console.log('⏳ Game will end automatically. Waiting 25 seconds...');
  
  // Wait for the game to finish (20 seconds + buffer)
  await page.waitForTimeout(25000);
  
  // Optional: take a screenshot of the final score
  await page.screenshot({ path: 'final-score.png' });
  console.log('📸 Screenshot saved as final-score.png');
  
  // Close browser after 5 seconds
  await page.waitForTimeout(5000);
  await browser.close();
})();
