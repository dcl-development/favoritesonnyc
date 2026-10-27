# Favorite Son

The website for Favorite Son Pizzeria & Wine Bar, 1210 Forest Avenue, Staten Island.

Production is [www.favoritesonnyc.com](https://www.favoritesonnyc.com). The apex domain redirects there. The same deployment is at [favoritesonnyc.vercel.app](https://favoritesonnyc.vercel.app). Pushes to `main` deploy to production. Pull requests get preview URLs.

For how the site is hosted, how to edit it, and what not to change, read [docs/HANDOFF.md](docs/HANDOFF.md). [`favorite-son-research-brief.md`](favorite-son-research-brief.md) is background research and is not shown on the site.

![Favorite Son homepage](docs/screenshot.png)

## What's on the site

- Home, one menu page (food, then wine and drinks), our story at `/story`, and visit. `/drinks` redirects to `/menu#drinks`. Visit has no site footer.
- Home leads with the neon sign, whole 14 inch pies cut into six, the current service notice, and links to the menu, visit, our story, and reservations.
- Reservations open Toast Tables. Parties of 8 or more are asked to call.
- Menu, wine, cocktails, beer, homepage photos, and the Our Story photo can be edited in Sanity Studio at `/studio`. If Sanity cannot be reached, the site uses the copies in `src/content/`. Hours and contact details are in `src/content/site.ts`.

## Stack

Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, Sanity, deployed on Vercel. The repo is [dcl-development/favoritesonnyc](https://github.com/dcl-development/favoritesonnyc).

## Running it locally

```sh
npm install
npm run dev
```

Open http://localhost:3000. The Sanity project and dataset default to production (`gdzx3zp3` / `production`), so no setup is needed to view the site. To point it somewhere else, copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET`.

Other scripts: `npm run build`, `npm run start`, and `npm run lint`. `scripts/seed-sanity.mts` loads the static menu into Sanity and needs `SANITY_AUTH_TOKEN`.

### Sanity images and Vercel

Homepage carousel and Our Story photos from Sanity use a custom `next/image` loader (`src/lib/sanityImageLoader.ts` via `SanityImage`) so requests go straight to `cdn.sanity.io` with width, quality, `auto=format`, and `fit` params. That bypasses Vercel Image Optimization, which counts against the team’s shared **5,000 transformations/month** quota. Local files under `/public` still use the default optimizer when rendered without that loader.
