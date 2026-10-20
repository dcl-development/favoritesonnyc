"use client";

import { useEffect, useState } from "react";

let entered = false;

export default function Template({ children }: { children: React.ReactNode }) {
  const [play] = useState(entered);

  useEffect(() => {
    entered = true;
  }, []);

  return <div className={play ? "sheet-enter" : undefined}>{children}</div>;
}