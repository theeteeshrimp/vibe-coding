"use client";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", size = "md", isLoading, children, disabled, ...props }, ref) => {
    const base = "inline-flex items-center justify-center font-medium rounded-[var(--radius-md)] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-primary)] disabled:opacity-50 disabled:cursor-not-allowed";
    const variants = {
      primary: "bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white shadow-sm shadow-indigo-500/20",
      secondary: "bg-[var(--bg-tertiary)] hover:bg-[var(--bg-elevated)] text-[var(--text-secondary)] border border-[var(--border)] hover:border-[var(--border-hover)]",
      ghost: "hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
      danger: "bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20",
    };
    const sizes = { sm: "px-3 py-1.5 text-xs gap-1.5", md: "px-4 py-2 text-sm gap-2", lg: "px-6 py-3 text-base gap-2" };
    return (
      <button ref={ref} className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} disabled={disabled || isLoading} {...props}>
        {isLoading && <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
