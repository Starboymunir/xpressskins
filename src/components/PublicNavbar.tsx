"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/Navbar";

export default function PublicNavbar() {
  const path = usePathname() || "";
  if (path.startsWith("/admin") || path.startsWith("/portal")) return null;
  return <Navbar />;
}
