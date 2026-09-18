import { createClient } from '@sanity/client';
import { createImageUrlBuilder } from '@sanity/image-url';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'pddoyk9z';
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const apiVersion = '2023-05-03';

export const client = createClient({
  projectId,
  dataset,
  useCdn: true,
  apiVersion,
});

const builder = createImageUrlBuilder(client);

export const urlFor = (source: any) => builder.image(source);

/**
 * Fetch from the Sanity HTTP query API using a GET request so Next.js can
 * cache the response and invalidate it with `revalidateTag`.
 */
export async function sanityFetch<T>(
  query: string,
  params: Record<string, string | number | boolean> = {},
  tags: string[] = ['post']
): Promise<T> {
  const search = new URLSearchParams({ query });
  for (const [key, value] of Object.entries(params)) {
    search.set(`$${key}`, JSON.stringify(value));
  }

  const url = `https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}?${search.toString()}`;

  const res = await fetch(url, {
    cache: 'force-cache',
    next: { tags },
  });

  if (!res.ok) {
    throw new Error(`Sanity fetch failed (${res.status}): ${await res.text()}`);
  }

  const json = await res.json();
  return json.result as T;
}

export const POSTS_QUERY = `*[_type == "post"] | order(_createdAt desc) {
  _id,
  title,
  slug,
  publishedAt,
  _createdAt,
  mainImage,
  "rawExcerpt": pt::text(body)
}`;

export const POST_QUERY = `{
  "post": *[_type == "post" && slug.current == $slug][0] {
    ...,
    "next": *[_type == "post" && _createdAt > ^._createdAt] | order(_createdAt asc)[0]{title, slug},
    "previous": *[_type == "post" && _createdAt < ^._createdAt] | order(_createdAt desc)[0]{title, slug}
  },
  "related": *[_type == "post" && slug.current != $slug] | order(_createdAt desc)[0...3] {
    _id, title, slug, mainImage, publishedAt, _createdAt, "rawExcerpt": pt::text(body)
  }
}`;

export const SLUGS_QUERY = `*[_type == "post"]{ "slug": slug.current }`;

export interface PostCard {
  _id: string;
  title: string;
  slug: { current: string } | null;
  publishedAt?: string;
  _createdAt: string;
  mainImage?: any;
  rawExcerpt?: string;
}

export interface Post extends PostCard {
  description?: string;
  _updatedAt?: string;
  body: any[];
  next?: { title: string; slug: { current: string } };
  previous?: { title: string; slug: { current: string } };
}
