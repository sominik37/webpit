import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Download, Mail, ArrowLeft, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function Redownload() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  useSEO({
    title: 'Re-download WebPit — Recover Your Purchase',
    description: 'Already purchased WebPit? Enter your order email to get a fresh download link.',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus('loading');
    setErrorMsg('');
    setDownloadUrl(null);

    try {
      const res = await fetch('/api/redownload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error ?? 'Something went wrong. Please try again.');
        setStatus('error');
        return;
      }

      setDownloadUrl(data.url);
      setStatus('success');

      // Trigger download automatically
      const link = document.createElement('a');
      link.href = data.url;
      link.download = 'WebPit.dmg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {
      setErrorMsg('Network error. Please check your connection and try again.');
      setStatus('error');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        {/* Back link */}
        <Link
          to="/download"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Desktop App
        </Link>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Header */}
          <div className="bg-slate-950 text-white px-8 pt-10 pb-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-blue-500 opacity-20 blur-3xl rounded-full pointer-events-none" />
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center mb-5">
                <Download className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight mb-2">
                Re-download WebPit
              </h1>
              <p className="text-slate-400 text-sm leading-relaxed">
                Enter the email address you used at checkout and we'll generate a fresh download link.
              </p>
            </div>
          </div>

          {/* Body */}
          <div className="px-8 py-8">
            {status !== 'success' ? (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-slate-700">
                    Order email address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {status === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-2xl text-sm text-red-700"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{errorMsg}</span>
                  </motion.div>
                )}

                <button
                  type="submit"
                  disabled={status === 'loading' || !email.trim()}
                  className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white font-bold py-3.5 rounded-2xl hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-lg text-sm"
                >
                  {status === 'loading' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Looking up your order...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      Get Download Link
                    </>
                  )}
                </button>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-5"
              >
                <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-sm text-emerald-800">
                  <CheckCircle className="w-5 h-5 shrink-0 text-emerald-600" />
                  <span>Purchase verified. Your download should start automatically.</span>
                </div>

                {downloadUrl && (
                  <a
                    href={downloadUrl}
                    download="WebPit.dmg"
                    className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white font-bold py-3.5 rounded-2xl hover:bg-slate-800 transition-all hover:shadow-lg text-sm"
                  >
                    <Download className="w-4 h-4" />
                    Download WebPit.dmg
                  </a>
                )}

                <p className="text-xs text-slate-400 text-center">
                  This link expires in 15 minutes. Come back here to generate a new one anytime.
                </p>

                <button
                  onClick={() => {
                    setStatus('idle');
                    setEmail('');
                    setDownloadUrl(null);
                  }}
                  className="w-full text-sm text-slate-400 hover:text-slate-600 transition-colors py-1"
                >
                  Use a different email
                </button>
              </motion.div>
            )}
          </div>
        </div>

        {/* Help text */}
        <p className="text-center text-sm text-slate-400 mt-6">
          Can't find your order email?{' '}
          <a
            href="mailto:usman.hyder37@outlook.com"
            className="text-slate-600 hover:text-slate-900 underline underline-offset-2 transition-colors"
          >
            Contact support
          </a>
        </p>
      </motion.div>
    </div>
  );
}
