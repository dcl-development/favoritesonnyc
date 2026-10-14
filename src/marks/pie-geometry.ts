/** Clean geometric tubes. Arcs and straight lines only, stroked at a uniform width. */
export const PIE_TUBE = {
  ring: { d: "M249.05 140.48 A126.26 126.26 0 1 1 140.81 62.07", width: 10 },
  slice: { d: "M132.28 195.77 L241.69 126.61 A130.10 130.10 0 0 0 157.64 56.65 Z", width: 9.5 },
  crust: { d: "M165.77 6.08 A146.53 146.53 0 0 1 275.66 98.53 L258.79 112.30 A154.20 154.20 0 0 0 159.73 34.21 Z", width: 11 },
} as const;
