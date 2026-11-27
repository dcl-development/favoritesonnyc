"use client";

import { useEffect } from "react";

/**
 * Keeps each stone band on a mortar joint. The block wall is a tile that starts at the top of
 * the page with one course every --wall-course; the bands sit between page sections, so where
 * they fall depends on the content. This nudges each band, top to bottom, so its centre lands
 * on the nearest joint between two rows of blocks: pulled up a little if there is room above,
 * otherwise pushed down. Re-runs when the layout changes.
 */
const MIN_GAP = 6; // never pull a band closer than this to the content above it

export function WallAlign() {
  useEffect(() => {
    const home = document.querySelector<HTMLElement>(".home");
    if (!home) return;
    let frame = 0;
    let busy = false;

    const align = () => {
      frame = 0;
      busy = true;
      const course = Number.parseFloat(
        getComputedStyle(document.body).getPropertyValue("--wall-course"),
      );
      const bands = Array.from(home.querySelectorAll<HTMLElement>(".stone-band"));
      bands.forEach((band) => band.style.removeProperty("margin-top"));
      if (!course) {
        busy = false;
        return;
      }
      const bodyTop = document.body.getBoundingClientRect().top;
      for (const band of bands) {
        // Read after the previous band moved, so each one sees the final layout above it.
        const rect = band.getBoundingClientRect();
        const base = Number.parseFloat(getComputedStyle(band).marginTop) || 0;
        const centre = rect.top - bodyTop + rect.height / 2;
        const down = (course - (centre % course)) % course;
        const up = course - down;
        const shift = down > 0.5 && up <= base - MIN_GAP && up < down ? -up : down;
        band.style.marginTop = `${(base + shift).toFixed(2)}px`;
      }
      busy = false;
    };

    const schedule = () => {
      if (busy || frame) return;
      frame = requestAnimationFrame(align);
    };

    align();
    const observer = new ResizeObserver(schedule);
    // Watch the sections, not the bands, so our own nudges don't retrigger us.
    Array.from(home.children).forEach((child) => {
      if (!child.classList.contains("stone-band")) observer.observe(child);
    });
    window.addEventListener("resize", schedule);
    window.addEventListener("load", schedule);
    document.fonts?.ready.then(schedule);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", schedule);
      window.removeEventListener("load", schedule);
    };
  }, []);

  return null;
}
