import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { client, urlFor } from '../lib/sanity';

interface Post {
  _id: string;
  title: string;
  slug: { current: string };
  publishedAt?: string;
  _createdAt: string;
  mainImage?: any;
  rawExcerpt?: string;
}

export default function Blog() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client
      .fetch(`*[_type == "post"] | order(_createdAt desc) {
        _id,
        title,
        slug,
        publishedAt,
        _createdAt,
        mainImage,
        "rawExcerpt": pt::text(body)
      }`)
      .then((data) => {
        setPosts(data);
        setLoading(false);
      })
      .catch((e) => {
        console.error("Sanity fetch error:", e);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="max-w-5xl mx-auto px-4 py-16 text-center text-gray-500">Loading blog posts...</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
      <div className="mb-12">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 mb-4">WebPit Blog</h1>
        <p className="text-lg text-gray-600 max-w-2xl">
          Learn about image optimization, web performance, and the latest news around the WebPit ecosystem.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link
            key={post._id}
            to={`/blog/${post.slug?.current || ''}`}
            className="group flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
          >
            {post.mainImage && (
              <div className="aspect-[16/9] w-full bg-gray-100 overflow-hidden">
                <img
                  src={urlFor(post.mainImage).width(600).height(400).url()}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            )}
            <div className="p-6 flex flex-col flex-grow">
              <p className="text-sm font-medium text-blue-600 mb-2">
                {new Date(post.publishedAt || post._createdAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
              <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                {post.title}
              </h2>
              {post.rawExcerpt && (
                <p className="text-gray-600 line-clamp-3 mb-4 flex-grow">
                  {post.rawExcerpt.slice(0, 150)}{post.rawExcerpt.length > 150 ? '...' : ''}
                </p>
              )}
              <div className="mt-auto flex items-center text-blue-600 font-semibold text-sm select-none">
                Read article
                <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {posts.length === 0 && (
        <div className="text-center py-24 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-gray-500 text-lg">No posts published yet. Check back soon!</p>
        </div>
      )}
    </div>
  );
}
