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
  const glowRef = useRef<HTMLDivElement>(null);

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
      // Two things are drawn from the tube paths, in screen pixels:
      //  - a tight hole in the tint, so the tubes themselves stay bright;
      //  - a red glow laid on top of the dark (screen blend), wide to narrow, so the light
      //    wraps every letter and ring. No pale patch: the glow is the neon's own colour.
      const holeLevels = [{ blur: 1.4, opacity: 1, extra: 3 }];
      const glowLevels = [
        { blur: 26, opacity: 0.5, extra: 6 },
        { blur: 10, opacity: 0.7, extra: 3 },
        { blur: 3.5, opacity: 0.95, extra: 1 },
      ];
      type Lv = { blur: number; opacity: number; extra: number };
      const nested = (
        id: string,
        box: DOMRect,
        viewBox: string,
        unitsPerPx: number,
        width: number,
        paths: string,
        levels: Lv[],
        color: string,
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
              `<g filter="url(#${id}${i})" opacity="${l.opacity}" fill="none" stroke="${color}" stroke-width="${(width + l.extra * unitsPerPx).toFixed(2)}" stroke-linecap="round" stroke-linejoin="round">${paths}</g>`,
          )
          .join("");
        return `<svg x="${(box.left - base.left).toFixed(1)}" y="${(box.top - base.top).toFixed(1)}" width="${box.width.toFixed(1)}" height="${box.height.toFixed(1)}" viewBox="${viewBox}" overflow="visible"><defs>${filters}</defs>${groups}</svg>`;
      };
      const signs: Array<(levels: Lv[], color: string, tag: string) => string> = [];
      if (pieBox && pieBox.width) {
        const paths = [PIE_TUBE.ring, PIE_TUBE.slice, PIE_TUBE.crust]
          .map((t) => `<path d="${t.d}"/>`)
          .join("");
        signs.push((levels, color, tag) =>
          nested(`p${tag}`, pieBox, "0 0 286 320", 286 / pieBox.width, 11 * 1.125, paths, levels, color),
        );
      }
      if (wordBox && wordBox.width) {
        const paths = letters
          .map((l) => `<path transform="translate(${l.x} 0)" d="${l.d}"/>`)
          .join("");
        signs.push((levels, color, tag) =>
          nested(
            `w${tag}`,
            wordBox,
            `${VIEWBOX.x} ${VIEWBOX.y} ${VIEWBOX.w} ${VIEWBOX.h}`,
            VIEWBOX.w / wordBox.width,
            2.6,
            paths,
            levels,
            color,
          ),
        );
      }
      const w = Math.round(base.width);
      const h = Math.round(base.height);
      const asImage = (svg: string) => `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;
      if (signs.length) {
        const holes = signs.map((draw) => draw(holeLevels, "#000", "h")).join("");
        layers.push(
          asImage(
            `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">` +
              `<defs><mask id="m" maskUnits="userSpaceOnUse" x="0" y="0" width="${w}" height="${h}"><rect width="${w}" height="${h}" fill="#fff"/>${holes}</mask></defs>` +
              `<rect width="${w}" height="${h}" fill="#000" mask="url(#m)"/></svg>`,
          ),
        );
        if (glowRef.current) {
          const glow = signs.map((draw) => draw(glowLevels, "#ff2a18", "g")).join("");
          glowRef.current.style.backgroundImage = asImage(
            `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${glow}</svg>`,
          );
        }
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

  return (
    <>
      <div ref={veil} className="night-veil" aria-hidden="true" />
      <div ref={glowRef} className="night-glow" aria-hidden="true" />
    </>
  );
}
