import { defineQuery } from "groq";

export const DISHES_QUERY = defineQuery(
  `*[_type == "dish"] | order(order asc, name asc) {
    _id, name, detail, price, section, nuts, status
  }`,
);

export const WINES_QUERY = defineQuery(
  `*[_type == "wine"] | order(order asc, name asc) {
    _id, name, meta, note, glass, bottle, section, status
  }`,
);

export const POURS_QUERY = defineQuery(
  `*[_type == "pour"] | order(order asc, name asc) {
    _id, name, detail, price, section, status
  }`,
);

export const STORY_QUERY = defineQuery(
  `*[_id == "story"][0]{
    lead,
    body,
    image {
      alt,
      crop,
      hotspot,
      asset
    }
  }`,
);

export const HOURS_QUERY = defineQuery(
  `*[_id == "hours"][0]{
    label, monday, tuesday, wednesday, thursday, friday, saturday, sunday
  }`,
);

export const PHOTOS_QUERY = defineQuery(
  `*[_type == "photo" && defined(image.asset)] | order(order asc) {
    _id,
    caption,
    alt,
    "src": image.asset->url
  }`,
);
