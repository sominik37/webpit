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
        "relative group cursor-pointer w-full h-64 rounded-[2rem] border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center gap-4 overflow-hidden",
        isDragging 
          ? "border-blue-500 bg-blue-50/50 scale-[1.01] shadow-xl" 
          : "border-slate-300 hover:border-blue-300 hover:bg-white bg-slate-50/80 shadow-sm hover:shadow-md"
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
          "w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300",
          isDragging ? "bg-blue-600 text-white shadow-lg scale-110" : "bg-slate-200/60 text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600"
        )}>
          <Upload className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900">
          Drop images here
        </h3>
        <p className="text-sm text-slate-500 mt-1 max-w-xs">
          or click to browse. Supports JPG, PNG, WEBP, GIF
        </p>
      </div>
    </div>
  );
}
