import React, { InputHTMLAttributes } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", label, error, helperText, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]"
          >
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={`w-full px-3.5 py-2 text-sm bg-[var(--color-paper-raised)] text-[var(--color-ink)] border ${
            error ? "border-[var(--color-danger)] focus:ring-[var(--color-danger)]" : "border-[var(--color-border)] focus:border-[var(--color-forest)] focus:ring-[var(--color-forest)]"
          } rounded focus:outline-none focus:ring-1 transition-colors duration-150 placeholder:text-[var(--color-muted)]/60 ${className}`}
          {...props}
        />
        {error && <p className="text-xs text-[var(--color-danger)] mt-1">{error}</p>}
        {helperText && !error && <p className="text-xs text-[var(--color-muted)] mt-1">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

