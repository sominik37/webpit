# Full SEO Audit — webpit.site (Codebase + Live Verification)

**Audit date:** Aug 31, 2026
**Audit type:** Codebase audit of `/Users/usmanhyder/Documents/My-projects/webpit` + live-site verification against `https://webpit.site`
**Stack:** React 19 + Vite 6 + React Router 7 (pure client-side SPA), Tailwind 4, Sanity CMS (blog), Vercel (host), Cloudflare (proxy), Paddle (payments)
**Pages audited:** `/`, `/blog`, `/blog/:slug` (9 posts), `/png-to-webp`, `/jpg-to-webp`, `/jpeg-to-webp`, `/gif-to-webp`, `/compress-webp`, `/download`, `/download/success`, `/download/redownload`, `/privacy`, `/terms`, `/refund`

---

## Executive Summary

### SEO Health Score: **51 / 100**

**Business type detected:** Free web tool (SaaS app) + paid macOS desktop app, with an SEO content blog. Monetization is a one-time $8.99 purchase via Paddle.

### Top 5 Critical Issues

1. **Global canonical is hardcoded to the homepage.** Every route — including all 9 blog posts and `/download` — emits `<link rel="canonical" href="https://webpit.site/">`. Google treats every page as a variant of the homepage, collapsing all ranking signals. Verified live: a rendered blog post declares the homepage canonical while showing its own H1.
2. **Pure client-side rendering with no SSR/prerendering.** The raw HTML served is identical for every URL (just a splash screen + shell). All content requires JS execution plus an async Sanity fetch. A sub-2s render of a blog post captured only the nav bar — no article content, no H1. Crawlers risk indexing loading states.
3. **robots.txt blocks every major AI crawler.** GPTBot, Google-Extended, CCBot, ClaudeBot, Bytespider, Amazonbot, Applebot-Extended, and meta-externalagent are all `Disallow`ed, plus `Content-Signal: ai-train=no`. The site is effectively invisible to ChatGPT, Perplexity, Gemini AI Overviews, and Claude citations.
4. **Soft-404s everywhere.** The Vercel catch-all rewrite `/(.*) → /` makes unknown URLs and missing assets return `200 text/html` (e.g. `/nonexistent-page-xyz`, `/apple-touch-icon.png`, `/downshare.webp`, `/favicon.ico`, `/llms.txt`). This wastes crawl budget and signals broken/empty pages as real ones.
5. **Only one JSON-LD block exists site-wide.** No `BlogPosting`/`Article`, no `FAQPage` (the homepage has an FAQ section), no `SoftwareApplication` for the paid app, no `Organization`, no breadcrumbs.

### Top 5 Quick Wins

1. Add `FAQPage` JSON-LD matching the homepage FAQ — copy-paste, no infra change.
2. Add `SoftwareApplication` JSON-LD to `/download` for the $8.99 app.
3. Add `BlogPosting` + `BreadcrumbList` JSON-LD to blog posts.
4. Stop globally preloading `hero.webp` (93 KB — it's only used on `/download`) and recompress `logo.webp` (139 KB).
5. Set `preload="none"` + lazy load on the four autoplaying MP4s on `/download` (~2 MB total).

---

## Category Scores

| Category | Weight | Score | Grade |
|---|---|---|---|
| Technical SEO | 22% | 52/100 | D |
| Content Quality | 23% | 58/100 | C |
| On-Page SEO | 20% | 55/100 | C |
| Schema / Structured Data | 10% | 50/100 | D |
| Performance (CWV) | 10% | 62/100 | C |
| AI Search Readiness | 10% | 15/100 | F |
| Images | 5% | 60/100 | C |
| **Weighted Total** | **100%** | **51/100** | **D** |

---

## Technical SEO

**Score: 52/100**

### Crawlability
- ✅ robots.txt present and valid (`public/robots.txt`), `Sitemap:` directive points to `https://webpit.site/sitemap.xml`.
- ✅ Live sitemap is current — all 9 Sanity blog posts are present (verified live).
- ❌ **Soft-404s (Critical).** `vercel.json` rewrites `/(.*)` → `/`. Every unknown path returns `200 text/html`. Verified: `/nonexistent-page-xyz` → 200 HTML. Google wastes crawl budget and you lose 404 status semantics.
- ⚠️ Missing assets serve the SPA shell as `200 text/html`: `/apple-touch-icon.png` (referenced in `index.html:58`), `/downshare.webp` (used as `og:image` on `/download`), `/favicon.ico`, `/llms.txt`. The files don't exist in `public/`.

### Indexability
- ✅ `<meta name="robots" content="index, follow">` on homepage.
- ❌ **Canonical collapse (Critical).** `index.html:55` hardcodes `<link rel="canonical" href="https://webpit.site/">`; nothing updates it client-side (`useSEO.ts` never touches canonical). Verified: blog post canonical = homepage.
- ⚠️ URL variant inconsistency: sitemap uses `https://webpit.site` (no trailing slash), canonical uses `https://webpit.site/`.

### Rendering / SPA Status
- ❌ **No SSR, SSG, or prerendering (Critical).** `main.tsx` mounts a BrowserRouter into `#root`; `vite.config.ts` has no SSR/pre-render plugin. The raw HTML for every route is the same ~4.8 KB shell with a splash screen. Blog content is fetched from Sanity at runtime (`Blog.tsx`, `BlogPost.tsx`).
- ❌ Evidence of unstable rendering: `render_page.py` captured a blog post after 1.8 s as *only* the nav bar (`Blog / Mac App / About WebP`) — the async Sanity fetch had not resolved. Google's renderer is more patient, but any render budget pressure (common for mid-tier crawls) yields empty pages.
- ✅ On the positive side, content is not a bot-blocked walled garden: `@sanity/client` fetches are CORS-open and indexable once JS runs.

### Security
- ✅ `strict-transport-security: max-age=63072000` (HSTS) present.
- ✅ HTTPS via Cloudflare + Vercel, `report-to`/NEL configured.

### Sitemap build pipeline
- ⚠️ `public/sitemap.xml` in the repo is **stale** (3 of 9 posts; lastmod May 31). It regenerates only when someone runs `npm run build` (which runs `npm run sitemap`). If the Sanity fetch fails during a build, the stale file silently ships. Recommend generating at deploy time (or adding it to CI) and committing fresh output.

---

## Content Quality & E-E-A-T

**Score: 58/100**

### Strengths
- ✅ Homepage has substantive, unique copy: 3-step how-to, WebP comparison table, 4-item FAQ, benefits section (`Home.tsx`).
- ✅ Blog has 9 relevant posts (image SEO, WebP vs JPEG/PNG/AVIF, Core Web Vitals, Mac app). Decent topical authority base for an image-optimization tool.
- ✅ Internal linking is solid on blog posts: related articles, prev/next navigation, CTAs to `/download`.
- ✅ Legal pages (Privacy, Terms, Refund) are thorough and current — trust signals for a payment-taking site.

### Weaknesses
- ⚠️ **Near-duplicate tool pages (High).** `/png-to-webp`, `/jpg-to-webp`, `/jpeg-to-webp`, `/gif-to-webp`, `/compress-webp` differ only in heading/description/uploadDesc; the FAQ, benefits section, and comparison table are identical (`Home.tsx` renders one shared body). Risk: duplicate-content cannibalization across the 5 pages.
- ⚠️ **Thin E-E-A-T.** No About page, no author pages/bios on blog posts, no company page. The only authorship signal is `"author": { "name": "Usman hyder" }` in JSON-LD. No `Organization` schema with `sameAs` to the listed social profiles.
- ⚠️ No dates/authors rendered on blog posts beyond a publish date; no author byline.
- ℹ️ Blog post "min read" is computed from excerpt length (`rawExcerpt.length / 200`) — cosmetic, not a content issue.

---

## On-Page SEO

**Score: 55/100**

### Per-route metadata
- ✅ `useSEO` hook (`src/hooks/useSEO.ts`) updates `title`, `meta description`, `og:title`, `og:description`, `og:image`/`twitter:image` client-side. Tool pages get unique titles/descriptions.
- ❌ **But all of it is JS-injected.** The raw HTML `<title>`/`<meta description>`/OG tags are identical on every route (only the homepage's). No-JS crawlers and social scrapers see homepage metadata for everything. Verified: rendered blog post kept homepage `og:title`/`og:image`/canonical while its `title` changed.
- ❌ Blog posts don't call `useSEO` and never set `og:image`/`twitter:image`/canonical. A blog post shared on social shows the homepage logo and homepage title.
- ⚠️ Raw title vs OG inconsistency: raw `<title>` says "Fast & Private", raw `og:title` says "Fast, Private & Free" (`index.html:28-47`).

### Headings & structure
- ✅ Home: `h1` is absent on `/` (hero is text-free); H2s for sections, H3s for cards, H4s in benefits — well-formed hierarchy.
- ✅ Blog listing: single `h1`; card titles are `h2` inside `<Link>`.
- ✅ Blog post: `<article>` + single `h1`, prose styled by `@tailwindcss/typography`.
- ⚠️ `/` (homepage) has no `h1` — the H1-equivalent is the site logo. Consider an H1 for the primary keyword ("Free WebP Image Converter").

### URLs & internal linking
- ✅ Clean, keyword-rich URLs (`/png-to-webp`, `/blog/<slug>`).
- ✅ SPA internal links use `Link` with `data-discover` — good for crawlers that render.
- ⚠️ Footer social anchors (`App.tsx:215-247`) use `rel="noreferrer"` without `noopener`; fine for external, but `noreferrer` strips referral data.

---

## Schema / Structured Data

**Score: 50/100**

### Current implementation (verified)
- ✅ One JSON-LD block in `index.html:59-85`: `WebApplication` + `Offer` (price 0) + `Person` author. Rendered and validated as structurally valid JSON-LD (1 block, valid).
- ⚠️ `WebApplication.applicationCategory` = "MultimediaApplication" — a valid, but nonstandard, Schema.org enum value.
- ⚠️ `author` name "Usman hyder" — no `url`/`sameAs`.

### Missing opportunities
- ❌ `FAQPage` — the homepage has a 4-question FAQ (`Home.tsx:551-569`) with zero schema.
- ❌ `SoftwareApplication` + `Offer` for the **paid** $8.99 Mac app on `/download` — currently only the free web app is marked up.
- ❌ `BlogPosting`/`Article` + `BreadcrumbList` on blog posts.
- ❌ `Organization` with `logo` and `sameAs` (X, LinkedIn, Reddit, Product Hunt).
- ❌ `ImageObject` for blog hero images.

---

## Performance (Core Web Vitals)

**Score: 62/100** (lab estimate; PageSpeed API quota exhausted — see notes)

### What's working well
- ✅ Async font loading with `preload`+`onload` swap and `noscript` fallback (`index.html:9-22`).
- ✅ GA4 script deferred by 2 s (`App.tsx:27-46`) to protect main-thread paint.
- ✅ Route-level code splitting via `React.lazy` + `Suspense`.
- ✅ `manualChunks` in `vite.config.ts` for vendor/motion/sanity splits.
- ✅ `logo.webp` and `hero.webp` preloaded with `fetchpriority=high`; splash screen inline in `#root` for fast FCP.

### Issues
- ❌ **`hero.webp` (93 KB) is preloaded with high priority on every page** (`index.html:26`) but is only rendered on `/download` (`Download.tsx:329`). Wasted bandwidth on the homepage at LCP-critical time.
- ❌ **`logo.webp` is 139 KB** — very heavy for a logo and it's the LCP candidate on the homepage (header logo, high priority). Should be ~10–20 KB.
- ⚠️ Four autoplay MP4s on `/download` (`batch-processing.mp4` 777 KB, `menubar-agent.mp4` 435 KB, `clipboard-conversion.mp4` 431 KB, `watch-folders.mp4` 330 KB ≈ 2 MB) start loading immediately — no `preload="none"`, no lazy loading.
- ⚠️ `BlogPost` chunk is 638 KB (`react-syntax-highlighter` bundles large prism styles). Lazy chunk is fine for initial load, but heavy for a content page — consider lighter highlighter or per-language prism imports.
- ⚠️ No responsive `srcset`/`sizes` on `hero.webp`/`logo.webp`.
- ⚠️ `SpeedInsights` injects `/_vercel/speed-insights/script.js` — small, acceptable.

---

## Images

**Score: 60/100**

- ✅ All site images are WebP. Blog hero cards use Sanity `urlFor(...).width().height().url()` (resized server-side) — good.
- ✅ Alt text present on header/logo, blog cards (`alt={post.title}`), feature placeholders.
- ❌ **Blog body images use a generic `alt="Blog content"`** (`BlogPost.tsx:276`) — identical, meaningless alt for every inline image. Fix by passing the Sanity asset's `alt`/`caption` from the Portable Text `image` type.
- ⚠️ `og:image` is `logo.webp` (139 KB, a logo) on homepage and `/download` (`downshare.webp` doesn't exist → serves HTML 200, so the actual shared image is broken). No per-page OG images for blog posts.
- ⚠️ `favicon.ico` and `apple-touch-icon.png` references resolve to `200 text/html` (files absent from `public/`). Modern browsers use `fav.webp` via the `<link>` tag, but iOS and older clients hit broken refs.
- ℹ️ `hero.webp` (93 KB) and `logo.webp` (139 KB) are the largest first-party images and can be aggressively recompressed.

---

## AI Search Readiness (GEO)

**Score: 15/100**

- ❌ **Critical: the site blocks essentially every AI crawler.** Live `robots.txt` (Cloudflare-managed) contains:
  - `Content-Signal: search=yes, ai-train=no, use=reference`
  - `Disallow: /` for `Amazonbot`, `Applebot-Extended`, `Bytespider`, `CCBot`, `ClaudeBot`, `Google-Extended`, `GPTBot`, `meta-externalagent`.
  
  This removes the site from AI Overviews (Google-Extended), ChatGPT (GPTBot/OAI-SearchBot), Perplexity, Claude (ClaudeBot), and Bing's AI surfaces (CCBot/Bytespider). If AI visibility is a goal, these blocks must be reconsidered — this is the single highest-leverage action for the AI category.
- ❌ No `llms.txt` (the path returns the SPA shell as HTML 200).
- ❌ Content is JS-rendered; even if AI crawlers were unblocked, most don't execute JS and would fetch the splash shell only.
- ✅ Structurally, blog content is well-formatted (headings, tables, code blocks, lists) — strong citability *if* unblocked.
- ⚠️ Brand presence is thin: Product Hunt / RankInPublic / Startuups badges exist, but no substantive third-party citations or backlink profile to lean on.

---

## Post-Audit Fixes Applied (Aug 31, 2026)

Fixes from the ACTION-PLAN have been applied and verified with `npm run lint` (clean) + `npm run build` (succeeds) + local Playwright preview checks:

| Fix | Change | Verified |
|---|---|---|
| C1 canonical | `useSEO` now sets per-route canonical (origin+pathname) + syncs OG/twitter tags; Blog/BlogPost refactored onto the hook | `/png-to-webp`→`/png-to-webp`, `/download`→`/download` |
| C3 assets | Real `apple-touch-icon.png`, `favicon.ico`, `downshare.webp` (1200×630), `llms.txt` added | All serve 200 with correct content-types |
| C3 404 | Client-side `NotFound` page (`noindex, follow`) at `<Route path="*">` | Renders on bogus paths |
| H1 schema | FAQPage, SoftwareApplication+Offer, BlogPosting+BreadcrumbList, Organization (`sameAs`) | Blocks verified in rendered DOM |
| H2 OG | `/download` og:image resolves; blog posts use hero image as og:image | — |
| H3 tool de-dup | Per-format FAQ copy (PNG/JPEG/GIF/compress) rendered + matching FAQPage schema | Unique FAQ per route verified |
| H4 perf | Removed global `hero.webp` preload; `logo.webp` 139→23 KB, `hero.webp` 93→58 KB; blog body alt from Sanity; BlogPost chunk 656→92 KB (PrismLight) | Build + Lighthouse chunk weights |
| H5 video | Feature MP4s lazy-load via IntersectionObserver (`preload="none"`) | — |
| M1 E-E-A-T | New `/about` page (Organization schema, founder, sameAs) + author byline on blog posts, footer link | Renders + schema verified |
| M2 sitemap | Regenerated: 21 URLs (+`/about`, `/download`, `/refund`), root trailing slash | `npm run sitemap` |
| M3 links | Tool pages → relevant blog posts section; blog → `/download` CTA already present | Verified link counts per route |
| M4 llms.txt | Added `public/llms.txt` | serves `text/plain` |
| Low items | Visually-hidden H1 on homepage + tool pages; `noopener` on footer/header external links | H1 present in DOM |
| — | Fixed pre-existing lint errors in `CompareModal.tsx` (missing imports) | `tsc --noEmit` clean |

**Still open:** C2 prerendering/SSR, C3 server-side 404 middleware, C4 AI-crawler policy decision (Cloudflare-managed robots), M1 author archive pages, M2 CI sitemap hook.

## Report Notes / Methodology



- Live rendering verified with a headless Chromium capture (`render_page.py`, Playwright) against `https://webpit.site/`, `/blog/<slug>`, plus curl checks of `/robots.txt`, `/sitemap.xml`, missing assets, and HTTP headers.
- PageSpeed Insights quota was exhausted (HTTP 429) — Core Web Vitals are **lab estimates** from code review (bundle sizes, preloads, chunk weights), not field data. Re-run after quota resets, or connect Search Console for CrUX field data.
- Live sitemap is current; the **local committed** `public/sitemap.xml` is stale and must be regenerated before the next deploy/commit.
