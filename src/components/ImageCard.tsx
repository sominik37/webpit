import React, { useEffect, useState } from 'react';
import { Check, Download, Loader2, X, ArrowRight, Image as ImageIcon } from 'lucide-react';
import { formatBytes, cn } from '@/src/lib/utils';
import { Button } from './ui/button';
import { motion } from 'motion/react';

export interface ProcessedImage {
  id: string;
  originalFile: File;
  previewUrl: string;
  status: 'pending' | 'processing' | 'done' | 'error';
  resultBlob?: Blob;
  resultUrl?: string;
  error?: string;
  originalSize: number;
  processedSize?: number;
  quality: number;
  isOriginalKept?: boolean;
}

interface ImageCardProps {
  item: ProcessedImage;
  onRemove: (id: string) => void;
  onDownload: (item: ProcessedImage) => void;
}

export const ImageCard: React.FC<ImageCardProps> = ({ item, onRemove, onDownload }) => {
  const savings = item.processedSize
    ? Math.round(((item.originalSize - item.processedSize) / item.originalSize) * 100)
    : 0;

  const isPositiveSavings = savings > 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200 hover:shadow-md transition-shadow flex flex-col sm:flex-row items-center gap-5 group"
    >
      {/* Preview */}
      <div className="relative w-full sm:w-24 h-24 shrink-0 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/60">
        <img
          src={item.previewUrl}
          alt="Preview"
          className="w-full h-full object-cover"
        />
        {item.status === 'processing' && (
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center backdrop-blur-[1px]">
            <Loader2 className="w-6 h-6 text-white animate-spin" />
          </div>
        )}
        {item.status === 'error' && (
          <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center backdrop-blur-[1px]">
            <X className="w-6 h-6 text-white" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 w-full text-center sm:text-left">
        <h4 className="font-medium text-slate-900 truncate text-lg" title={item.originalFile.name}>
          {item.originalFile.name}
        </h4>
        <div className="flex items-center justify-center sm:justify-start gap-2 text-sm text-slate-500 mt-1">
          <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-xs">{formatBytes(item.originalSize)}</span>
          <ArrowRight className="w-3 h-3 text-slate-400" />
          {item.status === 'done' && item.processedSize ? (
            <span className="font-mono font-medium text-slate-800 bg-emerald-50 px-1.5 py-0.5 rounded text-xs border border-emerald-100">
              {formatBytes(item.processedSize)}
            </span>
          ) : (
            <span className="text-slate-400">...</span>
          )}
        </div>

        {item.status === 'done' && (
          <div className={cn(
            "inline-flex items-center gap-1 text-xs font-medium mt-2 px-2 py-0.5 rounded-full",
            item.isOriginalKept ? "bg-blue-100 text-blue-700" : (isPositiveSavings ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700")
          )}>
            {item.isOriginalKept ? (
              <>
                <Check className="w-3 h-3" />
                Kept Original (0%)
              </>
            ) : isPositiveSavings ? (
              <>
                <Check className="w-3 h-3" />
                Saved {savings}%
              </>
            ) : (
              <>
                Larger by {Math.abs(savings)}%
              </>
            )}
          </div>
        )}

        {item.status === 'error' && (
          <p className="text-xs text-red-500 mt-1">{item.error || 'Conversion failed'}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 w-full sm:w-auto mt-4 sm:mt-0">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onRemove(item.id)}
          className="text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
          title="Remove"
        >
          <X className="w-4 h-4" />
        </Button>

        <Button
          onClick={() => onDownload(item)}
          disabled={item.status !== 'done'}
          className={cn(
            "flex-1 sm:flex-none gap-2 rounded-xl transition-all",
            item.status === 'done' 
              ? "bg-slate-900 text-white hover:bg-slate-800 hover:shadow-md" 
              : "bg-slate-100 text-slate-400"
          )}
        >
          <Download className="w-4 h-4" />
          <span className="sm:hidden">Download</span>
        </Button>
      </div>
    </motion.div>
  );
}
