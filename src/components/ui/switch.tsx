import * as React from "react";
import { cn } from "@/src/lib/utils";

interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, label, ...props }, ref) => {
    return (
      <label className="inline-flex items-center cursor-pointer gap-3">
        <div className="relative">
          <input
            type="checkbox"
            className="sr-only peer"
            ref={ref}
            {...props}
          />
          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </div>
        {label && <span className="text-sm font-medium text-slate-700">{label}</span>}
      </label>
    );
  }
);
Switch.displayName = "Switch";
