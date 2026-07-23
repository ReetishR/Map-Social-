import { HTMLAttributes } from "react";
import clsx from "clsx";

type Accent = "purple" | "cyan" | "pink" | "lime" | "amber" | "red" | "neutral";

const ACCENT_CLASSES: Record<Accent, string> = {
  purple: "bg-purple/15 text-[#c4b5fd] border-purple/40",
  cyan: "bg-cyan/15 text-[#67e8f9] border-cyan/40",
  pink: "bg-pink/15 text-[#f9a8d4] border-pink/40",
  lime: "bg-lime/15 text-[#bef264] border-lime/40",
  amber: "bg-amber/15 text-[#fcd34d] border-amber/40",
  red: "bg-red/15 text-[#fca5a5] border-red/40",
  neutral: "bg-white/5 text-text-muted border-border-strong",
};

export function Badge({
  accent = "neutral",
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement> & { accent?: Accent }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        ACCENT_CLASSES[accent],
        className,
      )}
      {...props}
    />
  );
}
