"use client";

import { useEffect, useLayoutEffect } from "react";

// True once the page has opened in this tab, so the intro only plays on a real page load,
// not when you navigate back to the home page.
let played = false;

/**
 * The home page's intro: it arrives as night (the HTML is rendered with data-boot="dark", which
 * CSS reads as "lamps off"), holds for a beat, and the lamps fade on. The fade is the same
 * --lamps transition the sign uses when you tap it. Skipped for reduced motion and on
 * navigations. If the visitor already switched the lamps off this session, they stay off.
 */
const HOLD_MS = 450;

export function LightsOn() {
  const finish = () => document.querySelector(".home")?.removeAttribute("data-boot");

  useLayoutEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (played || reduce) finish();
  }, []);

  useEffect(() => {
    if (played) return;
    played = true;
    const id = window.setTimeout(finish, HOLD_MS);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <noscript>
      <style>{`html:has(.home[data-boot="dark"]){--lamps:1!important}`}</style>
    </noscript>
  );
}
