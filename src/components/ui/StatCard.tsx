import React from "react";

export type StatTrend = "up" | "down" | "neutral";

interface StatCardProps {
  label: string;
  value: string | number;
  subText?: string;
  trend?: StatTrend;
  trendText?: string;
  icon: React.ReactNode;
  iconBgColor?: string;
  badgeText?: string;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subText,
  trend,
  trendText,
  icon,
  badgeText,
  className = "",
}) => {
  return (
    <div className={`metis-card p-[18px] flex items-center gap-4 transition hover:shadow-sm ${className}`}>
      {/* Icon Box exactly as in template */}
      <div className="w-[44px] h-[44px] rounded-[8px] bg-[#f8f9fa] border border-[#e9ecef] flex items-center justify-center text-[#475569] flex-shrink-0 text-[18px]">
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-1">
          <span className="text-[11px] font-medium uppercase tracking-wide text-[#64748b] truncate">
            {label}
          </span>
          {badgeText && (
            <span className="text-[9.5px] font-semibold px-1.5 py-0.2 rounded-[4px] bg-[#f1f5f9] text-[#475569] border border-[#e2e8f0]">
              {badgeText}
            </span>
          )}
        </div>

        <div className="text-[22px] font-bold text-[#0f172a] leading-snug mt-0.5">
          {value}
        </div>

        {(trendText || subText) && (
          <div className="text-[11.5px] mt-0.5 flex items-center gap-1">
            {trend === "up" && <span className="text-[#64748b]">↑</span>}
            {trend === "down" && <span className="text-[#64748b]">↓</span>}
            {trendText && (
              <span
                className={`font-semibold ${
                  trend === "up"
                    ? "text-[#198754]"
                    : trend === "down"
                    ? "text-[#dc2626]"
                    : "text-[#475569]"
                }`}
              >
                {trendText}
              </span>
            )}
            {subText && (
              <span className="text-[#64748b] truncate">· {subText}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
