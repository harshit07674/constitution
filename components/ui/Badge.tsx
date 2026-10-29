import React from "react";

export interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "forest" | "sage" | "brass" | "outline";
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "default",
  className = "",
}) => {
  const variantStyles = {
    default: "bg-[var(--color-surface-secondary)] text-[var(--color-ink)] border-[var(--color-border)]",
    forest: "bg-[var(--color-forest)] text-white border-transparent",
    sage: "bg-[var(--color-sage)]/20 text-[var(--color-forest)] border-[var(--color-sage)]/30",
    brass: "bg-[var(--color-brass)]/20 text-[#6d5528] border-[var(--color-brass)]/40",
    outline: "bg-transparent text-[var(--color-muted)] border-[var(--color-border)]",
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border tracking-wide uppercase ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

