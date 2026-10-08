"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { driveImg, portfolioImages } from "@/data/assets";

const LINKS = [
  { href: "/", label: "Home", jp: "家", img: 11 },
  { href: "/#build", label: "Price your wrap", jp: "見積", img: 59 },
  { href: "/portfolio", label: "Portfolio", jp: "作品", img: 2 },
  { href: "/projects", label: "Live builds", jp: "製作中", img: 44 },
  { href: "/how-it-works", label: "How it works", jp: "流れ", img: 41 },
  { href: "/contact", label: "Contact", jp: "連絡", img: 13 },
];

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hover, setHover] = useState(0);
  const path = usePathname();

  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 40);
    f(); window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);
  useEffect(() => { setOpen(false); }, [path]);
  useEffect(() => { document.documentElement.style.overflow = open ? "hidden" : ""; }, [open]);

  return (
    <>
      <motion.header
        initial={{ y: -80 }} animate={{ y: 0 }} transition={{ duration: 1, delay: 0.2, ease: EASE }}
        className={`fixed inset-x-0 top-0 z-[80] transition-colors duration-500 ${scrolled && !open ? "bg-[#050507]/70 backdrop-blur-xl" : ""}`}
      >
        <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-4 md:h-[72px] md:px-5 lg:px-10">
          <Link href="/" className="relative z-[90] flex items-center gap-3" aria-label="Xpress Skins home">
            <Image src="/New Xpressskins Logo cut only2 Large.png" alt="Xpress Skins" width={150} height={36} className="h-6 w-auto brightness-0 invert md:h-7" priority />
          </Link>

          <div className="relative z-[90] flex items-center gap-3">
            <span className="hidden md:block"><Link href="/#build" className="btn-pill btn-pill-light !py-2.5 !text-[11px]"><span className="btn-pill-txt">Price my wrap</span></Link></span>
            <button
              onClick={() => setOpen(!open)}
              className="group flex h-10 items-center gap-3 rounded-full border border-white/15 bg-black/30 px-3.5 backdrop-blur md:h-11 md:px-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-white transition-colors hover:border-white/40"
              aria-expanded={open}
            >
              <span className="hidden sm:inline">{open ? "Close" : "Menu"}</span>
              <span className="relative h-3 w-5">
                <span className={`absolute left-0 top-0 h-[1.5px] w-5 bg-white transition-transform duration-300 ${open ? "translate-y-[5px] rotate-45" : ""}`} />
                <span className={`absolute left-0 top-[5px] h-[1.5px] w-5 bg-white transition-opacity duration-300 ${open ? "opacity-0" : ""}`} />
                <span className={`absolute left-0 top-[10px] h-[1.5px] w-5 bg-white transition-transform duration-300 ${open ? "-translate-y-[5px] -rotate-45" : ""}`} />
              </span>
            </button>
          </div>
        </div>
      </motion.header>

      {/* full-screen menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[70] bg-[#050507]"
            initial={{ clipPath: "inset(0 0 100% 0)" }} animate={{ clipPath: "inset(0 0 0% 0)" }} exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            <div className="absolute inset-0 hidden lg:block">
              <AnimatePresence mode="wait">
                <motion.div key={hover} className="absolute inset-y-0 right-0 w-[46%]" initial={{ opacity: 0, scale: 1.08 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.7, ease: EASE }}>
                  <Image src={driveImg(portfolioImages[LINKS[hover].img].id)} alt="" fill className="object-cover opacity-70" sizes="50vw" />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#050507] via-transparent to-transparent" />
                </motion.div>
              </AnimatePresence>
            </div>
            <nav className="relative flex h-full flex-col justify-center px-6 lg:px-10">
              <ul className="space-y-1">
                {LINKS.map((l, i) => (
                  <li key={l.href} className="overflow-hidden">
                    <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ duration: 0.8, delay: 0.15 + i * 0.06, ease: EASE }}>
                      <Link
                        href={l.href}
                        onMouseEnter={() => setHover(i)}
                        onClick={() => setOpen(false)}
                        className="group flex items-baseline gap-5 py-1"
                      >
                        <span className="t-label w-8 text-white/35">0{i + 1}</span>
                        <span className="t-display text-[clamp(2.4rem,7vw,6rem)] leading-[0.95] text-white/85 transition-colors group-hover:text-white">{l.label}</span>
                        <span className="t-jp hidden text-xl text-[var(--mag)] opacity-0 transition-opacity group-hover:opacity-100 md:inline">{l.jp}</span>
                      </Link>
                    </motion.div>
                  </li>
                ))}
              </ul>
              <motion.div className="mt-10 flex flex-wrap gap-x-10 gap-y-3 t-label text-white/45" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
                <a href="https://www.instagram.com/xpressskins/" target="_blank" rel="noreferrer" className="hover:text-white">Instagram</a>
                <a href="https://www.youtube.com/@XpressSkins" target="_blank" rel="noreferrer" className="hover:text-white">YouTube</a>
                <Link href="/portal" className="hover:text-white">Customer portal</Link>
                <span>Houston, TX</span>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
