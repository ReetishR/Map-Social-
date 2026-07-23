"use client";

import { useState } from "react";
import { categoryImage } from "@/lib/venues/placeholderImage";

export function VenueImage({
  src,
  category,
  alt,
  className,
}: {
  src: string | null;
  category: string;
  alt: string;
  className?: string;
}) {
  const fallback = categoryImage(category);
  const [current, setCurrent] = useState(src || fallback);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={current}
      alt={alt}
      className={className}
      onError={() => setCurrent(fallback)}
    />
  );
}
