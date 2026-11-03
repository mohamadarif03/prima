import React from "react";

interface SectionCardProps {
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
  headerClassName?: string;
  noPadding?: boolean;
}

export const SectionCard: React.FC<SectionCardProps> = ({
  title,
  subtitle,
  badge,
  action,
  children,
  className = "",
  bodyClassName = "",
  headerClassName = "",
  noPadding = false,
}) => {
  return (
    <div
      className={`rounded-xl border border-slate-200/90 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900 ${className}`}
    >
      <div
        className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 px-5 py-4 dark:border-slate-800/80 ${headerClassName}`}
      >
        <div className="min-w-0">
          <div className="flex items-center gap-2.5">
            <h2 className="text-base font-semibold text-slate-900 dark:text-white tracking-tight">
              {title}
            </h2>
            {badge}
          </div>
          {subtitle && (
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              {subtitle}
            </p>
          )}
        </div>

        {action && <div className="shrink-0 flex items-center gap-2">{action}</div>}
      </div>

      <div className={`${noPadding ? "" : "p-5 sm:p-6"} ${bodyClassName}`}>
        {children}
      </div>
    </div>
  );
};
