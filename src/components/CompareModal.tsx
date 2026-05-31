import { X, ZoomIn, ZoomOut, Maximize2, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CompareModalProps {
  originalUrl: string;
  resultUrl?: string;
  resultPath?: string;
  onClose: () => void;
}

export const CompareModal: React.FC<CompareModalProps> = ({ originalUrl, resultUrl, resultPath, onClose }) => {
  const [sliderPos, setSliderPos] = useState(50);
  const [zoom, setZoom] = useState(1);
  const [isResizing, setIsResizing] = useState(false);
  const [viewMode, setViewMode] = useState<'slider' | 'diff'>('slider');
  const containerRef = useRef<HTMLDivElement>(null);

  const displayResultUrl = resultUrl;

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (viewMode !== 'slider') return;
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const position = ((x - rect.left) / rect.width) * 100;
    setSliderPos(Math.max(0, Math.min(100, position)));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-2 sm:p-10"
    >
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center gap-2 sm:gap-4 z-50">
        <div className="flex bg-white/10 rounded-full p-1 backdrop-blur-md border border-white/10">
           <button 
             onClick={() => setViewMode(prev => prev === 'slider' ? 'diff' : 'slider')} 
             className={cn(
                "p-2 rounded-full transition-colors flex items-center gap-2 px-3 sm:px-4 text-xs sm:text-sm font-medium",
                viewMode === 'diff' ? "bg-white text-slate-900" : "text-white hover:bg-white/10"
             )}
           >
                <Layers className="w-4 h-4" />
                <span className="hidden sm:inline">{viewMode === 'diff' ? 'Diff View' : 'Slider View'}</span>
           </button>
           <div className="w-px h-6 bg-white/10 mx-1"></div>
           <button onClick={() => setZoom(prev => Math.min(prev + 0.5, 5))} className="p-2 text-white hover:bg-white/10 rounded-full transition-colors"><ZoomIn className="w-5 h-5"/></button>
           <button onClick={() => setZoom(prev => Math.max(prev - 0.5, 1))} className="p-2 text-white hover:bg-white/10 rounded-full transition-colors"><ZoomOut className="w-5 h-5"/></button>
        </div>
        <button
          onClick={onClose}
          className="p-2.5 sm:p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all border border-white/10"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>

      <div className="flex flex-col items-center gap-4 w-full h-full max-w-6xl">
        <div className="flex justify-between w-full px-4 text-white/60 text-sm font-medium">
            <span>{viewMode === 'diff' ? 'PIXEL DIFFERENCE' : 'ORIGINAL'}</span>
            <span>{viewMode === 'diff' ? 'HIGHLIGHTING CHANGES' : 'OPTIMIZED'}</span>
        </div>

        <div 
          ref={containerRef}
          className={cn(
            "relative flex-1 w-full rounded-3xl overflow-hidden bg-slate-900 border border-white/5 shadow-2xl select-none",
            viewMode === 'slider' ? "cursor-col-resize" : "cursor-default"
          )}
          onMouseMove={handleMouseMove}
          onTouchMove={handleMouseMove}
        >
          {viewMode === 'slider' ? (
            <>
              {/* Result Image (Bottom layer) */}
              <div 
                className="absolute inset-0 w-full h-full flex items-center justify-center"
                style={{ transform: `scale(${zoom})` }}
              >
                <img src={displayResultUrl} alt="Result" className="max-w-full max-h-full object-contain" />
              </div>

              {/* Original Image (Top layer clipped) */}
              <div 
                className="absolute inset-0 w-full h-full flex items-center justify-center bg-slate-900 overflow-hidden"
                style={{ 
                    width: `${sliderPos}%`,
                    transform: `scale(${zoom})`,
                    transformOrigin: 'left center'
                }}
              >
                <img 
                   src={originalUrl} 
                   alt="Original" 
                   className="max-w-full max-h-full object-contain" 
                   style={{ width: `${100 / (sliderPos/100)}%`, maxWidth: 'none' }}
                />
              </div>

              {/* Slider Line */}
              <div 
                className="absolute top-0 bottom-0 w-1 bg-white shadow-xl z-10 flex items-center justify-center"
                style={{ left: `${sliderPos}%` }}
              >
                <div className="w-8 h-8 bg-white rounded-full shadow-2xl flex items-center justify-center">
                  <div className="flex gap-0.5">
                    <div className="w-0.5 h-3 bg-slate-400 rounded-full"></div>
                    <div className="w-0.5 h-3 bg-slate-400 rounded-full"></div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div 
                className="absolute inset-0 w-full h-full flex items-center justify-center"
                style={{ transform: `scale(${zoom})` }}
            >
                <img src={originalUrl} alt="Original" className="absolute max-w-full max-h-full object-contain" />
                <img 
                    src={displayResultUrl} 
                    alt="Diff" 
                    className="absolute max-w-full max-h-full object-contain" 
                    style={{ mixBlendMode: 'difference', filter: 'invert(1) contrast(5)' }} 
                />
            </div>
          )}
        </div>
        
        <div className="text-white/40 text-xs mt-2 uppercase tracking-widest text-center">
            {viewMode === 'slider' 
                ? 'Drag slider to compare quality • Use zoom buttons for details' 
                : 'Showing brightness-boosted difference between images'}
        </div>
      </div>
    </motion.div>
  );
};
