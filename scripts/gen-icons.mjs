// Genera los íconos PNG del HDX OS desde un SVG (sin dependencia de fuentes:
// la "H" y el caret se dibujan con rectángulos). Uso: node scripts/gen-icons.mjs
import sharp from "sharp";
import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "public", "icons");
mkdirSync(outDir, { recursive: true });

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="#a82c29"/>
  <rect x="150" y="128" width="52" height="256" rx="8" fill="#f8f9f6"/>
  <rect x="300" y="128" width="52" height="256" rx="8" fill="#f8f9f6"/>
  <rect x="150" y="230" width="202" height="52" rx="8" fill="#f8f9f6"/>
  <rect x="372" y="128" width="22" height="256" rx="6" fill="#f8f9f6" opacity="0.5"/>
</svg>`;

const targets = [
  [192, "icon-192.png"],
  [512, "icon-512.png"],
  [180, "apple-touch-icon.png"],
];

for (const [size, name] of targets) {
  await sharp(Buffer.from(svg)).resize(size, size).png().toFile(join(outDir, name));
  console.log("wrote", name, size + "px");
}
