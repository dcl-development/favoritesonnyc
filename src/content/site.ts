export const restaurant = {
  name: "favorite son",
  legalName: "Favorite Son Pizzeria & Wine Bar",
  line: "100% sourdough pizza, staten island",
  tagline: "pizza, wine & cocktails",
  phone: "929-805-0063",
  phoneTel: "+19298050063",
  email: "danny@favoritesonnyc.com",
  instagram: "https://www.instagram.com/favoritesonnyc/",
  url: "https://favoritesonnyc.com",
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
  hoursLabel: "wednesday–monday · 5–10 · closed tuesday",
  notice: {
    title: "no takeout, no slices",
    body: "walk-ins welcome, reservations available.",
  },
} as const;

export const nav = [
  { href: "/menu", label: "menu" },
  { href: "/drinks", label: "wine & drinks" },
  { href: "/visit", label: "visit" },
  { href: "/story", label: "our story" },
] as const;

export type Photo = {
  src: string;
  alt: string;
  label: string;
};

export const photos: Photo[] = [
  {
    src: "/photos/signature.jpg",
    alt: "A whole sourdough pie on a metal tray at the table, charred rim, tomato and mozzarella.",
    label: "signature",
  },
  {
    src: "/photos/slice.jpg",
    alt: "A slice held up, open crumb, tomato, and stracciatella.",
    label: "the slice",
  },
  {
    src: "/photos/butternut.jpg",
    alt: "Butternut squash pie with balsamic onion, basil, and pistachio.",
    label: "butternut squash",
  },
  {
    src: "/photos/sausage.jpg",
    alt: "Sausage and onion pie in the box, six slices.",
    label: "sausage & onion",
  },
  {
    src: "/photos/nduja.jpg",
    alt: "Stracciatella and ’nduja pie on a metal tray.",
    label: "stracciatella & ’nduja",
  },
  {
    src: "/photos/storefront.jpg",
    alt: "Danny Ippolito outside Favorite Son at 1210 Forest Avenue, white apron, neon pie sign.",
    label: "forest avenue",
  },
  {
    src: "/photos/sign.jpg",
    alt: "Paper sign on the wall: favorite son, pizza, wine and cocktails, 1210 forest avenue.",
    label: "the sign",
  },
];

/** Names that match a menu item exactly. Empty until something is 86’d. */
export const unavailable: string[] = [];
