import type { Metadata } from "next";
import { BuildGraphLab } from "@/components/build-graph/BuildGraphLab";

export const metadata: Metadata = {
  title: "Living Build Graph — Prototype",
  robots: { index: false, follow: false },
};

export default function GraphLabPage() {
  return <BuildGraphLab />;
}
