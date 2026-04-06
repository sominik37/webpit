import React, { useState, useCallback } from 'react';
import { Dropzone } from '../components/Dropzone';
import { ImageCard, type ProcessedImage } from '../components/ImageCard';
import { Slider } from '../components/ui/slider';
import { Button } from '../components/ui/button';
import { Download, Trash2, Settings2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { formatBytes } from '../lib/utils';

import { useSEO } from '../hooks/useSEO';

// Declare gtag for TypeScript
declare global {
  interface Window {
    gtag: (command: string, action: string, params?: any) => void;
  }
}

export default function Home({ type = 'default' }: { type?: string }) {
  const [images, setImages] = useState<ProcessedImage[]>([]);
  const [quality, setQuality] = useState(80);
  const [isProcessing, setIsProcessing] = useState(false);

  const seoData = {
    default: {
      title: "WebPit | Fast, Private & Free WebP Image Converter",
      description: "Convert JPG and PNG to WebP instantly. 100% client-side processing means your images never leave your browser. No signups, no limits, just speed.",
      heading: "How to Convert and Compress Your Images",
      contentDesc: "Using WebPit is as easy as \"Drag, Slide, and Save.\" You don’t need to be a tech expert to get professional results.",
      uploadDesc: "Drag and drop your JPG, PNG, or GIF files directly into the box above. You can even upload multiple images at once!"
    },
    png: {
      title: "Convert PNG to WebP Free | Maintain Transparency",
      description: "Fastest way to convert PNG to WebP with transparent backgrounds. Shrink file sizes up to 80% with no loss in visual quality. 100% free and private.",
      heading: "Easily Convert PNG to WebP in Seconds",
      contentDesc: "Looking to save space while keeping transparent backgrounds? WebPit converts your transparent PNGs to much smaller WebP files instantly.",
      uploadDesc: "Drag and drop your PNG files directly into the box above. WebPit preserves alpha transparency perfectly."
    },
    jpg: {
      title: "Convert JPG to WebP Free | Shrink Image Sizes Instantly",
      description: "Convert your heavy JPG images to fast-loading WebP format. Improve your website speed and SEO rankings today without slow servers.",
      heading: "Convert JPG to WebP for Faster Load Times",
      contentDesc: "WebPit takes your heavy JPG files and shrinks them to WebP format, offering immense file size savings while maintaining crisp details.",
      uploadDesc: "Drag and drop your JPG images directly into the box above to start saving space instantly."
    },
    jpeg: {
      title: "Convert JPEG to WebP Free | Optimize for Web",
      description: "Optimize JPEG photos to WebP exactly in your browser. Dramatically reduce file size for your website without losing perceptible quality.",
      heading: "Shrink JPEG to WebP Images Quickly",
      contentDesc: "Fast websites rank higher on Google. Convert your JPEGs to the modern WebP format securely in your browser to boost performance.",
      uploadDesc: "Drag and drop your JPEG photos directly into the box above."
    },
    gif: {
      title: "Convert GIF to Static WebP | Compress Heavy Frames",
      description: "Turn heavy GIFs into optimized WebP formats in seconds. Fully private browser-based conversion. Save bandwidth today.",
      heading: "Optimize GIF to WebP Quickly",
      contentDesc: "Turn those bulky GIFs into highly optimized WebP files instantly for much better loading performance.",
      uploadDesc: "Drag and drop your GIF files directly into the box above."
    },
    compress: {
      title: "Compress WebP Images | Advanced WebP Optimizer",
      description: "Compress and optimize your existing WebP images even further. Fine-tune image quality for the absolute best performance on the web.",
      heading: "Compress WebP for Ultimate Performance",
      contentDesc: "Need to squeeze every last byte out of your images? Use our advanced sliders to compress standard image files or existing WebP formats without quality loss.",
      uploadDesc: "Drag and drop your images to compress them directly in your browser."
    }
  };

  const currentSEO = seoData[type as keyof typeof seoData] || seoData.default;
  useSEO({ title: currentSEO.title, description: currentSEO.description });

  // Process a single image
  const processImage = async (img: ProcessedImage, targetQuality: number) => {
    return new Promise<ProcessedImage>((resolve) => {
      const image = new Image();
      image.src = img.previewUrl;

      image.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve({ ...img, status: 'error', error: 'Canvas context failed' });
          return;
        }

        ctx.drawImage(image, 0, 0);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve({ ...img, status: 'error', error: 'Conversion failed' });
              return;
            }

            if (blob.size >= img.originalSize) {
              resolve({
                ...img,
                status: 'done',
                resultBlob: img.originalFile,
                resultUrl: img.previewUrl,
                processedSize: img.originalSize,
                quality: targetQuality,
                isOriginalKept: true
              });
              return;
            }

            const resultUrl = URL.createObjectURL(blob);
            resolve({
              ...img,
              status: 'done',
              resultBlob: blob,
              resultUrl,
              processedSize: blob.size,
              quality: targetQuality,
              isOriginalKept: false
            });
          },
          'image/webp',
          targetQuality / 100
        );
      };

      image.onerror = () => {
        resolve({ ...img, status: 'error', error: 'Failed to load image' });
      };
    });
  };

  const handleFilesDrop = useCallback((files: File[]) => {
    const newImages: ProcessedImage[] = files.map(file => ({
      id: Math.random().toString(36).substring(7),
      originalFile: file,
      previewUrl: URL.createObjectURL(file),
      status: 'pending',
      originalSize: file.size,
      quality: quality
    }));

    setImages(prev => [...prev, ...newImages]);

    newImages.forEach(img => {
      setTimeout(async () => {
        setImages(current =>
          current.map(i => i.id === img.id ? { ...i, status: 'processing' } : i)
        );

        const result = await processImage(img, quality);

        if (result.status === 'done') {
          console.log('📊 GA Event: image_converted', result.originalFile.name);
          window.gtag?.('event', 'image_converted', {
            'event_category': 'conversion',
            'event_label': result.originalFile.name,
            'is_original_kept': result.isOriginalKept,
            'quality': quality
          });
        }

        setImages(current =>
          current.map(i => i.id === img.id ? result : i)
        );
      }, 100);
    });
  }, [quality]);

  const handleRemove = (id: string) => {
    setImages(prev => {
      const img = prev.find(i => i.id === id);
      if (img?.previewUrl) URL.revokeObjectURL(img.previewUrl);
      if (img?.resultUrl) URL.revokeObjectURL(img.resultUrl);
      return prev.filter(i => i.id !== id);
    });
  };

  const handleDownload = (item: ProcessedImage) => {
    if (!item.resultUrl) return;

    const link = document.createElement('a');
    link.href = item.resultUrl;

    if (item.isOriginalKept) {
      link.download = item.originalFile.name;
    } else {
      const originalName = item.originalFile.name.replace(/\.[^/.]+$/, "");
      link.download = `${originalName}.webp`;
    }

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadAll = async () => {
    const doneImages = images.filter(img => img.status === 'done' && img.resultBlob);
    if (doneImages.length === 0) return;

    const JSZip = (await import('jszip')).default;
    const zip = new JSZip();
    doneImages.forEach((img) => {
      if (img.isOriginalKept) {
        zip.file(img.originalFile.name, img.resultBlob!);
      } else {
        const originalName = img.originalFile.name.replace(/\.[^/.]+$/, "");
        zip.file(`${originalName}.webp`, img.resultBlob!);
      }
    });

    const content = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(content);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'webpit-optimized-images.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleQualityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuality(Number(e.target.value));
  };

  const handleReprocessAll = () => {
    if (images.length === 0) return;

    setIsProcessing(true);

    const promises = images.map(async (img) => {
      setImages(current =>
        current.map(i => i.id === img.id ? { ...i, status: 'processing' } : i)
      );
      return processImage({ ...img, resultBlob: undefined, resultUrl: undefined }, quality);
    });

    Promise.all(promises).then(results => {
      const successfulConversions = results.filter(r => r.status === 'done');
        if (successfulConversions.length > 0) {
          console.log('📊 GA Event: batch_reprocess', successfulConversions.length);
          window.gtag?.('event', 'batch_reprocess', {
            'event_category': 'conversion',
            'count': successfulConversions.length,
            'quality': quality
          });

          // Also fire individual events for each image in the batch
          successfulConversions.forEach(result => {
            window.gtag?.('event', 'image_converted', {
              'event_category': 'conversion',
              'event_label': result.originalFile.name,
              'is_original_kept': result.isOriginalKept,
              'quality': quality
            });
          });
        }

      setImages(results);
      setIsProcessing(false);
    });
  };

  const totalOriginalSize = images.reduce((acc, img) => acc + img.originalSize, 0);
  const totalProcessedSize = images.reduce((acc, img) => acc + (img.processedSize || 0), 0);
  const totalSavings = totalOriginalSize > 0 && totalProcessedSize > 0
    ? Math.round(((totalOriginalSize - totalProcessedSize) / totalOriginalSize) * 100)
    : 0;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Controls & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Settings Card */}
        <div className="md:col-span-2 bg-white rounded-3xl p-8 shadow-[0_2px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-200/60 transition-all hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)]">
          <div className="flex items-center gap-2 mb-6">
            <Settings2 className="w-5 h-5 text-blue-600" />
            <h2 className="font-semibold text-slate-900">Optimization Settings</h2>
          </div>

          <div className="space-y-6">
            <Slider
              label="Quality"
              value={quality}
              min={1}
              max={100}
              step={1}
              onChange={handleQualityChange}
              onMouseUp={handleReprocessAll}
              onTouchEnd={handleReprocessAll}
              valueDisplay={`${quality}%`}
            />
            <p className="text-sm text-slate-500 pt-2">
              Lower quality results in smaller file sizes but may reduce image fidelity.
              80% is recommended for a good balance.
            </p>
          </div>
        </div>

        {/* Stats Card */}
        <div className="bg-slate-950 text-white rounded-3xl p-8 shadow-xl flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="font-medium text-slate-300">Total Savings</h2>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-4xl font-light tracking-tight">
                {images.length > 0 && totalProcessedSize > 0 ? `${totalSavings}%` : '0%'}
              </span>
            </div>
          </div>

          <div className="mt-8 space-y-2 relative z-10">
            <div className="flex justify-between text-sm text-slate-400">
              <span>Original</span>
              <span className="font-mono text-slate-300">{formatBytes(totalOriginalSize)}</span>
            </div>
            <div className="flex justify-between text-sm text-white font-medium border-t border-slate-800 pt-2">
              <span>Optimized</span>
              <span className="font-mono text-green-400">{formatBytes(totalProcessedSize)}</span>
            </div>
          </div>
          {/* Subtle background glow effect using pure CSS */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-blue-500 opacity-20 blur-3xl rounded-full"></div>
        </div>
      </div>

      {/* Upload Area */}
      <Dropzone onFilesDrop={handleFilesDrop} />

      {/* Image List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-slate-900 text-lg">
            Processed Images ({images.length})
          </h3>
          {images.length > 0 && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadAll}
                disabled={!images.some(img => img.status === 'done')}
                className="bg-white"
              >
                <Download className="w-4 h-4 mr-2" />
                Download All (.zip)
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setImages([])}
                className="text-red-500 hover:text-red-600 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            </div>
          )}
        </div>

        <AnimatePresence mode="popLayout">
          {images.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 text-slate-400 border border-dashed border-slate-200 rounded-3xl bg-slate-50/50"
            >
              <p>No images added yet.</p>
            </motion.div>
          ) : (
            images.map(img => (
              <ImageCard
                key={img.id}
                item={img}
                onRemove={handleRemove}
                onDownload={handleDownload}
              />
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Informational Content Section */}
      <div className="mt-20 space-y-16 border-t border-slate-200/60 pt-20 text-slate-800">
        {/* How to Guide */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">{currentSEO.heading}</h2>
          <p className="text-lg text-slate-600 max-w-2xl">
            {currentSEO.contentDesc}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
            <div className="space-y-4 p-8 bg-white rounded-3xl border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-bold text-lg shadow-inner">1</div>
              <h3 className="font-semibold text-xl text-slate-900">Upload Your Photos</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{currentSEO.uploadDesc}</p>
            </div>
            <div className="space-y-4 p-8 bg-white rounded-3xl border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-bold text-lg shadow-inner">2</div>
              <h3 className="font-semibold text-xl text-slate-900">Adjust the Quality</h3>
              <p className="text-sm text-slate-500 leading-relaxed">Use the "Quality" slider to choose how much you want to shrink the file. 80% is the sweet spot—it makes the file much smaller while keeping the image looking sharp.</p>
            </div>
            <div className="space-y-4 p-8 bg-white rounded-3xl border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-bold text-lg shadow-inner">3</div>
              <h3 className="font-semibold text-xl text-slate-900">Download & Use</h3>
              <p className="text-sm text-slate-500 leading-relaxed">Once processed, your new WebP images are ready. Download them instantly to use on your website, blog, or store.</p>
            </div>
          </div>
        </section>

        {/* Why WebP & Comparison Table */}
        <section className="space-y-8">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Why Should You Use WebP?</h2>
            <p className="mt-4 text-lg text-slate-600">
              If you’ve ever wondered why your website feels slow, it’s usually because of "heavy" images. WebP is a modern image format that acts like a "shrink-wrap" for your photos. It keeps the quality high but cuts the file size down significantly.
            </p>
          </div>

          <div className="overflow-hidden rounded-3xl border border-slate-200 shadow-sm bg-white">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200/60">
                  <th className="p-5 font-semibold text-sm text-slate-700">Feature</th>
                  <th className="p-5 font-semibold text-sm text-slate-700">Old Formats (JPG/PNG)</th>
                  <th className="p-5 font-semibold text-sm text-slate-900">WebP (The Modern Way)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-5 text-sm font-medium text-slate-800">Size</td>
                  <td className="p-5 text-sm text-slate-500">Large and bulky.</td>
                  <td className="p-5 text-sm font-medium text-emerald-600 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    30% smaller on average.
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-5 text-sm font-medium text-slate-800">Speed</td>
                  <td className="p-5 text-sm text-slate-500">Slows down your website.</td>
                  <td className="p-5 text-sm font-medium text-emerald-600 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    Loads much faster.
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-5 text-sm font-medium text-slate-800">Quality</td>
                  <td className="p-5 text-sm text-slate-500">Loses detail when shrunk.</td>
                  <td className="p-5 text-sm font-medium text-emerald-600 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    Stays crisp even at small sizes.
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-5 text-sm font-medium text-slate-800">Transparency</td>
                  <td className="p-5 text-sm text-slate-500">Only PNGs can have clear backgrounds.</td>
                  <td className="p-5 text-sm font-medium text-emerald-600 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    Supports clear backgrounds with tiny file sizes.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="space-y-10 pt-8">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 text-center">Frequently Asked Questions (FAQ)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
            <div className="space-y-3">
              <h3 className="font-semibold text-lg text-slate-900">What is a WebP file?</h3>
              <p className="text-slate-600 leading-relaxed">Think of WebP as a "smarter" version of a photo. It was created by Google to help the internet move faster. It compresses the data inside an image much better than older formats like JPEG or PNG.</p>
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-lg text-slate-900">Will I lose quality if I compress my images?</h3>
              <p className="text-slate-600 leading-relaxed">Technically, yes, but your eyes likely won't see the difference! At our recommended 80% setting, the file size drops dramatically while the image still looks beautiful to the human eye.</p>
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-lg text-slate-900">Is WebP supported by all browsers?</h3>
              <p className="text-slate-600 leading-relaxed">Yes! All modern browsers—including Google Chrome, Apple Safari, Microsoft Edge, and Mozilla Firefox—fully support WebP images. If you use them on your website, everyone will be able to see them.</p>
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-lg text-slate-900">Why does image size matter for SEO?</h3>
              <p className="text-slate-600 leading-relaxed">Google loves fast websites. When your images are small and load quickly, Google ranks your site higher in search results. Using WebP is one of the easiest ways to give your website a "speed boost."</p>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="bg-slate-950 text-white rounded-[2.5rem] p-12 mb-8 space-y-10 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 bg-blue-500 opacity-10 blur-3xl rounded-full"></div>
          <div className="relative z-10 w-full">
             <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-2">The Benefits of Using WebPit for Your Website</h2>
             <p className="text-slate-400 mb-10 text-lg">Supercharge your site’s speed directly from your browser.</p>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
              <div className="flex gap-4">
                <div className="shrink-0 w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <div>
                  <h4 className="font-semibold text-lg text-slate-100">Better Google Rankings</h4>
                  <p className="text-slate-400 text-sm mt-1 leading-relaxed">Faster sites rank higher. By shrinking your images, you're telling search engines your site is user-friendly.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="shrink-0 w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <div>
                  <h4 className="font-semibold text-lg text-slate-100">Save Storage Space</h4>
                  <p className="text-slate-400 text-sm mt-1 leading-relaxed">Smaller files mean you use less space on your web hosting or cloud storage.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="shrink-0 w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <div>
                  <h4 className="font-semibold text-lg text-slate-100">Better Mobile Experience</h4>
                  <p className="text-slate-400 text-sm mt-1 leading-relaxed">People browsing on phones often have slower data. Small WebP images load instantly on mobile devices.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="shrink-0 w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <div>
                  <h4 className="font-semibold text-lg text-slate-100">100% Free & Private</h4>
                  <p className="text-slate-400 text-sm mt-1 leading-relaxed">Your images are processed right in your browser. We don't store your photos on our servers.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
