import type { Metadata } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import { site } from "@/lib/data";
import SmoothScrollProvider from "@/lib/smooth-scroll";
import Background from "@/components/Background";
import Cursor from "@/components/Cursor";
import Nav from "@/components/Nav";
import "./globals.css";

const display = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "variable",
  style: ["normal", "italic"],
  axes: ["SOFT", "opsz"],
});

const body = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: `${site.name} — ${site.title}`,
  description: site.description,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Background />
        <SmoothScrollProvider>
          <Cursor />
          <Nav />
          {children}
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
