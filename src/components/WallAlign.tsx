"use client";

import { useLayoutEffect } from "react";
import { alignHomeWall } from "@/lib/wall-align";

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
  useLayoutEffect(() => {
    const home = document.querySelector<HTMLElement>(".home");
    if (!home) return;
    let frame = 0;

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(() => {
        frame = 0;
        alignHomeWall();
      });
    };

    alignHomeWall();
    const observer = new ResizeObserver(schedule);
    home.querySelectorAll(".wall-region > *").forEach((child) => observer.observe(child));
    window.addEventListener("resize", schedule);
    document.fonts?.ready.then(schedule);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return null;
}