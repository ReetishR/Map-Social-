import { HTMLAttributes } from "react";
import clsx from "clsx";

export function Panel({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={clsx("panel", className)} {...props} />;
}

export function PanelHover({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={clsx("panel panel-hover", className)} {...props} />;
}
