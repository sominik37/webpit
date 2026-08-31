# Content Quality & E-E-A-T Findings — webpit.site

Score: **58/100**

## High
- **Near-duplicate tool pages.** `/png-to-webp`, `/jpg-to-webp`, `/jpeg-to-webp`, `/gif-to-webp`, `/compress-webp` share FAQ, benefits, and comparison table; only heading/description/uploadDesc differ (`Home.tsx` `seoData`). Cannibalization risk.
- **Weak E-E-A-T.** No About page, no author bios/pages on blog posts, no company page. Only JSON-LD `Person` node. No `Organization` + `sameAs`.

## Medium
- Blog posts render no author byline; meta description falls back to generic string when `post.description` absent.

## What works
- Homepage has real, unique content: 3-step how-to, WebP comparison table, 4-FAQ, benefits.
- 9 relevant blog posts (image SEO, WebP vs formats, CWV, Mac app) with related/prev-next internal links.
- Thorough Privacy/Terms/Refund (trust signals for a checkout site).
- Readable prose; Tailwind typography plugin on article body.
