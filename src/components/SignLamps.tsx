/** Gooseneck barn lamps over the sign board, each throwing a cone of light down the ribs.
 *  Pure markup; the glow and the cones are CSS, and switch with the sign's data-lights. */

const LAMPS = ["13%", "87%"] as const;

function Lamp() {
  return (
    <svg className="sign-lamp-art" viewBox="0 0 40 44" focusable="false">
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
  return (
    <div className="sign-lamps" aria-hidden="true">
      {LAMPS.map((x) => (
        <div key={x} className="sign-lamp" style={{ left: x }}>
          <div className="sign-cone" />
          <Lamp />
        </div>
      ))}
    </div>
  );
}
