# FillWords Astro Version

Standalone Astro website for FillWords, a free browser word puzzle where players swipe through letter grids to find every hidden word.

## Included

- Astro project config
- `@astrojs/sitemap` for generated sitemaps during build
- `@astrojs/partytown` for offloading Google scripts
- Google Analytics / Google Tag Manager helper component
- Static FillWords game embedded from `public/game/index.html`
- Reusable content, blog, sitemap, and policy pages

## Setup

```bash
npm install
npm run dev
```

Set production values in `.env`. `SITE_URL` must be the final public origin so Astro can generate correct sitemap URLs:

```bash
SITE_URL=https://fillwords.com
PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
PUBLIC_GTM_ID=GTM-XXXXXXX
```

Customize the game name, description, genre, contact email, policy date, social defaults, and topic keywords in `src/data/siteConfig.ts`.

Page copy and page-level SEO live in `src/data/pageContent.ts`. Route-level SEO, canonical sitemap entries, JSON-LD schema choices, and crawl priority live in `src/data/seo.ts` and `src/data/siteRoutes.ts`.

The playable game is intentionally framework-free inside `public/game`. Astro pages should load it through `/game/index.html`.
