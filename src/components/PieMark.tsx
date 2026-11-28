import { useId } from "react";
import { PIE_TUBE } from "@/marks/pie-geometry";

// Paths in src/marks/pie-mark.svg are true arcs and straight lines.
// Color, core, and glow are a style on top of that locked geometry.
// Stroke, core, halo, and highlight are 12.5% heavier than the locked widths.
const WEIGHT = 1.125;
const TUBES = [PIE_TUBE.ring, PIE_TUBE.slice, PIE_TUBE.crust] as const;

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
        <path key={tube.d} d={tube.d} strokeWidth={(width ?? tube.width) * WEIGHT} />
      ))}
    </g>
  );
}

export function PieMark({ className = "" }: { className?: string }) {
  const uid = useId().replace(/:/g, "");
  const glowId = `pie-glow-${uid}`;
  const glassId = `pie-glass-${uid}`;
  const filamentId = `pie-filament-${uid}`;
  const haloId = `pie-halo-${uid}`;

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
          <stop offset="0%" stopColor="#ff4630" />
          <stop offset="22%" stopColor="#f0201a" />
          <stop offset="46%" stopColor="#ff4a34" />
          <stop offset="68%" stopColor="#ec1c16" />
          <stop offset="84%" stopColor="#ff3a28" />
          <stop offset="100%" stopColor="#ff4630" />
        </linearGradient>
        <linearGradient id={filamentId} gradientUnits="userSpaceOnUse" x1="36" y1="12" x2="246" y2="286">
          <stop offset="0%" stopColor="#fff4ea" />
          <stop offset="34%" stopColor="#ffe6d8" />
          <stop offset="58%" stopColor="#fff0e4" />
          <stop offset="100%" stopColor="#ffe6d8" />
        </linearGradient>
        <filter
          id={glowId}
          x="-42"
          y="-46"
          width="372"
          height="412"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur in="SourceAlpha" stdDeviation={3 * WEIGHT} result="tight" />
          <feFlood floodColor="#8c0610" floodOpacity="0.4" result="tightInk" />
          <feComposite in="tightInk" in2="tight" operator="in" result="tightGlow" />
          <feGaussianBlur in="SourceAlpha" stdDeviation={6.5 * WEIGHT} result="mid" />
          <feFlood floodColor="#c01018" floodOpacity="0.2" result="midInk" />
          <feComposite in="midInk" in2="mid" operator="in" result="midGlow" />
          <feGaussianBlur in="SourceAlpha" stdDeviation={10 * WEIGHT} result="soft" />
          <feFlood floodColor="#e0141c" floodOpacity="0.11" result="softInk" />
          <feComposite in="softInk" in2="soft" operator="in" result="softGlow" />
          <feMerge>
            <feMergeNode in="softGlow" />
            <feMergeNode in="midGlow" />
            <feMergeNode in="tightGlow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter
          id={haloId}
          x="-360"
          y="-360"
          width="1006"
          height="1040"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="b1" />
          <feColorMatrix in="b1" type="matrix" values="0 0 0 0 1  0 0 0 0 0.6  0 0 0 0 0.46  0 0 0 0.85 0" result="l1" />
          <feGaussianBlur in="SourceAlpha" stdDeviation="9" result="b2" />
          <feColorMatrix in="b2" type="matrix" values="0 0 0 0 1  0 0 0 0 0.24  0 0 0 0 0.16  0 0 0 1.25 0" result="l2" />
          <feGaussianBlur in="SourceAlpha" stdDeviation="24" result="b3" />
          <feColorMatrix in="b3" type="matrix" values="0 0 0 0 0.95  0 0 0 0 0.12  0 0 0 0 0.09  0 0 0 1.45 0" result="l3" />
          <feGaussianBlur in="SourceAlpha" stdDeviation="60" result="b4" />
          <feColorMatrix in="b4" type="matrix" values="0 0 0 0 0.86  0 0 0 0 0.09  0 0 0 0 0.07  0 0 0 1.2 0" result="l4" />
          <feMerge>
            <feMergeNode in="l4" />
            <feMergeNode in="l3" />
            <feMergeNode in="l2" />
            <feMergeNode in="l1" />
          </feMerge>
        </filter>
      </defs>
      <g className="pie-halo-level">
        <g className="pie-halo" filter={`url(#${haloId})`}>
          <Tubes stroke="#ff3a24" />
        </g>
      </g>
      <svg viewBox="0 0 286 320" x="0" y="0" width="286" height="320" overflow="visible" filter={`url(#${glowId})`}>
        <Tubes stroke={`url(#${glassId})`} />
        {BENDS.map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r={5 * WEIGHT} fill="#ff241c" opacity="0.55" />
        ))}
      </svg>
      <g className="pie-core">
        <Tubes stroke={`url(#${filamentId})`} width={3.15} />
        {BENDS.map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r={1.7 * WEIGHT} fill="#ffd6d0" />
        ))}
      </g>
      <g className="pie-highlight">
        <g transform={`translate(${-2.8 * WEIGHT} ${-2.8 * WEIGHT})`}>
          <g opacity="0.55">
            <Tubes stroke="#f7fcff" width={2} />
          </g>
          <path
            className="pie-glint"
            d={PIE_TUBE.ring.d}
            fill="none"
            stroke="#fff"
            strokeWidth={4 * WEIGHT}
            strokeLinecap="round"
            strokeDasharray="36 780"
          />
        </g>
      </g>
      <g className="pie-flicker" fill="none" stroke="#2a0408" strokeLinecap="round" strokeLinejoin="round">
        <path d={PIE_TUBE.slice.d} strokeWidth={14 * WEIGHT} />
        <path d={PIE_TUBE.crust.d} strokeWidth={16 * WEIGHT} />
      </g>
    </svg>
  );
}
