"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { SanityImage } from "@/components/SanityImage";
import type { Photo } from "@/content/site";
import { isSanityImageSrc } from "@/lib/sanityImageLoader";

const AUTO_MS = 3600;
const RESUME_MS = 3000;

export function PieStrip({ photos }: { photos: Photo[] }) {
  const scroller = useRef<HTMLDivElement>(null);
  const coast = useRef(0);
  const settleTimer = useRef(0);
  const settleGen = useRef(0);
  const vel = useRef(0);
  const drag = useRef<{
    x: number;
    y: number;
    left: number;
    lastX: number;
    lastT: number;
    locked: boolean;
    pointer: number;
  } | null>(null);
  const inView = useRef(false);
  const hoverPaused = useRef(false);
  const userPaused = useRef(false);
  const advanceTimer = useRef(0);
  const resumeTimer = useRef(0);
  const loopWidth = useRef(0);
  const normalizeTimer = useRef(0);
  const scheduleAutoRef = useRef<() => void>(() => {});

  useEffect(
    () => () => {
      window.cancelAnimationFrame(coast.current);
      window.clearTimeout(settleTimer.current);
      window.clearTimeout(advanceTimer.current);
      window.clearTimeout(resumeTimer.current);
      window.clearTimeout(normalizeTimer.current);
    },
    [],
  );

  function prefersStill() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function nearest(node: HTMLDivElement) {
    const origin = node.getBoundingClientRect().left;
    let best = node.scrollLeft;
    let bestDist = Infinity;
    node.querySelectorAll<HTMLElement>(".pie-frame").forEach((frame) => {
      const target = node.scrollLeft + (frame.getBoundingClientRect().left - origin);
      const dist = Math.abs(frame.getBoundingClientRect().left - origin);
      if (dist < bestDist) {
        bestDist = dist;
        best = target;
      }
    });
    return best;
  }

  function settle(node: HTMLDivElement) {
    const token = ++settleGen.current;
    const left = nearest(node);
    const behavior = prefersStill() ? "auto" : "smooth";
    node.scrollTo({ left, behavior });
    window.clearTimeout(settleTimer.current);
    if (behavior === "auto") {
      node.classList.remove("is-free");
      return;
    }
    const done = () => {
      if (token !== settleGen.current) return;
      settleGen.current += 1;
      node.classList.remove("is-free");
      node.removeEventListener("scrollend", done);
    };
    node.addEventListener("scrollend", done);
    settleTimer.current = window.setTimeout(done, 700);
  }

  function scheduleUserResume() {
    window.clearTimeout(resumeTimer.current);
    userPaused.current = true;
    window.clearTimeout(advanceTimer.current);
    resumeTimer.current = window.setTimeout(() => {
      userPaused.current = false;
      scheduleAutoRef.current();
    }, RESUME_MS);
  }

  function onPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    scheduleUserResume();
    if (event.pointerType !== "mouse") return;
    const node = scroller.current;
    if (!node) return;
    window.cancelAnimationFrame(coast.current);
    window.clearTimeout(settleTimer.current);
    settleGen.current += 1;
    node.classList.add("is-free");
    vel.current = 0;
    drag.current = {
      x: event.clientX,
      y: event.clientY,
      left: node.scrollLeft,
      lastX: event.clientX,
      lastT: performance.now(),
      locked: false,
      pointer: event.pointerId,
    };
  }

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const current = drag.current;
    const node = scroller.current;
    if (!current || !node || event.pointerType !== "mouse") return;
    const dx = event.clientX - current.x;
    const dy = event.clientY - current.y;

    if (!current.locked) {
      if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
      if (Math.abs(dy) > Math.abs(dx)) {
        drag.current = null;
        node.classList.remove("is-free");
        return;
      }
      current.locked = true;
      node.setPointerCapture(current.pointer);
    }

    node.scrollLeft = current.left - dx;
    const now = performance.now();
    const dt = now - current.lastT || 16;
    vel.current = Math.max(-28, Math.min(28, ((current.lastX - event.clientX) / dt) * 16));
    current.lastX = event.clientX;
    current.lastT = now;
  }

  function endDrag(event: React.PointerEvent<HTMLDivElement>) {
    const current = drag.current;
    const node = scroller.current;
    drag.current = null;
    if (!current?.locked || !node || event.pointerType !== "mouse") {
      node?.classList.remove("is-free");
      scheduleUserResume();
      return;
    }

    if (prefersStill() || Math.abs(vel.current) < 0.6) {
      settle(node);
      scheduleUserResume();
      return;
    }

    let v = vel.current;
    const tick = () => {
      v *= 0.88;
      node.scrollLeft += v;
      if (Math.abs(v) < 0.5) {
        settle(node);
        scheduleUserResume();
        return;
      }
      coast.current = window.requestAnimationFrame(tick);
    };
    coast.current = window.requestAnimationFrame(tick);
  }

  useEffect(() => {
    if (prefersStill() || photos.length < 2) return;
    const node = scroller.current;
    if (!node) return;
    const count = photos.length;

    const measureLoop = () => {
      const frames = node.querySelectorAll<HTMLElement>(".pie-frame");
      if (frames.length < count * 2) return;
      const first = frames[0];
      const loopStart = frames[count];
      if (!first || !loopStart) return;
      loopWidth.current = loopStart.offsetLeft - first.offsetLeft;
    };

    const autoBlocked = () =>
      hoverPaused.current ||
      userPaused.current ||
      document.hidden ||
      !inView.current ||
      node.classList.contains("is-free") ||
      drag.current !== null;

    const normalizeLoop = () => {
      const width = loopWidth.current;
      if (width <= 0) return;
      if (node.scrollLeft >= width - 2) {
        node.classList.add("is-free");
        node.scrollLeft -= width;
        node.classList.remove("is-free");
      }
    };

    const advance = () => {
      if (autoBlocked()) return;
      measureLoop();
      const frames = node.querySelectorAll<HTMLElement>(".pie-frame");
      if (frames.length < 2) return;
      const origin = node.getBoundingClientRect().left;
      let closestIdx = 0;
      let bestDist = Infinity;
      frames.forEach((frame, index) => {
        const dist = Math.abs(frame.getBoundingClientRect().left - origin);
        if (dist < bestDist) {
          bestDist = dist;
          closestIdx = index;
        }
      });
      const nextIdx = (closestIdx + 1) % frames.length;
      const nextFrame = frames[nextIdx];
      const left = node.scrollLeft + (nextFrame.getBoundingClientRect().left - origin);
      node.scrollTo({ left, behavior: "smooth" });
      window.clearTimeout(normalizeTimer.current);
      const after = () => {
        normalizeLoop();
        node.removeEventListener("scrollend", after);
      };
      node.addEventListener("scrollend", after);
      normalizeTimer.current = window.setTimeout(after, 900);
    };

    const scheduleAutoAdvance = () => {
      window.clearTimeout(advanceTimer.current);
      if (autoBlocked()) return;
      advanceTimer.current = window.setTimeout(() => {
        advance();
        scheduleAutoAdvance();
      }, AUTO_MS);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        inView.current = entries.some((entry) => entry.isIntersecting);
        if (inView.current && !autoBlocked()) scheduleAutoAdvance();
        else window.clearTimeout(advanceTimer.current);
      },
      { threshold: 0.15 },
    );
    observer.observe(node);

    const onVisibility = () => {
      if (document.hidden) window.clearTimeout(advanceTimer.current);
      else if (!autoBlocked()) scheduleAutoAdvance();
    };
    document.addEventListener("visibilitychange", onVisibility);

    const onEnter = () => {
      hoverPaused.current = true;
      window.clearTimeout(advanceTimer.current);
    };
    const onLeave = () => {
      hoverPaused.current = false;
      scheduleUserResume();
    };

    const onFocusIn = () => {
      userPaused.current = true;
      window.clearTimeout(advanceTimer.current);
    };
    const onFocusOut = (event: FocusEvent) => {
      if (node.contains(event.relatedTarget as Node)) return;
      scheduleUserResume();
    };

    const onTouch = () => scheduleUserResume();
    const onWheel = () => scheduleUserResume();

    node.addEventListener("mouseenter", onEnter);
    node.addEventListener("mouseleave", onLeave);
    node.addEventListener("focusin", onFocusIn);
    node.addEventListener("focusout", onFocusOut);
    node.addEventListener("touchstart", onTouch, { passive: true });
    node.addEventListener("wheel", onWheel, { passive: true });

    measureLoop();
    window.addEventListener("resize", measureLoop);
    scheduleAutoRef.current = scheduleAutoAdvance;
    scheduleAutoAdvance();

    return () => {
      scheduleAutoRef.current = () => {};
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      node.removeEventListener("mouseenter", onEnter);
      node.removeEventListener("mouseleave", onLeave);
      node.removeEventListener("focusin", onFocusIn);
      node.removeEventListener("focusout", onFocusOut);
      node.removeEventListener("touchstart", onTouch);
      node.removeEventListener("wheel", onWheel);
      window.removeEventListener("resize", measureLoop);
      window.clearTimeout(advanceTimer.current);
    };
  }, [photos]);

  if (photos.length === 0) return null;

  const loopPhotos = photos.length > 1 ? [...photos, ...photos] : photos;

  return (
    <div
      className="pie-strip"
      ref={scroller}
      aria-label="photos"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      <div className="pie-track">
        {loopPhotos.map((photo, index) => {
          const shared = {
            src: photo.src,
            alt: photo.alt,
            fill: true as const,
            sizes: "(max-width: 388px) 72vw, 17.5rem",
            draggable: false,
          };
          return (
            <figure className="pie-frame" key={`${photo.src}-${index}`}>
              {isSanityImageSrc(photo.src) ? (
                <SanityImage {...shared} />
              ) : (
                <Image {...shared} />
              )}
              <figcaption>{photo.label}</figcaption>
            </figure>
          );
        })}
      </div>
    </div>
  );
}
