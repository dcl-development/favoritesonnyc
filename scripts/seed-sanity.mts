import { createReadStream } from "node:fs";
import { createClient } from "@sanity/client";
import {
  beers,
  cocktails,
  desserts,
  redPies,
  redWines,
  smallPlates,
  sparkling,
  sweetWines,
  whitePies,
  whiteWines,
} from "../src/content/menu.ts";
import { photos } from "../src/content/site.ts";

const token = process.env.SANITY_AUTH_TOKEN;
if (!token) {
  throw new Error("SANITY_AUTH_TOKEN is missing");
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "gdzx3zp3",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2026-09-26",
  token,
  useCdn: false,
});

function slug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function wineId(name: string) {
  // The published Barraco bottle kept this id when the producer spelling was corrected.
  if (name.startsWith("barraco,")) return "wine-vini-barraci";
  return `wine-${slug(name)}`;
}

const dishes = [
  ...smallPlates.map((item, order) => ({ ...item, section: "smallPlates", order })),
  ...redPies.map((item, order) => ({ ...item, section: "redPies", order })),
  ...whitePies.map((item, order) => ({ ...item, section: "whitePies", order })),
  ...desserts.map((item, order) => ({ ...item, section: "desserts", order })),
];

const wines = [
  ...sparkling.map((item, order) => ({ ...item, section: "sparkling", order })),
  ...whiteWines.map((item, order) => ({ ...item, section: "white", order })),
  ...redWines.map((item, order) => ({ ...item, section: "red", order })),
  ...sweetWines.map((item, order) => ({ ...item, section: "sweet", order })),
];

const pours = [
  ...cocktails.map((item, order) => ({ ...item, section: "cocktails", order })),
  ...beers.map((item, order) => ({ ...item, section: "beers", order })),
];

const transaction = client.transaction();

for (const dish of dishes) {
  transaction.createOrReplace({
    _id: `dish-${slug(dish.name)}`,
    _type: "dish",
    name: dish.name,
    detail: dish.detail,
    price: dish.price,
    section: dish.section,
    nuts: dish.nuts ?? false,
    status: "on",
    order: dish.order,
  });
}

for (const wine of wines) {
  transaction.createOrReplace({
    _id: wineId(wine.name),
    _type: "wine",
    name: wine.name,
    meta: wine.meta,
    note: wine.note,
    glass: wine.glass,
    bottle: wine.bottle,
    section: wine.section,
    status: "on",
    order: wine.order,
  });
}

for (const drink of pours) {
  transaction.createOrReplace({
    _id: `pour-${slug(drink.name)}`,
    _type: "pour",
    name: drink.name,
    detail: drink.detail,
    price: drink.price,
    section: drink.section,
    status: "on",
    order: drink.order,
  });
}

await transaction.commit();

for (const [order, photo] of photos.entries()) {
  const filename = photo.src.replace("/photos/", "");
  const asset = await client.assets.upload(
    "image",
    createReadStream(`public/photos/${filename}`),
    { filename },
  );

  await client.createOrReplace({
    _id: `photo-${slug(photo.label)}`,
    _type: "photo",
    image: {
      _type: "image",
      asset: { _type: "reference", _ref: asset._id },
    },
    caption: photo.label,
    alt: photo.alt,
    order,
  });
}

console.log(
  `seeded ${dishes.length} dishes, ${wines.length} wines, ${pours.length} pours, ${photos.length} photos`,
);
