"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/components/Footer";

export default function PublicFooter() {
  const path = usePathname() || "";
  if (path.startsWith("/admin") || path.startsWith("/portal")) return null;
  return <Footer />;
}
