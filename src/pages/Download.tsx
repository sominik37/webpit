import React, { useState, useCallback } from 'react';
import { motion } from 'motion/react';
import {
  Download,
  Layers,
  Clipboard,
  MonitorCheck,
  FolderSync,
  FileType2,
  Zap,
  ArrowRight,
  Check,
} from 'lucide-react';
import { useSEO } from '../hooks/useSEO';
import { cn } from '../lib/utils';
import { getPaddle } from '../lib/paddle';

function AppleLogo({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.09997 22C7.78997 22.05 6.79997 20.68 5.95997 19.47C4.24997 17 2.93997 12.45 4.69997 9.39C5.56997 7.87 7.12997 6.91 8.81997 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z"/>
    </svg>
  );
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface Platform {
  id: string;
  label: string;
  icon: React.ReactNode;
  available: boolean;
  badge?: string;
  priceId: string;
  version?: string;
  requirement?: string;
}

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  /** Filename inside /public/images/ — supports .webp, .png, .gif, .mp4 */
  src?: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const PLATFORMS: Platform[] = [
  {
    id: 'mac',
    label: 'macOS',
    icon: <AppleLogo className="w-5 h-5" />,
    available: true,
    badge: 'Available now',
    priceId: 'pri_01kr0qv07fh1ek8cc64etfgbtg',
    version: '1.0.2',
    requirement: 'macOS 26 Tahoe or later · Apple Silicon',
  },
  // {
  //   id: 'windows',
  //   label: 'Windows',
  //   icon: (
  //     // Simple Windows logo using SVG paths
  //     <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
  //       <path d="M3 5.557L10.5 4.5v7H3V5.557zM11.5 4.357L21 3v8.5h-9.5V4.357zM3 12.5h7.5V19.5L3 18.443V12.5zM11.5 12.5H21V21l-9.5-1.357V12.5z" />
  //     </svg>
  //   ),
  //   available: false,
  //   badge: 'Coming soon',
  //   priceId: '',
  // },
  // {
  //   id: 'linux',
  //   label: 'Linux',
  //   icon: (
  //     <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
  //       <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" />
  //     </svg>
  //   ),
  //   available: false,
  //   badge: 'Coming soon',
  //   priceId: '',
  // },
];

const FEATURES: Feature[] = [
  {
    icon: <Layers className="w-6 h-6" />,
    title: 'Batch Processing',
    description:
      'Drop an entire folder and convert hundreds of images in one go. WebPit processes them in parallel using native macOS APIs — no browser tab, no memory limits.',
    src: '/images/batch-processing.mp4',
  },
  {
    icon: <Clipboard className="w-6 h-6" />,
    title: 'Clipboard Conversion',
    description:
      'Copy an image anywhere on your Mac, hit the global shortcut, and get an optimized WebP back in your clipboard instantly. No windows, no friction.',
    src: '/images/clipboard-conversion.mp4',
  },
  {
    icon: <MonitorCheck className="w-6 h-6" />,
    title: 'Menu Bar Agent',
    description:
      'WebPit lives quietly in your menu bar. Drag images onto the icon, check conversion stats, or trigger a batch — all without ever switching apps.',
    src: '/images/menubar-agent.mp4',
  },
  {
    icon: <FolderSync className="w-6 h-6" />,
    title: 'Watch Folders',
    description:
      'Point WebPit at a folder and it automatically converts every new image that lands there. Perfect for screenshot folders, design exports, or camera imports.',
    src: '/images/watch-folders.mp4',
  },
  {
    icon: <FileType2 className="w-6 h-6" />,
    title: 'Naming Rules',
    description:
      'Define exactly how output files are named using tokens like {name}, {date}, {quality}, and {ext}. Keep your file system organised without renaming anything manually.',
    src: '/images/naming-rules.webp',
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: 'Native Speed',
    description:
      'Built with Swift and native macOS image frameworks. Conversions are 10–20× faster than browser-based tools and run entirely offline — your images never leave your machine.',
    src: '/images/speed.webp',
  },
];

const WEB_VS_APP = [
  { feature: 'Batch processing', web: 'Limited', app: true },
  { feature: 'Watch folders', web: false, app: true },
  { feature: 'Menu bar access', web: false, app: true },
  { feature: 'Clipboard conversion', web: false, app: true },
  { feature: 'Custom naming rules', web: 'Basic', app: true },
  { feature: 'Works offline', web: false, app: true },
  { feature: 'Native speed', web: false, app: true },
  { feature: 'Free to use', web: true, app: false },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function ImagePlaceholder({ label, src }: { label: string; src?: string }) {
  if (src) {
    const isVideo = src.endsWith('.mp4') || src.endsWith('.webm') || src.endsWith('.mov');
    if (isVideo) {
      return (
        <video
          src={src}
          autoPlay
          loop
          muted
          playsInline
          className="w-full rounded-2xl"
        />
      );
    }
    return (
      <img
        src={src}
        alt={label}
        className="w-full rounded-2xl"
      />
    );
  }

  return (
    <div className="w-full aspect-video rounded-2xl bg-slate-100 border-2 border-dashed border-slate-300 flex flex-col items-center justify-center gap-3 text-slate-400">
      {/* Replace this entire div with your <img> or <video> */}
      <div className="w-12 h-12 rounded-xl bg-slate-200 flex items-center justify-center">
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      <p className="text-sm font-medium">{label} screenshot</p>
      <p className="text-xs opacity-60">Drop file in /public/images/</p>
    </div>
  );
}

function CheckIcon() {
  return (
    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-600">
      <Check className="w-3 h-3" strokeWidth={3} />
    </span>
  );
}

function CrossIcon() {
  return (
    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-100 text-slate-400">
      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
      </svg>
    </span>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DownloadPage() {
  const [activePlatform, setActivePlatform] = useState<string>('mac');
  const selected = PLATFORMS.find(p => p.id === activePlatform)!;

  const openCheckout = useCallback(async (priceId: string) => {
    const paddle = await getPaddle(async (transactionId) => {
      // Fetch the signed download URL immediately after payment
      try {
        const res = await fetch(`/api/download?transaction_id=${transactionId}`);
        const data = await res.json();
        if (data.url) {
          sessionStorage.setItem('webpit_download_url', data.url);
        }
      } catch {
        // Silently fail — success page has fallback
      }
      window.location.href = `${window.location.origin}/download/success?transaction_id=${transactionId}`;
    });

    paddle?.Checkout.open({
      items: [{ priceId, quantity: 1 }],
      // No successUrl — let eventCallback handle the redirect for all payment types
    });
  }, []);;

  useSEO({
    title: 'Download WebPit — Native App for macOS',
    description:
      'Get WebPit for your desktop. Batch processing, watch folders, menu bar agent, clipboard conversion and more — all running natively, offline, at full speed.',
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-slate-950 text-white">
        {/* Background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60rem] h-[30rem] bg-blue-600 opacity-10 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-24 pb-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-semibold mb-8">
              <Zap className="w-3.5 h-3.5" />
              Native Desktop App
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
              WebPit, now on your{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                desktop
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
              Everything you love about WebPit, plus watch folders, clipboard conversion,
              a menu bar agent, and native speed — all running OFFLINE on your machine.
              No uploads, completely local, images remain 100% private.
            </p>

            {/* Platform selector */}
            <div className="inline-flex items-center gap-2 p-1.5 bg-white/5 border border-white/10 rounded-2xl mb-10">
              {PLATFORMS.map(p => (
                <button
                  key={p.id}
                  onClick={() => setActivePlatform(p.id)}
                  className={cn(
                    'flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all',
                    activePlatform === p.id
                      ? 'bg-white text-slate-900 shadow-md'
                      : 'text-slate-400 hover:text-white'
                  )}
                >
                  {p.icon}
                  {p.label}
                  {p.badge && (
                    <span className={cn(
                      'text-[10px] font-bold px-1.5 py-0.5 rounded-md',
                      p.available
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-slate-500/20 text-slate-400'
                    )}>
                      {p.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* CTA */}
            <div className="flex flex-col items-center gap-3">
              <p className="text-slate-400 text-sm font-medium">One-time purchase · No subscription</p>
              {selected.available ? (
                <button
                  onClick={() => openCheckout(selected.priceId)}
                  className="inline-flex items-center gap-3 bg-white text-slate-900 font-bold px-8 py-4 rounded-2xl hover:bg-slate-100 transition-all hover:shadow-xl hover:scale-[1.02] text-base cursor-pointer"
                >
                  <Download className="w-5 h-5" />
                  Download for {selected.label} — $8.99
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  disabled
                  className="inline-flex items-center gap-3 bg-white/10 text-slate-400 font-bold px-8 py-4 rounded-2xl cursor-not-allowed text-base border border-white/10"
                >
                  <Download className="w-5 h-5" />
                  {selected.label} — Coming Soon
                </button>
              )}

              {selected.requirement && (
                <p className="text-slate-500 text-sm">{selected.requirement}</p>
              )}
            </div>
          </motion.div>
        </div>

        {/* Hero app screenshot placeholder */}
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 pb-0 -mb-1">
          <div className="w-full aspect-[16/9] rounded-t-3xl bg-slate-800 border border-white/10 border-b-0 flex flex-col items-center justify-center gap-4 text-slate-500 overflow-hidden">
            {/* Replace with hero app screenshot */}
            <img src="/hero.webp" alt="WebPit for Mac" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mb-4">
            Built for power users
          </h2>
          <p className="text-lg text-slate-500 max-w-xl mx-auto">
            The web tool is great for quick conversions. The desktop app is for when
            images are part of your actual workflow.
          </p>
        </div>

        <div className="space-y-24">
          {FEATURES.map((feature, i) => {
            const isEven = i % 2 === 0;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.5 }}
                className={cn(
                  'flex flex-col gap-10 items-center',
                  isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'
                )}
              >
                {/* Text */}
                <div className="flex-1 space-y-5">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-slate-900 text-white shadow-lg">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                    {feature.title}
                  </h3>
                  <p className="text-slate-500 text-lg leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* Image */}
                <div className="flex-1 w-full">
                  <ImagePlaceholder label={feature.title} src={feature.src} />
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── Web vs App comparison ── */}
      <section className="bg-white border-y border-slate-200/60 py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mb-4">
              Web tool vs Desktop app
            </h2>
            <p className="text-slate-500 text-lg">
              The web tool stays free, forever. The desktop app is for when you need more.
            </p>
          </div>

          <div className="overflow-hidden rounded-3xl border border-slate-200 shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="p-5 text-sm font-semibold text-slate-600 w-1/2">Feature</th>
                  <th className="p-5 text-sm font-semibold text-slate-600 text-center">Web (Free)</th>
                  <th className="p-5 text-sm font-semibold text-slate-900 text-center">Desktop App</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {WEB_VS_APP.map(row => (
                  <tr key={row.feature} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-5 text-sm font-medium text-slate-800">{row.feature}</td>
                    <td className="p-5 text-center">
                      {row.web === true ? (
                        <CheckIcon />
                      ) : row.web === false ? (
                        <CrossIcon />
                      ) : (
                        <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                          {row.web}
                        </span>
                      )}
                    </td>
                    <td className="p-5 text-center">
                      {row.app === true ? (
                        <CheckIcon />
                      ) : row.app === false ? (
                        <CrossIcon />
                      ) : (
                        <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                          {row.app}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="bg-slate-950 text-white py-24 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[40rem] h-[20rem] bg-blue-600 opacity-10 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
            Ready to speed up your workflow?
          </h2>
          <p className="text-slate-500 text-lg mb-10">
            One-time purchase. No subscription. Free updates.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => openCheckout(PLATFORMS.find(p => p.id === 'mac')!.priceId)}
              className="inline-flex items-center gap-3 bg-white text-slate-900 font-bold px-8 py-4 rounded-2xl hover:bg-slate-100 transition-all hover:shadow-xl hover:scale-[1.02] text-base w-full sm:w-auto justify-center cursor-pointer"
            >
              <AppleLogo className="w-5 h-5" />
              Download for macOS — $8.99
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {PLATFORMS.find(p => p.id === 'mac')?.requirement && (
            <p className="text-slate-600 text-sm mt-4">
              {PLATFORMS.find(p => p.id === 'mac')!.requirement}
            </p>
          )}
          <p className="text-slate-600 text-sm mt-3">
            Not satisfied?{' '}
            <a href="/refund" className="underline hover:text-slate-400 transition-colors">
              14-day money-back guarantee.
            </a>
          </p>
        </div>
      </section>

    </div>
  );
}
