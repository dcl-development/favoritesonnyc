"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useSyncExternalStore } from "react";
import { homeMotionReady, subscribeHomeMotion } from "@/lib/home-motion";
import { restaurant } from "@/content/site";
import { PieMark } from "./PieMark";
import { SignLamps } from "./SignLamps";
import { keepTogether } from "@/lib/hours";
import { tearStyle } from "@/lib/tear";
import { restoreLights } from "@/lib/lights";
import { StatusLine, useServiceStatus } from "./StatusLine";

// href: where tapping the strip goes. The name strip is just the name.
type Strip = {
  key: string;
  kind: "name" | "line";
  text: string | null;
  href?: string;
  /** Read out after the text so a screen reader knows where the link goes. */
  hint?: string;
};

const baseStrips: Strip[] = [
  { key: "name", kind: "name", text: restaurant.name },
  { key: "tag", kind: "line", text: restaurant.tagline, href: "/menu", hint: "see the menu" },
  { key: "status", kind: "line", text: null, href: "/visit", hint: "hours and directions" },
  { key: "street", kind: "line", text: "1210 forest avenue", href: "/visit", hint: "hours and directions" },
];

const drift = [
  { x: 16, y: -10, r: -1.6, ease: 0.2 },
  { x: -12, y: 14, r: 1.2, ease: 0.08 },
  { x: 9, y: 7, r: -0.8, ease: 0.16 },
  { x: -14, y: -11, r: 1.8, ease: 0.06 },
  { x: 11, y: 9, r: -1.1, ease: 0.12 },
];

const introMs = 1600;

export function SignStrips() {
  const papers = useRef<Array<HTMLParagraphElement | null>>([]);
  const board = useRef<HTMLDivElement>(null);
  const motionReady = useSyncExternalStore(subscribeHomeMotion, homeMotionReady, () => true);
  // A special date within a week gets its own strip under the status strip.
  const { notice } = useServiceStatus();
  useEffect(() => {
    restoreLights();
  }, []);

  const strips: Strip[] = notice
    ? [...baseStrips.slice(0, 3), { key: "notice", kind: "line", text: keepTogether(notice), href: "/visit", hint: "hours and directions" }, ...baseStrips.slice(3)]
    : baseStrips;
  const count = strips.length;

  useLayoutEffect(() => {
    const node = board.current;
    const content = node?.querySelector(".sign-papers");
    if (!node || !content) return;

    let frame = 0;
    // The teal ribs repeat every --stripe-period (a rib, then a gap). Lock the board to a whole
    // number of periods minus the last gap, so it starts on a rib and ends on one, and the
    // bottom edge never slices a line.
    const fit = () => {
      const style = getComputedStyle(node);
      const period = Number.parseFloat(style.getPropertyValue("--stripe-period")) || 16;
      const gap = Number.parseFloat(style.getPropertyValue("--rib-gap")) || 4;
      node.style.height = "auto";
      const height = node.getBoundingClientRect().height;
      const stripes = Math.max(1, Math.ceil((height + gap) / period - 1e-4));
      node.style.height = `${stripes * period - gap}px`;
    };
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(fit);
    };

    fit();
    const observer = new ResizeObserver(schedule);
    observer.observe(content);
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", schedule);
      node.style.height = "";
    };
  }, []);

  useEffect(() => {
    if (!motionReady) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const fine = window.matchMedia("(pointer: fine)").matches;
    const nodes = papers.current.filter((node): node is HTMLParagraphElement => node !== null);
    const current = nodes.map(() => ({ x: 0, y: 0, r: 0 }));
    const target = { nx: 0, ny: 0 };
    const started = performance.now();
    let frame = 0;
    let running = false;
    let handedOff = false;

    const tick = () => {
      const elapsed = performance.now() - started;
      if (!handedOff) {
        const t = elapsed / introMs;
        if (t < 1) {
          const fade = Math.sin(t * Math.PI);
          const angle = t * Math.PI * 2;
          target.nx = Math.cos(angle) * 0.1 * fade;
          target.ny = Math.sin(angle) * 0.06 * fade;
        } else {
          target.nx = 0;
          target.ny = 0;
        }
      }

      let moving = !handedOff && elapsed < introMs + 500;
      nodes.forEach((node, index) => {
        const move = drift[index];
        const destX = target.nx * move.x;
        const destY = target.ny * move.y;
        const destR = target.nx * move.r;
        const here = current[index];
        here.x += (destX - here.x) * move.ease;
        here.y += (destY - here.y) * move.ease;
        here.r += (destR - here.r) * move.ease;
        if (
          Math.abs(destX - here.x) > 0.04 ||
          Math.abs(destY - here.y) > 0.04 ||
          Math.abs(destR - here.r) > 0.02
        ) {
          moving = true;
        }
        node.style.translate = `${here.x.toFixed(2)}px ${here.y.toFixed(2)}px`;
        node.style.rotate = `${here.r.toFixed(3)}deg`;
      });
      if (moving) frame = window.requestAnimationFrame(tick);
      else running = false;
    };

    const kick = () => {
      if (running) return;
      running = true;
      frame = window.requestAnimationFrame(tick);
    };

    // The sheen on the metal follows the cursor; leaving the window parks it back at the top.
    const moveSheen = (event: PointerEvent) => {
      const rect = board.current?.getBoundingClientRect();
      if (!rect) return;
      board.current?.style.setProperty("--sheen-x", `${event.clientX - rect.left}px`);
      board.current?.style.setProperty("--sheen-y", `${event.clientY - rect.top}px`);
    };

    const onMove = (event: PointerEvent) => {
      moveSheen(event);
      handedOff = true;
      target.nx = event.clientX / window.innerWidth - 0.5;
      target.ny = event.clientY / window.innerHeight - 0.5;
      kick();
    };

    const onLeave = (event: PointerEvent) => {
      if (event.relatedTarget) return;
      board.current?.style.removeProperty("--sheen-x");
      board.current?.style.removeProperty("--sheen-y");
      handedOff = true;
      target.nx = 0;
      target.ny = 0;
      kick();
    };

    if (fine) {
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerout", onLeave);
    }

    kick();

    return () => {
      if (fine) {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerout", onLeave);
      }
      window.cancelAnimationFrame(frame);
    };
  }, [count, motionReady]);

  return (
    <div className="sign">
      <PieMark className="pie-mark pie-mark-home" />
      <div className="sign-board" ref={board}>
        <SignLamps />
        <div className="sign-papers">
          {strips.map((strip, index) => (
            <p
              key={strip.key}
              ref={(node) => {
                papers.current[index] = node;
              }}
              className={`strip strip-${strip.kind}`}
              style={{ ["--i" as string]: index, ...tearStyle(strip.key) }}
            >
              {strip.href ? (
                <Link href={strip.href} className="strip-link">
                  {strip.key === "status" ? <StatusLine /> : strip.text}
                  <span className="sr-only">, {strip.hint}</span>
                </Link>
              ) : strip.key === "status" ? (
                <StatusLine />
              ) : (
                strip.text
              )}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
