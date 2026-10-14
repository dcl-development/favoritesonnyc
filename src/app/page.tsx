import Link from "next/link";
import { Footer } from "@/components/Footer";
import { PieStrip } from "@/components/PieStrip";
import { SignStrips } from "@/components/SignStrips";
import { nav, restaurant } from "@/content/site";
import { getPhotos } from "@/lib/cms";

export default async function Home() {
  const photos = await getPhotos();

  return (
    <main className="home">
      <SignStrips />
      <div className="home-stack">
        <nav className="home-pages" aria-label="pages">
          {nav.map((item) => (
            <Link key={item.href} href={item.href}>
              <span aria-hidden="true">[ </span>
              <span className="home-label">{item.label}</span>
              <span aria-hidden="true"> ]</span>
            </Link>
          ))}
        </nav>
        <div className="home-reserve">
          <a
            className="home-reserve-link"
            href={restaurant.reserve}
            target="_blank"
            rel="noopener"
          >
            <span aria-hidden="true">[ </span>
            <span className="home-label">reserve</span>
            <span aria-hidden="true"> ]</span>
          </a>
          <a className="reserve-tip" href={`tel:${restaurant.phoneTel}`}>
            <span>
              parties of 8+? call us, the room’s small but we’ll try to fit you.
            </span>
          </a>
        </div>
        <div className="home-copy">
          <p>whole pies, 14 inches, cut into six.</p>
          <p>{restaurant.notice.title}.</p>
        </div>
      </div>
      <PieStrip photos={photos} />
      <div className="home-foot">
        <Footer />
      </div>
    </main>
  );
}
