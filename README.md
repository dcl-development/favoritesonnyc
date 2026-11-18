# Favorite Son

The website for [Favorite Son Pizzeria & Wine Bar](https://www.favoritesonnyc.com), a sourdough pizzeria and natural wine bar on Forest Avenue in Staten Island.

**Live:** [www.favoritesonnyc.com](https://www.favoritesonnyc.com)

![Favorite Son homepage](docs/screenshot.png)

## What it does

- **Home** opens on the restaurant's sign, today's open/closed status, the service notice, and links to the menu, visit, our story, and reservations.
- **Menu** (`/menu`) lists small plates, red and white pies, dolci, then wine (by section), cocktails, and beer. Wine and drink prices show by the glass and bottle. `/drinks` redirects to `/menu#drinks`.
- **Visit** (`/visit`) has the address, directions, phone, Instagram, and the weekly and holiday hours.
- **Our story** (`/story`) is the family's story with a photo.
- **Reservations** go to Toast Tables (`/reserve` is a short link). Parties of 8 or more are asked to call.
- **Content editing:** the owner edits the menu, wine and drinks, hours (including holiday hours), homepage photos, and the story in Sanity Studio at `/studio`. Items can be switched off the menu without deleting them. Changes show on the site within a minute.
- **SEO:** per-page titles, descriptions, canonical URLs and Open Graph tags, a sitemap, and `Restaurant` JSON-LD built from the same Sanity hours, so search results match the site.

## Stack

- [Next.js 16](https://nextjs.org) (App Router, React Server Components), React 19, TypeScript
- Tailwind CSS 4 plus hand-written CSS
- [Sanity](https://www.sanity.io) 6 with an embedded Studio (`next-sanity`)
- Hosted on [Vercel](https://vercel.com): pushes to `main` deploy to production, and pull requests get preview URLs
- Sanity images load straight from the Sanity CDN through a custom `next/image` loader (`src/lib/sanityImageLoader.ts`), so they don't use Vercel Image Optimization quota

## Project layout

```
src/app/          routes: home, menu, visit, story, studio, sitemap, robots
src/components/   UI (sign, menu rows, sticky bar, reservation notice)
src/sanity/       Studio config, desk structure, and schemas (dish, pour, wine, photo, story, hours)
src/lib/          Sanity queries and mapping, hours logic, SEO helpers
src/content/      contact details and fixed copy
```

## Running it locally

Requires Node 20.9 or newer.

```sh
npm install
npm run dev
```

Open http://localhost:3000 for the site and http://localhost:3000/studio for the Studio. The Sanity project and dataset default to the production dataset (read-only without a login), so no setup is needed to view the site. To point it somewhere else, copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET`.

Other scripts: `npm run build`, `npm run start`, and `npm run lint`.
