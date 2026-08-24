import type { Metadata } from "next";
import "./globals.css";

const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL;
const siteUrl = configuredSiteUrl
  ? configuredSiteUrl.startsWith("http")
    ? configuredSiteUrl
    : `https://${configuredSiteUrl}`
  : undefined;
const metadataBase = siteUrl ? new URL(siteUrl) : undefined;
const socialImage = siteUrl ? `${siteUrl.replace(/\/$/, "")}/og-hero.jpg` : undefined;
const socialImageMetadata = socialImage ? { images: [socialImage] } : {};

export const metadata: Metadata = {
  ...(metadataBase ? { metadataBase } : {}),
  title: "D-01 — Deep Ocean Expedition",
  description: "A futuristic deep-sea exploration submarine, revealed and engineered in front of you through scroll.",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "D-01 — Deep Ocean Expedition",
    description: "A futuristic deep-sea exploration submarine, revealed and engineered in front of you through scroll.",
    ...socialImageMetadata,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    ...socialImageMetadata,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
