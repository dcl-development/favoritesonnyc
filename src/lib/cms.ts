import {
  allergyNote,
  beers as staticBeers,
  cocktails as staticCocktails,
  desserts as staticDesserts,
  redPies as staticRedPies,
  redWines as staticRedWines,
  smallPlates as staticSmallPlates,
  sparkling as staticSparkling,
  sweetWines as staticSweetWines,
  whitePies as staticWhitePies,
  whiteWines as staticWhiteWines,
  type Dish,
  type Pour,
  type Wine,
} from "@/content/menu";
import { photos as staticPhotos, storyCopy, storyPhoto, type Photo } from "@/content/site";
import { DEFAULT_HOURS, normalizeHours, type Hours, type RawHours } from "@/lib/hours";
import { client } from "@/sanity/lib/client";
import { storyPhotoUrl, type StoryImageField } from "@/sanity/lib/image";
import {
  DISHES_QUERY,
  HOURS_QUERY,
  PHOTOS_QUERY,
  POURS_QUERY,
  STORY_QUERY,
  WINES_QUERY,
} from "@/sanity/lib/queries";

const fetchOptions = { next: { revalidate: 60 } };

export type MenuBoard = {
  smallPlates: Dish[];
  redPies: Dish[];
  whitePies: Dish[];
  desserts: Dish[];
  empty: boolean;
};

export type DrinksBoard = {
  sparkling: Wine[];
  whiteWines: Wine[];
  redWines: Wine[];
  sweetWines: Wine[];
  cocktails: Pour[];
  beers: Pour[];
  empty: boolean;
};

const staticMenu: MenuBoard = {
  smallPlates: staticSmallPlates,
  redPies: staticRedPies,
  whitePies: staticWhitePies,
  desserts: staticDesserts,
  empty: false,
};

const staticDrinks: DrinksBoard = {
  sparkling: staticSparkling,
  whiteWines: staticWhiteWines,
  redWines: staticRedWines,
  sweetWines: staticSweetWines,
  cocktails: staticCocktails,
  beers: staticBeers,
  empty: false,
};

function toDish(item: {
  name?: string | null;
  detail?: string | null;
  price?: string | null;
  nuts?: boolean | null;
  status?: string | null;
}): Dish | null {
  if (!item.name || !item.price) return null;
  return {
    name: item.name,
    detail: item.detail ?? undefined,
    price: item.price,
    nuts: item.nuts ?? undefined,
    status: item.status === "off" ? "off" : "on",
  };
}

function toWine(item: {
  name?: string | null;
  meta?: string | null;
  note?: string | null;
  glass?: number | null;
  bottle?: number | null;
  status?: string | null;
}): Wine | null {
  if (!item.name || !item.meta || !item.note || item.glass == null || item.bottle == null) {
    return null;
  }
  return {
    name: item.name,
    meta: item.meta,
    note: item.note,
    glass: item.glass,
    bottle: item.bottle,
    status: item.status === "off" ? "off" : "on",
  };
}

function toPour(item: {
  name?: string | null;
  detail?: string | null;
  price?: string | null;
  status?: string | null;
}): Pour | null {
  if (!item.name || !item.price) return null;
  return {
    name: item.name,
    detail: item.detail ?? "",
    price: item.price,
    status: item.status === "off" ? "off" : "on",
  };
}

export async function getMenu(): Promise<MenuBoard> {
  try {
    const dishes = await client.fetch(DISHES_QUERY, {}, fetchOptions);
    if (!dishes.length) {
      return {
        smallPlates: [],
        redPies: [],
        whitePies: [],
        desserts: [],
        empty: true,
      };
    }

    const board: MenuBoard = {
      smallPlates: [],
      redPies: [],
      whitePies: [],
      desserts: [],
      empty: false,
    };

    for (const dish of dishes) {
      const mapped = toDish(dish);
      if (!mapped) continue;
      if (dish.section === "smallPlates") board.smallPlates.push(mapped);
      if (dish.section === "redPies") board.redPies.push(mapped);
      if (dish.section === "whitePies") board.whitePies.push(mapped);
      if (dish.section === "desserts") board.desserts.push(mapped);
    }

    return board;
  } catch {
    return staticMenu;
  }
}

export async function getDrinks(): Promise<DrinksBoard> {
  try {
    const [wines, pours] = await Promise.all([
      client.fetch(WINES_QUERY, {}, fetchOptions),
      client.fetch(POURS_QUERY, {}, fetchOptions),
    ]);

    if (!wines.length && !pours.length) {
      return {
        sparkling: [],
        whiteWines: [],
        redWines: [],
        sweetWines: [],
        cocktails: [],
        beers: [],
        empty: true,
      };
    }

    const board: DrinksBoard = {
      sparkling: [],
      whiteWines: [],
      redWines: [],
      sweetWines: [],
      cocktails: [],
      beers: [],
      empty: false,
    };

    for (const wine of wines) {
      const mapped = toWine(wine);
      if (!mapped) continue;
      if (wine.section === "sparkling") board.sparkling.push(mapped);
      if (wine.section === "white") board.whiteWines.push(mapped);
      if (wine.section === "red") board.redWines.push(mapped);
      if (wine.section === "sweet") board.sweetWines.push(mapped);
    }

    for (const drink of pours) {
      const mapped = toPour(drink);
      if (!mapped) continue;
      if (drink.section === "cocktails") board.cocktails.push(mapped);
      if (drink.section === "beers") board.beers.push(mapped);
    }

    return board;
  } catch {
    return staticDrinks;
  }
}

export type StoryPhoto = {
  src: string;
  alt: string;
  fromSanity: boolean;
};

const fallbackStoryPhoto: StoryPhoto = {
  src: storyPhoto.src,
  alt: storyPhoto.alt,
  fromSanity: false,
};

function storyParagraph(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

export type Story = {
  photo: StoryPhoto;
  lead: string;
  body: string;
};

const fallbackStory: Story = {
  photo: fallbackStoryPhoto,
  lead: storyCopy.lead,
  body: storyCopy.body,
};

export async function getStory(): Promise<Story> {
  try {
    const story = await client.fetch(STORY_QUERY, {}, fetchOptions);
    const image = story?.image as (StoryImageField & { alt?: string | null }) | null | undefined;
    let photo = fallbackStoryPhoto;

    if (image?.asset?._ref) {
      const src = storyPhotoUrl(image);
      if (src) {
        photo = {
          src,
          alt: image.alt?.trim() || "Favorite Son",
          fromSanity: true,
        };
      }
    }

    return {
      photo,
      lead: storyParagraph(story?.lead, storyCopy.lead),
      body: storyParagraph(story?.body, storyCopy.body),
    };
  } catch {
    return fallbackStory;
  }
}

export async function getPhotos(): Promise<Photo[]> {
  try {
    const photos = await client.fetch(PHOTOS_QUERY, {}, fetchOptions);
    if (!photos.length) return [];
    return photos.flatMap((photo: { src?: string | null; caption?: string | null; alt?: string | null }) => {
      if (!photo.src || !photo.caption || !photo.alt) return [];
      return [{ src: photo.src, alt: photo.alt, label: photo.caption }];
    });
  } catch {
    return staticPhotos;
  }
}

export async function getHours(): Promise<Hours> {
  try {
    const hours = (await client.fetch(HOURS_QUERY, {}, fetchOptions)) as RawHours;
    return normalizeHours(hours);
  } catch {
    return DEFAULT_HOURS;
  }
}

export { allergyNote };
