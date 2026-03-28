import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PortableText } from '@portabletext/react';
import { client, urlFor } from '../lib/sanity';

interface Post {
  title: string;
  publishedAt?: string;
  _createdAt: string;
  mainImage?: any;
  body: any[];
}

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client
      .fetch(`*[_type == "post" && slug.current == $slug][0]`, { slug })
      .then((data) => {
        setPost(data);
        setLoading(false);
      })
      .catch(console.error);
  }, [slug]);

  if (loading) return <div className="max-w-[920px] mx-auto px-4 py-24 text-center text-gray-500">Loading article...</div>;
  if (!post) return <div className="max-w-[920px] mx-auto px-4 py-24 text-center text-gray-500">Article not found.</div>;

  return (
    <article className="max-w-[920px] mx-auto px-4 sm:px-6 py-12 lg:py-20">
      <Link to="/blog" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-blue-600 mb-8 transition-colors">
        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to blog
      </Link>

      <header className="mb-10 text-center">
        <p className="text-blue-600 font-semibold mb-4 tracking-wide uppercase text-sm">
          {new Date(post.publishedAt || post._createdAt).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          })}
        </p>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 mb-8 leading-tight">
          {post.title}
        </h1>
        {post.mainImage && (
          <div className="rounded-2xl overflow-hidden shadow-2xl mb-12">
            <img
              src={urlFor(post.mainImage).width(1200).height(630).url()}
              alt={post.title}
              className="w-full object-cover aspect-video"
            />
          </div>
        )}
      </header>

      <div className="prose prose-lg prose-blue prose-p:leading-[1.5] prose-li:leading-[1.5] max-w-none text-gray-700">
        <PortableText 
          value={post.body} 
          components={{
            types: {
              image: ({ value }) => (
                <div className="my-8 rounded-xl overflow-hidden shadow-md">
                  <img src={urlFor(value).width(800).url()} alt="Blog content" className="w-full" />
                </div>
              ),
            },
          }}
        />
      </div>
    </article>
  );
}
