import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { PieStrip } from "@/components/PieStrip";
import { ReserveSign } from "@/components/ReserveSign";
import { NightVeil } from "@/components/NightVeil";
import { Reveal } from "@/components/Reveal";
import { SignStrips } from "@/components/SignStrips";
import { StoneBand } from "@/components/StoneBand";
import { WallAlign } from "@/components/WallAlign";
import { nav, restaurant } from "@/content/site";
import { getPhotos } from "@/lib/cms";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default async function Home() {
  const photos = await getPhotos();

  return (
    <main className="home">
      <h1 className="sr-only">{restaurant.legalName}, Staten Island</h1>
      <NightVeil />
      <WallAlign />
      <SignStrips />
      <StoneBand />
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
            aria-label="reservations"
          >
            <ReserveSign />
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
      {photos.length > 0 ? (
        <>
          <StoneBand />
          <Reveal>
            <PieStrip photos={photos} />
          </Reveal>
        </>
      ) : null}
      <StoneBand />
      <div className="home-foot">
        <Footer />
      </div>
    </main>
  );
}
