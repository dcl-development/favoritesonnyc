import {
  createImageUrlBuilder,
  type SanityImageCrop,
  type SanityImageHotspot,
} from "@sanity/image-url";
import { dataset, projectId } from "../env";

const builder = createImageUrlBuilder({ projectId, dataset });

/** Story column is 4/5. 2400px wide covers a 3x screen at the 1440px layout. */
const STORY_WIDTH = 2400;
const STORY_HEIGHT = 3000;

export type StoryImageField = {
  asset?: { _ref?: string | null } | null;
  crop?: SanityImageCrop | null;
  hotspot?: SanityImageHotspot | null;
};

export function storyPhotoUrl(image: StoryImageField): string | null {
  const ref = image.asset?._ref;
  if (!ref) return null;

  return builder
    .image({
      _type: "image",
      asset: { _type: "reference", _ref: ref },
      ...(image.crop ? { crop: image.crop } : {}),
      ...(image.hotspot ? { hotspot: image.hotspot } : {}),
    })
    .width(STORY_WIDTH)
    .height(STORY_HEIGHT)
    .fit("crop")
    .url();
}
