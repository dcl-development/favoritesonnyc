"use client";

import type { Dish } from "@/content/menu";
import { useMenuTap } from "./useMenuTap";

export function MenuRow({ name, detail, price, nuts }: Dish) {
  const { tapped, onPointerUp } = useMenuTap();

  return (
    <div
      className={tapped ? "menu-row menu-row-tap" : "menu-row"}
      onPointerUp={onPointerUp}
    >
      <div>
        <p className="menu-name">
          {name}
          {nuts ? <span aria-label="contains nuts">*</span> : null}
        </p>
        {detail ? <p className="menu-detail">{detail}</p> : null}
      </div>
      <p className="menu-price">{price}</p>
    </div>
  );
}
