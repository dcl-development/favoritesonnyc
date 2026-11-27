/** The reservations link as neon lettering: the letters themselves are the sign, bent from
 *  glass tube. There is no font for this, so each letter is a single stroke drawn by hand
 *  (the way a neon bender shapes it) and lit the same way as the pie: a pale hot core inside
 *  red glass, with light falling off the tube in layers. The link carries aria-label, so this
 *  is purely visual. */

type Glyph = { w: number; d: string };

// One continuous stroke per letter. Baseline y=14, x-height top y=4, ascender top y=0.
const GLYPHS: Record<string, Glyph> = {
  r: { w: 8, d: "M1 14 V4 M1 8.5 C1 5.2 3.4 4 7 4" },
  e: { w: 12, d: "M1 9 H11 C11 6 9 4 6 4 C3 4 1 6 1 9 C1 12 3 14 6 14 C8 14 9.6 13.2 10.6 12" },
  s: {
    w: 11,
    d: "M10 6 C9 4.6 7.6 4 6 4 C3.6 4 2.4 5.2 2.4 6.6 C2.4 8.2 4 8.8 6 9.2 C8 9.6 9.8 10.2 9.8 11.8 C9.8 13.2 8.4 14 6 14 C4.2 14 2.6 13.4 1.8 12.2",
  },
  v: { w: 12, d: "M1 4 L6 14 L11 4" },
  a: { w: 11, d: "M10 4 V14 M10 9 C10 6 8 4 5.5 4 C3 4 1 6 1 9 C1 12 3 14 5.5 14 C8 14 10 12 10 9" },
  t: { w: 10, d: "M5 0.5 V11.5 C5 13.2 6 14 8 14 H9 M1.5 4 H8.5" },
  i: { w: 4, d: "M2 4 V14 M2 0.6 V1.2" },
  o: { w: 12, d: "M6 4 C3 4 1 6 1 9 C1 12 3 14 6 14 C9 14 11 12 11 9 C11 6 9 4 6 4 Z" },
  n: { w: 11.5, d: "M1 14 V4 M1 8 C1 5 3.5 4 6 4 C9 4 10.5 5.6 10.5 8.5 V14" },
};

const WORD = "reservations";
const GAP = 5.5;

const letters = (() => {
  let x = 0;
  return WORD.split("").map((char, index) => {
    const glyph = GLYPHS[char];
    const placed = { char, index, x, d: glyph.d };
    x += glyph.w + GAP;
    return placed;
  });
})();

const WIDTH = letters[letters.length - 1].x + GLYPHS.s.w; // right edge of the last letter

function Layer({ stroke, width, className }: { stroke: string; width: number; className?: string }) {
  return (
    <g
      className={className}
      fill="none"
      stroke={stroke}
      strokeWidth={width}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {letters.map((letter) => (
        <path
          key={letter.index}
          d={letter.d}
          transform={`translate(${letter.x} 0)`}
          className="reserve-letter"
          style={{ ["--i" as string]: letter.index }}
          data-buzz={letter.index === 5 ? "" : undefined}
        />
      ))}
    </g>
  );
}

export function ReserveSign() {
  return (
    <svg
      className="reserve-art"
      viewBox={`-6 -9 ${WIDTH + 12} 34`}
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <filter
          id="reserve-halo"
          x="-90"
          y="-90"
          width={WIDTH + 180}
          height="214"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur in="SourceAlpha" stdDeviation="1.2" result="b1" />
          <feColorMatrix in="b1" type="matrix" values="0 0 0 0 1  0 0 0 0 0.6  0 0 0 0 0.46  0 0 0 0.9 0" result="l1" />
          <feGaussianBlur in="SourceAlpha" stdDeviation="3.6" result="b2" />
          <feColorMatrix in="b2" type="matrix" values="0 0 0 0 1  0 0 0 0 0.24  0 0 0 0 0.16  0 0 0 1.9 0" result="l2" />
          <feGaussianBlur in="SourceAlpha" stdDeviation="9" result="b3" />
          <feColorMatrix in="b3" type="matrix" values="0 0 0 0 0.95  0 0 0 0 0.12  0 0 0 0 0.09  0 0 0 2.1 0" result="l3" />
          <feGaussianBlur in="SourceAlpha" stdDeviation="16" result="b4" />
          <feColorMatrix in="b4" type="matrix" values="0 0 0 0 0.86  0 0 0 0 0.09  0 0 0 0 0.07  0 0 0 1.9 0" result="l4" />
          <feMerge>
            <feMergeNode in="l4" />
            <feMergeNode in="l3" />
            <feMergeNode in="l2" />
            <feMergeNode in="l1" />
          </feMerge>
        </filter>
      </defs>
      <g className="reserve-tube">
        <g filter="url(#reserve-halo)">
          <Layer stroke="#ff3a24" width={2.4} />
        </g>
        <Layer stroke="#ff3a24" width={2.4} />
        <Layer stroke="#fff1e4" width={0.9} />
      </g>
    </svg>
  );
}
