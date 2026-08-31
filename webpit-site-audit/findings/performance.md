# Performance (CWV) Findings — webpit.site

Score: **62/100** (lab estimate — PSI quota exhausted, re-run after reset)

## High
- `hero.webp` (93 KB) preloaded `fetchpriority=high` globally (`index.html:26`) but rendered only on `/download` (`Download.tsx:329`) → wasted bandwidth on homepage at LCP time.
- `logo.webp` is 139 KB — the homepage LCP candidate, preloaded high-priority, far too heavy for a logo.

## Medium
- ~2 MB of autoplay MP4s on `/download` load immediately: batch-processing 777 KB, menubar-agent 435 KB, clipboard-conversion 431 KB, watch-folders 330 KB. No `preload="none"` or lazy loading.
- `BlogPost` chunk 638 KB (react-syntax-highlighter + prism styles).

## Low
- No `srcset`/`sizes` on `hero.webp`/`logo.webp`.

## What works
- Async font load with preload+onload swap and noscript fallback.
- GA4 deferred 2s (`App.tsx:27-46`).
- Route-level code splitting + `manualChunks`.
- Inline splash screen for fast FCP.
- WebP images throughout; width/height attributes prevent CLS.

## Notes
- Field data unavailable: PageSpeed Insights returned HTTP 429 (daily quota). Vercel Speed Insights is installed and will provide CrUX-based field data.
