/**
 * Regenerate favicon assets from favicon.svg
 *
 * Usage (from repo root):
 *   npm i sharp to-ico
 *   node scripts/generate-favicons.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import toIco from "to-ico";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const svg = readFileSync(join(root, "favicon.svg"));

const png = async (size, out) => {
  await sharp(svg).resize(size, size).png().toFile(join(root, out));
};

await png(180, "apple-touch-icon.png");
await png(192, "icon-192.png");
await png(512, "icon-512.png");

const icoBuffers = await Promise.all(
  [16, 32].map((size) => sharp(svg).resize(size, size).png().toBuffer())
);
writeFileSync(join(root, "favicon.ico"), await toIco(icoBuffers));
