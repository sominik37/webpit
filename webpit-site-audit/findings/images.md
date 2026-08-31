# Images Findings — webpit.site

Score: **60/100**

## High
- **Broken OG image on /download.** `Download.tsx` passes `og:image: https://webpit.site/downshare.webp`; the file doesn't exist in `public/` and returns `200 text/html`. Social shares of /download use a broken image.
- **Non-unique OG images.** Blog posts share homepage `logo.webp` as their social image.

## Medium
- **Generic alt on blog body images.** `BlogPost.tsx:276` renders every inline Portable Text image with `alt="Blog content"` — meaningless for image SEO/a11y.

## Low
- `favicon.ico` and `apple-touch-icon.png` referenced in `index.html` are absent → `200 text/html`. Modern browsers use `fav.webp` but iOS/older clients hit broken refs.

## What works
- All first-party site images are WebP.
- Blog cards use Sanity-resized images (`urlFor(...).width().height()`) with `alt={post.title}`.
- `loading="lazy"` + `decoding="async"` on below-fold images (Product Hunt/RankInPublic badges, footer logo).
- width/height attributes present (CLS-safe).

## Priority
1. Real OG images (1200x630) per page + fix `downshare.webp` ref.
2. Alt text from Sanity asset metadata for blog body images.
3. Real `apple-touch-icon.png`/`favicon.ico`.
