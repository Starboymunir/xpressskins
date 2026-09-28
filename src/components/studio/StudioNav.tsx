"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const LINKS = [
  { href: "#studio", label: "Studio" },
  { href: "#process", label: "Process" },
  { href: "#gallery", label: "Gallery" },
  { href: "/projects", label: "Live builds" },
  { href: "/contact", label: "Contact" },
  { href: "/portal", label: "Portal" },
];

export function StudioNav() {
  const [open, setOpen] = useState(false);
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b-4 border-[var(--ink)] bg-[var(--ink)] text-white">
      <div className="mx-auto flex h-16 max-w-[1500px] items-center justify-between px-4 lg:px-8">
        <Link href="/studio" className="-rotate-2 border-[3px] border-[var(--ink)] bg-white px-3 py-1.5 shadow-[4px_4px_0_var(--mag)] transition-transform hover:rotate-1">
          <Image src="/New Xpressskins Logo cut only2 Large.png" alt="Xpress Skins" width={150} height={36} className="h-7 w-auto brightness-0" priority />
        </Link>
        <nav className="hidden items-center gap-6 lg:flex">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="mg-label text-[11px] text-white/85 transition-colors hover:text-[var(--yellow)]">{l.label}</Link>
          ))}
          <Link href="#studio" className="mg-btn mg-btn-yellow !border-white !py-2 !text-base">Get my price!</Link>
        </nav>
        <button className="flex h-10 w-10 items-center justify-center border-2 border-white lg:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>
      {open && (
        <div className="border-t-4 border-[var(--mag)] bg-[var(--ink)] px-5 py-4 lg:hidden">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="mg-title block py-2 text-3xl text-white hover:text-[var(--yellow)]">{l.label}</Link>
          ))}
          <Link href="#studio" onClick={() => setOpen(false)} className="mg-btn mg-btn-yellow mt-3 w-full">Get my price!</Link>
        </div>
      )}
    </header>
  );
}
