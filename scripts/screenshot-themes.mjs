import { chromium } from "playwright";
import sharp from "sharp";
import { mkdirSync } from "node:fs";
import path from "node:path";

const OUT_DIR = path.resolve("src/assets/images/themes");
mkdirSync(OUT_DIR, { recursive: true });

const MAX_HEIGHT = 2500;
const VIEWPORT = { width: 1440, height: 900 };

// Real, live Shopify demo storefronts for official free themes.
// URL pattern discovered from the Shopify Theme Store "View demo" button:
// https://theme-<slug>-demo.myshopify.com/
const TARGETS = [
  { out: "theme-1", slug: "dawn", url: "https://theme-dawn-demo.myshopify.com/" },
  { out: "theme-2", slug: "craft", url: "https://theme-craft-demo.myshopify.com/" },
  { out: "theme-3", slug: "sense", url: "https://theme-sense-demo.myshopify.com/" },
  { out: "theme-4", slug: "origin", url: "https://theme-origin-demo.myshopify.com/" },
];

async function autoScroll(page) {
  // Trigger lazy-loaded images and scroll-in animations before capture.
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let total = 0;
      const step = 400;
      const timer = setInterval(() => {
        window.scrollBy(0, step);
        total += step;
        if (total >= document.body.scrollHeight - window.innerHeight - step) {
          clearInterval(timer);
          resolve();
        }
      }, 200);
    });
  });
  await page.waitForTimeout(600);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(800);
}

async function gotoAndSettle(page, url) {
  await page.goto(url, { waitUntil: "load", timeout: 45000 });
  try {
    await page.waitForLoadState("networkidle", { timeout: 8000 });
  } catch {
    // some demo stores never go fully idle; we already waited for `load`
  }
  await page.waitForTimeout(2000);
}

async function dismissPopups(page) {
  const selectors = [
    'button:has-text("Accept")',
    'button:has-text("Accept All")',
    'button:has-text("Allow all")',
    'button:has-text("OK")',
    'button:has-text("Got it")',
    'button:has-text("I agree")',
    '[aria-label="Close"]',
    '[aria-label="close"]',
    ".close-button",
    ".modal-close",
  ];
  for (const sel of selectors) {
    try {
      const el = page.locator(sel).first();
      if (await el.isVisible({ timeout: 800 })) {
        await el.click({ timeout: 800 });
        await page.waitForTimeout(300);
      }
    } catch {
      // best-effort only
    }
  }
  try {
    await page.keyboard.press("Escape");
  } catch {
    // ignore
  }
}

async function captureOne(browser, target) {
  const { out, slug, url } = target;
  const ctx = await browser.newContext({ viewport: VIEWPORT });
  const page = await ctx.newPage();
  let buffer = null;
  try {
    await gotoAndSettle(page, url);
    await dismissPopups(page);
    await page.waitForTimeout(500);
    await autoScroll(page);
    await dismissPopups(page);
    buffer = await page.screenshot({ fullPage: true, type: "png" });
  } catch (err) {
    console.log(`[${slug}] first attempt failed: ${err.message}`);
    try {
      await gotoAndSettle(page, url);
      await dismissPopups(page);
      await page.waitForTimeout(500);
      await autoScroll(page);
      await dismissPopups(page);
      buffer = await page.screenshot({ fullPage: true, type: "png" });
    } catch (err2) {
      console.log(`[${slug}] retry failed: ${err2.message}`);
    }
  }
  await ctx.close();

  if (!buffer) {
    console.log(`FAILED: ${slug} (${url}) — no output written`);
    return;
  }

  const meta = await sharp(buffer).metadata();
  const cappedHeight = Math.min(meta.height, MAX_HEIGHT);
  await sharp(buffer)
    .extract({ left: 0, top: 0, width: meta.width, height: cappedHeight })
    .webp({ quality: 80 })
    .toFile(path.join(OUT_DIR, `${out}.webp`));

  console.log(`Done: ${out}.webp <- ${slug} (${url})`);
}

const browser = await chromium.launch();
for (const target of TARGETS) {
  await captureOne(browser, target);
}
await browser.close();
