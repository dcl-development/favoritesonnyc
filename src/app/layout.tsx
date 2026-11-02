import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { PieLight } from "@/components/PieLight";
import { HoursProvider } from "@/components/HoursProvider";
import { StickyBar } from "@/components/StickyBar";
import { getHours } from "@/lib/cms";
import {
  hoursSentence,
  openingHoursSpecification,
  specialOpeningHoursSpecification,
  type Hours,
} from "@/lib/hours";
import { restaurant } from "@/content/site";
import "./globals.css";

// Cutive is the fallback for devices without American Typewriter (Windows, Android).
// Its vertical metrics are overridden to American Typewriter's (UPM 1000, hhea ascender 904,
// descender -250, line gap 0) so text sits on the same baseline and centres the same way.
// File: Google Fonts' Cutive v24 latin subset (OFL, see src/fonts/Cutive-OFL.txt).
const cutive = localFont({
  src: "../fonts/Cutive-Regular-latin.woff2",
  weight: "400",
  style: "normal",
  display: "swap",
  variable: "--font-cutive",
  declarations: [
    { prop: "ascent-override", value: "90.4%" },
    { prop: "descent-override", value: "25%" },
    { prop: "line-gap-override", value: "0%" },
  ],
});

function describe(hours: Hours) {
  return `100% sourdough pizza, natural wine, and cocktails at 1210 Forest Avenue, Staten Island. ${hoursSentence(hours)} Dine-in, walk-in.`;
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#f8f4eb",
};

export async function generateMetadata(): Promise<Metadata> {
  const description = describe(await getHours());
  return {
  metadataBase: new URL(restaurant.url),
  title: {
    default: "favorite son",
    template: "%s · favorite son",
  },
  description,
  openGraph: {
    title: "favorite son",
    description,
    url: restaurant.url,
    siteName: "favorite son",
    images: [{ url: "/photos/og.jpg", width: 719, height: 960, alt: "Favorite Son on Forest Avenue" }],
    locale: "en_US",
    type: "website",
  },
  };
}

const structuredData = (hours: Hours) => ({
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: restaurant.legalName,
  servesCuisine: "Pizza",
  url: restaurant.url,
  email: restaurant.email,
  telephone: restaurant.phoneTel,
  image: `${restaurant.url}/photos/og.jpg`,
  address: {
    "@type": "PostalAddress",
    streetAddress: restaurant.address.street,
    addressLocality: restaurant.address.city,
    addressRegion: restaurant.address.region,
    postalCode: restaurant.address.postal,
    addressCountry: "US",
  },
  openingHoursSpecification: openingHoursSpecification(hours),
  ...(hours.special.length
    ? { specialOpeningHoursSpecification: specialOpeningHoursSpecification(hours) }
    : {}),
  acceptsReservations: true,
  potentialAction: {
    "@type": "ReserveAction",
    target: restaurant.reserve,
  },
  sameAs: [restaurant.instagram],
  hasMenu: `${restaurant.url}/menu`,
});

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const hours = await getHours();
  return (
    <html lang="en" className={`reveal-ready ${cutive.variable}`}>
      <body>
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData(hours)) }}
        />
        <a className="skip" href="#content">
          skip to content
        </a>
        <HoursProvider hours={hours}>
          <PieLight />
          <StickyBar />
          <div id="content">{children}</div>
        </HoursProvider>
      </body>
    </html>
  );
}
