"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowUpRight, ArrowUp } from "lucide-react";

const COLS = [
  { title: "Build", links: [["Price your wrap", "/#build"], ["How it works", "/how-it-works"], ["Live builds", "/projects"], ["Customer portal", "/portal"]] },
  { title: "Studio", links: [["Portfolio", "/portfolio"], ["Contact", "/contact"], ["Instagram", "https://www.instagram.com/xpressskins/"], ["YouTube", "https://www.youtube.com/@XpressSkins"]] },
  { title: "Legal", links: [["Privacy", "#"], ["Terms", "#"], ["Refunds", "#"]] },
];

export function Footer() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString("en-US", { timeZone: "America/Chicago", hour: "2-digit", minute: "2-digit" }));
    tick(); const id = setInterval(tick, 15000); return () => clearInterval(id);
  }, []);
  return (
    <footer className="relative overflow-hidden border-t border-white/[0.06] bg-[#050507] text-white">
      <div className="mx-auto max-w-[1600px] px-5 pt-20 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <p className="t-label text-white/40">Xpress Skins Inc.</p>
            <p className="t-display mt-4 max-w-sm text-3xl leading-tight">Custom itasha wraps.<br /><span className="t-serif text-[var(--mag)]">Houston, shipped anywhere.</span></p>
            <div className="mt-8 flex flex-wrap gap-x-8 gap-y-2 t-label text-white/45">
              <span>Houston · {time} CT</span>
              <span>Est. 2020</span>
              <a href="mailto:hello@xpressskins.com" className="hover:text-white">hello@xpressskins.com</a>
            </div>
          </div>
          {COLS.map((c) => (
            <div key={c.title}>
              <p className="t-label text-white/40">{c.title}</p>
              <ul className="mt-5 space-y-3">
                {c.links.map(([label, href]) => (
                  <li key={label}>
                    <Link href={href} className="group inline-flex items-center gap-1 text-[15px] text-white/75 transition-colors hover:text-white">
                      {label}<ArrowUpRight size={13} className="opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex items-center justify-between border-t border-white/[0.06] py-5 t-label text-white/35">
          <span>© {new Date().getFullYear()} Xpress Skins Inc. All wraps original.</span>
          <a href="#top" className="flex items-center gap-2 hover:text-white">Top <ArrowUp size={12} /></a>
        </div>
      </div>
      {/* giant wordmark clipped at the bottom */}
      <div aria-hidden className="pointer-events-none select-none overflow-hidden">
        <p className="t-display -mb-[0.22em] whitespace-nowrap text-center text-[18vw] leading-none tracking-[-0.04em] text-white/[0.05]">XPRESS SKINS</p>
      </div>
    </footer>
  );
}
