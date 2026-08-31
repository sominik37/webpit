# On-Page SEO Findings — webpit.site

Score: **55/100**

## High
- **JS-injected metadata.** `useSEO` sets title/description/OG client-side only. Raw HTML `<title>`/`<meta description>`/OG identical across all routes. No-JS crawlers and social scrapers see homepage metadata everywhere.
- **Blog posts lack unique social meta.** `BlogPost.tsx` updates only `document.title` + `meta description`; `og:title`/`og:image`/canonical stay homepage defaults (verified in rendered output).

## Medium
- Homepage `/` has no H1 (hero is the logo); primary keyword never appears in an H1.
- Raw `<title>` ("Fast & Private") vs `og:title` ("Fast, Private & Free") inconsistency in `index.html`.

## Low
- Footer social links use `rel="noreferrer"` without `noopener`.
- `meta keywords` present (ignored by Google).

## What works
- Clean keyword-rich URLs (`/png-to-webp`, `/blog/<slug>`).
- Unique titles/descriptions defined per tool page in `Home.tsx` `seoData`.
- Well-formed heading hierarchy on blog/download pages; `<article>` + single H1 on posts.
- Internal linking: nav, footer, related posts, prev/next.
