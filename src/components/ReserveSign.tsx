/** The reservations link as neon lettering: the letters themselves are the sign, bent from
 *  glass tube. There is no font for this, so each letter is a single stroke drawn by hand
 *  (the way a neon bender shapes it) and lit the same way as the pie: a pale hot core inside
 *  red glass, with light falling off the tube in layers. The link carries aria-label, so this
 *  is purely visual. */

type Glyph = { w: number; d: string };

// Typewriter slab lettering, to match the site's type. Each letter is a few strokes of tube
// (the stem, its serifs, the bowl), the way a neon bender would shape it. Baseline y=14,
// x-height top y=4, ascender top y=0.
export const GLYPHS: Record<string, Glyph> = {
  r: { w: 11, d: "M1.4 4.4 L4.6 4 V14 M1.2 14 H8.4 M4.6 8.6 C4.6 5.6 6.4 4 9.6 4 C10.2 4 10.6 4.1 11 4.2" },
  e: { w: 12, d: "M1.2 9 H10.8 C10.8 6 8.8 4 6 4 C3 4 1.2 6 1.2 9 C1.2 12 3 14 6 14 C8 14 9.6 13.2 10.8 11.8" },
  s: {
    w: 11,
    d: "M9.8 6 C8.8 4.6 7.6 4 6 4 C3.6 4 2.4 5.2 2.4 6.6 C2.4 8.2 4 8.8 6 9.2 C8 9.6 9.8 10.2 9.8 11.8 C9.8 13.2 8.4 14 6 14 C4.2 14 2.6 13.4 1.6 12.2",
  },
  v: { w: 13, d: "M0.8 4 H5.4 M8 4 H12.2 M3 4 L6.6 14 L10.2 4" },
  a: {
    w: 12,
    d: "M2 5.6 C3.2 4.4 4.6 4 6 4 C8.6 4 9.8 5.4 9.8 7.8 V13.4 C9.8 13.8 10.2 14 10.8 14 M9.8 9.4 H6.2 C3.6 9.4 2.2 10.4 2.2 12 C2.2 13.4 3.4 14 5.2 14 C7.6 14 9.8 12.8 9.8 11.2",
  },
  t: { w: 11, d: "M4.8 0.6 V11.6 C4.8 13.2 5.8 14 7.6 14 H9.6 M1 4 H8.4" },
  i: { w: 10, d: "M2 4.4 L5 4 V14 M1.2 14 H8.8 M5 0.4 V1.4" },
  o: { w: 12, d: "M6 4 C3 4 1.2 6 1.2 9 C1.2 12 3 14 6 14 C9 14 10.8 12 10.8 9 C10.8 6 9 4 6 4 Z" },
  n: { w: 15, d: "M1.8 4.4 L5 4 V14 M1.2 14 H8.6 M5 8 C5 5.4 6.8 4 9 4 C11.4 4 12.6 5.4 12.6 8 V14 M10 14 H14.2" },
};

const WORD = "reservations";
const GAP = 3.2;

export const letters = (() => {
  let x = 0;
  return WORD.split("").map((char, index) => {
    const glyph = GLYPHS[char];
    const placed = { char, index, x, d: glyph.d };
    x += glyph.w + GAP;
    return placed;
  });
})();

export const WIDTH = letters[letters.length - 1].x + GLYPHS.s.w; // right edge of the last letter
export const VIEWBOX = { x: -6, y: -9, w: WIDTH + 12, h: 34 };

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
      viewBox={`${VIEWBOX.x} ${VIEWBOX.y} ${VIEWBOX.w} ${VIEWBOX.h}`}
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
          <feGaussianBlur in="SourceAlpha" stdDeviation="0.6" result="b1" />
          <feColorMatrix in="b1" type="matrix" values="0 0 0 0 1  0 0 0 0 0.6  0 0 0 0 0.46  0 0 0 0.85 0" result="l1" />
          <feGaussianBlur in="SourceAlpha" stdDeviation="1.7" result="b2" />
          <feColorMatrix in="b2" type="matrix" values="0 0 0 0 1  0 0 0 0 0.24  0 0 0 0 0.16  0 0 0 1.25 0" result="l2" />
          <feGaussianBlur in="SourceAlpha" stdDeviation="4.6" result="b3" />
          <feColorMatrix in="b3" type="matrix" values="0 0 0 0 0.95  0 0 0 0 0.12  0 0 0 0 0.09  0 0 0 1.45 0" result="l3" />
          <feGaussianBlur in="SourceAlpha" stdDeviation="11.5" result="b4" />
          <feColorMatrix in="b4" type="matrix" values="0 0 0 0 0.86  0 0 0 0 0.09  0 0 0 0 0.07  0 0 0 1.2 0" result="l4" />
          <feMerge>
            <feMergeNode in="l4" />
            <feMergeNode in="l3" />
            <feMergeNode in="l2" />
            <feMergeNode in="l1" />
          </feMerge>
        </filter>
      </defs>
      <g className="reserve-tube">
        {/* Same recipe as the pie's halo, including being dimmer against a lit wall. */}
        <g className="reserve-halo-level">
          <g filter="url(#reserve-halo)">
            <Layer stroke="#ff2a3c" width={2.4} />
          </g>
        </g>
        {/* the glass: a deeper red edge, the bright body, then a pale core */}
        <g opacity={0.55}>
          <Layer stroke="#9a0a18" width={2.9} />
        </g>
        <Layer stroke="#ff2a30" width={2.3} />
        <g className="reserve-core">
          <Layer stroke="#ffd2c8" width={0.8} />
        </g>
        {/* what makes the pie look round: a thin pale highlight a little up and to the left of the
            tube's centre, as if light is reflecting off one side of the glass. It shifts slightly
            with the cursor, like the pie's does. */}
        <g className="reserve-highlight">
          <g transform="translate(-0.5 -0.5)" opacity={0.6}>
            <Layer stroke="#f7fcff" width={0.5} />
          </g>
        </g>
        {/* The shine circles the "o", like the one around the pie logo. */}
        <g fill="none" stroke="#fff" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
          {letters
            .filter((letter) => letter.char === "o")
            .map((letter) => (
              <path
                key={letter.index}
                d={letter.d}
                pathLength={100}
                transform={`translate(${letter.x} 0)`}
                className="reserve-glint"
              />
            ))}
        </g>
      </g>
    </svg>
  );
}
