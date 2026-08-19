import type { Metadata } from "next";
import "./globals.css";
import "@/components/blueprint/blueprint.css";

export const metadata: Metadata = {
  title: "System Volume — Blueprint Prototype",
  description:
    "A scroll-driven technical drawing that constructs itself into a software system's architecture.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
