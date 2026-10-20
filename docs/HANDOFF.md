# Favorite Son handoff

This is the operating manual for the Favorite Son website. The public site is a small Next.js app. The owner edits the menu, drinks, homepage photos, and the Our Story photo in Sanity. Hours, the service notice, reservations, and the neon sign live in the repo.

Background research that is not shown on the site is in [`favorite-son-research-brief.md`](../favorite-son-research-brief.md) at the repo root. That file is the in-repo copy. Jake holds the original research archive (ChatGPT, September 24–25, 2026).

## Domain and hosting

`favoritesonnyc.com` is registered at Squarespace Domains. The registration was at Google Domains and moved to Squarespace in 2023. DNS stays on the Squarespace nameservers:

- `nse1.squarespacedns.com`
- `nse2.squarespacedns.com`
- `nse3.squarespacedns.com`
- `nse4.squarespacedns.com`

Those records point the site at Vercel. Production is [www.favoritesonnyc.com](https://www.favoritesonnyc.com). The apex domain redirects to www. The same deployment is also at [favoritesonnyc.vercel.app](https://favoritesonnyc.vercel.app).

The Vercel project is under the `jakedcl` account. Pushes to `main` deploy to production. Pull request branches get preview deployments.

The GitHub repo is [jakedcl/favoritesonnyc](https://github.com/jakedcl/favoritesonnyc).

## Stack and local development

Next.js 16.3 (App Router), React 19, TypeScript, and Tailwind CSS 4. Sanity Studio is embedded at `/studio` through `next-sanity`. Node and npm are the toolchain. There is no Bun script.

```sh
npm install
npm run dev
```

Open http://localhost:3000. `npm run build` makes a production build, `npm run start` serves that build, and `npm run lint` runs ESLint.

The Sanity project id and dataset default to production (`gdzx3zp3` / `production`) in `src/sanity/env.ts`, so a checkout can render the live menu without a local env file. Copy `.env.example` to `.env.local` only when you need to point somewhere else:

```sh
NEXT_PUBLIC_SANITY_PROJECT_ID=gdzx3zp3
NEXT_PUBLIC_SANITY_DATASET=production
```

`scripts/seed-sanity.mts` copies the static menu and homepage photos into Sanity. It needs a write token in `SANITY_AUTH_TOKEN`. That token is not in `.env.example` and should not be committed. Seeding writes to whatever project and dataset the env vars name, which defaults to production.

Pages revalidate from Sanity about every 60 seconds (`src/lib/cms.ts`). A Studio publish shows up on the site after that, or on the next deploy.

## Pages and routes

| URL | What it is |
| --- | --- |
| `/` | Home. Neon sign, `[ menu ]` `[ visit ]` `[ our story ]`, `[ reservations ]`, the service notice, the photo strip, and the footer. |
| `/menu` | One menu. Food first, then wine and drinks. Jump links go to `#food` and `#drinks`. |
| `/menu#drinks` | Wine, cocktails, and beer on the same page. |
| `/drinks` | Permanent redirect (308) to `/menu#drinks`. Also `/drinks/*`. |
| `/visit` | Address, phone, hours, `[ book a reservation ]`, Instagram, one paragraph, then the storefront photo. No site footer. |
| `/story` | Our Story. The nav label is “our story”. The path is `/story`, not `/our-story`. |
| `/studio` | Sanity Studio. `/admin` redirects here. |
| `/sitemap.xml`, `/robots.txt` | Generated. The sitemap lists `/`, `/menu`, `/visit`, and `/story`. |

Inner pages share `Sheet`: a small pie mark, the kicker, the page title, the same three bracket links, and a dashed rule. Visit passes `footer={false}`. Home, menu, and story keep the footer.

The visit paragraph is fixed copy: no takeout, no slices, walk-ins welcome, reservations available, covered outdoor seating, and parties of 8 or more should call. “Call” is a `tel` link.

## Contact and reservations

From `src/content/site.ts`:

- Address: 1210 Forest Avenue, Staten Island, NY 10310
- Phone: 929-805-0063
- Owner email: danny@favoritesonnyc.com
- Instagram: [@favoritesonnyc](https://www.instagram.com/favoritesonnyc/)
- Press: the SILive story, linked from the Our Story page

Reservations are a Toast Tables link, not an API:

https://toast.app/r/favorite-son-llc-1210-forest-avenue

Home uses `[ reservations ]`. Visit uses `[ book a reservation ]`. Both open that URL in a new tab. Parties of 8 or more are asked to call. On a fine-pointer desktop, hovering the home reservations link shows that note. It is also in the visit paragraph.

Hours are Wednesday through Monday, 5–10, closed Tuesday, in America/New_York. `src/lib/hours.ts` turns that into the “open until 10” / “opens at 5” line in the footer and the sticky bar. The visit page prints the seven days by hand. None of this is a Sanity field.

## Business facts and content rules

Use these when writing or editing public copy. The published Sanity menu and `src/content/menu.ts` already follow the menu rules below.

**Identity**

- Legal name: Favorite Son Pizzeria & Wine Bar. The wordmark on the site is lowercase “favorite son”.
- Address: 1210 Forest Avenue, Staten Island, NY 10310. Say “Forest Avenue, Staten Island.” Westerleigh and Port Richmond are both used elsewhere, and the neighborhood name is not settled.
- Danny Ippolito is the contact: danny@favoritesonnyc.com, 929-805-0063.
- Hours: Wednesday–Monday, 5–10pm. Closed Tuesday. The restaurant opened September 9, 2026.
- Instagram: [@favoritesonnyc](https://www.instagram.com/favoritesonnyc/). Danny’s account is [@shaolinsomm](https://www.instagram.com/shaolinsomm/).
- Google listing: https://www.google.com/maps?cid=1258756891494654008. The site’s address link is a maps search for the street address.
- The Facebook page linked from Danny is labeled Unofficial. Do not link it.

**How to describe the food**

- The oven is an electric Moretti Forni. Never call it wood-fired or coal-fired.
- The pies are naturally leavened, New York-style sourdough, 14 inches, cut into six slices.
- Do not invent fermentation hours, superlatives, awards, or health grades. Press and comments that say “first” or “best” are not the restaurant’s claims.
- Beet salad is arugula, orange, pistachio, and goat cheese, and it is marked for nuts. Do not change the cheese to robiola.
- Tiramisu cannoli is one dessert (three chocolate-covered minis), not two dishes.
- “Baby, you’re driving” contains alcohol (bison-grass vodka, grapefruit liqueur, lime, Lillet Blanc). It is not a mocktail. Athletic Run Wild is the nonalcoholic beer.
- The beer list is those five, at $7–$9: Menabrea Bionda $8, Forst Doppelbock $7, Five Boroughs Gridlock hazy IPA $9, Killsboro Antipasto! pilsner $8, Athletic Run Wild $8.
- Nut marks follow the printed menu: beet salad, butternut squash, olive oil cake, and tartufo.

## Open questions

Leave these as printed until Danny confirms a change. Do not guess a correction into the menu.

- Cellario, Langhe Timorasso: the grape field repeats the producer name, “Cellario”.
- “Vini Barraci” is the spelling on the supplied wine list. Confirm it against the bottle before changing it.
- Day Wines’ tasting note says “naval orange”. It may have meant “navel”.
- Porchetta & peppers lists mozz, long hots, and parm. Porchetta itself is missing from that ingredient line.
- Glass and bottle pour sizes are not on the wine list.
- Graceanne’s name and title are not confirmed for a credit line. The story page currently uses Graceanne Belmonte-Ippolito, from Danny’s public Facebook intro. Her role at the restaurant is not established.
- Photo reuse permissions are not on file. Do not treat social screenshots or press photos as licensed site assets.

## Sanity

Studio config is `sanity.config.ts`. Project `gdzx3zp3`, dataset `production`, API version `2026-09-26`. The desk is titled “Edit the website” (`src/sanity/structure.ts`).

The owner can edit:

- **Food menu.** Dishes in Small plates, Red pies, White pies, and Dolci. Each item has available tonight (on, or off / 86), name, ingredients, price, section, a nuts flag, and sort order.
- **Wine & drinks.** Wines (sparkling, white & orange, red, sweet) with year/place/grapes, a tasting note, glass price, and bottle price. Cocktails and beer are separate “pour” documents with name, optional note, and price. The same on/off and sort order fields apply.
- **Homepage photos.** Image with a hotspot, a short label, alt text, and sort order. These replace the photo strip when at least one complete photo is published.
- **Our Story.** One document, id `story`. A photo with a hotspot, plus alt text required once an image is uploaded. The hotspot is what stays in the frame. Leave the photo empty to keep the kitchen picture.

Hours, the phone, the address, the reservation URL, the service notice, and the story paragraphs are not in Studio. Change those in `src/content/site.ts`, `src/app/visit/page.tsx`, and `src/app/story/page.tsx`.

Fallbacks when Sanity cannot be reached (`catch` in `src/lib/cms.ts`):

- Menu and drinks use `src/content/menu.ts`.
- The Our Story photo uses `/photos/kitchen.jpg` and the alt text in `site.ts`.
- Homepage photos use the seven files listed in `site.ts`.

A successful fetch that returns no documents is different. An empty food list or an empty drinks list shows “the board is blank tonight” / “the list is blank tonight”. An empty homepage photo list hides the strip. An Our Story document with no image still uses the kitchen photo.

`src/content/site.ts` also has an `unavailable` name list. The live 86 switch is the Sanity “Available tonight?” field. The static list stays empty unless someone is editing the file fallback.

## Design

Type is American Typewriter, with Courier New as the fallback (`--font-type` in `src/app/globals.css`). The voice on the page is lowercase.

Colors:

| Token | Hex | Where it shows |
| --- | --- | --- |
| `--wall` | `#e8e1d2` | Page background. `html` and `body` both use it, including under the home footer. |
| `--paper` | `#f8f4eb` | Inner pages, the sticky bar, photo captions, and the browser `theme-color`. |
| `--ink` | `#1a140f` | Text. |
| `--soft` | `#4a3d34` | Secondary lines. |

Bracket links are the page nav and the reservation buttons: `[ menu ]`, `[ visit ]`, `[ our story ]`, `[ reservations ]`, `[ book a reservation ]`. They have no resting underline. On hover, focus, or press, the brackets move 2px outward and return. The current page on inner nav is a dotted mark under the word, not under the brackets.

Other inline links (phone, address, email, Instagram, menu jumps, “call”) use a 1px dotted underline, current color, about 3px offset. Hover stays dotted.

iOS Safari draws American Typewriter lighter than Chrome. Inside `@supports (-webkit-touch-callout: none)` only, body text uses `font-weight: 500`, automatic font smoothing, and a 0.2px stroke. Explicit 400 styles on the sign and menu prices become 500 there. Headings stay 600. Studio resets that treatment so the editing UI does not pick it up. The font family does not change.

The viewport is `cover`, so `env(safe-area-inset-*)` is real on iPhone. The sticky bar pads the top inset. The footer pads the bottom inset. Visit has no footer, so the sheet pads the bottom inset instead. `body` has `min-height: 100dvh`.

The sticky bar is fixed to `top: 0` and hidden with `translate3d(0, -110%, 0)` until the page scrolls past 48px. A `::before` of paper, one viewport tall, sits above the bar, and the visible bar also carries a paper shadow upward. That covers the iPhone sliver above the bar. The skip link is clipped until keyboard focus. When the bar is visible it has a soft shadow, `0 1px 6px rgba(0, 0, 0, 0.06)`.

Menu rows indent 4px on hover only when the device actually hovers. A touch tap plays a 1 second indent that returns to zero. Food and drinks jump links smooth-scroll, offset by the sticky bar, and write the hash with `history.replaceState`. Reduced motion jumps instantly.

## Neon sign

Do not reshape the mark. The paths in `src/marks/pie-mark.svg` and `src/marks/pie-geometry.ts` are locked. `PieMark` draws that geometry at `WEIGHT` 1.125 (strokes 12.5% heavier than the locked widths). Color and glow are a style on top of the paths.

The hero is layered: a glass stroke (reds from `#ff2a30` through `#f2161e`) with a stacked gaussian glow, a filament core (`#ffd6d0` / `#ffc4bc`) that shimmers, a cool specular (`#f7fcff`) plus a white glint (`#fff`) on the ring, and a separate dark flicker (`#2a0408`) on the slice and crust only. The ring does not flicker. The flicker is a short step-end flash of a dark stroke, peaking around 5–6% opacity, so the slice and crust stay near 93–95% of full brightness. It runs on an 8.5s cycle. The burst sits about three quarters through that cycle, and a negative delay makes the first flash land 2 seconds after load. The glint is its own 10.5s trip around the ring.

The specular follows the pointer on desktop and device tilt when the browser already provides it, up to about 1.1px (`PieLight`, `--pie-lx` / `--pie-ly`). Touch moves do not drive it. The hero ring is centered with margin on `.pie-mark-home`, not a transform, so the slice-out entrance can keep its own translate. The little mark in the header and sticky bar does not shimmer, glint, or flicker.

`prefers-reduced-motion` turns the sign animations off, including flicker, glint, shimmer, and the light follow.

## Motion

Shipped in pull request 27. Transforms and opacity only. No animation library.

- Menu groups, the photo strip, visit info, and story blocks fade in and rise 10px over 460ms, with a short stagger. Each one runs once, through an `IntersectionObserver` in `src/components/Reveal.tsx`. The hero and the neon are not in that set. Without JavaScript, a `noscript` style keeps those blocks visible.
- The sticky bar slides down and fades in over 250ms, and slides back up when it hides. The paper cover above the bar stays.
- Bracket buttons use the 2px nudge described above. The menu-row tap still lasts one second.
- The photo strip is a horizontal scroll-snap row (`scroll-snap-type: x mandatory`, `scroll-behavior: smooth`). A drag coasts, then settles on a frame.
- Client route changes fade the new view in over 230ms, starting around 42% opacity so the page does not flash empty. The first load does not play that fade (`src/app/template.tsx`).

Reduced motion disables the new transitions, the route fade, the bracket nudge, and smooth scrolling. Snap on the photo strip can remain. Content is visible immediately.

## Changelog, pull requests 6–27

Merged to `main`. Numbers are the GitHub pull requests.

| PR | What changed |
| --- | --- |
| 6 | Tidied the layout and matched the header mark to the shop’s neon sign. |
| 7 | Removed the no-reservations line from the site. |
| 8 | Removed that policy from the research brief. |
| 9 | Added the Toast Tables reservation link. |
| 10 | Ended the sign band on a full stripe and stacked the footer links. |
| 11 | Made the Our Story photo editable in Sanity, with hotspot and alt text. |
| 12 | Timed the neon flicker against the glint, three quarters through the streak. |
| 13 | Kept the flicker on that three-quarter point of the streak. |
| 14 | Started the first flicker two seconds after load. |
| 15 | Grouped the footer and showed `@favoritesonnyc`. |
| 16 | Combined food and wine onto `/menu`, and made iOS Safari body type heavier. |
| 17 | Made inner-page nav the same bracket links as home. |
| 18 | Renamed the home reserve link to `[ reservations ]`. |
| 19 | Added a faint shadow on the sticky bar while it is visible. |
| 20 | Made a menu-row tap indent, then return after one second. |
| 21 | Tried to cover the gap above the sticky bar. Not enough on a real iPhone. |
| 22 | Extended the bar’s paper background upward and hid the skip link until keyboard focus. |
| 23 | Simplified visit: no footer, Instagram, `[ book a reservation ]`, one paragraph, then the photo. |
| 24 | Dotted underlines on inline text links, not on bracket buttons. |
| 25 | Smooth-scrolled the menu jump links, with the heading clear of the sticky bar. |
| 26 | Matched the color under the footer to the page, including the home safe area. |
| 27 | Added the motion system above. Left the neon animation alone. |
