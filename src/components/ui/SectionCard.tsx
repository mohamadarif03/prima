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
    <div className={`metis-card flex flex-col ${className}`}>
      <div className={`metis-card-header ${headerClassName}`}>
        <div className="min-w-0 flex items-center gap-2.5">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="metis-card-title">{title}</h2>
              {badge}
            </div>
            {subtitle && (
              <p className="text-[12px] text-[#64748b] mt-0.5">{subtitle}</p>
            )}
          </div>
        </div>

        {action && (
          <div className="shrink-0 flex items-center gap-2">{action}</div>
        )}
      </div>

      <div className={`${noPadding ? "" : "p-5"} flex-1 ${bodyClassName}`}>
        {children}
      </div>
    </div>
  );
};
