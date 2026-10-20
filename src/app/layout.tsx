import type { Metadata, Viewport } from "next";
import { PieLight } from "@/components/PieLight";
import { StickyBar } from "@/components/StickyBar";
import { restaurant } from "@/content/site";
import "./globals.css";

const description =
  "100% sourdough pizza, natural wine, and cocktails at 1210 Forest Avenue, Staten Island. Wednesday–Monday, 5–10. Closed Tuesday. Dine-in, walk-in.";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#f8f4eb",
};

export const metadata: Metadata = {
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

const structuredData = {
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
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: [
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
      "Monday",
    ],
    opens: "17:00",
    closes: "22:00",
  },
  acceptsReservations: true,
  potentialAction: {
    "@type": "ReserveAction",
    target: restaurant.reserve,
  },
  sameAs: [restaurant.instagram],
  hasMenu: `${restaurant.url}/menu`,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="reveal-ready">
      <body>
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <a className="skip" href="#content">
          skip to content
        </a>
        <PieLight />
        <StickyBar />
        <div id="content">{children}</div>
      </body>
    </html>
  );
}
