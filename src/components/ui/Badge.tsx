import React from "react";

export type BadgeVariant = "default" | "success" | "warning" | "danger" | "info" | "neutral";
export type BadgeSize = "sm" | "md";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  className?: string;
  icon?: React.ReactNode;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-[#0d6efd] text-white",
  success: "bg-[#198754] text-white",
  warning: "bg-[#cc7a00] text-white",
  danger: "bg-[#dc2626] text-white",
  info: "bg-[#087990] text-white",
  neutral: "bg-[#f1f5f9] text-[#475569] border border-[#cbd5e1]",
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: "text-[11px] font-semibold px-2 py-0.5 rounded-[4px] leading-tight",
  md: "text-[12px] font-semibold px-2.5 py-1 rounded-[5px] leading-normal",
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "default",
  size = "sm",
  className = "",
  icon,
}) => {
  return (
    <span
      className={`inline-flex items-center gap-1 font-semibold ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {icon && <span className="inline-flex shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
