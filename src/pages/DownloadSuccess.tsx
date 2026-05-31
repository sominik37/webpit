import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { CheckCircle, Download, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';

type Status = 'loading' | 'ready' | 'downloading' | 'error';

export default function DownloadSuccess() {
  const [searchParams] = useSearchParams();
  const transactionId = searchParams.get('transaction_id') 
    || searchParams.get('_ptxn') 
    || searchParams.get('ptxn')
    || searchParams.get('paddle_transaction_id');

  const [status, setStatus] = useState<Status>('loading');
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');

  useSEO({
    title: 'Thank You — WebPit for Desktop',
    description: 'Your purchase is confirmed. Your download is starting.',
  });

  useEffect(() => {
    // First check if we already have the URL from sessionStorage (set during checkout)
    const cachedUrl = sessionStorage.getItem('webpit_download_url');
    if (cachedUrl) {
      sessionStorage.removeItem('webpit_download_url');
      setDownloadUrl(cachedUrl);
      setStatus('ready');
      triggerDownload(cachedUrl);
      return;
    }

    // Fallback: fetch via transaction ID from URL
    if (!transactionId) {
      setErrorMsg('No transaction ID found. Please check your email for the download link.');
      setStatus('error');
      return;
    }

    // Retry up to 3 times — card payments may take a moment to process
    const attemptFetch = async (retries: number): Promise<void> => {
      try {
        const res = await fetch(`/api/download?transaction_id=${transactionId}`);
        const data = await res.json();
        if (data.url) {
          setDownloadUrl(data.url);
          setStatus('ready');
          triggerDownload(data.url);
        } else if (retries > 0) {
          await new Promise(r => setTimeout(r, 3000));
          return attemptFetch(retries - 1);
        } else {
          setErrorMsg(data.error || 'Could not generate download link.');
          setStatus('error');
        }
      } catch {
        if (retries > 0) {
          await new Promise(r => setTimeout(r, 3000));
          return attemptFetch(retries - 1);
        }
        setErrorMsg('Something went wrong. Please contact support.');
        setStatus('error');
      }
    };

    attemptFetch(3);
  }, [transactionId]);

  function triggerDownload(url: string) {
    setStatus('downloading');
    const link = document.createElement('a');
    link.href = url;
    link.download = 'WebPit.dmg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

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
          <div className={`w-20 h-20 rounded-full flex items-center justify-center ${
            status === 'error' ? 'bg-red-100' : 'bg-emerald-100'
          }`}>
            {status === 'loading' ? (
              <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" strokeWidth={1.5} />
            ) : status === 'error' ? (
              <AlertCircle className="w-10 h-10 text-red-500" strokeWidth={1.5} />
            ) : (
              <CheckCircle className="w-10 h-10 text-emerald-600" strokeWidth={1.5} />
            )}
          </div>
        </div>

        {/* Heading */}
        {status === 'loading' && (
          <>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-4">
              Preparing your download...
            </h1>
            <p className="text-lg text-slate-500">Verifying your payment, this may take a few seconds.</p>
          </>
        )}

        {(status === 'ready' || status === 'downloading') && (
          <>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mb-4">
              You're all set!
            </h1>
            <p className="text-lg text-slate-500 mb-8 leading-relaxed">
              Thanks for purchasing WebPit for Desktop. Your download should start automatically.
            </p>

            {/* Social share */}
            <div className="mb-8">
              <p className="text-sm font-medium text-slate-500 mb-3">Enjoying WebPit? Spread the word</p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                {/* X / Twitter */}
                <a
                  href="https://x.com/intent/tweet?text=Just%20picked%20up%20WebPit%20for%20Mac%20%E2%80%94%20native%20WebP%20converter%20with%20watch%20folders%2C%20clipboard%20conversion%20and%20menu%20bar%20access.%20Super%20fast%20%F0%9F%9A%80&url=https%3A%2F%2Fwebpit.site%2Fdownload"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Share on X"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-medium hover:bg-slate-700 transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  Share on X
                </a>
                {/* Reddit */}
                <a
                  href="https://www.reddit.com/submit?url=https%3A%2F%2Fwebpit.site%2Fdownload&title=WebPit%20for%20Mac%20%E2%80%94%20native%20WebP%20converter%20with%20watch%20folders%20%26%20clipboard%20conversion"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Share on Reddit"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500 text-white text-sm font-medium hover:bg-orange-600 transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
                  </svg>
                  Share on Reddit
                </a>
                {/* LinkedIn */}
                <a
                  href="https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Fwebpit.site%2Fdownload"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Share on LinkedIn"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0A66C2] text-white text-sm font-medium hover:bg-[#0958a8] transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  LinkedIn
                </a>
              </div>
            </div>

            {/* Manual download button in case auto-trigger didn't work */}
            {downloadUrl && (
              <button
                onClick={() => triggerDownload(downloadUrl)}
                className="inline-flex items-center gap-3 bg-slate-900 text-white font-bold px-8 py-4 rounded-2xl hover:bg-slate-800 transition-all hover:shadow-lg mb-8"
              >
                <Download className="w-5 h-5" />
                {status === 'downloading' ? 'Download Again' : 'Download WebPit.dmg'}
              </button>
            )}

            {/* Steps */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 mb-8 text-left space-y-6">
              <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                Installation steps
              </h2>
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm">1</div>
                <div>
                  <p className="font-semibold text-slate-900">Open the .dmg file</p>
                  <p className="text-sm text-slate-500 mt-0.5">Find <span className="font-mono bg-slate-100 px-1 rounded text-xs">WebPit.dmg</span> in your Downloads folder, open it, and drag WebPit to your Applications folder.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm">2</div>
                <div>
                  <p className="font-semibold text-slate-900">Try to open WebPit</p>
                  <p className="text-sm text-slate-500 mt-0.5">Double-click WebPit in Applications. macOS will show a Gatekeeper warning — click <span className="font-semibold text-slate-700">OK</span> to dismiss it.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm">3</div>
                <div>
                  <p className="font-semibold text-slate-900">Right-click → Open <span className="ml-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700 uppercase tracking-wide align-middle">Key step</span></p>
                  <p className="text-sm text-slate-500 mt-0.5"><span className="font-semibold text-slate-700">Right-click</span> (or Control-click) the WebPit icon in Applications and choose <span className="font-semibold text-slate-700">Open</span>. A new dialog appears with an <span className="font-semibold text-slate-700">Open</span> button — click it. You only need to do this once.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-8 h-8 rounded-xl bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-sm">4</div>
                <div>
                  <p className="font-semibold text-slate-900">Alternative: System Settings</p>
                  <p className="text-sm text-slate-500 mt-0.5">Or go to <span className="font-semibold text-slate-700">System Settings → Privacy &amp; Security</span> and click <span className="font-semibold text-slate-700">Open Anyway</span> next to the WebPit entry.</p>
                </div>
              </div>
            </div>
          </>
        )}

        {status === 'error' && (
          <>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-4">
              Something went wrong
            </h1>
            <p className="text-lg text-slate-500 mb-8">{errorMsg}</p>
            <a
              href="mailto:usman.hyder37@outlook.com"
              className="inline-flex items-center gap-2 bg-slate-900 text-white font-bold px-8 py-4 rounded-2xl hover:bg-slate-800 transition-all mb-8"
            >
              Contact Support
            </a>
          </>
        )}

        {/* Order reference */}
        {transactionId && (
          <p className="text-xs text-slate-400 font-mono mb-6">
            Order ref: {transactionId}
          </p>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to="/download" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Desktop App
          </Link>
          <span className="hidden sm:block text-slate-300">·</span>
          <Link to="/download/redownload" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
            Re-download later
          </Link>
          <span className="hidden sm:block text-slate-300">·</span>
          <Link to="/" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
            Use the web tool
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
