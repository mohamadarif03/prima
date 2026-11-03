import React from "react";

export type ProgressColor = "teal" | "emerald" | "amber" | "rose" | "sky" | "slate";

interface ProgressBarProps {
  value: number; // 0 - 100
  max?: number;
  color?: ProgressColor;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  labelPosition?: "right" | "top";
  className?: string;
  animate?: boolean;
}

const colorStyles: Record<ProgressColor, string> = {
  teal: "bg-teal-600 dark:bg-teal-500",
  emerald: "bg-emerald-500 dark:bg-emerald-400",
  amber: "bg-amber-500 dark:bg-amber-400",
  rose: "bg-rose-500 dark:bg-rose-400",
  sky: "bg-sky-500 dark:bg-sky-400",
  slate: "bg-slate-600 dark:bg-slate-400",
};

const heightStyles = {
  sm: "h-1.5",
  md: "h-2.5",
  lg: "h-3.5",
};

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  color = "teal",
  size = "md",
  showLabel = false,
  labelPosition = "right",
  className = "",
  animate = true,
}) => {
  const percentage = Math.min(Math.max(Math.round((value / max) * 100), 0), 100);

  return (
    <div className={`w-full ${className}`}>
      {showLabel && labelPosition === "top" && (
        <div className="flex justify-between items-center text-xs font-medium text-slate-600 dark:text-slate-300 mb-1.5">
          <span>Progres</span>
          <span className="font-semibold text-slate-800 dark:text-slate-100">{percentage}%</span>
        </div>
      )}

      <div className="flex items-center gap-3">
        <div className={`w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800/80 ${heightStyles[size]}`}>
          <div
            className={`h-full rounded-full ${colorStyles[color]} ${
              animate ? "transition-all duration-700 ease-out" : ""
            }`}
            style={{ width: `${percentage}%` }}
            role="progressbar"
            aria-valuenow={percentage}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>

        {showLabel && labelPosition === "right" && (
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 min-w-[38px] text-right">
            {percentage}%
          </span>
        )}
      </div>
    </div>
  );
};
