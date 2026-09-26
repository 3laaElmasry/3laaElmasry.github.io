import { chromium } from "playwright";
import sharp from "sharp";
import { mkdirSync } from "node:fs";
import path from "node:path";

const OUT_DIR = path.resolve("src/assets/images/projects");
mkdirSync(OUT_DIR, { recursive: true });

const MAX_DESKTOP_HEIGHT = 3000;
const DESKTOP_VIEWPORT = { width: 1440, height: 900 };
const MOBILE_VIEWPORT = { width: 390, height: 844 };

// name/category used only for placeholder fallback text
const TARGETS = [
  {
    slug: "rull-home",
    url: "https://www.rullclothes.com",
    name: "Rull Clothes",
    category: "Fashion",
  },
  {
    slug: "rull-product",
    url: "https://www.rullclothes.com/products/premium-essential-tee-38",
    name: "Rull Clothes",
    category: "Fashion",
  },
  {
    slug: "fakhmestaa",
    url: "https://fakhmestaa.com/",
    name: "Fakhmestaa",
    category: "Footwear",
  },
  {
    slug: "naila",
    url: "https://naila-eg.com",
    name: "Naila",
    category: "Fashion",
  },
  {
    slug: "almosaad",
    url: "https://almosad-emtop.com/",
    name: "Al Mosaad x EMTOP",
    category: "Power Tools",
  },
  {
    slug: "alrajhi",
    url: "https://alrajhiindustry.com",
    name: "Alrajhi Industry",
    category: "Doors & Decor",
  },
];

const fallbacks = [];

async function autoScroll(page) {
  // Scroll through the whole page in steps so lazy-loaded images and
  // scroll-triggered animations render before we take a full-page shot.
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
  // Best-effort extra settle time; some sites never reach true
  // networkidle (persistent widgets/polling), so don't hard-fail on it.
  try {
    await page.waitForLoadState("networkidle", { timeout: 8000 });
  } catch {
    // ignore, we already waited for `load`
  }
  await page.waitForTimeout(2000);
}

async function dismissPopups(page) {
  const selectors = [
    'button:has-text("Accept")',
    'button:has-text("accept")',
    'button:has-text("Accept All")',
    'button:has-text("Allow all")',
    'button:has-text("OK")',
    'button:has-text("Got it")',
    'button:has-text("I agree")',
    '[aria-label="Close"]',
    '[aria-label="close"]',
    'button:has-text("×")',
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
      // ignore, best-effort only
    }
  }
  try {
    await page.keyboard.press("Escape");
  } catch {
    // ignore
  }
}

async function captureOne(browser, target) {
  const { slug, url, name, category } = target;

  // Desktop
  const desktopCtx = await browser.newContext({ viewport: DESKTOP_VIEWPORT });
  const desktopPage = await desktopCtx.newPage();
  let desktopBuffer = null;
  try {
    await gotoAndSettle(desktopPage, url);
    await dismissPopups(desktopPage);
    await desktopPage.waitForTimeout(500);
    desktopBuffer = await desktopPage.screenshot({ fullPage: true, type: "png" });
  } catch (err) {
    console.log(`[desktop] first attempt failed for ${slug}: ${err.message}`);
    try {
      await gotoAndSettle(desktopPage, url);
      await dismissPopups(desktopPage);
      await desktopPage.waitForTimeout(500);
      desktopBuffer = await desktopPage.screenshot({ fullPage: true, type: "png" });
    } catch (err2) {
      console.log(`[desktop] retry failed for ${slug}: ${err2.message}`);
    }
  }
  await desktopCtx.close();

  // Mobile
  const mobileCtx = await browser.newContext({ viewport: MOBILE_VIEWPORT });
  const mobilePage = await mobileCtx.newPage();
  let mobileBuffer = null;
  try {
    await gotoAndSettle(mobilePage, url);
    await dismissPopups(mobilePage);
    await mobilePage.waitForTimeout(500);
    mobileBuffer = await mobilePage.screenshot({ fullPage: false, type: "png" });
  } catch (err) {
    console.log(`[mobile] first attempt failed for ${slug}: ${err.message}`);
    try {
      await gotoAndSettle(mobilePage, url);
      await dismissPopups(mobilePage);
      await mobilePage.waitForTimeout(500);
      mobileBuffer = await mobilePage.screenshot({ fullPage: false, type: "png" });
    } catch (err2) {
      console.log(`[mobile] retry failed for ${slug}: ${err2.message}`);
    }
  }
  await mobileCtx.close();

  // Desktop output (cap height, convert to webp)
  if (desktopBuffer) {
    const meta = await sharp(desktopBuffer).metadata();
    const cappedHeight = Math.min(meta.height, MAX_DESKTOP_HEIGHT);
    await sharp(desktopBuffer)
      .extract({ left: 0, top: 0, width: meta.width, height: cappedHeight })
      .webp({ quality: 80 })
      .toFile(path.join(OUT_DIR, `${slug}-desktop.webp`));
  } else {
    await makePlaceholder(
      path.join(OUT_DIR, `${slug}-desktop.webp`),
      DESKTOP_VIEWPORT.width,
      900,
      name,
      category
    );
    fallbacks.push(`${slug}-desktop: placeholder used (site failed to load)`);
  }

  // Mobile output
  if (mobileBuffer) {
    await sharp(mobileBuffer)
      .webp({ quality: 80 })
      .toFile(path.join(OUT_DIR, `${slug}-mobile.webp`));
  } else {
    await makePlaceholder(
      path.join(OUT_DIR, `${slug}-mobile.webp`),
      MOBILE_VIEWPORT.width,
      MOBILE_VIEWPORT.height,
      name,
      category
    );
    fallbacks.push(`${slug}-mobile: placeholder used (site failed to load)`);
  }

  console.log(`Done: ${slug}`);
}

function escapeXml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

async function makePlaceholder(outPath, width, height, name, category) {
  const safeName = escapeXml(name);
  const safeCategory = escapeXml(category.toUpperCase());
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#16161A"/>
          <stop offset="100%" stop-color="#1C1C22"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#g)"/>
      <circle cx="${width * 0.85}" cy="${height * 0.15}" r="${Math.min(width, height) * 0.3}" fill="#C6F432" opacity="0.08"/>
      <text x="50%" y="48%" text-anchor="middle" font-family="Arial, sans-serif" font-size="${Math.max(width * 0.055, 22)}" fill="#F5F5F7" font-weight="700">${safeName}</text>
      <text x="50%" y="58%" text-anchor="middle" font-family="Arial, sans-serif" font-size="${Math.max(width * 0.03, 14)}" fill="#C6F432" letter-spacing="2">${safeCategory}</text>
    </svg>
  `;
  await sharp(Buffer.from(svg)).webp({ quality: 80 }).toFile(outPath);
}

const browser = await chromium.launch();
for (const target of TARGETS) {
  await captureOne(browser, target);
}
await browser.close();

if (fallbacks.length) {
  console.log("\nFallbacks used:");
  fallbacks.forEach((f) => console.log(` - ${f}`));
} else {
  console.log("\nNo fallbacks needed.");
}
