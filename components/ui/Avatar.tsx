import clsx from "clsx";

const PALETTE = ["#8b5cf6", "#22d3ee", "#ec4899", "#84e044", "#f59e0b", "#60a5fa"];

function hashName(name: string): number {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function Avatar({
  name,
  ready,
  size = "md",
  className,
}: {
  name: string;
  ready?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const color = PALETTE[hashName(name) % PALETTE.length];
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");

  const sizeClasses =
    size === "sm" ? "h-7 w-7 text-xs" : size === "lg" ? "h-14 w-14 text-lg" : "h-10 w-10 text-sm";

  return (
    <div className={clsx("relative inline-flex", className)}>
      <div
        className={clsx(
          "flex items-center justify-center rounded-full font-display font-semibold text-black/80",
          sizeClasses,
        )}
        style={{ backgroundColor: color }}
      >
        {initials || "?"}
      </div>
      {ready !== undefined && (
        <span
          className={clsx(
            "absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-bg",
            ready ? "bg-lime" : "bg-text-faint",
          )}
        />
      )}
    </div>
  );
}
