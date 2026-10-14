import type { Metadata } from "next";
import Image from "next/image";
import { Sheet } from "@/components/Sheet";
import { restaurant } from "@/content/site";

export const metadata: Metadata = {
  title: "visit",
  description:
    "Favorite Son is at 1210 Forest Avenue, Staten Island. Wednesday–Monday, 5–10. Closed Tuesday. Walk-in, dine-in.",
};

const days = [
  ["wednesday", "5–10"],
  ["thursday", "5–10"],
  ["friday", "5–10"],
  ["saturday", "5–10"],
  ["sunday", "5–10"],
  ["monday", "5–10"],
  ["tuesday", "closed"],
];

export default function VisitPage() {
  return (
    <Sheet title="visit">
      <div className="visit-grid">
        <div>
          <p>
            <a href={restaurant.maps.google}>
              {restaurant.address.street}
              <br />
              {restaurant.address.city}, {restaurant.address.region}{" "}
              {restaurant.address.postal}
            </a>
          </p>
          <p className="visit-phone">
            <a href={`tel:${restaurant.phoneTel}`}>{restaurant.phone}</a>
          </p>
          <p className="visit-phone">
            <a href={restaurant.reserve} target="_blank" rel="noopener">
              reserve
            </a>
          </p>
          <ul className="hours-list">
            {days.map(([day, hours]) => (
              <li key={day}>
                <span>{day}</span>
                <span>{hours}</span>
              </li>
            ))}
          </ul>
          <p className="section-note" style={{ marginTop: "1rem" }}>
            {restaurant.notice.title}. {restaurant.notice.body}
          </p>
          <p className="section-note">there is covered outdoor seating.</p>
          <p>
            <a href={`mailto:${restaurant.email}`}>{restaurant.email}</a>
          </p>
        </div>
        <figure className="visit-photo">
          <Image
            src="/photos/storefront.jpg"
            alt="Danny Ippolito outside Favorite Son at 1210 Forest Avenue."
            fill
            sizes="(max-width: 800px) 100vw, 400px"
            priority
          />
        </figure>
      </div>
    </Sheet>
  );
}
