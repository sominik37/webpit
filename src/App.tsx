import React, { useState, useCallback, useEffect } from 'react';
import { Dropzone } from './components/Dropzone';
import { ImageCard, type ProcessedImage } from './components/ImageCard';
import { Slider } from './components/ui/slider';
import { Button } from './components/ui/button';
import { Download, Trash2, Settings2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { formatBytes } from './lib/utils';

export default function App() {
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
            
            const resultUrl = URL.createObjectURL(blob);
            resolve({
              ...img,
              status: 'done',
              resultBlob: blob,
              resultUrl,
              processedSize: blob.size,
              quality: targetQuality
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
    
    // Trigger processing for new images
    newImages.forEach(img => {
      // Small delay to allow UI to update
      setTimeout(async () => {
        setImages(current => 
          current.map(i => i.id === img.id ? { ...i, status: 'processing' } : i)
        );
        
        const result = await processImage(img, quality);
        
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
    const originalName = item.originalFile.name.replace(/\.[^/.]+$/, "");
    link.download = `${originalName}.webp`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleQualityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuality(Number(e.target.value));
  };

  // Re-process all images when quality changes (debounced ideally, but simple here)
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
    <div className="min-h-screen bg-[#F5F5F5] text-gray-900 font-sans pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white">
              <Sparkles className="w-5 h-5" />
            </div>
            <h1 className="font-semibold text-lg tracking-tight">WebPit</h1>
          </div>
          <div className="flex items-center gap-4">
            <a 
              href="https://developers.google.com/speed/webp" 
              target="_blank" 
              rel="noreferrer"
              className="text-sm text-gray-500 hover:text-black transition-colors hidden sm:block"
            >
              About WebP
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        
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
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setImages([])}
                className="text-red-500 hover:text-red-600 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All
              </Button>
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
      </main>
    </div>
  );
}
