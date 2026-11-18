# AGENTS.md — favoritesonnyc

Website for Favorite Son Pizzeria & Wine Bar, 1210 Forest Ave, Staten Island. Production: www.favoritesonnyc.com (apex redirects there).

## Dev framework

This repo follows Jake's dev framework: [jakedcl/dev-framework](https://github.com/jakedcl/dev-framework) (start at its `AGENTS.md`). The framework is the source of truth; if anything in this file conflicts with it, the framework wins.

The framework repo is private. Cloud agents open it with `git clone --depth 1 https://x-access-token:${DEV_FRAMEWORK_READ_TOKEN}@github.com/jakedcl/dev-framework /tmp/dev-framework` (the token is a Cursor secret; never print or commit it).

## Stack
- Next.js 16.4 (App Router), React 19.3, TypeScript, Tailwind CSS 4.
- Sanity 6 + next-sanity 13. Project `gdzx3zp3`, dataset `production`. Studio is embedded at `/studio` (`/admin` redirects).
- Vercel: pushes to `main` deploy to production; PRs get preview URLs.

## Layout
- `src/app/` home, `menu/` (food, then wine and drinks), `story/`, `visit/`, `studio/`. `/drinks` redirects to `/menu#drinks`.
- `src/sanity/` env, `lib/`, `structure.ts`, `schemaTypes/` (dish, pour, wine, photo, story, templates).
- `src/content/` menu types and the allergy note (`menu.ts`); contact and the service notice live in `site.ts`. Menu, photos, story text, and hours come from Sanity only (no static copies).
- `src/marks/` the pie mark. `src/components/`, `src/lib/`.

## Commands
- `npm run dev`, `npm run build`, `npm run start`, `npm run lint`. No env needed; Sanity defaults to production.

## Read first
- `docs/HANDOFF.md` covers hosting, editing, and what not to change. `favorite-son-research-brief.md` is background only, not site copy.

## Gotchas
- The oven is an electric Moretti Forni. Never call it wood-fired or coal-fired.
- Don't invent fermentation hours, superlatives, awards, or health grades. Don't link the Unofficial Facebook page.
- Beet salad is arugula, orange, pistachio, goat cheese (marked for nuts). Don't change the cheese.
- Pie mark paths in `src/marks/pie-mark.svg` and `pie-geometry.ts` are locked. Style on top; don't reshape.
- iOS Safari font weight tweak lives inside `@supports (-webkit-touch-callout: none)`. Studio resets it. Keep it scoped.
- Reservations go to Toast Tables. Parties of 8+ are asked to call.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
