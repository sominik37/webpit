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

  // SEO Update
  useEffect(() => {
    document.title = "WebPit Blog - Updates & Insights on Image Optimization";
    
    let metaDescription = document.querySelector('meta[name="description"]');
    const descText = "Learn about image optimization, web performance, and the latest news from the WebPit ecosystem. Convert images to WebP and improve your Core Web Vitals.";
    
    if (metaDescription) {
      metaDescription.setAttribute('content', descText);
    } else {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      metaDescription.setAttribute('content', descText);
      document.head.appendChild(metaDescription);
    }
  }, []);

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

  if (loading) return <div className="max-w-5xl mx-auto px-4 py-16 text-center text-slate-500 font-medium">Loading blog posts...</div>;

  const hasPosts = posts.length > 0;
  const featuredPost = hasPosts ? posts[0] : null;
  const gridPosts = hasPosts ? posts.slice(1) : [];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 lg:py-20">
      <div className="relative mb-20 text-center">
        {/* Decorative background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30rem] h-[15rem] bg-blue-500/10 blur-[100px] rounded-full -z-10 pointer-events-none"></div>
        
        <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-semibold mb-6 shadow-sm">
           Updates & Insights
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-5xl font-extrabold tracking-tight text-slate-900 mb-6 font-sans">WebPit Blog</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Learn about image optimization, web performance, and the latest news around the WebPit ecosystem.
        </p>
      </div>

      {featuredPost && (
        <Link
          to={`/blog/${featuredPost.slug?.current || ''}`}
          className="group flex flex-col md:flex-row bg-white rounded-[2.5rem] border border-slate-200/60 shadow-[0_8px_30px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-300 overflow-hidden mb-12 items-center"
        >
          <div className="md:w-5/12 w-full p-8 md:p-10 lg:p-12 flex flex-col justify-center order-2 md:order-1">
            <div className="flex flex-wrap items-center gap-3 mb-5">
               <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-bold text-[10px] tracking-widest uppercase border border-blue-100 shadow-sm">Featured</span>
               <p className="text-sm font-medium text-slate-500">
                {new Date(featuredPost.publishedAt || featuredPost._createdAt).toLocaleDateString('en-US', {
                  month: 'short', day: 'numeric', year: 'numeric',
                })}
               </p>
               <span className="text-slate-300">•</span>
               <p className="text-sm font-medium text-slate-500">{Math.max(2, Math.ceil((featuredPost.rawExcerpt?.length || 500) / 200))} min read</p>
            </div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-slate-900 mb-6 group-hover:text-blue-600 transition-colors leading-tight tracking-tight">
              {featuredPost.title}
            </h2>
            {featuredPost.rawExcerpt && (
              <p className="text-slate-600 text-base line-clamp-3 mb-8 leading-relaxed">
                {featuredPost.rawExcerpt}
              </p>
            )}
            <div className="mt-auto flex items-center text-blue-600 font-bold text-sm select-none">
              Read article
              <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
          </div>
          {featuredPost.mainImage && (
            <div className="md:w-7/12 w-full p-4 md:p-6 lg:p-8 order-1 md:order-2">
              <div className="w-full h-full aspect-[4/3] rounded-[1.5rem] overflow-hidden shadow-2xl border border-slate-100 group-hover:shadow-blue-200/50 transition-all duration-500 relative">
                <img
                  src={urlFor(featuredPost.mainImage).width(1200).height(900).url()}
                  alt={featuredPost.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>
          )}
        </Link>
      )}

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {gridPosts.map((post) => (
          <Link
            key={post._id}
            to={`/blog/${post.slug?.current || ''}`}
            className="group flex flex-col bg-white rounded-[2rem] border border-slate-200/60 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-300 overflow-hidden"
          >
            {post.mainImage && (
              <div className="aspect-[16/9] w-full bg-slate-100 overflow-hidden relative">
                <img
                  src={urlFor(post.mainImage).width(600).height(400).url()}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            )}
            <div className="p-8 flex flex-col flex-grow">
              <div className="flex items-center gap-2 mb-4 text-xs font-semibold text-slate-500">
                <span className="px-2.5 py-1 rounded-md border border-slate-200 bg-slate-50 text-slate-600">
                  {new Date(post.publishedAt || post._createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
                <span className="text-slate-300">•</span>
                <span>{Math.max(2, Math.ceil((post.rawExcerpt?.length || 400) / 200))} min read</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                {post.title}
              </h2>
              {post.rawExcerpt && (
                <p className="text-slate-600 line-clamp-3 mb-6 flex-grow leading-relaxed">
                  {post.rawExcerpt}
                </p>
              )}
              <div className="mt-auto flex items-center text-blue-600 font-bold text-sm select-none">
                Read article
                <svg className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {!hasPosts && (
        <div className="text-center py-24 bg-white rounded-[2rem] border border-slate-200/60 shadow-sm relative overflow-hidden">
          <div className="absolute inset-0 bg-slate-50/50 -z-10"></div>
          <p className="text-slate-500 text-lg font-medium">No posts published yet. Check back soon!</p>
        </div>
      )}
    </div>
  );
}
