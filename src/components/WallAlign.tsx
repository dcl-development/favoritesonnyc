"use client";

import { useEffect } from "react";

/**
 * Lays the home page wall out like a real one. Each section sits on its own piece of wall
 * (.wall-region) with a stone band between pieces. The wall tile has one course of blocks every
 * --wall-course and each piece starts at a joint, so making a piece a whole number of courses
 * tall means every row of blocks ends cleanly at the band above and below it. The section's
 * content is centred in its piece (CSS), so equal space sits above and below it.
 *
 * Only min-height changes, set from the content's own height, so this does not retrigger itself.
 */
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
      const regions = Array.from(home.querySelectorAll<HTMLElement>(".wall-region"));
      for (const region of regions) region.style.removeProperty("min-height");
      if (!course) return;
      for (const region of regions) {
        const natural = region.getBoundingClientRect().height;
        const courses = Math.max(1, Math.ceil(natural / course - 1e-3));
        region.style.minHeight = `${courses * course}px`;
      }
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(align);
    };

    align();
    const observer = new ResizeObserver(schedule);
    // Watch what is inside each piece of wall, not the piece itself, so our own sizing is ignored.
    home.querySelectorAll(".wall-region > *").forEach((child) => observer.observe(child));
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
