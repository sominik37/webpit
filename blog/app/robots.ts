import type { MetadataRoute } from 'next';

/**
 * The blog app is only ever meant to be consumed through the main domain
 * (https://webpit.site/blog) via a Vercel rewrite. Disallow the raw
 * *.vercel.app origin so it never competes with the canonical URLs.
 * This file is served on the blog origin only; webpit.site/robots.txt is
 * owned by the main Vite app and still allows crawling of /blog.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', disallow: '/' }],
  };
}
