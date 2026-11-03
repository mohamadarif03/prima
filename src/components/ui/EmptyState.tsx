import React from "react";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  action,
  className = "",
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-[8px] border border-dashed border-[#cbd5e1] bg-[#f8f9fa] px-6 py-12 text-center ${className}`}
    >
      {icon && (
        <div className="mb-3 flex h-[48px] w-[48px] items-center justify-center rounded-[8px] bg-white border border-[#e2e8f0] text-[#0d6efd] shadow-2xs text-[20px]">
          {icon}
        </div>
      )}
      <h3 className="text-[14px] font-semibold text-[#1e293b]">
        {title}
      </h3>
      <p className="mt-1 max-w-sm text-[12.5px] text-[#64748b] leading-relaxed">
        {description}
      </p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};
