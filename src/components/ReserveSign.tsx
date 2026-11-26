/** The [reservations] link as a small neon sign: dark backplate, a glass tube frame with
 *  the break and end caps real signs have, mounting clips, and lettering that powers on
 *  letter by letter on hover. The link carries aria-label="reservations", so the lettering
 *  is purely visual (it is not aria-hidden, which an older rule on this link would restyle). Drawn to match the pie's tube (same reds, same pale core). */

const LABEL = "reservations";
const TUBE =
  "M146 10 H244 a10 10 0 0 1 10 10 V52 a10 10 0 0 1 -10 10 H20 a10 10 0 0 1 -10 -10 V20 a10 10 0 0 1 10 -10 H118";

// Clips sit on straight runs of the tube: [x, y, horizontal run?]
const CLIPS: ReadonlyArray<readonly [number, number, boolean]> = [
  [10, 36, false],
  [254, 36, false],
  [64, 62, true],
  [200, 62, true],
  [64, 10, true],
  [200, 10, true],
];

export function ReserveSign() {
  return (
    <>
      <svg className="reserve-art" viewBox="0 0 264 72" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id="reserve-glass" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="264" y2="72">
            <stop offset="0%" stopColor="#ff2a30" />
            <stop offset="30%" stopColor="#d40e16" />
            <stop offset="55%" stopColor="#f0141c" />
            <stop offset="80%" stopColor="#c40c14" />
            <stop offset="100%" stopColor="#f2161e" />
          </linearGradient>
          <linearGradient id="reserve-plate" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2a1d1a" />
            <stop offset="100%" stopColor="#150e0d" />
          </linearGradient>
          <filter
            id="reserve-glow"
            x="-20"
            y="-20"
            width="304"
            height="112"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="tight" />
            <feFlood floodColor="#e0141c" floodOpacity="0.7" result="tightInk" />
            <feComposite in="tightInk" in2="tight" operator="in" result="tightGlow" />
            <feGaussianBlur in="SourceAlpha" stdDeviation="8" result="soft" />
            <feFlood floodColor="#e0141c" floodOpacity="0.4" result="softInk" />
            <feComposite in="softInk" in2="soft" operator="in" result="softGlow" />
            <feMerge>
              <feMergeNode in="softGlow" />
              <feMergeNode in="tightGlow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <rect x="3" y="3" width="258" height="66" rx="9" fill="url(#reserve-plate)" />
        <rect x="3.4" y="3.4" width="257.2" height="65.2" rx="8.6" stroke="#4a3a34" strokeWidth="0.8" />

        <g className="reserve-tube">
          <path
            d={TUBE}
            stroke="url(#reserve-glass)"
            strokeWidth="4.4"
            strokeLinecap="round"
            filter="url(#reserve-glow)"
          />
          <path d={TUBE} stroke="#ffd6d0" strokeWidth="1.6" strokeLinecap="round" />
        </g>

        {/* the glass ends where the tube breaks, with their electrode caps */}
        <rect x="112" y="7" width="7" height="6" rx="1.5" fill="#2e211e" />
        <rect x="145" y="7" width="7" height="6" rx="1.5" fill="#2e211e" />

        {CLIPS.map(([x, y, horizontal]) => (
          <rect
            key={`${x}-${y}`}
            x={horizontal ? x - 5 : x - 2.6}
            y={horizontal ? y - 2.6 : y - 5}
            width={horizontal ? 10 : 5.2}
            height={horizontal ? 5.2 : 10}
            rx="1.2"
            fill="#8a7d74"
            stroke="#3a312d"
            strokeWidth="0.6"
          />
        ))}
      </svg>
      <span className="reserve-label">
        {LABEL.split("").map((letter, index) => (
          <span key={index} className="reserve-letter" style={{ ["--i" as string]: index }}>
            {letter}
          </span>
        ))}
      </span>
    </>
  );
}
