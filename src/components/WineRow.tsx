"use client";

import type { Wine } from "@/content/menu";
import { useMenuTap } from "./useMenuTap";

export function WineRow({ name, meta, note, glass, bottle, status }: Wine) {
  const off = status === "off";
  const { tapped, onPointerUp } = useMenuTap();

  return (
    <div
      className={tapped ? "menu-row wine-row menu-row-tap" : "menu-row wine-row"}
      onPointerUp={onPointerUp}
    >
      <div>
        <p className="menu-name">{name}</p>
        <p className="menu-meta">{meta}</p>
        <p className="menu-note">{note}</p>
      </div>
      <p className="menu-price">
        {off ? (
          "off tonight"
        ) : (
          <>
            {glass}
            <span className="price-split"> / </span>
            {bottle}
          </>
        )}
      </p>
    </div>
  );
}
