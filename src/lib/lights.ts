// The home sign's lamps. The page is always night; this only switches the barn lamps.
// State lives on <html data-lights="off"> so CSS can read it anywhere, is remembered for the
// browser session, and is exposed as a tiny store so React can follow it.

const KEY = "fs-lights";
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

/** Restore the saved choice on load. */
export function restoreLights() {
  let off = false;
  try {
    off = sessionStorage.getItem(KEY) === "off";
  } catch {
    // Blocked storage: lamps just start on.
  }
  apply(off);
}

/** Flip the lamps. */
export function toggleLights() {
  const off = !lampsOff();
  apply(off);
  try {
    if (off) sessionStorage.setItem(KEY, "off");
    else sessionStorage.removeItem(KEY);
  } catch {
    // Blocked storage: the choice just won't survive a reload.
  }
}
