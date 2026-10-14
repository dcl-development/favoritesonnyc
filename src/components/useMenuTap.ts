"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";

export function useMenuTap() {
  const [tapped, setTapped] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  function onPointerUp(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "mouse") return;
    if (window.matchMedia("(hover: hover)").matches) return;
    window.clearTimeout(timer.current);
    setTapped(false);
    requestAnimationFrame(() => {
      setTapped(true);
      timer.current = window.setTimeout(() => setTapped(false), 1000);
    });
  }

  return { tapped, onPointerUp };
}
