import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin, ArrowUpRight } from "lucide-react";

const footerLinks = [
  {
    title: "Services",
    links: [
      { label: "Custom Itasha Wraps", href: "/pricing" },
      { label: "Semi-Custom Designs", href: "/pricing" },
      { label: "Pre-Made Designs", href: "/portfolio" },
      { label: "Professional Install", href: "/how-it-works" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "How It Works", href: "/how-it-works" },
      { label: "Portfolio", href: "/portfolio" },
      { label: "Active Projects", href: "/projects" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "Refund Policy", href: "#" },
    ],
  },
];

const socials = [
  { label: "Facebook", href: "https://www.facebook.com/xpressskins2018/" },
  { label: "Instagram", href: "https://www.instagram.com/xpressskins/" },
  { label: "YouTube", href: "https://www.youtube.com/@XpressSkins" },
  { label: "TikTok", href: "#" },
  { label: "X", href: "https://x.com/XpressSkins" },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-surface-0">
      {/* Top accent line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

      {/* Subtle bg orb */}
      <div className="pointer-events-none absolute bottom-0 left-[20%] h-96 w-96 rounded-full bg-accent/[0.03] blur-[150px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-5 lg:px-8">
        {/* Main grid */}
        <div className="grid grid-cols-1 gap-12 py-16 md:grid-cols-2 lg:grid-cols-12 lg:gap-8 lg:py-20">
          {/* Brand */}
          <div className="lg:col-span-4">
            <Link href="/" className="group mb-5 inline-block">
              <Image
                src="/New Xpressskins Logo cut only2 Large.png"
                alt="Xpress Skins"
                width={180}
                height={54}
                className="h-12 w-auto brightness-0 invert transition-all duration-300 group-hover:brightness-100 group-hover:invert-0"
              />
            </Link>
            <p className="mb-7 max-w-sm text-sm leading-relaxed text-muted">
              Founded in 2020, Xpress Skins Inc. is a creative movement
              dedicated to inspiring self-expression through custom anime vehicle
              wraps. Turn what you love into art on wheels.
            </p>
            <div className="space-y-3 text-sm">
              <a
                href="tel:+13463177987"
                className="group flex items-center gap-3 text-muted transition-colors hover:text-accent"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/5 bg-white/[0.02] transition-colors group-hover:border-accent/20">
                  <Phone size={13} />
                </div>
                (346) 317-7987
              </a>
              <a
                href="mailto:info@xpressskins.com"
                className="group flex items-center gap-3 text-muted transition-colors hover:text-accent"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/5 bg-white/[0.02] transition-colors group-hover:border-accent/20">
                  <Mail size={13} />
                </div>
                info@xpressskins.com
              </a>
              <div className="flex items-center gap-3 text-muted">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/5 bg-white/[0.02]">
                  <MapPin size={13} />
                </div>
                1804 W Sam Houston Pkwy N, Houston, TX 77043
              </div>
            </div>
          </div>

          {/* Link groups */}
          {footerLinks.map((group) => (
            <div key={group.title} className="lg:col-span-2">
              <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-white">
                {group.title}
              </h4>
              <ul className="space-y-3">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center gap-1 text-sm text-muted transition-colors duration-300 hover:text-white"
                    >
                      {link.label}
                      <ArrowUpRight
                        size={10}
                        className="translate-x-0.5 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-40"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Socials */}
          <div className="lg:col-span-2">
            <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-white">
              Follow Us
            </h4>
            <div className="flex flex-wrap gap-2">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-white/5 bg-white/[0.02] px-3 py-1.5 text-xs font-medium text-muted transition-all duration-300 hover:border-accent/20 hover:bg-accent/[0.06] hover:text-white"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-3 border-t border-white/[0.04] py-6 md:flex-row">
          <span className="text-xs text-muted">
            &copy; {new Date().getFullYear()} Xpress Skins Inc. All rights reserved.
          </span>
          <span className="text-xs text-muted/50">
            Designed with passion in Houston, TX
          </span>
        </div>
      </div>
    </footer>
  );
}
