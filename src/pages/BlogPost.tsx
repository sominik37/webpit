import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PortableText } from '@portabletext/react';
import { client, urlFor } from '../lib/sanity';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

// ─── Code Block Component ──────────────────────────────────────────────────
interface CodeBlockValue {
  code: string;
  language?: string;
  filename?: string;
}

function CodeBlock({ value }: { value: CodeBlockValue }) {
  const [copied, setCopied] = useState(false);

  const copyCode = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value.code ?? '');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }, [value.code]);

  const language = value.language?.toLowerCase() ?? 'code';

  return (
    <div style={{
      margin: '2rem 0',
      borderRadius: '0.875rem',
      overflow: 'hidden',
      border: '1px solid #1e293b',
      background: '#0f172a',
      boxShadow: '0 8px 32px rgba(0,0,0,0.28)',
      fontSize: '0.89rem',
      lineHeight: '1.7',
      fontFamily: '"JetBrains Mono", "Fira Code", "Cascadia Code", Menlo, Consolas, monospace',
    }}>
      {/* Header bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.6rem 1rem',
        background: '#1e293b',
        borderBottom: '1px solid #334155',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{
            padding: '2px 10px',
            borderRadius: '999px',
            background: '#3b82f6',
            color: '#fff',
            fontWeight: 700,
            fontSize: '0.7rem',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}>{language}</span>
          {value.filename && (
            <span style={{ color: '#94a3b8', fontSize: '0.78rem' }}>{value.filename}</span>
          )}
        </div>
        <button
          onClick={copyCode}
          title="Copy code"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            background: copied ? '#22c55e22' : 'transparent',
            border: `1px solid ${copied ? '#22c55e' : '#334155'}`,
            color: copied ? '#22c55e' : '#94a3b8',
            borderRadius: '0.4rem',
            padding: '3px 10px',
            fontSize: '0.72rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          {copied ? (
            <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg> Copied!</>
          ) : (
            <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg> Copy</>
          )}
        </button>
      </div>

      {/* Code body */}
      <div style={{ overflowX: 'auto', fontSize: '0.9rem' }}>
        <SyntaxHighlighter
          language={language === 'js' ? 'javascript' : language === 'ts' ? 'typescript' : language}
          style={vscDarkPlus}
          showLineNumbers={true}
          customStyle={{
            margin: 0,
            padding: '1rem',
            background: '#0f172a',
          }}
          lineNumberStyle={{
            minWidth: '2.5rem',
            paddingRight: '1rem',
            color: '#475569',
            textAlign: 'right',
            userSelect: 'none',
            borderRight: '1px solid #1e293b',
            marginRight: '1rem',
          }}
        >
          {value.code ?? ''}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}

interface Post {
  _id: string;
  title: string;
  description?: string;
  publishedAt?: string;
  _createdAt: string;
  mainImage?: any;
  body: any[];
  next?: { title: string; slug: { current: string } };
  previous?: { title: string; slug: { current: string } };
}

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // SEO Update
  useEffect(() => {
    if (post) {
      document.title = `${post.title} | WebPit Blog`;
      
      // Update meta description
      let metaDescription = document.querySelector('meta[name="description"]');
      const descText = post.description || "Read more about this article on the WebPit Blog.";
      
      if (metaDescription) {
        metaDescription.setAttribute('content', descText);
      } else {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        metaDescription.setAttribute('content', descText);
        document.head.appendChild(metaDescription);
      }
    }
    
    // Cleanup to reset title (optional but good practice)
    return () => {
      document.title = "WebPit - Free Online Image Converter";
    };
  }, [post]);

  useEffect(() => {
    setLoading(true);
    client
      .fetch(`{
        "post": *[_type == "post" && slug.current == $slug][0] {
          ...,
          "next": *[_type == "post" && _createdAt > ^._createdAt] | order(_createdAt asc)[0]{title, slug},
          "previous": *[_type == "post" && _createdAt < ^._createdAt] | order(_createdAt desc)[0]{title, slug}
        },
        "related": *[_type == "post" && slug.current != $slug] | order(_createdAt desc)[0...3] {
          _id, title, slug, mainImage, publishedAt, _createdAt, "rawExcerpt": pt::text(body)
        }
      }`, { slug })
      .then((data) => {
        setPost(data.post);
        setRelatedPosts(data.related || []);
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
      });
  }, [slug]);

  if (loading) return (
    <div className="max-w-[920px] mx-auto px-4 py-32 text-center">
       <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
       <p className="text-slate-500 font-medium">Loading article...</p>
    </div>
  );
  
  if (!post) return <div className="max-w-[920px] mx-auto px-4 py-24 text-center text-slate-500 font-medium font-sans">Article not found.</div>;

  return (
    <div className="bg-slate-50/50 min-h-screen">
      <article className="max-w-[920px] mx-auto px-4 sm:px-6 py-12 lg:py-20">
        <Link to="/blog" className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-blue-600 mb-10 transition-all bg-white border border-slate-200/60 hover:border-blue-200 px-5 py-2.5 rounded-full shadow-sm hover:shadow-md group">
          <svg className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to blog
        </Link>

        <header className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 mb-6 text-blue-600 font-bold tracking-widest uppercase text-xs">
            <span className="w-8 h-[2px] bg-blue-600"></span>
            {new Date(post.publishedAt || post._createdAt).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-12 leading-[1.1]">
            {post.title}
          </h1>
          {post.mainImage && (
            <div className="rounded-[2.5rem] overflow-hidden shadow-2xl mb-16 border border-white relative">
              <img
                src={urlFor(post.mainImage).width(1200).height(630).url()}
                alt={post.title}
                className="w-full object-cover aspect-video"
              />
            </div>
          )}
        </header>

        <div className="prose prose-lg prose-slate prose-blue prose-p:leading-[1.8] prose-li:leading-[1.8] max-w-none text-slate-700 bg-white p-8 md:p-12 lg:p-16 rounded-[2.5rem] border border-slate-200/50 shadow-sm mb-16">
          <PortableText 
            value={post.body} 
            components={{
              types: {
                image: ({ value }) => (
                  <div className="my-12 rounded-[2rem] overflow-hidden shadow-xl border border-slate-100 p-2 bg-slate-50">
                    <img src={urlFor(value).width(1200).url()} alt="Blog content" className="w-full rounded-[1.5rem]" />
                  </div>
                ),
                code: ({ value }) => <CodeBlock value={value} />,
              },
            }}
          />
        </div>

        {/* Next/Prev Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-12 border-t border-slate-200">
          {post.previous ? (
            <Link to={`/blog/${post.previous.slug.current}`} className="group p-8 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-200 transition-all">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                <svg className="w-3 h-3 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
                Previous
              </p>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">{post.previous.title}</h3>
            </Link>
          ) : <div />}
          
          {post.next && (
            <Link to={`/blog/${post.next.slug.current}`} className="group p-8 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-200 transition-all text-right">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2 justify-end">
                Next
                <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
              </p>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">{post.next.title}</h3>
            </Link>
          )}
        </div>
      </article>

      {/* Related Articles Section */}
      {relatedPosts.length > 0 && (
        <section className="bg-slate-100/50 py-20 border-t border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-12 text-center">Related Articles</h2>
            <div className="grid gap-8 md:grid-cols-3">
              {relatedPosts.map((rPost: any) => (
                <Link
                  key={rPost._id}
                  to={`/blog/${rPost.slug?.current}`}
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
