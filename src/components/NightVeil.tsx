"use client";

import { useEffect, useRef } from "react";

/**
 * Switches the page between "lit" and "moonlight". With the lights on this tint is nearly
 * clear, so the whole page is lit and easy to read. When the sign is tapped off, the tint
 * fades to a cool night colour over everything, with soft holes cut out around the one light
 * that never goes out, the neon pie, plus a faint moon in the top corner. Dark text stays
 * dark because the tint only multiplies. The pie is measured from the page, so it follows
 * the layout at any size.
 */
export function NightVeil() {
  const veil = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = veil.current;
    const home = node?.parentElement;
    if (!node || !home) return;

    let frame = 0;

    const paint = () => {
      frame = 0;
      const base = home.getBoundingClientRect();
      if (!base.width) return;

      const centre = (el: Element, lower = 0.5) => {
        const r = el.getBoundingClientRect();
        if (!r.width || !r.height) return null;
        return {
          x: Math.round(r.left - base.left + r.width / 2),
          y: Math.round(r.top - base.top + r.height * lower),
        };
      };

      // mask alpha: 0 = fully lit, 1 = full night. All layers intersect.
      const pool = (at: { x: number; y: number }, radius: string, stops: string) =>
        `radial-gradient(circle ${radius} at ${at.x}px ${at.y}px, ${stops})`;

      const layers: string[] = [];

      // The neon pie lights the wall around it, always. It is the one light that never goes out.
      const pie = home.querySelector(".pie-mark-home");
      const pieAt = pie && centre(pie);
      if (pieAt) {
        layers.push(pool(pieAt, "5.6rem", "rgba(0,0,0,0.22) 0%, rgba(0,0,0,0.5) 40%, rgba(0,0,0,0.9) 76%, #000 100%"));
      }

      // The moon: a faint cool wash from the top right, so nothing is ever pitch dark.
      layers.push("radial-gradient(circle 52rem at 100% 0, rgba(0,0,0,0.5) 0%, #000 100%)");

      const image = layers.join(", ");
      node.style.maskImage = image;
      node.style.setProperty("-webkit-mask-image", image);
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(paint);
    };

    paint();
    const observer = new ResizeObserver(schedule);
    observer.observe(home);
    window.addEventListener("resize", schedule);
    // Fonts and photos can shift the layout after first paint.
    window.addEventListener("load", schedule);
    document.fonts?.ready.then(schedule);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", schedule);
      window.removeEventListener("load", schedule);
    };
  }, []);

  return <div ref={veil} className="night-veil" aria-hidden="true" />;
}
