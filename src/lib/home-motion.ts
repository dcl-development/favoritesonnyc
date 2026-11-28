/** Gates home-page entrance motion until the reservations notice is dismissed (`data-motion-ready` on <html>). */

const ATTR = "data-motion-ready";
const listeners = new Set<() => void>();

export function homeMotionReady(): boolean {
  return document.documentElement.hasAttribute(ATTR);
}

export function subscribeHomeMotion(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function releaseHomeMotion(): void {
  if (homeMotionReady()) return;
  document.documentElement.setAttribute(ATTR, "");
  listeners.forEach((listener) => listener());
}