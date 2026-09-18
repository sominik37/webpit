'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white/70 border-b border-slate-200/50 transition-all duration-300 sticky top-0 z-50 backdrop-blur-md">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <a
          href="/"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
        >
          <img
            src="/logo.webp"
            alt="WebPit Logo"
            width="160"
            height="48"
            className="h-12 w-auto object-contain"
            fetchPriority="high"
          />
        </a>
        {/* Desktop nav */}
        <div className="hidden sm:flex items-center gap-6">
          <Link href="/blog" className="text-sm font-medium text-slate-800 hover:text-blue-600 transition-colors">
            Blog
          </Link>
          <a href="/download" className="text-sm font-medium text-slate-800 hover:text-blue-600 transition-colors">
            Mac App
          </a>
          <a
            href="https://developers.google.com/speed/webp"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-slate-500 hover:text-slate-900 transition-colors"
          >
            About WebP
          </a>
        </div>
        {/* Mobile hamburger */}
        <button
          className="sm:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>
      {/* Mobile nav drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-slate-200/50 bg-white/95 backdrop-blur-md px-4 py-4 flex flex-col gap-1">
          <Link
            href="/blog"
            className="text-sm font-medium text-slate-800 hover:text-blue-600 hover:bg-slate-50 transition-colors px-3 py-2.5 rounded-xl"
            onClick={() => setMobileMenuOpen(false)}
          >
            Blog
          </Link>
          <a
            href="/download"
            className="text-sm font-medium text-slate-800 hover:text-blue-600 hover:bg-slate-50 transition-colors px-3 py-2.5 rounded-xl"
            onClick={() => setMobileMenuOpen(false)}
          >
            Mac App
          </a>
          <a
            href="https://developers.google.com/speed/webp"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors px-3 py-2.5 rounded-xl"
            onClick={() => setMobileMenuOpen(false)}
          >
            About WebP
          </a>
        </div>
      )}
    </header>
  );
}
