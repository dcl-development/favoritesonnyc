"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { releaseHomeMotion } from "@/lib/home-motion";

const NOTICE_KEY = "fs-reservation-notice";

function shouldHoldHomeMotion(pathname: string): boolean {
  if (pathname !== "/") return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  try {
    return sessionStorage.getItem(NOTICE_KEY) !== "1";
  } catch {
    return false;
  }
}

/** Releases `data-motion-ready` when the home page does not need to wait on the notice. */
export function HomeMotionBoot() {
  const pathname = usePathname();

  useEffect(() => {
    if (!shouldHoldHomeMotion(pathname)) releaseHomeMotion();
  }, [pathname]);

  return null;
}