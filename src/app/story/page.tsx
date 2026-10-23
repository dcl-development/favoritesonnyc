import type { Metadata } from "next";
import Image from "next/image";
import { Reveal } from "@/components/Reveal";
import { SanityImage } from "@/components/SanityImage";
import { Sheet } from "@/components/Sheet";
import { restaurant } from "@/content/site";
import { getStory, type StoryPhoto } from "@/lib/cms";

const storySizes =
  "(max-width: 719px) calc(100vw - 2.3rem), min(22.5rem, calc((100vw - 7rem) * 0.4737))";

export const metadata: Metadata = {
  title: "our story",
  description:
    "Favorite Son is the Ippolito family’s sourdough pizzeria and wine bar on Forest Avenue, Staten Island.",
};

function StoryFigure({ photo }: { photo: StoryPhoto }) {
  if (photo.fromSanity) {
    return (
      <Reveal as="figure" className="story-photo">
        <SanityImage
          className="story-photo-cms"
          src={photo.src}
          alt={photo.alt}
          fill
          sizes={storySizes}
          loading="lazy"
          style={{ objectFit: "cover", objectPosition: "center" }}
        />
      </Reveal>
    );
  }

  return (
    <Reveal as="figure" className="story-photo">
      <Image
        src={photo.src}
        alt={photo.alt}
        fill
        sizes={storySizes}
        loading="lazy"
      />
    </Reveal>
  );
}

export default async function StoryPage() {
  const story = await getStory();

  return (
    <Sheet title="our story">
      <div className="story-grid">
        <StoryFigure photo={story.photo} />
        <Reveal className="prose" delay={1}>
          <p>{story.lead}</p>
          <p>{story.body}</p>
          <p>
            <a href={restaurant.press}>Click here for the SILive story.</a>
          </p>
        </Reveal>
      </div>
    </Sheet>
  );
}
