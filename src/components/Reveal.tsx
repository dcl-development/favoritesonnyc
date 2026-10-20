"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export function Reveal({
  delay = 0,
  className,
  as: Tag = "div",
  children,
}: {
  delay?: number;
  className?: string;
  as?: "div" | "figure";
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        setShown(true);
        observer.disconnect();
      },
      { threshold: 0.01, rootMargin: "0px 0px -32px 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as never}
      className={[className, shown ? "is-in" : ""].filter(Boolean).join(" ") || undefined}
      data-reveal={String(delay)}
    >
      {children}
    </Tag>
  );
}
