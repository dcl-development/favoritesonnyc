import type { Metadata } from "next";
import Image from "next/image";
import { Sheet } from "@/components/Sheet";
import { restaurant } from "@/content/site";
import { getStoryPhoto, type StoryPhoto } from "@/lib/cms";

const storySizes = "(max-width: 799px) calc(100vw - 2.3rem), 47.5rem";

export const metadata: Metadata = {
  title: "our story",
  description:
    "Favorite Son is the Ippolito family’s sourdough pizzeria and wine bar on Forest Avenue, Staten Island.",
};

function StoryFigure({ photo }: { photo: StoryPhoto }) {
  if (photo.fromSanity) {
    return (
      <figure className="story-photo">
        <Image
          className="story-photo-cms"
          src={photo.src}
          alt={photo.alt}
          fill
          sizes={storySizes}
          loading="lazy"
          style={{ objectFit: "cover", objectPosition: "center" }}
        />
      </figure>
    );
  }

  return (
    <figure className="story-photo">
      <Image
        src={photo.src}
        alt={photo.alt}
        fill
        sizes={storySizes}
        loading="lazy"
      />
    </figure>
  );
}

export default async function StoryPage() {
  const photo = await getStoryPhoto();

  return (
    <Sheet title="our story">
      <div className="story-grid">
        <StoryFigure photo={photo} />
        <div className="prose">
          <p>
            Favorite Son is Danny Ippolito and Graceanne Belmonte-Ippolito’s
            pizzeria on Forest Avenue. Danny is the owner, the pizzaiolo, and the
            sommelier. The name is for his mother, Maryann, from her only son.
          </p>
          <p>
            The pies are naturally leavened, New York style, baked in an electric
            Moretti Forni. The wine is natural. Danny spent about six years on the
            dough before the doors opened in September 2026, after kitchens at
            Carbone and Locanda Verde, and after Bin 5, the wine bar he had in
            Rosebank.
          </p>
          <p>
            <a href={restaurant.press}>Click here for the SILive story.</a>
          </p>
        </div>
      </div>
    </Sheet>
  );
}
