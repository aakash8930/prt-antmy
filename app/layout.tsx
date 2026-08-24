import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: "D-01 — Deep Ocean Expedition",
  description: "A futuristic deep-sea exploration submarine, revealed and engineered in front of you through scroll.",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "D-01 — Deep Ocean Expedition",
    description: "A futuristic deep-sea exploration submarine, revealed and engineered in front of you through scroll.",
    images: ["/og-hero.jpg"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og-hero.jpg"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
