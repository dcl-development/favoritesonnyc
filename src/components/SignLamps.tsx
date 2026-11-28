"use client";

import { useSyncExternalStore } from "react";
import { lampsOff, subscribeLights, toggleLights } from "@/lib/lights";

/** Gooseneck barn lamps over the sign board, each throwing a cone of light down the ribs.
 *  The lamps are the lights switch: tapping either one turns every lamp off (and back on), and
 *  they are real buttons, so the keyboard and screen readers get the same control. The glow and
 *  the cones are CSS, driven by the page-wide --lamps value. */

const LAMPS = ["13%", "87%"] as const;

function Lamp() {
  return (
    <svg className="sign-lamp-art" viewBox="0 0 40 44" focusable="false" aria-hidden="true">
      <path
        d="M31 44 V12 Q31 3 21 3 Q20 3 20 10"
        fill="none"
        stroke="#2b211d"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path d="M8 24 Q9 12 20 11 Q31 12 32 24 Z" fill="#b3262f" />
      <path d="M12 21 Q14 14 20 13.2" fill="none" stroke="#e8707a" strokeWidth="1.3" strokeLinecap="round" opacity=".7" />
      <rect x="6" y="23.2" width="28" height="2.4" rx="1.2" fill="#85191f" />
      <ellipse className="sign-bulb" cx="20" cy="28.6" rx="4.2" ry="3" />
    </svg>
  );
}

export function SignLamps() {
  const off = useSyncExternalStore(subscribeLights, lampsOff, () => false);
  return (
    <div className="sign-lamps">
      {LAMPS.map((x) => (
        <div key={x} className="sign-lamp" style={{ left: x }}>
          <div className="sign-cone" aria-hidden="true" />
          <button
            type="button"
            className="sign-lamp-btn"
            aria-pressed={!off}
            aria-label={off ? "turn the barn lamps on" : "turn the barn lamps off"}
            onClick={toggleLights}
          >
            <Lamp />
          </button>
        </div>
      ))}
    </div>
  );
}
