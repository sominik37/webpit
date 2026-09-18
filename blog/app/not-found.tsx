import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="max-w-[920px] mx-auto px-4 sm:px-6 py-24 text-center">
      <p className="text-sm font-bold uppercase tracking-widest text-blue-600 mb-4">404</p>
      <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mb-4">
        Article not found
      </h1>
      <p className="text-slate-500 mb-10">
        The page you&apos;re looking for doesn&apos;t exist or may have been moved.
      </p>
      <Link
        href="/blog"
        className="inline-flex items-center text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 px-6 py-3 rounded-xl transition-colors"
      >
        Back to the blog
      </Link>
    </div>
  );
}
