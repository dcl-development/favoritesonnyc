import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { PieStrip } from "@/components/PieStrip";
import { SignStrips } from "@/components/SignStrips";
import { restaurant } from "@/content/site";
import { getPhotos } from "@/lib/cms";

export default async function Home() {
  const photos = await getPhotos();

  return (
    <main>
      <SignStrips />
      <Nav />
      <div className="home-lead">
        <p>whole pies, 14 inches, cut into six.</p>
        <p>{restaurant.notice.title}.</p>
        <p className="home-actions">
          <Link href="/menu">see the menu</Link>
          <a href={restaurant.maps.google}>directions</a>
          <a href={`tel:${restaurant.phoneTel}`}>call</a>
          <a href={restaurant.reserve} target="_blank" rel="noopener">
            reserve
          </a>
        </p>
        <p className="section-note">
          parties of 8+? <a href={`tel:${restaurant.phoneTel}`}>call us</a>.
        </p>
      </div>
      <PieStrip photos={photos} />
      <div className="home-foot">
        <Footer />
      </div>
    </main>
  );
}
