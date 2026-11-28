/**
 * Builds public/textures/block-wall.svg — painted cinder-block tile for the home wall.
 * Geometry matches --wall-course (66px × 4 courses = 264px tile height, 816px width).
 * Visual reference: storefront columns — smooth cream faces, recessed grey joint shadows.
 */
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "../public/textures/block-wall.svg");

const TILE_W = 816;
const TILE_H = 264;
const BLOCK_W = 134.4;
const BLOCK_H = 64.4;
const GAP = 1.6;
const COURSE = 66;

const ROW_A = [-135.2, 0.8, 136.8, 272.8, 408.8, 544.8, 680.8, 816.8];
const ROW_B = [-67.2, 68.8, 204.8, 340.8, 476.8, 612.8, 748.8];

const ROWS = [
  { y: 0.8, xs: ROW_A },
  { y: 66.8, xs: ROW_B },
  { y: 132.8, xs: ROW_A },
  { y: 198.8, xs: ROW_B },
];

/** Warm cream/off-white — subtle drift, long repeat. */
const BLOCK_COLORS = [
  "#f5f2eb",
  "#f4f0e8",
  "#f3efe6",
  "#f2ede5",
  "#f1ece3",
  "#f0ebe1",
  "#f3f1ea",
  "#efece2",
  "#f2efe9",
  "#eeebe1",
];

function blockColor(row, col, x) {
  const hash = (row * 19 + col * 37 + Math.abs(Math.round(x * 10)) * 11) % BLOCK_COLORS.length;
  return BLOCK_COLORS[hash];
}

function horizontalJoints() {
  const joints = [];
  for (let row = 1; row < 4; row++) {
    joints.push({ y: row * COURSE - GAP / 2, x: -24, w: TILE_W + 48 });
  }
  return joints;
}

function verticalJoints() {
  const joints = [];
  for (const { y, xs } of ROWS) {
    for (const x0 of xs) {
      const x = x0 + BLOCK_W;
      if (x <= -40 || x >= TILE_W + 40) continue;
      joints.push({ x, y: y - 0.1, h: BLOCK_H + 0.2 });
    }
  }
  return joints;
}

function chamferLines(x, y) {
  const x1 = x + 0.5;
  const x2 = x + BLOCK_W - 0.5;
  const y1 = y + 0.55;
  const yBot = y + BLOCK_H - 0.45;
  return {
    top: `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y1}" stroke="#fffef9" stroke-width="0.55" stroke-linecap="round" opacity="0.2"/>`,
    bottom: `<line x1="${x1}" y1="${yBot}" x2="${x2}" y2="${yBot}" stroke="#9e9484" stroke-width="0.65" stroke-linecap="round" opacity="0.22"/>`,
    left: `<line x1="${x + 0.5}" y1="${y + 1.2}" x2="${x + 0.5}" y2="${yBot}" stroke="#a09688" stroke-width="0.45" opacity="0.12"/>`,
    right: `<line x1="${x + BLOCK_W - 0.5}" y1="${y + 1.2}" x2="${x + BLOCK_W - 0.5}" y2="${yBot}" stroke="#a09688" stroke-width="0.45" opacity="0.1"/>`,
  };
}

function build() {
  let body = "";

  body += `<rect width="${TILE_W}" height="${TILE_H}" fill="#d4cdc0"/>`;

  ROWS.forEach(({ y, xs }, row) => {
    xs.forEach((x, col) => {
      const fill = blockColor(row, col, x);
      body += `<g>`;
      body += `<rect x="${x}" y="${y}" width="${BLOCK_W}" height="${BLOCK_H}" rx="1.35" fill="${fill}"/>`;
      body += `<rect x="${x}" y="${y}" width="${BLOCK_W}" height="${BLOCK_H}" rx="1.35" fill="url(#faceLight)" opacity="0.48"/>`;
      const c = chamferLines(x, y);
      body += c.top + c.bottom + c.left + c.right;
      body += `</g>`;
    });
  });

  for (const j of horizontalJoints()) {
    body += `<rect x="${j.x}" y="${j.y}" width="${j.w}" height="${GAP}" fill="url(#jointH)"/>`;
    body += `<rect x="${j.x}" y="${j.y}" width="${j.w}" height="0.85" fill="#8a7f72" opacity="0.28"/>`;
  }
  for (const j of verticalJoints()) {
    body += `<rect x="${j.x}" y="${j.y}" width="${GAP}" height="${j.h}" fill="url(#jointV)"/>`;
    body += `<rect x="${j.x}" y="${j.y}" width="0.7" height="${j.h}" fill="#918576" opacity="0.2"/>`;
  }

  const grime = [
    [118, 41, 24, 10, 0.022],
    [521, 88, 19, 8, 0.018],
    [701, 151, 20, 6, 0.019],
    [238, 181, 17, 5, 0.016],
    [632, 42, 13, 5, 0.015],
  ];
  for (const [cx, cy, rx, ry, op] of grime) {
    body += `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#7a6f5e" opacity="${op}"/>`;
  }

  body += `<rect width="${TILE_W}" height="${TILE_H}" fill="url(#speckle)" opacity="0.075" style="mix-blend-mode:multiply"/>`;

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${TILE_W}" height="${TILE_H}" viewBox="0 0 ${TILE_W} ${TILE_H}">
<defs>
  <linearGradient id="faceLight" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#ffffff" stop-opacity="0.28"/>
    <stop offset="32%" stop-color="#faf8f2" stop-opacity="0.05"/>
    <stop offset="100%" stop-color="#bfb5a5" stop-opacity="0.14"/>
  </linearGradient>
  <linearGradient id="jointH" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#7a6f62" stop-opacity="0.62"/>
    <stop offset="28%" stop-color="#a89b8a"/>
    <stop offset="72%" stop-color="#ccc4b5"/>
    <stop offset="100%" stop-color="#ece6db" stop-opacity="0.55"/>
  </linearGradient>
  <linearGradient id="jointV" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0%" stop-color="#857a6d" stop-opacity="0.45"/>
    <stop offset="45%" stop-color="#bab1a2"/>
    <stop offset="100%" stop-color="#ded7ca" stop-opacity="0.5"/>
  </linearGradient>
  <filter id="fineGrain" filterUnits="objectBoundingBox" x="0" y="0" width="1" height="1">
    <feTurbulence type="fractalNoise" baseFrequency="0.88" numOctaves="2" seed="11" result="n"/>
    <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.47  0 0 0 0 0.44  0 0 0 0 0.39  0 0 0 0.08 0" result="g"/>
    <feBlend in="SourceGraphic" in2="g" mode="multiply"/>
  </filter>
  <pattern id="speckle" patternUnits="userSpaceOnUse" width="128" height="128">
    <rect width="128" height="128" fill="#eee9df" filter="url(#fineGrain)"/>
  </pattern>
</defs>
${body}
</svg>`;

  writeFileSync(OUT, svg);
  console.log(`Wrote ${OUT} (${Buffer.byteLength(svg)} bytes)`);
}

build();