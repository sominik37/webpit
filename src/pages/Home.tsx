import React, { useState, useCallback } from 'react';
import { Dropzone } from '../components/Dropzone';
import { ImageCard, type ProcessedImage } from '../components/ImageCard';
import { Slider } from '../components/ui/slider';
import { Button } from '../components/ui/button';
import { Download, Trash2, Settings2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { formatBytes } from '../lib/utils';

// Declare gtag for TypeScript
declare global {
  interface Window {
    gtag: (command: string, action: string, params?: any) => void;
  }
}

export default function Home() {
  const [images, setImages] = useState<ProcessedImage[]>([]);
  const [quality, setQuality] = useState(80);
  const [isProcessing, setIsProcessing] = useState(false);

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
        <div className="md:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <Settings2 className="w-5 h-5 text-gray-500" />
            <h2 className="font-medium">Optimization Settings</h2>
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
            <p className="text-sm text-gray-500">
              Lower quality results in smaller file sizes but may reduce image fidelity.
              80% is recommended for a good balance.
            </p>
          </div>
        </div>

        {/* Stats Card */}
        <div className="bg-black text-white rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="font-medium text-white/80">Total Savings</h2>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-4xl font-light tracking-tight">
                {images.length > 0 && totalProcessedSize > 0 ? `${totalSavings}%` : '0%'}
              </span>
            </div>
          </div>

          <div className="mt-8 space-y-1">
            <div className="flex justify-between text-sm text-white/60">
              <span>Original</span>
              <span className="font-mono">{formatBytes(totalOriginalSize)}</span>
            </div>
            <div className="flex justify-between text-sm text-white">
              <span>Optimized</span>
              <span className="font-mono">{formatBytes(totalProcessedSize)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Area */}
      <Dropzone onFilesDrop={handleFilesDrop} />

      {/* Image List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-gray-900">
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
              className="text-center py-12 text-gray-400"
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
      <div className="mt-16 space-y-12 border-t border-gray-200 pt-16 text-gray-800">
        {/* How to Guide */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold tracking-tight text-black">How to Convert and Compress Your Images</h2>
          <p className="text-lg text-gray-600">
            Using WebPit is as easy as "Drag, Slide, and Save." You don’t need to be a tech expert to get professional results.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <div className="space-y-3 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold">1</div>
              <h3 className="font-semibold text-lg">Upload Your Photos</h3>
              <p className="text-sm text-gray-500">Drag and drop your JPG, PNG, or GIF files directly into the box above. You can even upload multiple images at once!</p>
            </div>
            <div className="space-y-3 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold">2</div>
              <h3 className="font-semibold text-lg">Adjust the Quality</h3>
              <p className="text-sm text-gray-500">Use the "Quality" slider to choose how much you want to shrink the file. 80% is the sweet spot—it makes the file much smaller while keeping the image looking sharp.</p>
            </div>
            <div className="space-y-3 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold">3</div>
              <h3 className="font-semibold text-lg">Download & Use</h3>
              <p className="text-sm text-gray-500">Once processed, your new WebP images are ready. Download them instantly to use on your website, blog, or store.</p>
            </div>
          </div>
        </section>

        {/* Why WebP & Comparison Table */}
        <section className="space-y-8">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-bold tracking-tight text-black">Why Should You Use WebP?</h2>
            <p className="mt-4 text-lg text-gray-600">
              If you’ve ever wondered why your website feels slow, it’s usually because of "heavy" images. WebP is a modern image format that acts like a "shrink-wrap" for your photos. It keeps the quality high but cuts the file size down significantly.
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="p-4 font-semibold text-sm">Feature</th>
                  <th className="p-4 font-semibold text-sm">Old Formats (JPG/PNG)</th>
                  <th className="p-4 font-semibold text-sm text-black">WebP (The Modern Way)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="p-4 text-sm font-medium">Size</td>
                  <td className="p-4 text-sm text-gray-500">Large and bulky.</td>
                  <td className="p-4 text-sm font-medium text-green-600">30% smaller on average.</td>
                </tr>
                <tr>
                  <td className="p-4 text-sm font-medium">Speed</td>
                  <td className="p-4 text-sm text-gray-500">Slows down your website.</td>
                  <td className="p-4 text-sm font-medium text-green-600">Loads much faster.</td>
                </tr>
                <tr>
                  <td className="p-4 text-sm font-medium">Quality</td>
                  <td className="p-4 text-sm text-gray-500">Loses detail when shrunk.</td>
                  <td className="p-4 text-sm font-medium text-green-600">Stays crisp even at small sizes.</td>
                </tr>
                <tr>
                  <td className="p-4 text-sm font-medium">Transparency</td>
                  <td className="p-4 text-sm text-gray-500">Only PNGs can have clear backgrounds.</td>
                  <td className="p-4 text-sm font-medium text-green-600">Supports clear backgrounds with tiny file sizes.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="space-y-8">
          <h2 className="text-3xl font-bold tracking-tight text-black text-center">Frequently Asked Questions (FAQ)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            <div className="space-y-2">
              <h3 className="font-bold text-lg">What is a WebP file?</h3>
              <p className="text-gray-600">Think of WebP as a "smarter" version of a photo. It was created by Google to help the internet move faster. It compresses the data inside an image much better than older formats like JPEG or PNG.</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-lg">Will I lose quality if I compress my images?</h3>
              <p className="text-gray-600">Technically, yes, but your eyes likely won't see the difference! At our recommended 80% setting, the file size drops dramatically while the image still looks beautiful to the human eye.</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-lg">Is WebP supported by all browsers?</h3>
              <p className="text-gray-600">Yes! All modern browsers—including Google Chrome, Apple Safari, Microsoft Edge, and Mozilla Firefox—fully support WebP images. If you use them on your website, everyone will be able to see them.</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-lg">Why does image size matter for SEO?</h3>
              <p className="text-gray-600">Google loves fast websites. When your images are small and load quickly, Google ranks your site higher in search results. Using WebP is one of the easiest ways to give your website a "speed boost."</p>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="bg-black text-white rounded-3xl p-10 mb-8 space-y-8">
          <h2 className="text-3xl font-bold tracking-tight">The Benefits of Using WebPit for Your Website</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex gap-4">
              <div className="shrink-0 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <div>
                <h4 className="font-bold">Better Google Rankings</h4>
                <p className="text-gray-400 text-sm">Faster sites rank higher. By shrinking your images, you're telling search engines your site is user-friendly.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="shrink-0 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <div>
                <h4 className="font-bold">Save Storage Space</h4>
                <p className="text-gray-400 text-sm">Smaller files mean you use less space on your web hosting or cloud storage.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="shrink-0 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <div>
                <h4 className="font-bold">Better Mobile Experience</h4>
                <p className="text-gray-400 text-sm">People browsing on phones often have slower data. Small WebP images load instantly on mobile devices, keeping your visitors happy.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="shrink-0 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <div>
                <h4 className="font-bold">100% Free & Private</h4>
                <p className="text-gray-400 text-sm">Your images are processed right in your browser. We don't store your photos on our servers, so your privacy is always protected.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
