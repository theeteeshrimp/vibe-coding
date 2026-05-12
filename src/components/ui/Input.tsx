import { InputHTMLAttributes, forwardRef } from "react";
export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className = "", ...props }, ref) => {
    return <input ref={ref} className={`w-full px-3 py-2.5 bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-[var(--radius-md)] text-sm text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/40 focus:border-[var(--accent)]/40 transition-all ${className}`} {...props} />;
  }
);
Input.displayName = "Input";
