# AI Search Readiness (GEO) Findings — webpit.site

Score: **15/100**

## Critical
- **All major AI crawlers blocked.** Live robots.txt (Cloudflare-managed) contains `Disallow: /` for `Amazonbot`, `Applebot-Extended`, `Bytespider`, `CCBot`, `ClaudeBot`, `Google-Extended`, `GPTBot`, `meta-externalagent`, plus `Content-Signal: search=yes, ai-train=no, use=reference`. The site is absent from AI Overviews (Google-Extended), ChatGPT (GPTBot), Perplexity, and Claude.
  - Note: committed `public/robots.txt` is the benign default; the restrictive rules come from Cloudflare's managed robots feature.

## High
- **JS-rendered content.** Even if unblocked, non-JS AI crawlers only retrieve the splash shell — no article content to cite.

## Medium
- No `llms.txt` (`/llms.txt` returns SPA HTML 200).

## What works / Opportunities
- Blog content is well-structured (headings, tables, code blocks, lists) — strong citability once accessible.
- Brand badges (Product Hunt, RankInPublic, Startuups) provide thin third-party mention signals.

## Recommendation
Decide deliberately. If AI visibility matters, remove the AI-crawler disallows (or at least Google-Extended/GPTBot/ClaudeBot) and add prerendering so crawlers can read content; add `llms.txt`.
