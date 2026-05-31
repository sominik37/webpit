import React, { Suspense, lazy, useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { SpeedInsights } from "@vercel/speed-insights/react";

// Lazy load pages for performance optimization
const Home = lazy(() => import('./pages/Home'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const Download = lazy(() => import('./pages/Download'));
const DownloadSuccess = lazy(() => import('./pages/DownloadSuccess'));
const Redownload = lazy(() => import('./pages/Redownload'));
const Refund = lazy(() => import('./pages/Refund'));

// Simple loading fallback
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
  </div>
);

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
      <header className="bg-white/70 border-b border-slate-200/50 transition-all duration-300 sticky top-0 z-50 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity" onClick={() => setMobileMenuOpen(false)}>
            <img 
              src="/logo.webp" 
              alt="WebPit Logo" 
              width="160" 
              height="48" 
              className="h-12 w-auto object-contain" 
              fetchpriority="high"
            />
          </Link>
          {/* Desktop nav */}
          <div className="hidden sm:flex items-center gap-6">
              <Link to="/blog" className="text-sm font-medium text-slate-800 hover:text-blue-600 transition-colors">
                Blog
              </Link>
              <Link to="/download" className="text-sm font-medium text-slate-800 hover:text-blue-600 transition-colors">
                Desktop App
              </Link>
              <a
                href="https://developers.google.com/speed/webp"
                target="_blank"
                rel="noreferrer"
                className="text-sm text-slate-500 hover:text-slate-900 transition-colors"
              >
                About WebP
              </a>
          </div>
          {/* Mobile hamburger */}
          <button
            className="sm:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
            onClick={() => setMobileMenuOpen(prev => !prev)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
        {/* Mobile nav drawer */}
        {mobileMenuOpen && (
          <div className="sm:hidden border-t border-slate-200/50 bg-white/95 backdrop-blur-md px-4 py-4 flex flex-col gap-1">
            <Link
              to="/blog"
              className="text-sm font-medium text-slate-800 hover:text-blue-600 hover:bg-slate-50 transition-colors px-3 py-2.5 rounded-xl"
              onClick={() => setMobileMenuOpen(false)}
            >
              Blog
            </Link>
            <Link
              to="/download"
              className="text-sm font-medium text-slate-800 hover:text-blue-600 hover:bg-slate-50 transition-colors px-3 py-2.5 rounded-xl"
              onClick={() => setMobileMenuOpen(false)}
            >
              Desktop App
            </Link>
            <a
              href="https://developers.google.com/speed/webp"
              target="_blank"
              rel="noreferrer"
              className="text-sm text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors px-3 py-2.5 rounded-xl"
              onClick={() => setMobileMenuOpen(false)}
            >
              About WebP
            </a>
          </div>
        )}
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
            <Route path="/download" element={<Download />} />
            <Route path="/download/success" element={<DownloadSuccess />} />
            <Route path="/download/redownload" element={<Redownload />} />
            <Route path="/refund" element={<Refund />} />
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

              <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
                <Link to="/privacy" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">Privacy</Link>
                <Link to="/terms" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">Terms</Link>
                <Link to="/refund" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">Refunds</Link>
                <a href="/sitemap.xml" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">Sitemap</a>
                {/* Social links */}
                <a
                  href="https://x.com/sominik37"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="X (Twitter)"
                  className="text-slate-400 hover:text-slate-900 transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a
                  href="https://www.reddit.com/user/stark37/"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Reddit"
                  className="text-slate-400 hover:text-slate-900 transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
                  </svg>
                </a>
                <a
                  href="https://www.linkedin.com/in/usmanhyder37/"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn"
                  className="text-slate-400 hover:text-slate-900 transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
      </footer>
      <SpeedInsights />
    </div>
  );
}
