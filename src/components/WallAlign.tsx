"use client";

import { useEffect } from "react";

/**
 * Lays the home page out on the block wall. The wall tile has one course of blocks every
 * --wall-course, starting at the top of the page, and the stone bands sit between sections.
 *
 * - The first band is nudged onto the nearest mortar joint (up if there is room, else down).
 * - Every section after it is given a whole number of courses between its two bands, with
 *   equal space above and below its content. So every later band lands on a joint too, and
 *   each section is centred between its bands, whatever its height.
 *
 * Only margins change, never sizes, so this does not retrigger itself.
 */
const MIN_PULL = 6; // never pull the first band closer than this to the content above it
const MIN_PAD = 20; // the least space between a section's content and a band

export function WallAlign() {
  useEffect(() => {
    const home = document.querySelector<HTMLElement>(".home");
    if (!home) return;
    let frame = 0;

    const align = () => {
      frame = 0;
      const course = Number.parseFloat(
        getComputedStyle(document.body).getPropertyValue("--wall-course"),
      );
      const bands = Array.from(home.querySelectorAll<HTMLElement>(".stone-band"));
      for (const band of bands) {
        band.style.removeProperty("margin-top");
        (band.previousElementSibling as HTMLElement | null)?.style.removeProperty("margin-top");
      }
      if (!course || !bands.length) return;

      // First band: onto the nearest joint.
      const first = bands[0];
      const bodyTop = document.body.getBoundingClientRect().top;
      const rect = first.getBoundingClientRect();
      const base = Number.parseFloat(getComputedStyle(first).marginTop) || 0;
      const centre = rect.top - bodyTop + rect.height / 2;
      const down = (course - (centre % course)) % course;
      const up = course - down;
      const shift = down > 0.5 && up <= base - MIN_PULL && up < down ? -up : down;
      first.style.marginTop = `${(base + shift).toFixed(2)}px`;

      // Every later band: a whole number of courses after the one before, content centred.
      for (const band of bands.slice(1)) {
        const section = band.previousElementSibling as HTMLElement | null;
        if (!section) continue;
        const height = section.getBoundingClientRect().height;
        const bandHeight = band.getBoundingClientRect().height;
        const courses = Math.max(1, Math.ceil((height + 2 * MIN_PAD + bandHeight) / course));
        const pad = (courses * course - bandHeight - height) / 2;
        section.style.marginTop = `${pad.toFixed(2)}px`;
        band.style.marginTop = `${pad.toFixed(2)}px`;
      }
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(align);
    };

    align();
    const observer = new ResizeObserver(schedule);
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
