# Schema / Structured Data Findings — webpit.site

Score: **50/100**

## Current (validated)
- Single JSON-LD block (`index.html:59-85`): `WebApplication` + `Offer` (price 0) + `Person` author. Structurally valid per render validation.
- `applicationCategory` = "MultimediaApplication" (valid but unusual enum).
- `author.name` = "Usman hyder", no `url`/`sameAs`.

## Missing
- `FAQPage` for the homepage FAQ (`Home.tsx:551-569`) — 4 Q&As, zero markup.
- `SoftwareApplication` + `Offer` ($8.99) for the paid Mac app on `/download`.
- `BlogPosting`/`Article` + `BreadcrumbList` on all 9 blog posts (no headline/datePublished/image/author).
- `Organization` with `logo` + `sameAs` (X, LinkedIn, Reddit, Product Hunt exist in footer).
- `ImageObject` for blog heroes.

## Priority
1. FAQPage (homepage) — copy-paste win.
2. SoftwareApplication (/download).
3. BlogPosting + BreadcrumbList (blog).
4. Organization.
