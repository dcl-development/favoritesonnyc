"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { nav } from "@/content/site";

export function Nav() {
  const path = usePathname();

  return (
    <nav className="site-nav" aria-label="pages">
      {nav.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          aria-current={path === item.href ? "page" : undefined}
        >
          <span aria-hidden="true">[ </span>
          <span className="nav-label">{item.label}</span>
          <span aria-hidden="true"> ]</span>
        </Link>
      ))}
    </nav>
  );
}
