"use client";

import { getBase } from "@/lib/api";

export default function MediaImage({ mediaKey, alt, width, height, style }: {
  mediaKey: string;
  alt: string;
  width?: number;
  height?: number;
  style?: React.CSSProperties;
}) {
  const base = getBase();
  const src = `${base}/api/media/${mediaKey}`;
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      style={style}
      loading="lazy"
    />
  );
}
