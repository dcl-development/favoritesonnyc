import { HoursLabel } from "@/components/HoursProvider";
import { restaurant } from "@/content/site";
import { DashedRule } from "./DashedRule";

const instagramHandle = `@${new URL(restaurant.instagram).pathname.split("/").filter(Boolean)[0]}`;

export function Footer() {
  return (
    <footer className="site-footer">
      <DashedRule />
      <div className="footer-group">
        <p>
          <HoursLabel />
        </p>
        <p>
          <a href={restaurant.maps.google}>
            {restaurant.address.street}
            <br />
            {restaurant.address.city}, {restaurant.address.region} {restaurant.address.postal}
          </a>
        </p>
        <p>
          <a href={restaurant.instagram}>{instagramHandle}</a>
        </p>
        <p>
          <a href={`mailto:${restaurant.email}`}>{restaurant.email}</a>
        </p>
      </div>
    </footer>
  );
}
