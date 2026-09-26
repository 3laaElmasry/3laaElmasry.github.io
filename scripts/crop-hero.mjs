import sharp from "sharp";
import { mkdirSync } from "node:fs";
import path from "node:path";

const SRC = path.resolve("assets/hero.JPG");
const OUT_DIR = path.resolve("src/assets/images/hero");

// Fraction of the original height to keep, measured from the top.
// Tuned so the crop ends around the waistline (no legs visible)
// while keeping a little headroom above the head.
const CROP_HEIGHT_RATIO = 0.52;

mkdirSync(OUT_DIR, { recursive: true });

const meta = await sharp(SRC).metadata();
const { width, height } = meta;

const cropHeight = Math.round(height * CROP_HEIGHT_RATIO);

console.log(`Original: ${width}x${height}`);
console.log(`Cropping to: ${width}x${cropHeight} (ratio ${CROP_HEIGHT_RATIO})`);

const base = sharp(SRC).extract({
  left: 0,
  top: 0,
  width,
  height: cropHeight,
});

await base
  .clone()
  .resize(800, null, { withoutEnlargement: true })
  .webp({ quality: 82 })
  .toFile(path.join(OUT_DIR, "hero-800.webp"));

await base
  .clone()
  .resize(1200, null, { withoutEnlargement: true })
  .webp({ quality: 85 })
  .toFile(path.join(OUT_DIR, "hero-1200.webp"));

await base
  .clone()
  .resize(1200, null, { withoutEnlargement: true })
  .jpeg({ quality: 85 })
  .toFile(path.join(OUT_DIR, "hero-1200.jpg"));

console.log("Done. Wrote hero-800.webp, hero-1200.webp, hero-1200.jpg");
