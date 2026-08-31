# SEO Action Plan — webpit.site

Priorities: **Critical** (fix immediately) > **High** (1 week) > **Medium** (1 month) > **Low** (backlog).

> **Status legend:** ✅ applied (commit/build-ready) · ⚠️ partial / needs decision · ⬜ not started

---

## Phase 1 — Critical Fixes (Week 1)

### ✅ C1. Fix per-route canonicals
**Evidence:** `index.html:55` hardcodes `canonical → https://webpit.site/`; `useSEO.ts` never updates it. Verified on a rendered blog post.
**Status: ✅ Applied.**
`src/hooks/useSEO.ts` now sets a per-route canonical (defaults to `origin + pathname`) and also keeps `og:title`/`og:description`/`twitter:*` in sync. All pages route through `useSEO` (including `Blog` and `BlogPost`, which previously used manual DOM edits). Verified in preview: `/png-to-webp` → canonical `/png-to-webp`, `/download` → `/download`, `/` → `/`.
**Remaining:** prerender (C2) so canonicals appear in raw HTML without JS.

### ⚠️ C2. Add prerendering / SSR for route-level HTML
**Evidence:** every route serves the same ~4.8 KB JS shell; a 1.8 s render captured only the nav bar; blog content is async from Sanity.
**Status: ⚠️ Not started (infra change).**
Requires `vite-plugin-prerender`/`vite-ssg` + network access to Sanity at build time. Skipped to avoid introducing puppeteer into the build; the client-side SEO layer (canonical/OG/schema) is now in place and will carry through once prerendering is added. Blog content also becomes AI-crawler-visible only via prerendering.

### ✅ C3. Eliminate soft-404s and fix missing assets
**Evidence:** `vercel.json` rewrite `/(.*) → /`; `/nonexistent-page-xyz`, `/apple-touch-icon.png`, `/downshare.webp`, `/favicon.ico`, `/llms.txt` all return `200 text/html`.
**Status: ⚠️ Partial.**
- ✅ Real files added to `public/`: `apple-touch-icon.png` (180×180), `favicon.ico` (32×32), `downshare.webp` (1200×630), `llms.txt`. All now serve with correct content-types (verified).
- ✅ Client-side `NotFound` page (`src/pages/NotFound.tsx`) with `noindex, follow`, routed via `<Route path="*">`.
- ⬜ True server-side 404 statuses still need Vercel middleware (middleware not added to avoid deploy risk). Soft-404s for unknown paths persist server-side.

### ✅ C4. Decide AI-crawler policy (robots.txt)
**Evidence:** live robots.txt (Cloudflare-managed) `Disallow`ed GPTBot, Google-Extended, CCBot, ClaudeBot, Bytespider, Amazonbot, Applebot-Extended, meta-externalagent + `ai-train=no`.
**Status: ✅ Applied (owner decision: allow).**
- Cloudflare managed robots.txt **turned off** (owner action in dash.cloudflare.com → Security → Settings → "Set your preference to block training in robots.txt").
- `public/robots.txt` updated to explicitly `Allow: /` for all crawlers including every major AI bot (GPTBot, OAI-SearchBot, Google-Extended, ClaudeBot, CCBot, PerplexityBot, Bytespider, Amazonbot, Applebot-Extended, meta-externalagent). Zero `Disallow` rules. Verified in `dist/robots.txt` after build.

---

## Phase 2 — High-Impact Improvements (Weeks 2–3)

### ✅ H1. Add structured data
**Status: ✅ Applied.**
- `FAQPage` (4 Q&As) injected on all tool/home pages (`Home.tsx` via `useJsonLd`).
- `SoftwareApplication` + `Offer` ($8.99, InStock) on `/download`.
- `BlogPosting` (headline/description/image/datePublished/dateModified/author/publisher) + `BreadcrumbList` on `/blog/:slug`.
- `Organization` + `sameAs` (X, LinkedIn, Reddit, Product Hunt) added statically to `index.html`.
- New hook: `src/lib/seo.ts` `useJsonLd(data, id)` — dedupes/replaces blocks per route.

### ✅ H2. Unique OG/social images per page
**Status: ✅ Applied.**
- `public/downshare.webp` (1200×630) created; `/download` og:image now resolves.
- Blog posts now pass their Sanity hero image as `og:image`/`twitter:image` via `useSEO`.
- ⬜ Dedicated per-page OG images for tool pages (currently share `logo.webp`) — nice-to-have.

### ✅ H3. De-duplicate the 5 tool landing pages
**Status: ✅ Applied.**
Each format now has its own FAQ set (`Home.tsx` `seoData.faqItems`) rendered in the page and injected as matching `FAQPage` schema — PNG covers transparency, JPG covers size savings, JPEG covers photography/quality, GIF covers static-frame output, compress covers re-encoding. The FAQ section renders from the same data used for schema (single source of truth).

### ✅ H4. Fix image performance + alt text
**Status: ✅ Applied.**
- Removed global `hero.webp` preload from `index.html` (it's only used on `/download`).
- Recompressed `logo.webp`: **139 KB → 23 KB** (1024w q82); `hero.webp`: **93 KB → 58 KB** (1280w q75) via `cwebp`.
- Blog body images now use Sanity `alt`/`caption` instead of generic `alt="Blog content"`.
- `BlogPost` JS chunk: **656 KB → 92 KB** by switching to `PrismLight` with per-language imports.
- Bonus: fixed pre-existing lint errors in `CompareModal.tsx` (missing `useState`/`useRef`/`cn` imports).

### ✅ H5. Lazy-load /download media
**Status: ✅ Applied.** Four feature MP4s now use an `IntersectionObserver`-driven `LazyVideo` (`preload="none"`, loads only when scrolled into view) instead of eager autoplay.

---

## Phase 3 — Content & Authority (Month 2)

### ✅ M1. E-E-A-T build-out
**Status: ✅ Applied (core).**
- New `/about` page (`src/pages/About.tsx`) with `Organization` schema (founder + `sameAs`), routed + footer-linked + added to sitemap.
- Author byline ("By Usman Hyder") linked to `/about` on every blog post.
- ⬜ Optional extras still open: author archive pages, per-post author image in schema.

### ✅ M2. Refresh committed sitemap + automate
**Status: ✅ Applied (regeneration).**
- `public/sitemap.xml` regenerated: now **21 URLs** — added `/about`, `/download`, `/refund`, fixed root to trailing-slash form to match canonical.
- ⬜ Move generation into CI/deploy hook (still build-time only).

### ✅ M3. Content cluster expansion
**Status: ✅ Applied (internal linking).**
- Tool pages now render a "Learn More About Image Optimization" section with per-format relevant blog post links (`Home.tsx` `typeResources`) — e.g. PNG → transparency post, all → format guide / image-SEO / CWV posts. Verified: `/png-to-webp` links 2 posts, `/gif-to-webp` links 1, `/` links 3.
- Blog posts already CTA to `/download`; combined with the new tool→blog links the hub-and-spoke is in place.
- ⬜ Optional: publish additional comparison/alternative posts.

### ✅ M4. Add `llms.txt`
**Status: ✅ Applied.** `public/llms.txt` created (summary + key pages).

---

## Phase 4 — Monitoring & Iteration (Ongoing)

- ⬜ Connect Search Console + CrUX for field CWV data.
- ⬜ Add drift baselines for canonical/OG/schema across deploys.
- ⬜ Quarterly ranking and cluster review.

---

## Severity Rollup (updated)

| Severity | Total | Done | Remaining |
|---|---|---|---|
| Critical | 4 | C1, C3 (partial), C4 | C2 prerender, C3 middleware |
| High | 5 | H1, H2, H3, H4, H5 | — |
| Medium | 4 | M1, M2, M3, M4 | CI sitemap hook (M2), author archive pages (M1) |
| Low | 3 | homepage H1 ✅, favicon.ico ✅, noopener ✅ | meta keywords (harmless, kept) |

