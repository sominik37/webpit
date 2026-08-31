import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSEO } from '../hooks/useSEO';

export default function NotFound() {
  useSEO({
    title: 'Page Not Found | WebPit',
    description: 'The page you are looking for does not exist. Return to the WebPit home page.',
  });

  useEffect(() => {
    const meta = document.querySelector('meta[name="robots"]');
    if (meta) meta.setAttribute('content', 'noindex, follow');
  }, []);

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-slate-50 px-4">
      <div className="text-center">
        <p className="text-6xl font-extrabold text-slate-200">404</p>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-4 mb-3">
          This page doesn&apos;t exist
        </h1>
        <p className="text-slate-500 text-lg mb-8">
          The link may be broken, or the page may have been moved.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center justify-center bg-slate-900 text-white font-bold px-8 py-3.5 rounded-xl hover:bg-slate-800 transition-all"
          >
            Back to WebPit
          </Link>
          <Link
            to="/download"
            className="inline-flex items-center justify-center bg-white border border-slate-200 text-slate-700 font-bold px-8 py-3.5 rounded-xl hover:border-slate-300 transition-all"
          >
            Get the Mac App
          </Link>
        </div>
      </div>
    </div>
  );
}
