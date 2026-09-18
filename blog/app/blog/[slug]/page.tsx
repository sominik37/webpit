import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { sanityFetch, urlFor, POST_QUERY, SLUGS_QUERY, type Post, type PostCard } from '@/lib/sanity';
import PostBody from '@/components/PostBody';

export const revalidate = false;
export const dynamicParams = true;

const SITE_URL = 'https://webpit.site';

interface PostQueryResult {
  post: Post | null;
  related: PostCard[];
}

export async function generateStaticParams() {
  try {
    const slugs = await sanityFetch<{ slug: string | null }[]>(SLUGS_QUERY, {}, ['post']);
    return slugs.filter((s) => s.slug).map((s) => ({ slug: s.slug as string }));
  } catch (error) {
    console.error('generateStaticParams error:', error);
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;

  let data: PostQueryResult = { post: null, related: [] };
  try {
    data = await sanityFetch<PostQueryResult>(POST_QUERY, { slug }, ['post', `post:${slug}`]);
  } catch (error) {
    console.error('generateMetadata error:', error);
  }

  const post = data.post;
  const canonical = `${SITE_URL}/blog/${slug}`;

  if (!post) {
    return {
      title: 'Article not found | WebPit Blog',
      robots: { index: false, follow: true },
    };
  }

  const image = post.mainImage
    ? urlFor(post.mainImage).width(1200).height(630).fit('crop').url()
    : `${SITE_URL}/logo.webp`;
  const description = post.description || 'Read more about this article on the WebPit Blog.';

  return {
    title: `${post.title} | WebPit Blog`,
    description,
    alternates: { canonical },
    openGraph: {
      type: 'article',
      url: canonical,
      title: `${post.title} | WebPit Blog`,
      description,
      images: [image],
      publishedTime: post.publishedAt || post._createdAt,
      modifiedTime: post._updatedAt,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${post.title} | WebPit Blog`,
      description,
      images: [image],
    },
  };
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(value));
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let data: PostQueryResult = { post: null, related: [] };
  try {
    data = await sanityFetch<PostQueryResult>(POST_QUERY, { slug }, ['post', `post:${slug}`]);
  } catch (error) {
    console.error('Blog post fetch error:', error);
  }

  const { post, related } = data;
  if (!post) notFound();

  const canonical = `${SITE_URL}/blog/${slug}`;
  const image = post.mainImage
    ? urlFor(post.mainImage).width(1200).height(630).fit('crop').url()
    : `${SITE_URL}/logo.webp`;

  const blogPostingSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    image,
    datePublished: post.publishedAt || post._createdAt,
    dateModified: post._updatedAt,
    author: { '@type': 'Person', name: 'Usman hyder', url: 'https://github.com/sominik37' },
    publisher: {
      '@type': 'Organization',
      name: 'WebPit',
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.webp` },
    },
    mainEntityOfPage: canonical,
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` },
      { '@type': 'ListItem', position: 3, name: post.title, item: canonical },
    ],
  };

  return (
    <div className="bg-slate-50/50 min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <article className="max-w-[920px] mx-auto px-4 sm:px-6 py-12 lg:py-20">
        <Link
          href="/blog"
          className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-blue-600 mb-10 transition-all bg-white border border-slate-200/60 hover:border-blue-200 px-5 py-2.5 rounded-full shadow-sm hover:shadow-md group"
        >
          <svg className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to blog
        </Link>

        <header className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 mb-6 text-blue-600 font-bold tracking-widest uppercase text-xs">
            <span className="w-8 h-[2px] bg-blue-600"></span>
            {formatDate(post.publishedAt || post._createdAt)}
          </div>
          <p className="text-sm text-slate-500 mb-4">
            By{' '}
            <a href="/about" className="font-semibold text-slate-700 hover:text-blue-600 transition-colors">
              Usman hyder
            </a>
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-12 leading-[1.1]">
            {post.title}
          </h1>
          {post.mainImage && (
            <div className="rounded-[2.5rem] overflow-hidden shadow-2xl mb-16 border border-white relative">
              <img
                src={urlFor(post.mainImage).width(1200).height(630).fit('crop').url()}
                alt={post.title}
                className="w-full"
              />
            </div>
          )}
        </header>

        <div className="prose prose-lg prose-slate prose-blue prose-p:leading-[1.8] prose-li:leading-[1.8] max-w-none text-slate-700 bg-white p-6 sm:p-8 md:p-12 lg:p-16 rounded-[2.5rem] border border-slate-200/50 shadow-sm mb-16">
          <PostBody value={post.body} />
        </div>

        {/* CTA – Get the Mac App */}
        <a
          href="/download"
          className="group block bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-[2.5rem] p-8 sm:p-10 hover:from-slate-800 hover:to-slate-700 transition-all hover:shadow-2xl hover:-translate-y-0.5 border border-white/5 mb-16"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-start gap-5">
              <div className="shrink-0 w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10">
                <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
              </div>
              <div>
                <p className="text-xl font-bold">Get WebPit for Mac — unlimited power, one‑time purchase</p>
                <p className="text-sm text-slate-400 mt-1.5">
                  Batch processing · Watch folders · Menu bar agent · Clipboard conversion · Native speed
                </p>
              </div>
            </div>
            <div className="shrink-0 inline-flex items-center gap-2 bg-white text-slate-900 font-bold px-6 py-3.5 rounded-xl hover:bg-slate-100 transition-all group-hover:shadow-lg text-base sm:ml-0">
              Download Now — $8.99
              <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </a>

        {/* Next/Prev Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-12 border-t border-slate-200">
          {post.previous ? (
            <Link
              href={`/blog/${post.previous.slug.current}`}
              className="group p-8 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-200 transition-all"
            >
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                <svg className="w-3 h-3 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </p>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                {post.previous.title}
              </h3>
            </Link>
          ) : (
            <div />
          )}

          {post.next && (
            <Link
              href={`/blog/${post.next.slug.current}`}
              className="group p-8 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-200 transition-all text-right"
            >
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2 justify-end">
                Next
                <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                </svg>
              </p>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                {post.next.title}
              </h3>
            </Link>
          )}
        </div>
      </article>

      {/* Related Articles Section */}
      {related.length > 0 && (
        <section className="bg-slate-100/50 py-20 border-t border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-12 text-center">Related Articles</h2>
            <div className="grid gap-8 md:grid-cols-3">
              {related.map((rPost) => (
                <Link
                  key={rPost._id}
                  href={`/blog/${rPost.slug?.current}`}
                  className="group flex flex-col bg-white rounded-3xl border border-slate-200/60 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                >
                  {rPost.mainImage && (
                    <div className="aspect-[16/10] w-full bg-slate-100 overflow-hidden">
                      <img
                        src={urlFor(rPost.mainImage).width(600).height(400).url()}
                        alt={rPost.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {rPost.title}
                    </h3>
                    <p className="text-slate-500 text-sm line-clamp-2 flex-grow">{rPost.rawExcerpt}</p>
                    <div className="mt-4 flex items-center text-blue-600 font-bold text-xs">
                      Read more
                      <svg className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
