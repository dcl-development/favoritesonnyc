"use client";

import { useEffect } from "react";

const ids = ["food", "drinks"] as const;

function scrollToSection(id: string) {
  const target = document.getElementById(id);
  if (!target) return;

  const bar = document.querySelector(".sticky-bar");
  const barHeight = bar?.getBoundingClientRect().height ?? 0;
  const top = Math.max(0, target.getBoundingClientRect().top + window.scrollY - barHeight - 8);
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  window.scrollTo({
    top,
    behavior: reduce ? "auto" : "smooth",
  });

  const hash = `#${id}`;
  if (window.location.hash !== hash) {
    history.replaceState(null, "", hash);
  }
}

export function MenuJumps() {
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (!ids.includes(id as (typeof ids)[number])) return;
    const frame = requestAnimationFrame(() => scrollToSection(id));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <nav className="menu-jumps" aria-label="on this page">
      {ids.map((id) => (
        <a
          key={id}
          href={`#${id}`}
          onClick={(event) => {
            event.preventDefault();
            scrollToSection(id);
          }}
        >
          {id === "food" ? "food" : "wine & drinks"}
        </a>
      ))}
    </nav>
  );
}
