import fs from 'fs';
import path from 'path';

const SANITY_PROJECT_ID = 'pddoyk9z';
const SANITY_DATASET = 'production';
const BASE_URL = 'https://webpit.site';

async function generateSitemap() {
  const staticRoutes = [
    '',
    '/blog',
    '/png-to-webp',
    '/jpg-to-webp',
    '/jpeg-to-webp',
    '/gif-to-webp',
    '/compress-webp',
    '/privacy',
    '/terms',
  ];

  // Fetch blog posts from Sanity
  const query = encodeURIComponent('*[_type == "post"] { "slug": slug.current, _updatedAt }');
  const url = `https://${SANITY_PROJECT_ID}.api.sanity.io/v2023-05-03/data/query/${SANITY_DATASET}?query=${query}`;

  let blogRoutes: { slug: string; updatedAt: string }[] = [];
  try {
    const response = await fetch(url);
    const data = await response.json();
    blogRoutes = data.result.map((post: any) => ({
      slug: `/blog/${post.slug}`,
      updatedAt: post._updatedAt.split('T')[0],
    }));
  } catch (error) {
    console.error('Error fetching blog posts from Sanity:', error);
  }

  const today = new Date().toISOString().split('T')[0];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticRoutes
  .map(
    (route) => `  <url>
    <loc>${BASE_URL}${route}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${route === '' ? 'daily' : 'monthly'}</changefreq>
    <priority>${route === '' ? '1.0' : '0.8'}</priority>
  </url>`
  )
  .join('\n')}
${blogRoutes
  .map(
    (route) => `  <url>
    <loc>${BASE_URL}${route.slug}</loc>
    <lastmod>${route.updatedAt}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  const outputPath = path.join(process.cwd(), 'public', 'sitemap.xml');
  fs.writeFileSync(outputPath, sitemap);
  console.log(`Sitemap generated successfully at ${outputPath}`);
}

generateSitemap();
