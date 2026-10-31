import Link from "next/link";
import { HoursLabel } from "@/components/HoursProvider";
import { restaurant } from "@/content/site";

export default function NotFound() {
  return (
    <main className="missing">
      <h1 className="strip-name">that page is off tonight</h1>
      <p>{restaurant.address.line}</p>
      <p>
        <HoursLabel />
      </p>
      <p>
        <a href={`tel:${restaurant.phoneTel}`}>{restaurant.phone}</a>
      </p>
      <p className="home-actions">
        <Link href="/">home</Link>
        <Link href="/menu">menu</Link>
        <a href={restaurant.maps.google}>directions</a>
      </p>
    </main>
  );
}
