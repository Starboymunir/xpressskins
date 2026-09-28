"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const LINKS = [
  { href: "#studio", label: "Wrap Studio" },
  { href: "#process", label: "Process" },
  { href: "#gallery", label: "Gallery" },
  { href: "/projects", label: "Live Builds" },
  { href: "/contact", label: "Contact" },
];

export function StudioNav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 10);
    f();
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);

  return (
    <header className={`fixed inset-x-0 top-0 z-50 border-b transition-all ${scrolled ? "border-[var(--line)] bg-[var(--paper)]/90 backdrop-blur-md" : "border-transparent"}`}>
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-5 lg:px-8">
        <Link href="/studio" className="flex items-center gap-3">
          <Image src="/New Xpressskins Logo cut only2 Large.png" alt="Xpress Skins" width={150} height={36} className="h-8 w-auto brightness-0" priority />
        </Link>
        <nav className="hidden items-center gap-7 lg:flex">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[var(--ink-2)] transition-colors hover:text-[var(--mag)]">{l.label}</Link>
          ))}
          <Link href="/portal" className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[var(--ink-2)] hover:text-[var(--mag)]">Portal</Link>
          <Link href="#studio" className="xs-btn !py-2.5">Get my price</Link>
        </nav>
        <button className="flex h-10 w-10 items-center justify-center border border-[var(--line)] lg:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>
      {open && (
        <div className="border-t border-[var(--line)] bg-[var(--paper)] px-5 py-4 lg:hidden">
          {[...LINKS, { href: "/portal", label: "Portal" }].map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="block py-3 text-[13px] font-semibold uppercase tracking-[0.16em] text-[var(--ink)]">{l.label}</Link>
          ))}
          <Link href="#studio" onClick={() => setOpen(false)} className="xs-btn mt-2 w-full">Get my price</Link>
        </div>
      )}
    </header>
  );
}
