import React, { ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "brass";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", size = "md", isLoading = false, children, disabled, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:ring-offset-1 disabled:opacity-50 disabled:pointer-events-none cursor-pointer";

    const sizeStyles = {
      sm: "text-xs px-3 py-1.5 rounded-sm gap-1.5",
      md: "text-sm px-4 py-2 rounded gap-2",
      lg: "text-base px-6 py-2.5 rounded gap-2.5",
    };

    const variantStyles = {
      primary:
        "bg-[var(--color-forest)] text-[var(--color-paper-raised)] hover:bg-[#28382c] active:bg-[#212e24] shadow-xs",
      secondary:
        "bg-[var(--color-surface-secondary)] text-[var(--color-ink)] hover:bg-[#ded8cb] border border-[var(--color-border)]",
      outline:
        "bg-transparent text-[var(--color-ink)] hover:bg-[var(--color-surface-secondary)] border border-[var(--color-border)]",
      ghost:
        "bg-transparent text-[var(--color-ink)] hover:bg-[var(--color-surface-secondary)]/60",
      danger:
        "bg-[var(--color-danger)] text-white hover:bg-[#8e372c] active:bg-[#782f25]",
      brass:
        "bg-[var(--color-brass)] text-[var(--color-ink)] hover:bg-[#b8955c] active:bg-[#aa8850] font-semibold",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

