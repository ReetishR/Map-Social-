"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";
import clsx from "clsx";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    "bg-purple text-white hover:bg-purple-strong shadow-[0_0_0_1px_rgba(139,92,246,0.4),0_0_24px_rgba(139,92,246,0.35)] hover:shadow-[0_0_0_1px_rgba(139,92,246,0.6),0_0_32px_rgba(139,92,246,0.5)]",
  secondary:
    "bg-panel border border-border-strong text-text hover:bg-panel-hover",
  ghost: "bg-transparent text-text-muted hover:text-text hover:bg-panel",
  danger: "bg-red/90 text-white hover:bg-red",
};

const SIZE_CLASSES: Record<Size, string> = {
  sm: "text-sm px-3.5 py-1.5 rounded-full",
  md: "text-sm px-5 py-2.5 rounded-full",
  lg: "text-base px-7 py-3.5 rounded-full",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={clsx(
          "font-display font-semibold tracking-tight transition-all duration-150 inline-flex items-center justify-center gap-2 cursor-pointer",
          "disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
          VARIANT_CLASSES[variant],
          SIZE_CLASSES[size],
          className,
        )}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";
