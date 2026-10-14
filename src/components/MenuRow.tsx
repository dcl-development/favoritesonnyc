"use client";

import { unavailable } from "@/content/site";
import type { Dish } from "@/content/menu";
import { useMenuTap } from "./useMenuTap";

export function MenuRow({ name, detail, price, nuts, status }: Dish) {
  const off = status === "off" || unavailable.includes(name);
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
      <p className="menu-price">{off ? "off tonight" : price}</p>
    </div>
  );
}
