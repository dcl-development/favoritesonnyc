// Torn-paper edges for the strips on the home sign. Each strip gets its own tear, generated from
// a seed (its key), so it is the same on the server and the client and never changes between
// visits. Returned as CSS custom properties: the paper outline, a slightly larger outline for the
// whiter fibres that show along a real tear, and where the faint crease and curl fall.

function random(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i += 1) h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
  return () => {
    h = Math.imul(h ^ (h >>> 15), h | 1);
    h ^= h + Math.imul(h ^ (h >>> 7), h | 61);
    return ((h ^ (h >>> 14)) >>> 0) / 4294967296;
  };
}

const f = (n: number) => Number(n.toFixed(2));

/** Depths in px along one torn edge: fine jitter, with the odd deeper bite. */
function edge(rand: () => number, points: number, fine: number, bite: number) {
  const depths: number[] = [];
  let carry = rand() * fine;
  for (let i = 0; i <= points; i += 1) {
    // neighbours are related, so the edge wanders instead of buzzing
    carry = carry * 0.45 + rand() * fine * 0.75;
    const notch = rand() < 0.1 ? rand() * bite : 0;
    depths.push(f(carry + notch));
  }
  return depths;
}

function outline(rand: () => number, outward: number) {
  const n = 34;
  const top = edge(rand, n, 2.6, 2.6);
  const bottom = edge(rand, n, 2.6, 2.6);
  const sides = [0.2, 0.45, 0.7].map(() => f(rand() * 2.4));
  const otherSides = [0.2, 0.45, 0.7].map(() => f(rand() * 2.4));
  const pts: string[] = [];
  top.forEach((d, i) => pts.push(`${f((i / n) * 100)}% ${f(d - outward)}px`));
  [0.2, 0.45, 0.7].forEach((y, i) => pts.push(`calc(100% - ${f(sides[i] - outward)}px) ${y * 100}%`));
  bottom
    .slice()
    .reverse()
    .forEach((d, i) => pts.push(`${f(((n - i) / n) * 100)}% calc(100% - ${f(d - outward)}px)`));
  [0.7, 0.45, 0.2].forEach((y, i) => pts.push(`${f(otherSides[i] - outward)}px ${y * 100}%`));
  return `polygon(${pts.join(", ")})`;
}

export function tearStyle(seed: string): Record<string, string> {
  const rand = random(seed);
  const tear = outline(rand, 0);
  // The fibre fringe has its own tear. Its box is 2px bigger all round (CSS), and its tear sits
  // just inside that box, so it peeks out past the paper's edge by 0-3px, unevenly.
  const fray = outline(rand, -0.4);
  const crease = rand() < 0.6;
  return {
    "--tear": tear,
    "--fray": fray,
    "--crease-at": crease ? `${f(22 + rand() * 56)}%` : "-10%",
    "--crease-tilt": `${f(84 + rand() * 12)}deg`,
    "--curl-at": rand() < 0.5 ? "0%" : "100%",
  };
}
