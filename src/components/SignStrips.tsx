"use client";

import { useEffect, useRef } from "react";
import { restaurant } from "@/content/site";
import { PieMark } from "./PieMark";
import { StatusLine } from "./StatusLine";

const strips = [
  { key: "name", kind: "name" as const, text: restaurant.name },
  { key: "tag", kind: "line" as const, text: restaurant.tagline },
  { key: "status", kind: "line" as const, text: null },
  { key: "street", kind: "line" as const, text: "1210 forest avenue" },
];

const drift = [
  { x: 16, y: -10, r: -1.6, ease: 0.2 },
  { x: -12, y: 14, r: 1.2, ease: 0.08 },
  { x: 9, y: 7, r: -0.8, ease: 0.16 },
  { x: -14, y: -11, r: 1.8, ease: 0.06 },
];

const introMs = 1600;

export function SignStrips() {
  const papers = useRef<Array<HTMLParagraphElement | null>>([]);

  useEffect(() => {
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

    const onMove = (event: PointerEvent) => {
      handedOff = true;
      target.nx = event.clientX / window.innerWidth - 0.5;
      target.ny = event.clientY / window.innerHeight - 0.5;
      kick();
    };

    const onLeave = (event: PointerEvent) => {
      if (event.relatedTarget) return;
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
  }, []);

  return (
    <div className="sign">
      <PieMark className="pie-mark pie-mark-home" />
      <div className="sign-board">
        <div className="sign-papers">
          {strips.map((strip, index) => (
            <p
              key={strip.key}
              ref={(node) => {
                papers.current[index] = node;
              }}
              className={`strip strip-${strip.kind}`}
              style={{ ["--i" as string]: index }}
            >
              {strip.key === "status" ? <StatusLine /> : strip.text}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
