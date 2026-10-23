import type { ImageLoaderProps } from "next/image";

/** Sanity CDN URLs only — local /public paths are returned unchanged. */
export function isSanityImageSrc(src: string): boolean {
  return src.startsWith("https://cdn.sanity.io/");
}

// Per-image next/image loader for Sanity URLs. Sanity's CDN resizes for free;
// local /public assets keep Vercel's default image optimization when used without this loader.
export default function sanityImageLoader({
  src,
  width,
  quality,
}: ImageLoaderProps): string {
  if (!isSanityImageSrc(src)) {
    return src;
  }

  const url = new URL(src);
  url.searchParams.set("w", String(width));
  url.searchParams.set("q", String(quality || url.searchParams.get("q") || 75));
  if (!url.searchParams.has("fit")) url.searchParams.set("fit", "max");
  if (!url.searchParams.has("auto")) url.searchParams.set("auto", "format");
  return url.toString();
}
