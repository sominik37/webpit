import React from 'react';
import { Save, ChevronDown, Check } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/src/lib/utils';

export interface Preset {
  id: string;
  name: string;
  quality: number;
  format: 'webp' | 'avif';
  lossless: boolean;
  strip_metadata: boolean;
}

const DEFAULT_PRESETS: Preset[] = [
  { id: 'web-standard', name: 'Web Standard', quality: 80, format: 'webp', lossless: false, strip_metadata: true },
  { id: 'high-quality', name: 'High Quality', quality: 95, format: 'webp', lossless: false, strip_metadata: false },
  { id: 'avif-next', name: 'Ultra Compact (AVIF)', quality: 50, format: 'avif', lossless: false, strip_metadata: true },
  { id: 'lossless-archive', name: 'Lossless Archive', quality: 100, format: 'webp', lossless: true, strip_metadata: false },
];

interface PresetSelectorProps {
  currentPresetId: string;
  onSelect: (preset: Preset) => void;
}

export const PresetSelector: React.FC<PresetSelectorProps> = ({ currentPresetId, onSelect }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const currentPreset = DEFAULT_PRESETS.find(p => p.id === currentPresetId) || DEFAULT_PRESETS[0];

  return (
    <div className="relative">
      <div className="flex items-center gap-2 mb-2">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Presets</label>
      </div>
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl hover:border-slate-300 transition-all text-sm font-medium text-slate-900"
      >
        <span className="truncate">{currentPreset.name}</span>
        <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            {DEFAULT_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => {
                  onSelect(preset);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full flex items-center justify-between px-4 py-3 text-sm transition-colors hover:bg-slate-50",
                  currentPresetId === preset.id ? "text-blue-600 bg-blue-50/50" : "text-slate-700"
                )}
              >
                <div className="flex flex-col items-start">
                    <span className="font-medium">{preset.name}</span>
                    <span className="text-[10px] opacity-60 uppercase">{preset.format} • Q:{preset.quality}</span>
                </div>
                {currentPresetId === preset.id && <Check className="w-4 h-4" />}
              </button>
            ))}
            <div className="border-t border-slate-100 p-2">
                <Button variant="ghost" size="sm" className="w-full justify-start text-[11px] rounded-lg">
                    <Save className="w-3 h-3 mr-2" />
                    Save Current Settings
                </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
