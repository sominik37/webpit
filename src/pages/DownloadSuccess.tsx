import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { CheckCircle, Download, Mail, ArrowLeft, Apple } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';

export default function DownloadSuccess() {
  const [searchParams] = useSearchParams();
  const checkoutId = searchParams.get('checkout_id');

  useSEO({
    title: 'Thank You — WebPit for Desktop',
    description: 'Your purchase is confirmed. Check your email for the download link.',
  });

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg text-center"
      >
        {/* Icon */}
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-emerald-600" strokeWidth={1.5} />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mb-4">
          You're all set!
        </h1>
        <p className="text-lg text-slate-500 mb-10 leading-relaxed">
          Thanks for purchasing WebPit for Desktop. Check your inbox — Polar has sent you
          a confirmation email with your download link.
        </p>

        {/* Steps */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 mb-8 text-left space-y-6">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
            Next steps
          </h2>

          <div className="flex items-start gap-4">
            <div className="shrink-0 w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
              1
            </div>
            <div>
              <p className="font-semibold text-slate-900">Check your email</p>
              <p className="text-sm text-slate-500 mt-0.5">
                Polar sent a receipt with your download link. Check your spam folder if
                you don't see it within a minute.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="shrink-0 w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
              2
            </div>
            <div>
              <p className="font-semibold text-slate-900">Download the app</p>
              <p className="text-sm text-slate-500 mt-0.5">
                Click the download link in your email to get the <code className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded">.dmg</code> file.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="shrink-0 w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
              3
            </div>
            <div>
              <p className="font-semibold text-slate-900">Install & enjoy</p>
              <p className="text-sm text-slate-500 mt-0.5">
                Open the <code className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded">.dmg</code>, drag WebPit to your Applications folder, and you're done.
              </p>
            </div>
          </div>
        </div>

        {/* Order reference */}
        {checkoutId && (
          <p className="text-xs text-slate-400 font-mono mb-8">
            Order ref: {checkoutId}
          </p>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/download"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Desktop App
          </Link>
          <span className="hidden sm:block text-slate-300">·</span>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
          >
            Use the web tool
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
