import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X, Zap, FolderSync, Clipboard, MonitorCheck, ArrowRight } from 'lucide-react';

interface MacAppPromoModalProps {
  open: boolean;
  onClose: () => void;
}

const PERKS = [
  { icon: <Zap className="w-4 h-4" />, text: 'Unlimited conversions — no daily cap' },
  { icon: <FolderSync className="w-4 h-4" />, text: 'Watch folders — auto-convert on save' },
  { icon: <Clipboard className="w-4 h-4" />, text: 'Clipboard conversion with a global shortcut' },
  { icon: <MonitorCheck className="w-4 h-4" />, text: 'Menu bar agent — always one click away' },
];

export function MacAppPromoModal({ open, onClose }: MacAppPromoModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors z-10"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Dark header */}
            <div className="bg-slate-950 text-white px-8 pt-10 pb-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-blue-500 opacity-20 blur-3xl rounded-full pointer-events-none" />
              <div className="relative z-10">
                {/* Apple icon */}
                <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center mb-5">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-extrabold tracking-tight mb-2">
                  You've hit today's limit
                </h2>
                <p className="text-slate-400 text-sm leading-relaxed">
                  The web tool is free for up to <span className="text-white font-semibold">20 files per day</span>.
                  Get the Mac app for unlimited conversions and a whole lot more.
                </p>
              </div>
            </div>

            {/* Perks list */}
            <div className="px-8 py-6 space-y-3">
              {PERKS.map((perk) => (
                <div key={perk.text} className="flex items-center gap-3 text-sm text-slate-700">
                  <span className="shrink-0 w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                    {perk.icon}
                  </span>
                  {perk.text}
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="px-8 pb-8 space-y-3">
              <Link
                to="/download"
                onClick={onClose}
                className="flex items-center justify-center gap-2 w-full bg-slate-900 text-white font-bold py-3.5 rounded-2xl hover:bg-slate-800 transition-all hover:shadow-lg text-sm"
              >
                Get WebPit for Mac — $8.99
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                onClick={onClose}
                className="w-full text-sm text-slate-400 hover:text-slate-600 transition-colors py-1"
              >
                Continue tomorrow (limit resets at midnight)
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
