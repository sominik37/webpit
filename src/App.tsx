import React, { Suspense, lazy } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { SpeedInsights } from "@vercel/speed-insights/react";

// Lazy load pages for performance optimization
const Home = lazy(() => import('./pages/Home'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));

// Simple loading fallback
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
  </div>
);

export default function App() {
  React.useEffect(() => {
    // Delay Google Analytics loading by 2 seconds to prioritize main content paint
    const timer = setTimeout(() => {
      const script1 = document.createElement('script');
      script1.async = true;
      script1.src = 'https://www.googletagmanager.com/gtag/js?id=G-86TZ4T7C8W';
      document.head.appendChild(script1);

      const script2 = document.createElement('script');
      script2.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-86TZ4T7C8W');
      `;
      document.head.appendChild(script2);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Header */}
      <header className="bg-white/70 backdrop-blur-lg border-b border-slate-200/50 sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <img 
              src="/logo.webp" 
              alt="WebPit Logo" 
              width="160" 
              height="48" 
              className="h-12 w-auto object-contain" 
              fetchpriority="high"
            />
          </Link>
          <div className="flex items-center gap-6">
            <Link to="/blog" className="text-sm font-medium text-slate-800 hover:text-blue-600 transition-colors hidden sm:block">
              Blog
            </Link>
            <a
              href="https://developers.google.com/speed/webp"
              target="_blank"
              rel="noreferrer"
              className="text-sm text-slate-500 hover:text-slate-900 transition-colors hidden sm:block"
            >
              About WebP
            </a>
          </div>
        </div>
      </header>

      <main className="flex-grow w-full">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home type="default" />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/png-to-webp" element={<Home type="png" />} />
            <Route path="/jpg-to-webp" element={<Home type="jpg" />} />
            <Route path="/jpeg-to-webp" element={<Home type="jpeg" />} />
            <Route path="/gif-to-webp" element={<Home type="gif" />} />
            <Route path="/compress-webp" element={<Home type="compress" />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
          </Routes>
        </Suspense>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200/50 py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col items-center space-y-8">
          {/* Product Hunt Embed Badge */}
          <div className="flex flex-wrap justify-center items-center gap-4 w-full">
            <a
              href="https://www.producthunt.com/products/webpit?embed=true&utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-webpit"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                alt="WebPit - Free, Instant WebP Conversion & Image Compress | Product Hunt"
                width="250"
                height="54"
                src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1091872&theme=light&t=1772870370632"
                className="h-[54px] w-auto hover:scale-105 transition-transform duration-300 shadow-sm rounded border border-slate-100"
                loading="lazy"
                decoding="async"
              />
            </a>
            <a
              href="https://rankinpublic.xyz/products/webpit.site"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="https://rankinpublic.xyz/api/badges/badge-featured.png?site=webpit.site"
                alt="Featured on RankInPublic"
                title="Featured on RankInPublic"
                width="250"
                height="80"
                className="h-[54px] w-auto hover:scale-105 transition-transform duration-300 shadow-sm rounded border border-slate-100"
                loading="lazy"
                decoding="async"
              />
            </a>
            <a
              href="https://startuups.com//projects/webpit"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="https://startuups.com//images/badges/startuupscom.badge.svg"
                alt="Featured on startuups"
                width="150"
                height="54"
                className="h-[54px] w-auto hover:scale-105 transition-transform duration-300 shadow-sm rounded border border-slate-100 bg-white"
                loading="lazy"
                decoding="async"
              />
            </a>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-6 w-full">
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <img 
                src="/logo.webp" 
                alt="WebPit Logo" 
                width="128" 
                height="40" 
                className="h-10 w-auto object-contain" 
                loading="lazy"
              />
            </Link>

            <p className="text-slate-500 text-sm">
              © {new Date().getFullYear()} WebPit. Processed locally for your privacy.
            </p>

            <div className="flex items-center gap-6">
              <Link to="/privacy" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">Privacy</Link>
              <Link to="/terms" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">Terms</Link>
              <a href="/sitemap.xml" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">Sitemap</a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="text-sm text-slate-400 hover:text-slate-900 transition-colors"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
      <SpeedInsights />
    </div>
  );
}
