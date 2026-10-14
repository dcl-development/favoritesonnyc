import Link from "next/link";
import { restaurant } from "@/content/site";
import { DashedRule } from "./DashedRule";
import { StatusLine } from "./StatusLine";

export function Footer() {
  return (
    <footer className="site-footer">
      <DashedRule />
      <p>favorite son pizzeria & wine bar</p>
      <p>
        <a href={restaurant.maps.google}>{restaurant.address.line}</a>
      </p>
      <p>
        <a href={`tel:${restaurant.phoneTel}`}>{restaurant.phone}</a>
      </p>
      <p>{restaurant.hoursLabel}</p>
      <p>
        <StatusLine variant="quiet" />
      </p>
      <p className="footer-links">
        <Link href="/visit">directions</Link>
        <a href={restaurant.instagram}>instagram</a>
        <a href={`mailto:${restaurant.email}`}>{restaurant.email}</a>
      </p>
    </footer>
  );
}
