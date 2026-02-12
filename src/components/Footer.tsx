import Link from "next/link";
import {
  Facebook,
  Instagram,
  Youtube,
  Twitter,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";

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
  { icon: Facebook, href: "https://www.facebook.com/xpressskins2018/", label: "Facebook" },
  { icon: Instagram, href: "https://www.instagram.com/xpressskins/", label: "Instagram" },
  { icon: Youtube, href: "https://www.youtube.com/@XpressSkins", label: "YouTube" },
  { icon: Twitter, href: "https://x.com/XpressSkins", label: "X" },
];

export function Footer() {
  return (
    <footer className="relative bg-dark-900 border-t border-white/5">
      {/* Gradient line at top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-pink to-transparent" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-neon-pink to-neon-purple flex items-center justify-center font-black text-lg text-white">
                X
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight text-white">
                  XPRESS SKINS
                </span>
                <span className="text-[10px] tracking-[0.3em] text-dark-300 uppercase">
                  Itasha Studio
                </span>
              </div>
            </Link>
            <p className="text-dark-300 text-sm leading-relaxed max-w-sm mb-6">
              Founded in 2020, Xpress Skins Inc. is a creative movement dedicated
              to inspiring self-expression through custom anime vehicle wraps.
              Turn what you love into art on wheels.
            </p>
            <div className="space-y-3 text-sm text-dark-300">
              <a href="tel:+13463177987" className="flex items-center gap-3 hover:text-neon-pink transition-colors">
                <Phone size={16} />
                (346) 317-7987
              </a>
              <a href="mailto:info@xpressskins.com" className="flex items-center gap-3 hover:text-neon-pink transition-colors">
                <Mail size={16} />
                info@xpressskins.com
              </a>
              <div className="flex items-center gap-3">
                <MapPin size={16} className="shrink-0" />
                1804 W Sam Houston Pkwy N, Houston, TX 77043
              </div>
            </div>
          </div>

          {/* Links */}
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">
                {group.title}
              </h4>
              <ul className="space-y-3">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-dark-300 text-sm hover:text-neon-pink transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <span className="text-dark-400 text-xs">
            &copy; {new Date().getFullYear()} Xpress Skins Inc. All rights reserved.
          </span>
          <div className="flex items-center gap-4">
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-dark-300 hover:text-neon-pink hover:bg-neon-pink/10 transition-all"
              >
                <social.icon size={16} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
