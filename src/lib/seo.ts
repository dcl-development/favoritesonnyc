import type { Metadata } from "next";

export const ogImage = {
  url: "/photos/og.jpg",
  width: 719,
  height: 960,
  alt: "Favorite Son on Forest Avenue",
};

/** Per-page canonical plus Open Graph, so shared links show the right page title and URL. */
export function pageMetadata(path: string, title: string, description: string): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `${title} · favorite son`,
      description,
      url: path,
      siteName: "favorite son",
      images: [ogImage],
      locale: "en_US",
      type: "website",
    },
  };
}
