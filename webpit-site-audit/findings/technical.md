# Technical SEO Findings — webpit.site

Score: **52/100**

## Critical
- **Canonical collapse.** `index.html:55` hardcodes `rel="canonical" href="https://webpit.site/"`. `useSEO.ts` never updates canonical. Verified: rendered `/blog/<slug>` declares homepage canonical. Every route signals to Google it is the homepage → all ranking signals collapse to `/`.
- **No SSR/prerender.** Pure CSR (`main.tsx` + BrowserRouter). Raw HTML identical for all routes. A 1.8s Playwright render of a blog post captured only nav (Blog/Mac App/About WebP). Async Sanity fetch means content appears only after JS + network.
- **Soft-404s.** `vercel.json` `/(.*) → /` returns `200 text/html` for unknown URLs and missing assets. Verified: `/nonexistent-page-xyz` → 200; `/apple-touch-icon.png`, `/downshare.webp`, `/favicon.ico`, `/llms.txt` → 200 HTML.

## High
- Missing asset files referenced in `<head>`: `apple-touch-icon.png`, `favicon.ico`; `/download` OG image `downshare.webp` absent.

## Medium
- Committed `public/sitemap.xml` stale (3 of 9 posts). Regeneration only via `npm run build`; Sanity fetch failure silently ships stale file.
- URL variant mismatch: sitemap `https://webpit.site` vs canonical `https://webpit.site/`.

## What works
- robots.txt valid with `Sitemap:` directive; live sitemap current (all 9 posts).
- HSTS, HTTPS, NEL configured.
- SPA `<Link data-discover>` navigation is crawler-friendly once JS runs.
