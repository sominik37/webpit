import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Download,
  Layers,
  Clipboard,
  MonitorCheck,
  FolderSync,
  FileType2,
  Zap,
  Apple,
  ArrowRight,
  Check,
  Star,
} from 'lucide-react';
import { useSEO } from '../hooks/useSEO';
import { cn } from '../lib/utils';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Platform {
  id: string;
  label: string;
  icon: React.ReactNode;
  available: boolean;
  badge?: string;
  polarUrl: string;
  version?: string;
  requirement?: string;
}

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  /** Replace with <img> once you have the real screenshot/demo */
  imagePlaceholder: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const PLATFORMS: Platform[] = [
  {
    id: 'mac',
    label: 'macOS',
    icon: <Apple className="w-5 h-5" />,
    available: true,
    badge: 'Available now',
    polarUrl: 'https://buy.polar.sh/polar_cl_s20KA3nlF9vcFcDjYlTxITkKRPQs1M1ONmqNw1IL4YR', // ← replace
    version: '1.0.2',
    requirement: 'macOS 26 Tahoe or later · Apple Silicon',
  },
  {
    id: 'windows',
    label: 'Windows',
    icon: (
      // Simple Windows logo using SVG paths
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3 5.557L10.5 4.5v7H3V5.557zM11.5 4.357L21 3v8.5h-9.5V4.357zM3 12.5h7.5V19.5L3 18.443V12.5zM11.5 12.5H21V21l-9.5-1.357V12.5z" />
      </svg>
    ),
    available: false,
    badge: 'Coming soon',
    polarUrl: '#',
  },
  {
    id: 'linux',
    label: 'Linux',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" />
      </svg>
    ),
    available: false,
    badge: 'Coming soon',
    polarUrl: '#',
  },
];

const FEATURES: Feature[] = [
  {
    icon: <Layers className="w-6 h-6" />,
    title: 'Batch Processing',
    description:
      'Drop an entire folder and convert hundreds of images in one go. WebPit processes them in parallel using native macOS APIs — no browser tab, no memory limits.',
    imagePlaceholder: 'batch-processing',
  },
  {
    icon: <Clipboard className="w-6 h-6" />,
    title: 'Clipboard Conversion',
    description:
      'Copy an image anywhere on your Mac, hit the global shortcut, and get an optimized WebP back in your clipboard instantly. No windows, no friction.',
    imagePlaceholder: 'clipboard-conversion',
  },
  {
    icon: <MonitorCheck className="w-6 h-6" />,
    title: 'Menu Bar Agent',
    description:
      'WebPit lives quietly in your menu bar. Drag images onto the icon, check conversion stats, or trigger a batch — all without ever switching apps.',
    imagePlaceholder: 'menubar-agent',
  },
  {
    icon: <FolderSync className="w-6 h-6" />,
    title: 'Watch Folders',
    description:
      'Point WebPit at a folder and it automatically converts every new image that lands there. Perfect for screenshot folders, design exports, or camera imports.',
    imagePlaceholder: 'watch-folders',
  },
  {
    icon: <FileType2 className="w-6 h-6" />,
    title: 'Naming Rules',
    description:
      'Define exactly how output files are named using tokens like {name}, {date}, {quality}, and {ext}. Keep your file system organised without renaming anything manually.',
    imagePlaceholder: 'naming-rules',
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: 'Native Speed',
    description:
      'Built with Swift and native macOS image frameworks. Conversions are 10–20× faster than browser-based tools and run entirely offline — your images never leave your machine.',
    imagePlaceholder: 'native-speed',
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

function ImagePlaceholder({ label }: { label: string }) {
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
      <p className="text-xs opacity-60">Replace with actual image</p>
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
              a menu bar agent, and native speed — all running offline on your machine.
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
                <a
                  href={selected.polarUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-white text-slate-900 font-bold px-8 py-4 rounded-2xl hover:bg-slate-100 transition-all hover:shadow-xl hover:scale-[1.02] text-base"
                >
                  <Download className="w-5 h-5" />
                  Download for {selected.label} — $8.99
                  <ArrowRight className="w-4 h-4" />
                </a>
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
            <div className="w-16 h-16 rounded-2xl bg-slate-700 flex items-center justify-center">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-sm font-medium">Hero app screenshot</p>
            <p className="text-xs opacity-50">Replace with actual screenshot</p>
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
                  <ImagePlaceholder label={feature.title} />
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
            <a
              href={PLATFORMS.find(p => p.id === 'mac')!.polarUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-white text-slate-900 font-bold px-8 py-4 rounded-2xl hover:bg-slate-100 transition-all hover:shadow-xl hover:scale-[1.02] text-base w-full sm:w-auto justify-center"
            >
              <Apple className="w-5 h-5" />
              Download for macOS — $8.99
              <ArrowRight className="w-4 h-4" />
            </a>
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
