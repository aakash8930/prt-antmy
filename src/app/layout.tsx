import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import "@/components/story/story.css";
import "@/components/build-graph/graph-lab.css";

export const metadata: Metadata = {
  title: "Aakash Singh — Full-Stack Software Developer",
  description:
    "The story of how Aakash Singh moved from first browser experiments to client software, connected systems, AI-assisted engineering, and ML experimentation.",
  openGraph: {
    title: "Aakash Singh — Full-Stack Software Developer",
    description:
      "I started by making things work. I became a developer by learning what it takes to make the whole system work.",
    type: "website",
    siteName: "Aakash Singh",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
