import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Zap, Globe, Lock } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';
import { useJsonLd } from '../lib/seo';

export default function About() {
  useSEO({
    title: 'About WebPit — Private, Fast, WebP-First',
    description:
      'WebPit is a free, private image converter that turns JPG, PNG, GIF, and WebP into optimized WebP files entirely in your browser. Learn who we are and why we built it.',
  });

  useJsonLd(
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'WebPit',
      url: 'https://webpit.site/',
      logo: 'https://webpit.site/logo.webp',
      description:
        'WebPit is a free, private, browser-based image converter and compressor that converts JPG, PNG, GIF, and WebP to optimized WebP format entirely on-device.',
      founder: { '@type': 'Person', name: 'Usman hyder', url: 'https://github.com/sominik37' },
      sameAs: [
        'https://x.com/sominik37',
        'https://www.linkedin.com/in/usmanhyder37/',
        'https://www.reddit.com/user/stark37/',
        'https://www.producthunt.com/products/webpit',
      ],
    },
    'about-organization-jsonld'
  );

  const principles = [
    {
      icon: <Lock className="w-5 h-5" />,
      title: 'Private by design',
      text: 'Every conversion runs in your browser. Images are never uploaded, stored, or seen by any server — yours stay yours.',
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: 'Fast for everyone',
      text: 'Smaller images load faster, use less bandwidth, and rank better in search. That is the whole point of WebP.',
    },
    {
      icon: <Globe className="w-5 h-5" />,
      title: 'Free for the web',
      text: 'The web tool is free up to 20 files a day, forever. A one-time-purchase Mac app exists for heavy daily workflows.',
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: 'No accounts, no lock-in',
      text: 'No signup, no watermark, no data harvesting. Drag in, adjust quality, download your optimized images.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">About WebPit</h1>
        <p className="text-slate-500 text-lg max-w-2xl mx-auto">
          A tiny, private image optimizer built for people who care about page speed — and their data.
        </p>
      </div>

      <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-slate-200/50 shadow-sm prose prose-slate max-w-none text-slate-600 leading-relaxed">
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Why WebPit exists</h2>
          <p>
            Images are the biggest reason websites feel slow, and slow websites lose visitors — and rankings.
            Most online converters ask you to upload your photos to their server, which is slow, and frankly
            a little creepy for sensitive images. We wanted a converter that felt instant and was genuinely private.
          </p>
          <p>
            WebPit processes images entirely in your browser using the HTML5 Canvas API. Nothing is uploaded,
            nothing is tracked, and nothing is stored. You drag a file in, adjust a slider, and download an
            optimized WebP a moment later.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">What we believe</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 not-prose">
            {principles.map((p) => (
              <div key={p.title} className="flex gap-4 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                <div className="shrink-0 w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                  {p.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 text-lg">{p.title}</h3>
                  <p className="text-sm text-slate-500 mt-1 leading-relaxed">{p.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Who's behind it</h2>
          <p>
            WebPit is an independent project by{' '}
            <a
              href="https://github.com/sominik37"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Usman hyder
            </a>
            — no company, no investors, no VC pressure. Just a developer who got tired of bloated web tools.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Get started</h2>
          <div className="flex flex-col sm:flex-row items-center gap-3 not-prose">
            <Link
              to="/"
              className="inline-flex items-center justify-center bg-slate-900 text-white font-bold px-8 py-3.5 rounded-xl hover:bg-slate-800 transition-all"
            >
              Use the free web tool
            </Link>
            <Link
              to="/download"
              className="inline-flex items-center justify-center bg-white border border-slate-200 text-slate-700 font-bold px-8 py-3.5 rounded-xl hover:border-slate-300 transition-all"
            >
              Get the Mac App
            </Link>
            <Link
              to="/blog"
              className="inline-flex items-center justify-center bg-white border border-slate-200 text-slate-700 font-bold px-8 py-3.5 rounded-xl hover:border-slate-300 transition-all"
            >
              Read the blog
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
