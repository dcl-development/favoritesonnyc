"use client";

import { useEffect, useRef } from "react";
import { PIE_TUBE } from "@/marks/pie-geometry";
import { letters, VIEWBOX } from "./ReserveSign";

/**
 * Switches the page between "lit" and "moonlight". With the lights on this tint is nearly
 * clear, so the whole page is lit and easy to read. When the sign is tapped off, the tint
 * fades to a cool night colour over everything, with soft holes cut out around the one light
 * that never go out, the neon pie and the neon reservations lettering, plus a faint moon in the top corner. Dark text stays
 * dark because the tint only multiplies. The pie is measured from the page, so it follows
 * the layout at any size.
 */
export function NightVeil() {
  const veil = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = veil.current;
    const home = node?.parentElement;
    if (!node || !home) return;

    let frame = 0;

    const paint = () => {
      frame = 0;
      const base = home.getBoundingClientRect();
      if (!base.width) return;

      const layers: string[] = [];

      // The two neon signs never go out. Their light is cut out of the night tint in the shape of
      // the tubes themselves (the pie's rings, the lettering), blurred in three widths, so the
      // glow wraps each letter instead of bursting from a centre.
      const pieEl = home.querySelector(".pie-mark-home");
      const wordEl = home.querySelector(".reserve-art");
      const pieBox = pieEl?.getBoundingClientRect();
      const wordBox = wordEl?.getBoundingClientRect();
      const tubes: string[] = [];
      // Blur radii in screen pixels, widest first; each sign converts them to its own units.
      const levels = [
        { blur: 22, opacity: 0.42 },
        { blur: 9, opacity: 0.55 },
        { blur: 3, opacity: 0.9 },
      ];
      const nested = (
        id: string,
        box: DOMRect,
        viewBox: string,
        unitsPerPx: number,
        width: number,
        paths: string,
      ) => {
        const filters = levels
          .map(
            (l, i) =>
              `<filter id="${id}${i}" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="${(l.blur * unitsPerPx).toFixed(2)}"/></filter>`,
          )
          .join("");
        const groups = levels
          .map(
            (l, i) =>
              `<g filter="url(#${id}${i})" opacity="${l.opacity}" fill="none" stroke="#000" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round">${paths}</g>`,
          )
          .join("");
        return `<svg x="${(box.left - base.left).toFixed(1)}" y="${(box.top - base.top).toFixed(1)}" width="${box.width.toFixed(1)}" height="${box.height.toFixed(1)}" viewBox="${viewBox}" overflow="visible"><defs>${filters}</defs>${groups}</svg>`;
      };
      if (pieBox && pieBox.width) {
        const paths = [PIE_TUBE.ring, PIE_TUBE.slice, PIE_TUBE.crust]
          .map((t) => `<path d="${t.d}"/>`)
          .join("");
        tubes.push(nested("p", pieBox, "0 0 286 320", 286 / pieBox.width, 11 * 1.125, paths));
      }
      if (wordBox && wordBox.width) {
        const paths = letters
          .map((l) => `<path transform="translate(${l.x} 0)" d="${l.d}"/>`)
          .join("");
        tubes.push(
          nested(
            "w",
            wordBox,
            `${VIEWBOX.x} ${VIEWBOX.y} ${VIEWBOX.w} ${VIEWBOX.h}`,
            VIEWBOX.w / wordBox.width,
            2.6,
            paths,
          ),
        );
      }
      if (tubes.length) {
        const w = Math.round(base.width);
        const h = Math.round(base.height);
        const svg =
          `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">` +
          `<defs><mask id="m" maskUnits="userSpaceOnUse" x="0" y="0" width="${w}" height="${h}"><rect width="${w}" height="${h}" fill="#fff"/>${tubes.join("")}</mask></defs>` +
          `<rect width="${w}" height="${h}" fill="#000" mask="url(#m)"/></svg>`;
        layers.push(`url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`);
      }

      // The moon: a faint cool wash from the top right, so nothing is ever pitch dark.
      layers.push("radial-gradient(circle 52rem at 100% 0, rgba(0,0,0,0.5) 0%, #000 100%)");

      const image = layers.join(", ");
      node.style.maskImage = image;
      node.style.setProperty("-webkit-mask-image", image);
      node.style.maskRepeat = "no-repeat";
      node.style.setProperty("-webkit-mask-repeat", "no-repeat");
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(paint);
    };

    paint();
    const observer = new ResizeObserver(schedule);
    observer.observe(home);
    window.addEventListener("resize", schedule);
    // Fonts and photos can shift the layout after first paint.
    window.addEventListener("load", schedule);
    document.fonts?.ready.then(schedule);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", schedule);
      window.removeEventListener("load", schedule);
    };
  }, []);

  return <div ref={veil} className="night-veil" aria-hidden="true" />;
}
