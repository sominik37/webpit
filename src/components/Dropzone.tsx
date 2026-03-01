import React, { useCallback, useState } from 'react';
import { Upload, Image as ImageIcon, FileWarning } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface DropzoneProps {
  onFilesDrop: (files: File[]) => void;
}

export function Dropzone({ onFilesDrop }: DropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = (Array.from(e.dataTransfer.files) as File[]).filter(file => 
      file.type.startsWith('image/')
    );
    
    if (files.length > 0) {
      onFilesDrop(files);
    }
  }, [onFilesDrop]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = (Array.from(e.target.files) as File[]).filter(file => 
        file.type.startsWith('image/')
      );
      if (files.length > 0) {
        onFilesDrop(files);
      }
    }
  }, [onFilesDrop]);

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        "relative group cursor-pointer w-full h-64 rounded-3xl border-2 border-dashed transition-all duration-200 flex flex-col items-center justify-center gap-4 overflow-hidden",
        isDragging 
          ? "border-black bg-gray-50 scale-[1.01]" 
          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50/50"
      )}
    >
      <input
        type="file"
        multiple
        accept="image/*"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        onChange={handleFileInput}
      />
      
      <div className="relative z-0 flex flex-col items-center text-center p-6">
        <div className={cn(
          "w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-colors",
          isDragging ? "bg-black text-white" : "bg-gray-100 text-gray-500 group-hover:bg-gray-200"
        )}>
          <Upload className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">
          Drop images here
        </h3>
        <p className="text-sm text-gray-500 mt-1 max-w-xs">
          or click to browse. Supports JPG, PNG, WEBP, GIF
        </p>
      </div>
    </div>
  );
}
