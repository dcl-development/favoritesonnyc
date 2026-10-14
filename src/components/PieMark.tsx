import { useId } from "react";
import { PIE_TUBE } from "@/marks/pie-geometry";

// Paths in src/marks/pie-mark.svg are true arcs and straight lines.
// Color, core, and glow are a style on top of that locked geometry.
const TUBES = [PIE_TUBE.ring, PIE_TUBE.slice, PIE_TUBE.crust] as const;

// Left side of the ring, about 10 o'clock down to 8 o'clock. Same length as before.
// Style only; the locked paths stay put.
const FLICKER = "M28.01 259.51 A126.26 126.26 0 0 1 50.06 92.05";

// Corners and open ends run a little hotter than the straight runs.
const BENDS = [
  [132.28, 195.77],
  [241.69, 126.61],
  [157.64, 56.65],
  [165.77, 6.08],
  [275.66, 98.53],
  [258.79, 112.3],
  [159.73, 34.21],
  [249.05, 140.48],
  [140.81, 62.07],
] as const;

function Tubes({ stroke, width }: { stroke: string; width?: number }) {
  return (
    <g fill="none" stroke={stroke} strokeLinecap="round" strokeLinejoin="round">
      {TUBES.map((tube) => (
        <path key={tube.d} d={tube.d} strokeWidth={width ?? tube.width} />
      ))}
    </g>
  );
}

export function PieMark({ className = "" }: { className?: string }) {
  const uid = useId().replace(/:/g, "");
  const glowId = `pie-glow-${uid}`;
  const glassId = `pie-glass-${uid}`;
  const filamentId = `pie-filament-${uid}`;
  const fadeId = `pie-flicker-fade-${uid}`;
  const maskId = `pie-flicker-mask-${uid}`;

  return (
    <svg
      className={className}
      viewBox="0 0 286 320"
      fill="none"
      overflow="visible"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={glassId} gradientUnits="userSpaceOnUse" x1="18" y1="24" x2="268" y2="308">
          <stop offset="0%" stopColor="#ff2a30" />
          <stop offset="22%" stopColor="#d40e16" />
          <stop offset="46%" stopColor="#f0141c" />
          <stop offset="68%" stopColor="#c40c14" />
          <stop offset="84%" stopColor="#e81018" />
          <stop offset="100%" stopColor="#f2161e" />
        </linearGradient>
        <linearGradient id={filamentId} gradientUnits="userSpaceOnUse" x1="36" y1="12" x2="246" y2="286">
          <stop offset="0%" stopColor="#fff8f6" />
          <stop offset="34%" stopColor="#ffcfc8" />
          <stop offset="58%" stopColor="#fff6f3" />
          <stop offset="100%" stopColor="#ffc4bc" />
        </linearGradient>
        <filter
          id={glowId}
          x="-36"
          y="-40"
          width="360"
          height="400"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="tight" />
          <feFlood floodColor="#8c0610" floodOpacity="0.4" result="tightInk" />
          <feComposite in="tightInk" in2="tight" operator="in" result="tightGlow" />
          <feGaussianBlur in="SourceAlpha" stdDeviation="6.5" result="mid" />
          <feFlood floodColor="#c01018" floodOpacity="0.2" result="midInk" />
          <feComposite in="midInk" in2="mid" operator="in" result="midGlow" />
          <feGaussianBlur in="SourceAlpha" stdDeviation="10" result="soft" />
          <feFlood floodColor="#e0141c" floodOpacity="0.11" result="softInk" />
          <feComposite in="softInk" in2="soft" operator="in" result="softGlow" />
          <feMerge>
            <feMergeNode in="softGlow" />
            <feMergeNode in="midGlow" />
            <feMergeNode in="tightGlow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id={fadeId} gradientUnits="userSpaceOnUse" x1="28.01" y1="259.51" x2="50.06" y2="92.05">
          <stop offset="0%" stopColor="#fff" stopOpacity="0" />
          <stop offset="16%" stopColor="#fff" stopOpacity="1" />
          <stop offset="84%" stopColor="#fff" stopOpacity="1" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <mask id={maskId} maskUnits="userSpaceOnUse" x="-20" y="70" width="120" height="220">
          <path d={FLICKER} fill="none" stroke={`url(#${fadeId})`} strokeWidth="26" strokeLinecap="round" />
        </mask>
      </defs>
      <svg viewBox="0 0 286 320" x="0" y="0" width="286" height="320" overflow="visible" filter={`url(#${glowId})`}>
        <Tubes stroke={`url(#${glassId})`} />
        {BENDS.map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="5" fill="#ff241c" opacity="0.55" />
        ))}
      </svg>
      <g className="pie-core">
        <Tubes stroke={`url(#${filamentId})`} width={3.15} />
        {BENDS.map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="1.7" fill="#fff7f5" />
        ))}
      </g>
      <g className="pie-highlight">
        <g transform="translate(-2.8 -2.8)">
          <g opacity="0.55">
            <Tubes stroke="#f7fcff" width={2} />
          </g>
          <path
            className="pie-glint"
            d={PIE_TUBE.ring.d}
            fill="none"
            stroke="#fff"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="36 780"
          />
        </g>
      </g>
      <path
        className="pie-flicker"
        d={FLICKER}
        fill="none"
        stroke="#2a0408"
        strokeWidth="18"
        strokeLinecap="round"
        mask={`url(#${maskId})`}
      />
    </svg>
  );
}
