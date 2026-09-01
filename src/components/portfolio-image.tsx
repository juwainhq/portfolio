"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type Fit = "contain" | "cover";

type PortfolioImageProps = {
  src: string;
  alt: string;
  fit?: Fit;
  /** Maximum width the image may occupy, as a CSS length. */
  maxWidth?: string;
  /** When the natural image is much smaller than its column, cap the rendered
   *  width to this fraction of the column (0-1). Default: 1. */
  maxWidthFraction?: number;
  /** Extra class on the outer wrapper. */
  containerClassName?: string;
  /** Extra class on the <img>. */
  imgClassName?: string;
  sizes?: string;
  priority?: boolean;
  unoptimized?: boolean;
  noZoom?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
};

/**
 * PortfolioImage
 *
 * Renders an image at its NATURAL aspect ratio.
 *
 * - The container's aspect ratio is set from the image's intrinsic
 *   width/height, read once the image loads.
 * - Default fit is `contain` so the entire artwork is always visible.
 *   The container itself is transparent so the artwork blends directly
 *   with the page background — no artificial gray frame is added.
 * - The image is never stretched or distorted.
 */
export function PortfolioImage({
  src,
  alt,
  fit = "contain",
  maxWidth,
  maxWidthFraction = 1,
  containerClassName = "",
  imgClassName = "",
  sizes = "100vw",
  priority = false,
  unoptimized,
  noZoom = false,
  onMouseEnter,
  onMouseLeave,
}: PortfolioImageProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [intrinsic, setIntrinsic] = useState<{ w: number; h: number } | null>(
    null
  );

  useEffect(() => {
    const probe = new window.Image();
    probe.decoding = "async";
    probe.src = src;
    if (probe.complete && probe.naturalWidth) {
      setIntrinsic({ w: probe.naturalWidth, h: probe.naturalHeight });
      return;
    }
    probe.onload = () => {
      if (probe.naturalWidth && probe.naturalHeight) {
        setIntrinsic({ w: probe.naturalWidth, h: probe.naturalHeight });
      }
    };
  }, [src]);

  const aspectStyle: React.CSSProperties = intrinsic
    ? { aspectRatio: `${intrinsic.w} / ${intrinsic.h}` }
    : { minHeight: "50vh" };

  const widthCapStyle: React.CSSProperties = {};
  if (maxWidth) widthCapStyle.maxWidth = maxWidth;
  if (maxWidthFraction < 1) {
    widthCapStyle.maxWidth = `min(${maxWidthFraction * 100}%, 720px)`;
  }

  return (
    <div
      ref={wrapperRef}
      className={`relative w-full ${containerClassName}`}
      style={{ ...aspectStyle, ...widthCapStyle }}
      onMouseEnter={() => {
        setHovered(true);
        onMouseEnter?.();
      }}
      onMouseLeave={() => {
        setHovered(false);
        onMouseLeave?.();
      }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        unoptimized={unoptimized}
        className={`block w-full h-full ${
          fit === "cover" ? "object-cover" : "object-contain"
        } ${!noZoom ? "transition-transform duration-[1.2s] ease-out" : ""} ${
          !noZoom ? (hovered ? "scale-[1.02]" : "scale-100") : ""
        } ${imgClassName}`}
      />
    </div>
  );
}
