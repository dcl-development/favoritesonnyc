// The home sign's lamps. The page is always night; this only switches the barn lamps.
// State lives on <html data-lights="off"> so CSS can read it anywhere, is remembered for the
// browser session, and is exposed as a tiny store so React can follow it.

const KEY = "fs-lights";
const USED = "fs-lamps-used";
const listeners = new Set<() => void>();

export function lampsOff(): boolean {
  return document.documentElement.dataset.lights === "off";
}

export function subscribeLights(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function apply(off: boolean) {
  if (off) document.documentElement.dataset.lights = "off";
  else delete document.documentElement.dataset.lights;
  listeners.forEach((listener) => listener());
}

/** Once a visitor has used the lamps they know they are switches, so the idle sway that hints at
 *  it stops (CSS reads <html data-lamps-used>). Remembered for the browser session. */
function markUsed() {
  document.documentElement.dataset.lampsUsed = "";
  try {
    sessionStorage.setItem(USED, "1");
  } catch {
    // Blocked storage: the hint just comes back on the next load.
  }
}

/** Restore the saved choice on load. */
export function restoreLights() {
  let off = false;
  try {
    off = sessionStorage.getItem(KEY) === "off";
    if (sessionStorage.getItem(USED)) document.documentElement.dataset.lampsUsed = "";
  } catch {
    // Blocked storage: lamps just start on.
  }
  apply(off);
}

/** Flip the lamps. */
export function toggleLights() {
  const off = !lampsOff();
  apply(off);
  markUsed();
  try {
    if (off) sessionStorage.setItem(KEY, "off");
    else sessionStorage.removeItem(KEY);
  } catch {
    // Blocked storage: the choice just won't survive a reload.
  }
}
