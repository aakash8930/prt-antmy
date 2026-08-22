import type { Metadata } from "next";
import "./globals.css";
import "@/components/blueprint/blueprint.css";
import "@/components/site/site.css";

export const metadata: Metadata = {
  title: "Aakash Singh — Full-Stack Software Developer",
  description:
    "Aakash Singh — full-stack software developer building web, mobile and backend systems, APIs, automation and AI-assisted products.",
  openGraph: {
    title: "Aakash Singh — Full-Stack Software Developer",
    description:
      "Full-stack software developer building web, mobile and backend systems, APIs, automation and AI-assisted products.",
    type: "website",
    siteName: "Aakash Singh",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
