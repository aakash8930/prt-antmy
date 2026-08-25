import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VOLT — Engineered to Move",
  description:
    "VOLT is a high-performance electric motorcycle. A cinematic, scroll-driven brand experience.",
};

export const viewport: Viewport = {
  themeColor: "#07090a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#07090a] text-[#eef1ee] antialiased">{children}</body>
    </html>
  );
}
