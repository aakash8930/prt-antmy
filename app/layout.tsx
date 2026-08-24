import type { Metadata } from "next";
import "./globals.css";

const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL;
const siteUrl = configuredSiteUrl
  ? configuredSiteUrl.startsWith("http")
    ? configuredSiteUrl
    : `https://${configuredSiteUrl}`
  : undefined;
const metadataBase = siteUrl ? new URL(siteUrl) : undefined;
const socialImage = siteUrl ? `${siteUrl.replace(/\/$/, "")}/ai-core-style-frame.jpg` : undefined;
const socialImageMetadata = socialImage ? { images: [socialImage] } : {};

export const metadata: Metadata = {
  ...(metadataBase ? { metadataBase } : {}),
  title: "NEXUS — AI systems in motion",
  description: "A living interface for the next generation of artificial intelligence.",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "NEXUS — AI systems in motion",
    description: "A living interface for the next generation of artificial intelligence.",
    ...socialImageMetadata,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    ...socialImageMetadata,
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
