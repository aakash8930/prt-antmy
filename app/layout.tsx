import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
const metadataBase = siteUrl ? new URL(siteUrl) : undefined;
const socialImage = siteUrl ? `${siteUrl.replace(/\/$/, "")}/sequence/frame_0000.webp` : undefined;

export const metadata: Metadata = {
  ...(metadataBase ? { metadataBase } : {}),
  title: "Aakash Singh — Full-stack developer",
  description: "Aakash Singh crafts digital systems, intelligent interfaces, and products built to scale.",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "Aakash Singh — Full-stack developer",
    description: "Crafting digital systems with clarity, motion, and purpose.",
    ...(socialImage ? { images: [socialImage] } : {}),
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    ...(socialImage ? { images: [socialImage] } : {}),
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
