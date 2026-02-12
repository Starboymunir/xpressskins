"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Zap, ShoppingBag, User } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/collections", label: "Shop" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/pricing", label: "Get a Quote" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/projects", label: "Active Projects" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "glass-strong shadow-[0_4px_30px_rgba(0,0,0,0.4)]"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-2">
            <Image
              src="/New Xpressskins Logo cut only2 Large.png"
              alt="Xpress Skins"
              width={160}
              height={48}
              className="h-10 w-auto brightness-0 invert transition-all duration-300 group-hover:brightness-100 group-hover:invert-0 group-hover:drop-shadow-[0_0_12px_rgba(255,26,108,0.5)]"
              priority
            />
          </Link>

          {/* Desktop Links */}
          <div className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group relative px-4 py-2 text-[13px] font-medium text-muted-light transition-colors duration-300 hover:text-white"
              >
                {link.label}
                <span className="absolute bottom-0 left-1/2 h-[2px] w-0 -translate-x-1/2 rounded-full bg-gradient-to-r from-accent to-accent2 transition-all duration-300 group-hover:w-3/4" />
              </Link>
            ))}
            <Link href="/pricing" className="btn-primary ml-4 !px-5 !py-2.5 !text-[13px]">
              <ShoppingBag size={14} />
              <span>Shop Now</span>
            </Link>
            <Link
              href="/portal"
              className="ml-2 flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 text-muted-light transition-colors hover:border-accent/30 hover:text-white"
              title="My Account"
            >
              <User size={16} />
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-white transition-colors hover:border-accent/30 lg:hidden"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden glass-strong lg:hidden"
          >
            <div className="space-y-1 px-5 py-6">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="block rounded-xl px-4 py-3 text-sm font-medium text-muted-light transition-colors hover:bg-white/[0.03] hover:text-white"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="pt-3"
              >
                <Link
                  href="/pricing"
                  onClick={() => setIsOpen(false)}
                  className="btn-primary w-full"
                >
                  <Zap size={16} />
                  <span>Start Your Build</span>
                </Link>
                <Link
                  href="/portal"
                  onClick={() => setIsOpen(false)}
                  className="mt-2 flex items-center justify-center gap-2 w-full rounded-xl border border-white/10 px-4 py-3 text-sm font-medium text-muted-light transition-colors hover:bg-white/[0.03] hover:text-white"
                >
                  <User size={16} />
                  <span>My Account</span>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
