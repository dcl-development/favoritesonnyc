"use client";

import { useEffect, useRef } from "react";

/**
 * The page is always night. This is a cool tint laid over the whole home page, with soft
 * holes cut out around every light source, so light falls where it actually comes from:
 * the barn lamps (which the sign toggles), the neon pie, the neon reservations sign, and a
 * faint moon in the top corner. Dark text stays dark because the tint only multiplies.
 * Source positions are measured from the page, so it follows the layout at any size.
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

      // Barn lamps: fully lit under the shade, fading out. They fade with --lamps (0 when off).
      home.querySelectorAll(".sign-lamp-art").forEach((lamp) => {
        const at = centre(lamp, 0.7);
        if (at) {
          layers.push(
            pool(
              at,
              "19rem",
              "rgba(0,0,0,calc(1 - var(--lamps))) 0%, rgba(0,0,0,calc(1 - 0.78 * var(--lamps))) 30%, rgba(0,0,0,calc(1 - 0.3 * var(--lamps))) 62%, #000 100%",
            ),
          );
        }
      });

      // The neon pie and the neon reservations sign light the wall around them, always.
      const pie = home.querySelector(".pie-mark-home");
      const pieAt = pie && centre(pie);
      if (pieAt) {
        layers.push(pool(pieAt, "17rem", "rgba(0,0,0,0.04) 0%, rgba(0,0,0,0.42) 36%, #000 100%"));
      }
      const reserve = home.querySelector(".home-reserve-link");
      const reserveAt = reserve && centre(reserve);
      if (reserveAt) {
        layers.push(pool(reserveAt, "15rem", "rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.5) 38%, #000 100%"));
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
