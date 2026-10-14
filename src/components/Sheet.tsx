import Link from "next/link";
import type { ReactNode } from "react";
import { restaurant } from "@/content/site";
import { DashedRule } from "./DashedRule";
import { Footer } from "./Footer";
import { Nav } from "./Nav";
import { PieMark } from "./PieMark";

export function Sheet({
  title,
  kicker,
  footer = true,
  children,
}: {
  title: string;
  kicker?: string;
  footer?: boolean;
  children: ReactNode;
}) {
  return (
    <main className="sheet">
      <header className="sheet-mast">
        <Link href="/" className="mast-brand">
          <PieMark className="pie-mark pie-mark-tiny" />
          favorite son
        </Link>
        <p className="mast-kicker">{kicker ?? restaurant.line}</p>
        <h1>{title}</h1>
        <Nav />
        <DashedRule />
      </header>
      {children}
      {footer ? <Footer /> : null}
    </main>
  );
}
