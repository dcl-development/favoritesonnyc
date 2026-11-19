export const restaurant = {
  name: "favorite son",
  legalName: "Favorite Son Pizzeria & Wine Bar",
  line: "100% sourdough pizza, staten island",
  tagline: "pizza, wine & cocktails",
  phone: "929-805-0063",
  phoneTel: "+19298050063",
  email: "danny@favoritesonnyc.com",
  instagram: "https://www.instagram.com/favoritesonnyc/",
  url: "https://www.favoritesonnyc.com",
  press:
    "https://www.silive.com/dining/2026/09/no-slices-no-delivery-no-shortcuts-favorite-son-brings-artisan-sourdough-pizza-to-staten-island.html",
  address: {
    street: "1210 Forest Avenue",
    city: "Staten Island",
    region: "NY",
    postal: "10310",
    line: "1210 Forest Avenue, Staten Island, NY 10310",
  },
  maps: {
    google:
      "https://www.google.com/maps/search/?api=1&query=1210+Forest+Avenue+Staten+Island+NY+10310",
  },
  reserve: "https://toast.app/r/favorite-son-llc-1210-forest-avenue",
  notice: {
    title: "no takeout, no slices",
    body: "walk-ins welcome, reservations available.",
  },
} as const;

export const nav = [
  { href: "/menu", label: "menu" },
  { href: "/visit", label: "visit" },
  { href: "/story", label: "our story" },
] as const;

export const storyPhoto = {
  src: "/photos/kitchen.jpg",
  alt: "Danny Ippolito and Graceanne Belmonte-Ippolito in the kitchen.",
} as const;

export type Photo = {
  src: string;
  alt: string;
  label: string;
};

/** Popup shown once per browser session (see ReservationNotice). */
export const reservationNotice = {
  title: "Reservations & walk-ins",
  paragraphs: [
    "Walk-ins are always welcome! We’re a small room, so walk-in space is limited, but our heated, enclosed patio is nice and warm.",
    "Reservations need a card to hold your table. Please confirm your booking so we can save your spot.",
    "Parties of 8 or more, please give us a call.",
  ],
} as const;
