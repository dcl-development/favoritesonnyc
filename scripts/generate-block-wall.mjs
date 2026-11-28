/**
 * Builds public/textures/block-wall.svg — painted cinder-block tile for the home wall.
 * Geometry matches --wall-course (66px × 4 courses = 264px tile height, 816px width).
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

const BLOCK_COLORS = [
  "#f7f4ed",
  "#f4f0e8",
  "#f2ede5",
  "#eee9df",
  "#f0ebe1",
  "#ebe6db",
  "#f3efe8",
  "#efebe3",
  "#f1ece4",
  "#e9e4da",
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

function blockMarkup(x, y, fill) {
  const x1 = x + 1;
  const x2 = x + BLOCK_W - 1;
  const yTop = y + 1;
  const yBot = y + BLOCK_H - 1;
  return `<g>
  <rect x="${x}" y="${y}" width="${BLOCK_W}" height="${BLOCK_H}" rx="1.4" fill="${fill}"/>
  <rect x="${x}" y="${y}" width="${BLOCK_W}" height="${BLOCK_H}" rx="1.4" fill="url(#faceLight)" opacity="0.72"/>
  <line x1="${x1}" y1="${yTop + 0.35}" x2="${x2}" y2="${yTop + 0.35}" stroke="#fffef9" stroke-width="0.7" stroke-linecap="round" opacity="0.34"/>
  <line x1="${x1}" y1="${yBot - 0.2}" x2="${x2}" y2="${yBot - 0.2}" stroke="#7d7162" stroke-width="0.85" stroke-linecap="round" opacity="0.38"/>
  <line x1="${x + 0.55}" y1="${yTop + 1.5}" x2="${x + 0.55}" y2="${yBot - 1}" stroke="#8a7d6e" stroke-width="0.5" opacity="0.16"/>
  <line x1="${x + BLOCK_W - 0.55}" y1="${yTop + 1.5}" x2="${x + BLOCK_W - 0.55}" y2="${yBot - 1}" stroke="#8a7d6e" stroke-width="0.5" opacity="0.14"/>
</g>`;
}

function lightingMask() {
  let shapes = "";
  ROWS.forEach(({ y, xs }) => {
    for (const x of xs) {
      shapes += `<rect x="${x}" y="${y}" width="${BLOCK_W}" height="${BLOCK_H}" rx="1.4" fill="#fff"/>`;
    }
  });
  return shapes;
}

function build() {
  let body = "";

  body += `<rect width="${TILE_W}" height="${TILE_H}" fill="#c8bfb0"/>`;

  ROWS.forEach(({ y, xs }, row) => {
    xs.forEach((x, col) => {
      body += blockMarkup(x, y, blockColor(row, col, x));
    });
  });

  for (const j of horizontalJoints()) {
    body += `<rect x="${j.x}" y="${j.y}" width="${j.w}" height="${GAP}" fill="url(#jointH)"/>`;
    body += `<rect x="${j.x}" y="${j.y}" width="${j.w}" height="1.05" fill="#6d6254" opacity="0.48"/>`;
    body += `<rect x="${j.x}" y="${j.y + GAP - 0.55}" width="${j.w}" height="0.55" fill="#f0ebe2" opacity="0.55"/>`;
  }
  for (const j of verticalJoints()) {
    body += `<rect x="${j.x}" y="${j.y}" width="${GAP}" height="${j.h}" fill="url(#jointV)"/>`;
    body += `<rect x="${j.x}" y="${j.y}" width="0.85" height="${j.h}" fill="#756a5c" opacity="0.36"/>`;
  }

  const grime = [
    [118, 41, 24, 10, 0.026],
    [521, 88, 19, 8, 0.021],
    [701, 151, 20, 6, 0.022],
    [238, 181, 17, 5, 0.019],
    [632, 42, 13, 5, 0.018],
    [367, 58, 16, 7, 0.017],
  ];
  for (const [cx, cy, rx, ry, op] of grime) {
    body += `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#6f6456" opacity="${op}"/>`;
  }

  body += `<rect width="${TILE_W}" height="${TILE_H}" fill="url(#speckle)" opacity="0.095" style="mix-blend-mode:multiply"/>`;
  body += `<g style="mix-blend-mode:multiply" opacity="0.42" filter="url(#topLight)">${lightingMask()}</g>`;

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${TILE_W}" height="${TILE_H}" viewBox="0 0 ${TILE_W} ${TILE_H}">
<defs>
  <linearGradient id="faceLight" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#ffffff" stop-opacity="0.42"/>
    <stop offset="35%" stop-color="#faf7f0" stop-opacity="0.1"/>
    <stop offset="100%" stop-color="#a99a88" stop-opacity="0.28"/>
  </linearGradient>
  <linearGradient id="jointH" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#5c5145" stop-opacity="0.75"/>
    <stop offset="30%" stop-color="#9c8f7d"/>
    <stop offset="72%" stop-color="#c9bfb0"/>
    <stop offset="100%" stop-color="#ebe4d8" stop-opacity="0.65"/>
  </linearGradient>
  <linearGradient id="jointV" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0%" stop-color="#65594c" stop-opacity="0.55"/>
    <stop offset="50%" stop-color="#b5aa9a"/>
    <stop offset="100%" stop-color="#ddd5c8" stop-opacity="0.55"/>
  </linearGradient>
  <filter id="topLight" filterUnits="userSpaceOnUse" x="-8" y="-8" width="${TILE_W + 16}" height="${TILE_H + 16}" color-interpolation-filters="sRGB">
    <feGaussianBlur in="SourceGraphic" stdDeviation="0.35" result="soft"/>
    <feDiffuseLighting in="soft" surfaceScale="2.8" diffuseConstant="1.15" lighting-color="#ffffff" result="light">
      <feDistantLight azimuth="270" elevation="58"/>
    </feDiffuseLighting>
    <feComponentTransfer in="light">
      <feFuncR type="linear" slope="0.38" intercept="0.62"/>
      <feFuncG type="linear" slope="0.38" intercept="0.62"/>
      <feFuncB type="linear" slope="0.38" intercept="0.62"/>
    </feComponentTransfer>
  </filter>
  <filter id="fineGrain" filterUnits="objectBoundingBox" x="0" y="0" width="1" height="1">
    <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="11" result="n"/>
    <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.47  0 0 0 0 0.44  0 0 0 0 0.39  0 0 0 0.1 0" result="g"/>
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