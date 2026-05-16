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
                Next steps
              </h2>
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm">1</div>
                <div>
                  <p className="font-semibold text-slate-900">Open the .dmg file</p>
                  <p className="text-sm text-slate-500 mt-0.5">Find WebPit.dmg in your Downloads folder and open it.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm">2</div>
                <div>
                  <p className="font-semibold text-slate-900">Drag to Applications</p>
                  <p className="text-sm text-slate-500 mt-0.5">Drag WebPit to your Applications folder to install.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm">3</div>
                <div>
                  <p className="font-semibold text-slate-900">Launch & enjoy</p>
                  <p className="text-sm text-slate-500 mt-0.5">Open WebPit from Applications and start converting.</p>
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
          <Link to="/" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
            Use the web tool
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
