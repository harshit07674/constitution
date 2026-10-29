import React, { TextareaHTMLAttributes } from "react";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = "", label, error, helperText, id, rows = 4, ...props }, ref) => {
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]"
          >
            {label}
          </label>
        )}
        <textarea
          id={textareaId}
          ref={ref}
          rows={rows}
          className={`w-full px-3.5 py-2.5 text-sm bg-[var(--color-paper-raised)] text-[var(--color-ink)] border ${
            error ? "border-[var(--color-danger)] focus:ring-[var(--color-danger)]" : "border-[var(--color-border)] focus:border-[var(--color-forest)] focus:ring-[var(--color-forest)]"
          } rounded focus:outline-none focus:ring-1 transition-colors duration-150 placeholder:text-[var(--color-muted)]/60 resize-y leading-relaxed ${className}`}
          {...props}
        />
        {error && <p className="text-xs text-[var(--color-danger)] mt-1">{error}</p>}
        {helperText && !error && <p className="text-xs text-[var(--color-muted)] mt-1">{helperText}</p>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

