import React from "react";

export type StatTrend = "up" | "down" | "neutral";

interface StatCardProps {
  label: string;
  value: string | number;
  subText?: string;
  trend?: StatTrend;
  trendText?: string;
  icon: React.ReactNode;
  iconBgColor?: string; // e.g., "bg-teal-50 text-teal-600"
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
  iconBgColor = "bg-teal-50 text-teal-700 dark:bg-teal-950/70 dark:text-teal-300",
  badgeText,
  className = "",
}) => {
  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {label}
            </span>
            {badgeText && (
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10.5px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                {badgeText}
              </span>
            )}
          </div>

          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              {value}
            </span>
          </div>

          {(trendText || subText) && (
            <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs">
              {trendText && (
                <span
                  className={`inline-flex items-center font-semibold ${
                    trend === "up"
                      ? "text-emerald-600 dark:text-emerald-400"
                      : trend === "down"
                      ? "text-rose-600 dark:text-rose-400"
                      : "text-slate-600 dark:text-slate-400"
                  }`}
                >
                  {trend === "up" && "↑ "}
                  {trend === "down" && "↓ "}
                  {trendText}
                </span>
              )}
              {subText && (
                <span className="text-slate-500 dark:text-slate-400">
                  {subText}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Icon Container */}
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-slate-200/60 transition-transform duration-200 group-hover:scale-105 dark:border-slate-700/60 ${iconBgColor}`}
        >
          {icon}
        </div>
      </div>

      {/* Subtle bottom border accent for medical elegance */}
      <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-teal-500/30 to-transparent opacity-0 transition-opacity duration-300 hover:opacity-100" />
    </div>
  );
};
