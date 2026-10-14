"use client";

import { useEffect } from "react";

const maxShift = 1.1;

export function PieLight() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const root = document.documentElement;
    let frame = 0;
    let x = 0;
    let y = 0;
    const target = { x: 0, y: 0 };
    let listening = false;

    const paint = () => {
      frame = 0;
      x += (target.x - x) * 0.35;
      y += (target.y - y) * 0.35;
      root.style.setProperty("--pie-lx", `${x.toFixed(2)}px`);
      root.style.setProperty("--pie-ly", `${y.toFixed(2)}px`);
      if (Math.abs(target.x - x) > 0.04 || Math.abs(target.y - y) > 0.04) {
        frame = requestAnimationFrame(paint);
      }
    };

    const kick = () => {
      if (!frame) frame = requestAnimationFrame(paint);
    };

    const onPointer = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const nx = (event.clientX / window.innerWidth) * 2 - 1;
      const ny = (event.clientY / window.innerHeight) * 2 - 1;
      target.x = Math.max(-1, Math.min(1, nx)) * maxShift;
      target.y = Math.max(-1, Math.min(1, ny)) * maxShift;
      kick();
    };

    // iOS only sends tilt after a permission prompt. Skip that and use the
    // event when the browser already provides it.
    const onTilt = (event: DeviceOrientationEvent) => {
      if (event.gamma == null || event.beta == null) return;
      target.x = Math.max(-1, Math.min(1, event.gamma / 35)) * maxShift;
      target.y = Math.max(-1, Math.min(1, (event.beta - 40) / 35)) * maxShift;
      kick();
    };

    const start = () => {
      if (listening || reduce.matches) return;
      listening = true;
      window.addEventListener("pointermove", onPointer, { passive: true });
      window.addEventListener("deviceorientation", onTilt);
    };

    const stop = () => {
      if (!listening) return;
      listening = false;
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("deviceorientation", onTilt);
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      x = 0;
      y = 0;
      target.x = 0;
      target.y = 0;
      root.style.removeProperty("--pie-lx");
      root.style.removeProperty("--pie-ly");
    };

    const onReduce = () => {
      if (reduce.matches) stop();
      else start();
    };

    start();
    reduce.addEventListener("change", onReduce);
    return () => {
      reduce.removeEventListener("change", onReduce);
      stop();
    };
  }, []);

  return null;
}
