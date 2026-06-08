// Recompacta as imagens pesadas REFERENCIADAS no código para WebP.
// Uso: node scripts/optimize-images.mjs
import sharp from "sharp";
import { stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUB = path.join(__dirname, "..", "public");

// { arquivo de origem, largura máx, qualidade }
const TARGETS = [
  // Heroes desktop (servidos em telas grandes)
  { src: "design-builder-46bfb20e.png", width: 1920, quality: 70 }, // home (bg único p/ todos)
  { src: "hero-bg.png",                 width: 1920, quality: 72 }, // /sache desktop
  { src: "LP_INFLUENCERS_3.png",        width: 1920, quality: 72 }, // /dionisio /jean desktop
  { src: "cz-pack100-hero-bg.jpg",      width: 1920, quality: 74 }, // /pack100 desktop
  { src: "cz-choice-bg.jpg",            width: 1600, quality: 72 }, // /choice bg

  // Heroes mobile (servidos em telas pequenas)
  { src: "LP_SACHE_MOBILE.png",         width: 828,  quality: 70 },
  { src: "CARBOZE_PACK_MOBILE.png",     width: 828,  quality: 70 },
  { src: "LP_INFLUENCERS_MOBILE.png",   width: 828,  quality: 70 },

  // Imagens de conteúdo
  { src: "lp-produto-secao5.png",       width: 1200, quality: 78 }, // CostValue
  { src: "cz-pack100-cta.png",          width: 1200, quality: 78 }, // CTAFinal100
];

const kb = (b) => (b / 1024).toFixed(0) + " KB";

let totalBefore = 0;
let totalAfter = 0;

for (const t of TARGETS) {
  const inPath = path.join(PUB, t.src);
  if (!existsSync(inPath)) {
    console.log(`⚠️  pulado (não existe): ${t.src}`);
    continue;
  }
  const outName = t.src.replace(/\.(png|jpe?g)$/i, ".webp");
  const outPath = path.join(PUB, outName);

  const before = (await stat(inPath)).size;
  await sharp(inPath)
    .resize({ width: t.width, withoutEnlargement: true })
    .webp({ quality: t.quality, effort: 6 })
    .toFile(outPath);
  const after = (await stat(outPath)).size;

  totalBefore += before;
  totalAfter += after;
  const pct = (100 - (after / before) * 100).toFixed(1);
  console.log(`✓ ${t.src}  ${kb(before)} → ${outName}  ${kb(after)}  (-${pct}%)`);
}

console.log(
  `\nTOTAL: ${kb(totalBefore)} → ${kb(totalAfter)}  (-${(100 - (totalAfter / totalBefore) * 100).toFixed(1)}%)`
);
