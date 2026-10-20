export type ItemStatus = "on" | "off";

export type Dish = {
  name: string;
  detail?: string;
  price: string;
  nuts?: boolean;
  status?: ItemStatus;
};

export const smallPlates: Dish[] = [
  { name: "fried calamari", detail: "aioli, salsa brava", price: "16" },
  {
    name: "meatballs",
    detail: "tomato sauce, ricotta, toast (minimum of two)",
    price: "5/ball",
  },
  { name: "porcini rice balls", detail: "lemon cream", price: "9" },
  {
    name: "beet salad",
    detail: "arugula, orange, pistachio, goat cheese",
    price: "12",
    nuts: true,
  },
];

export const redPies: Dish[] = [
  {
    name: "signature",
    detail: "tomato, mozz, evoo, parm",
    price: "22",
  },
  {
    name: "sausage & onion",
    detail: "tomato, mozz, sausage, onion",
    price: "26",
  },
  {
    name: "pepperoni & honey",
    detail: "tomato, mozz, pepperoni, chili, honey",
    price: "26",
  },
  {
    name: "stracciatella & ’nduja",
    detail: "tomato, mozz, stracciatella, ’nduja",
    price: "30",
  },
];

export const whitePies: Dish[] = [
  {
    name: "white clam",
    detail: "mozz, clam, garlic, parsley",
    price: "30",
  },
  {
    name: "porchetta & peppers",
    detail: "mozz, long hots, parm",
    price: "30",
  },
  {
    name: "mushroom",
    detail: "mozz, mushroom, evoo, parm",
    price: "26",
  },
  {
    name: "butternut squash",
    detail: "mozz, balsamic onion, chili, honey, pistachio, basil",
    price: "26",
    nuts: true,
  },
];

export const desserts: Dish[] = [
  {
    name: "tiramisu cannoli",
    detail: "3 chocolate covered minis",
    price: "9",
  },
  {
    name: "olive oil cake",
    detail: "whipped cream & pistachios",
    price: "9",
    nuts: true,
  },
  {
    name: "tartufo",
    detail: "whipped cream (contains nuts)",
    price: "9",
    nuts: true,
  },
];

export const allergyNote =
  "contains nuts. please tell your server about any allergies. we take steps to limit cross-contact, and we cannot guarantee that any item is completely free of allergens.";

export type Wine = {
  name: string;
  meta: string;
  note: string;
  glass: number;
  bottle: number;
  status?: ItemStatus;
};

export const sparkling: Wine[] = [
  {
    name: "criante, “niente panico” frizzante",
    meta: "2023, sicily · 11.5% · catarratto",
    note: "savory orange, chamomile, fresh",
    glass: 16,
    bottle: 56,
  },
  {
    name: "fondo bozzole, “giano” lambrusco",
    meta: "2023, lombardy · 12% · lambrusco salamino",
    note: "dry, wild cherry, bracing",
    glass: 17,
    bottle: 59,
  },
  {
    name: "van de sype, sparkling rosé",
    meta: "2023, emilia-romagna · 11.5% · lambrusco grasparossa",
    note: "bright, cherry, earthy, juicy",
    glass: 18,
    bottle: 63,
  },
];

export const whiteWines: Wine[] = [
  {
    name: "francesco cirelli, pecorino",
    meta: "2024, abruzzo · 12% · pecorino",
    note: "crisp pear, lemon pith, stony finish",
    glass: 16,
    bottle: 56,
  },
  {
    name: "cellario, langhe timorasso",
    meta: "2024, piedmont · 13% · timorasso",
    note: "stone fruit, honey, waxy minerality",
    glass: 16,
    bottle: 56,
  },
  {
    name: "barraco, “fior di bianco”",
    meta: "2025, sicily · 12% · catarratto, grillo, zibibbo",
    note: "zesty citrus, wild thyme, sea-spray",
    glass: 19,
    bottle: 66,
  },
  {
    name: "day wines, “vin de days l’orange”",
    meta: "2023, oregon · 12.5% · riesling, gewürz blend",
    note: "navel orange, dried mango, grippy",
    glass: 18,
    bottle: 63,
  },
];

export const redWines: Wine[] = [
  {
    name: "broc cellars, “amore rosso”",
    meta: "2024, california · 12.5% · barbera, dolcetto",
    note: "playful, pomegranate, chillable",
    glass: 16,
    bottle: 56,
  },
  {
    name: "schiavenza, langhe nebbiolo",
    meta: "2022, piedmont · 14% · nebbiolo",
    note: "fragrant rose, dark fruit, gripping tannins",
    glass: 19,
    bottle: 66,
  },
  {
    name: "les lunes, pinot noir",
    meta: "2023, california · 12.7% · pinot noir",
    note: "wild strawberry, rose petal, subtle earth",
    glass: 19,
    bottle: 66,
  },
];

export const sweetWines: Wine[] = [
  {
    name: "bera, moscato d’asti canelli",
    meta: "2025, piedmont · 5.5% · moscato",
    note: "honeyed peach, jasmine, gentle bubbles",
    glass: 19,
    bottle: 66,
  },
];

export type Pour = {
  name: string;
  detail: string;
  price: string;
  status?: ItemStatus;
};

export const cocktails: Pour[] = [
  { name: "blood orange margarita", detail: "tequila, blood orange, lime", price: "16" },
  {
    name: "baby, you’re driving",
    detail: "bison-grass vodka, grapefruit liqueur, lime, lillet blanc",
    price: "16",
  },
  { name: "old fashioned", detail: "bourbon, demerara, bitters", price: "16" },
  { name: "manhattan", detail: "rye, sweet vermouth, bitters", price: "16" },
  { name: "gold rush", detail: "bourbon, honey, lemon", price: "16" },
  { name: "bee’s knees", detail: "gin, honey, lemon, lavender", price: "16" },
  { name: "negroni", detail: "gin, campari, sweet vermouth", price: "16" },
  {
    name: "naked & famous",
    detail: "mezcal, aperol, yellow chartreuse, lime",
    price: "16",
  },
  {
    name: "last word",
    detail: "gin, green chartreuse, maraschino liqueur, lime",
    price: "16",
  },
  { name: "pomegranate daiquiri", detail: "rum, lime, grenadine", price: "16" },
  {
    name: "espresso martini",
    detail: "vodka, espresso, mr. black, cinnamon",
    price: "16",
  },
];

export const beers: Pour[] = [
  { name: "menabrea bionda", detail: "", price: "8" },
  { name: "forst doppelbock", detail: "", price: "7" },
  { name: "five boroughs gridlock hazy ipa", detail: "", price: "9" },
  { name: "killsboro antipasto! pilsner", detail: "", price: "8" },
  { name: "athletic run wild", detail: "nonalcoholic", price: "8" },
];
