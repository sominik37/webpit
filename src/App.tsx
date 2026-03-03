import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { SpeedInsights } from "@vercel/speed-insights/react";
import Home from './pages/Home';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';

export default function App() {
  return (
    <div className="min-h-screen bg-[#F5F5F5] text-gray-900 font-sans flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white">
              <Sparkles className="w-5 h-5" />
            </div>
            <h1 className="font-semibold text-lg tracking-tight">WebPit</h1>
          </Link>
          <div className="flex items-center gap-4">
            <a
              href="https://developers.google.com/speed/webp"
              target="_blank"
              rel="noreferrer"
              className="text-sm text-gray-500 hover:text-black transition-colors hidden sm:block"
            >
              About WebP
            </a>
          </div>
        </div>
      </header>

      <main className="flex-grow w-full">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-black rounded flex items-center justify-center text-white">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <span className="font-semibold text-sm tracking-tight">WebPit</span>
            </div>

            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} WebPit. Processed locally for your privacy.
            </p>

            <div className="flex items-center gap-6">
              <Link to="/privacy" className="text-sm text-gray-500 hover:text-black transition-colors">Privacy</Link>
              <Link to="/terms" className="text-sm text-gray-500 hover:text-black transition-colors">Terms</Link>
              <a href="/sitemap.xml" className="text-sm text-gray-500 hover:text-black transition-colors">Sitemap</a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="text-sm text-gray-400 hover:text-black transition-colors"
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
