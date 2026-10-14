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

const instagramHandle = `@${new URL(restaurant.instagram).pathname.split("/").filter(Boolean)[0]}`;

export default function VisitPage() {
  return (
    <Sheet title="visit" footer={false}>
      <div className="visit-grid">
        <div className="visit-copy">
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
            <a href={restaurant.reserve} target="_blank" rel="noopener">
              [ book a reservation ]
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
        </div>
        <figure className="visit-photo">
          <Image
            src="/photos/storefront.jpg"
            alt="Danny Ippolito outside Favorite Son at 1210 Forest Avenue."
            fill
            sizes="(max-width: 720px) 100vw, 400px"
            priority
          />
        </figure>
      </div>
    </Sheet>
  );
}
