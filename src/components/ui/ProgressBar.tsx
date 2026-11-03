import React from "react";

export type ProgressColor =
  | "blue"
  | "teal"
  | "green"
  | "yellow"
  | "red"
  | "slate"
  | "emerald"
  | "amber"
  | "rose";

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
  blue: "bg-[#0d6efd]",
  teal: "bg-[#087990]",
  green: "bg-[#198754]",
  yellow: "bg-[#cc7a00]",
  red: "bg-[#dc2626]",
  slate: "bg-[#475569]",
  emerald: "bg-[#198754]",
  amber: "bg-[#cc7a00]",
  rose: "bg-[#dc2626]",
};

const heightStyles = {
  sm: "h-[5px]",
  md: "h-[8px]",
  lg: "h-[12px]",
};

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  color = "blue",
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
        <div className="flex justify-between items-center text-[12px] font-medium text-[#475569] mb-1">
          <span>Progres</span>
          <span className="font-semibold text-[#1e293b]">{percentage}%</span>
        </div>
      )}

      <div className="flex items-center gap-3">
        <div className={`w-full overflow-hidden rounded-[4px] bg-[#f1f5f9] border border-[#e2e8f0]/60 ${heightStyles[size]}`}>
          <div
            className={`h-full rounded-[3px] ${colorStyles[color]} ${
              animate ? "transition-all duration-500 ease-out" : ""
            }`}
            style={{ width: `${percentage}%` }}
            role="progressbar"
            aria-valuenow={percentage}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>

        {showLabel && labelPosition === "right" && (
          <span className="text-[12px] font-semibold text-[#1e293b] min-w-[34px] text-right">
            {percentage}%
          </span>
        )}
      </div>
    </div>
  );
};
