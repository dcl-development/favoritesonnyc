import type { Metadata } from "next";
import Image from "next/image";
import { Reveal } from "@/components/Reveal";
import { Sheet } from "@/components/Sheet";
import { restaurant } from "@/content/site";

export const metadata: Metadata = {
  title: "visit",
  description:
    "Favorite Son is at 1210 Forest Avenue, Staten Island. Open every day, 4–9. Walk-in, dine-in.",
};

const days = [
  ["monday", "4–9"],
  ["tuesday", "4–9"],
  ["wednesday", "4–9"],
  ["thursday", "4–9"],
  ["friday", "4–9"],
  ["saturday", "4–9"],
  ["sunday", "4–9"],
];

const instagramHandle = `@${new URL(restaurant.instagram).pathname.split("/").filter(Boolean)[0]}`;

export default function VisitPage() {
  return (
    <Sheet title="visit" footer={false}>
      <div className="visit-grid">
        <Reveal className="visit-copy">
          <p>
            <a href={restaurant.maps.google}>
              {restaurant.address.street}
              <br />
              {restaurant.address.city}, {restaurant.address.region}{" "}
              {restaurant.address.postal}
            </a>
          </p>
          <p>
            <a href={`tel:${restaurant.phoneTel}`}>{restaurant.phone}</a>
          </p>
          <ul className="hours-list">
            {days.map(([day, hours]) => (
              <li key={day}>
                <span>{day}</span>
                <span>{hours}</span>
              </li>
            ))}
          </ul>
          <p>
            <a className="bracket-link" href={restaurant.reserve} target="_blank" rel="noopener">
              <span aria-hidden="true">[ </span>
              book a reservation
              <span aria-hidden="true"> ]</span>
            </a>
          </p>
          <p>
            <a href={restaurant.instagram}>{instagramHandle}</a>
          </p>
          <p className="visit-notes">
            {`${restaurant.notice.title}. ${restaurant.notice.body} there is covered outdoor seating. `}
            parties of 8 or more, please{" "}
            <a href={`tel:${restaurant.phoneTel}`}>call</a>.
          </p>
        </Reveal>
        <Reveal as="figure" className="visit-photo" delay={1}>
          <Image
            src="/photos/storefront.jpg"
            alt="Danny Ippolito outside Favorite Son at 1210 Forest Avenue."
            fill
            sizes="(max-width: 720px) 100vw, 400px"
            priority
          />
        </Reveal>
      </div>
    </Sheet>
  );
}
