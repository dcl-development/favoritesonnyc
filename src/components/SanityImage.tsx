"use client";

import Image, { type ImageProps } from "next/image";
import sanityImageLoader from "@/lib/sanityImageLoader";

export type SanityImageProps = Omit<ImageProps, "loader">;

export function SanityImage({ alt, ...props }: SanityImageProps) {
  return <Image alt={alt} {...props} loader={sanityImageLoader} />;
}
