import * as React from "react";
import { cn } from "@/src/lib/utils";

interface SliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  valueDisplay?: string;
}

export const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className, label, valueDisplay, ...props }, ref) => {
    return (
      <div className="w-full space-y-2">
        <div className="flex justify-between items-center">
          {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
          {valueDisplay && <span className="text-sm font-mono text-gray-500">{valueDisplay}</span>}
        </div>
        <input
          type="range"
          ref={ref}
          className={cn(
            "w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black",
            className
          )}
          {...props}
        />
      </div>
    );
  }
);
Slider.displayName = "Slider";
