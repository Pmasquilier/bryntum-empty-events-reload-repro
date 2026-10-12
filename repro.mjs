// npm run dev (one terminal), then npm run repro (another): clicks both buttons headless and counts the bars.
import { chromium } from 'playwright-core';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport : { width : 1280, height : 600 } });
await page.goto(process.env.REPRO_URL ?? 'http://localhost:5173/');
await page.waitForFunction(() => window.ready);

const bars = () => page.locator('.b-sch-event-wrap:not(.b-released)').count();
console.log('initial load:', await bars(), 'bars');
await page.getByRole('button', { name : '1. Load no events' }).click();
await page.waitForTimeout(500);
console.log('after 1:', await bars(), 'bars');
await page.getByRole('button', { name : '2. Load the 7 events again' }).click();
await page.waitForTimeout(500);
const final = await bars();
console.log('after 2:', final, 'bars', final < 7 ? '(reproduced)' : '(not reproduced)');
await page.screenshot({ path : 'screenshots/after-reload.png' });
await browser.close();
