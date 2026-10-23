"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { SanityImage } from "@/components/SanityImage";
import type { Photo } from "@/content/site";
import { isSanityImageSrc } from "@/lib/sanityImageLoader";

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

  useEffect(
    () => () => {
      window.cancelAnimationFrame(coast.current);
      window.clearTimeout(settleTimer.current);
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

  function onPointerDown(event: React.PointerEvent<HTMLDivElement>) {
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
      return;
    }

    if (prefersStill() || Math.abs(vel.current) < 0.6) {
      settle(node);
      return;
    }

    let v = vel.current;
    const tick = () => {
      v *= 0.88;
      node.scrollLeft += v;
      if (Math.abs(v) < 0.5) {
        settle(node);
        return;
      }
      coast.current = window.requestAnimationFrame(tick);
    };
    coast.current = window.requestAnimationFrame(tick);
  }

  if (photos.length === 0) return null;

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
        {photos.map((photo) => {
          const shared = {
            src: photo.src,
            alt: photo.alt,
            fill: true as const,
            sizes: "(max-width: 388px) 72vw, 17.5rem",
            draggable: false,
          };
          return (
            <figure className="pie-frame" key={photo.src}>
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
