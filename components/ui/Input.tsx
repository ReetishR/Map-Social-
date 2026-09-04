import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef } from "react";
import clsx from "clsx";

const BASE =
  "w-full rounded-xl border border-border bg-bg-elevated px-3.5 py-2.5 text-sm text-text placeholder:text-text-faint focus:outline-none focus:border-purple transition-colors";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input ref={ref} className={clsx(BASE, className)} {...props} />
  ),
);
Input.displayName = "Input";

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea ref={ref} className={clsx(BASE, "resize-none", className)} {...props} />
));
Textarea.displayName = "Textarea";
