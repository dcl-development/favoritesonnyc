import Link from "next/link";
import { HoursLabel } from "@/components/HoursProvider";
import { restaurant } from "@/content/site";
import { DashedRule } from "./DashedRule";
import { StatusLine } from "./StatusLine";

const instagramHandle = `@${new URL(restaurant.instagram).pathname.split("/").filter(Boolean)[0]}`;

export function Footer() {
  return (
    <footer className="site-footer">
      <DashedRule />
      <div className="footer-groups">
        <div className="footer-group">
          <p>favorite son pizzeria & wine bar</p>
          <p>
            <a href={restaurant.maps.google}>{restaurant.address.line}</a>
          </p>
          <p>
            <a href={`tel:${restaurant.phoneTel}`}>{restaurant.phone}</a>
          </p>
        </div>
        <div className="footer-group">
          <p>
            <HoursLabel />
          </p>
          <p>
            <StatusLine variant="quiet" />
          </p>
        </div>
        <div className="footer-group">
          <p>
            <Link href="/visit">directions</Link>
          </p>
          <p>
            <a href={restaurant.instagram}>{instagramHandle}</a>
          </p>
          <p>
            <a href={`mailto:${restaurant.email}`}>{restaurant.email}</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
