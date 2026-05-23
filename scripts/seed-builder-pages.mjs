#!/usr/bin/env node
/**
 * Seed builder_pages with Puck JSON trees that recreate the existing
 * hard-coded designs for the home, contact, how-it-works and portfolio pages.
 *
 * Requirements:
 *   - SUPABASE_URL env var
 *   - SUPABASE_SERVICE_ROLE_KEY env var
 *
 * Usage:
 *   cd xpressskins-site
 *   $env:SUPABASE_URL="https://xxxx.supabase.co"
 *   $env:SUPABASE_SERVICE_ROLE_KEY="eyJ..."
 *   node scripts/seed-builder-pages.mjs
 */
import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

// Load .env.local
try {
  const text = readFileSync(resolve(process.cwd(), ".env.local"), "utf8");
  for (const line of text.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/i);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
} catch {}

const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars");
  process.exit(1);
}
const supabase = createClient(url, key, { auth: { persistSession: false } });

/* Real Drive IDs from src/data/assets.ts (portfolioImages, in order). */
const PORTFOLIO_IDS = [
  "1T7a5RDQuv6wPfrbvSZZii6Yt2nMzYcAR", // 0  hero poster
  "19pWPcT-N-psJHq3uRyTa-hQITrTxJUTq", // 1
  "1VdhxRldKnVy1Bw-WiTXJ0ZindSmVnvGc", // 2
  "1jWQr3BrE_LkBKaVGkRFGsrbUlItbZhQr", // 3
  "1mcEwVHe4Kfom5jrY-13uYh_qBAGpUz-a", // 4
  "1SkLmMQjEmu0Yi0nP-QZWHGunbB_AGi0z", // 5
  "1HI2f82JMaISz3MfC1BLA6wEnKUBLFJSF", // 6  CTAOverlay
  "1YCPEuFx9FFkt3HnM_vkZMTT19VhMXldz", // 7
  "1nus0QfhQQWxSsZukZDFM80Beyy8rM_J7", // 8
  "13vN3MyVnaE58WnDhmoMDT7mugcVd5vje", // 9  ImageBanner
  "1IXctyjzyHd1dyw-4xfz_eVT8Gn4L9T0f", // 10
  "1n3-Iz5iNxRB0rePgd8tg-dme0FaTGfoW", // 11
  "1bz9KUk6YwzRCK72zm3Z3sQ-dbVRehSc8", // 12
  "1Eoz9vDo_DVOIJNZ-pIfGGE1g32SDXVeA", // 13
  "1vFBc9fCPAogQ7O2Fnovo8dsdRXsfuOaI", // 14 FeatureSplit img1
  "1kf79pi__xLmSnRamX4cLtJY_RVzgQx_I", // 15
  "1VU5_JpxoQr6GquBehlidPMtnedQ8TyqY", // 16 FeatureSplit img2
];
const ID = () => randomUUID();
const blk = (type, props = {}) => ({ type, props: { id: ID(), ...props } });
const data = (content) => ({ content, root: { props: {} } });

/* ─── HOME ──────────────────────────────────────────────── */
const homeData = data([
  blk("HeroVideo", {
    videoSrc: "/hero-video.mp4",
    posterImageId: PORTFOLIO_IDS[0],
    title: "Custom Itasha Wraps",
    subtitle: "Designed by artists. Printed on premium Avery vinyl. Shipped nationwide.",
    primaryCtaLabel: "Shop Now",
    primaryCtaHref: "/pricing",
    primaryCtaIcon: "ShoppingBag",
    secondaryCtaLabel: "View Portfolio",
    secondaryCtaHref: "/portfolio",
    stats: [
      { val: "500+", lab: "Wraps Completed" },
      { val: "4.9★", lab: "Average Rating" },
      { val: "5+", lab: "Years Experience" },
    ],
  }),
  blk("Marquee", {
    items: [
      { text: "ITASHA WRAPS" }, { text: "CUSTOM ARTWORK" }, { text: "AVERY DENNISON" },
      { text: "UV LAMINATED" }, { text: "HOUSTON TX" }, { text: "NATIONWIDE SHIPPING" },
      { text: "PREMIUM VINYL" }, { text: "ANIME ART" }, { text: "FREE DESIGN CONSULTATION" },
    ],
  }),
  blk("ImageBanner", {
    imageId: PORTFOLIO_IDS[9],
    heading: "Your Vision. Our Craft.",
    gradientWord: "Our Craft.",
    body: "Every Itasha wrap starts with your idea and ends with a rolling masterpiece. We blend artist talent, premium materials, and obsessive attention to detail.",
    ctaLabel: "Start Your Custom Build",
    ctaHref: "/pricing",
    ctaIcon: "Zap",
    height: "medium",
    align: "left",
    overlay: "left-fade",
  }),
  blk("ImageScroller", {
    eyebrow: "Gallery",
    heading: "Straight From the Studio",
    source: "portfolio",
    start: 8,
    count: 16,
    ctaLabel: "See all builds",
    ctaHref: "/portfolio",
  }),
  blk("FeatureSplit", {
    eyebrow: "Why Choose Us",
    heading: "Not Just a Wrap Shop. An Art Studio.",
    gradientWord: "An Art Studio.",
    image1Id: PORTFOLIO_IDS[14],
    image2Id: PORTFOLIO_IDS[16],
    features: [
      { icon: "Palette", title: "Hand-Crafted Artwork", desc: "Each design is original — created by professional anime artists who bring your vision to life." },
      { icon: "Shield", title: "Premium Materials", desc: "Avery Dennison & 3M vinyl with high-gloss UV lamination. Vibrant colors that last 5-7 years." },
      { icon: "Truck", title: "Ship Anywhere in the US", desc: "Nationwide shipping in reinforced tubes, or professional installation at our Houston studio." },
      { icon: "Sparkles", title: "100% Custom", desc: "No templates, no generic designs. Every wrap is made to order with your unique vision." },
    ],
  }),
  blk("PaymentMilestones", {
    eyebrow: "Flexible Payment",
    heading: "Pay As We Progress",
    gradientWord: "Progress",
    subhead: "No surprise invoices. Milestone-based payments tied to real progress.",
    milestones: [
      { pct: "25%", label: "Start Custom Art", desc: "Kick off your project — artists begin your design." },
      { pct: "25%", label: "Design Approval", desc: "Pay once you love the final approved artwork." },
      { pct: "50%", label: "Print & Deliver", desc: "Final payment to print on premium vinyl & ship." },
    ],
    badges: [
      { text: "No Hidden Fees" }, { text: "Revisions Included" },
      { text: "Milestone-Based" }, { text: "Money-Back Guarantee" },
    ],
  }),
  blk("VideoShowcase", {
    eyebrow: "Behind the Scenes",
    heading: "Watch Our Builds Come to Life",
    subhead: "From concept to completion — real footage from our Houston studio.",
    seeAllLabel: "See All",
    seeAllHref: "/portfolio",
    heroIndex: 0, gridStart: 1, gridCount: 6,
  }),
  blk("CTAOverlay", {
    imageId: PORTFOLIO_IDS[6],
    heading: "Ready to Turn Heads?",
    body: "Join 500+ customers who turned their vehicles into anime masterpieces. Get your instant quote in under 2 minutes.",
    primaryLabel: "Shop Now",
    primaryHref: "/pricing",
    primaryIcon: "ShoppingBag",
    secondaryLabel: "Contact Us",
    secondaryHref: "/contact",
    height: "medium",
  }),
  blk("PhysicsBalls"),
]);

/* ─── CONTACT ───────────────────────────────────────────── */
const contactData = data([
  blk("PageHero", {
    title: "Let's Talk",
    gradientWord: "Talk",
    subtitle: "Got a vision? Questions? Just want to chat anime? We're here.",
    halo: "accent",
  }),
  blk("ContactInfoGrid", {
    items: [
      { icon: "Phone", iconColor: "accent", title: "Call Us", line1: "(346) 317-7987", line2: "Mon-Sat, 9AM-6PM CT", href: "tel:+13463177987" },
      { icon: "Mail", iconColor: "accent2", title: "Email", line1: "info@xpressskins.com", line2: "We reply within 24 hours", href: "mailto:info@xpressskins.com" },
      { icon: "MapPin", iconColor: "accent3", title: "Studio", line1: "1804 W Sam Houston Pkwy N", line2: "Houston, TX 77043" },
      { icon: "Clock", iconColor: "accent3", title: "Business Hours", line1: "Monday - Saturday: 9AM - 6PM CT", line2: "Sunday: Closed" },
    ],
  }),
  blk("SocialLinks", {
    heading: "Follow Us",
    links: [
      { label: "Instagram", href: "https://www.instagram.com/xpressskins/" },
      { label: "TikTok", href: "https://www.tiktok.com/@xpress_skins_" },
      { label: "YouTube", href: "https://www.youtube.com/@XpressSkins" },
      { label: "Facebook", href: "https://www.facebook.com/xpressskins2018/" },
    ],
  }),
  blk("ContactForm", {
    buttonLabel: "Send Message",
    successHeading: "Message Sent!",
    successBody: "Thank you for reaching out. We'll get back to you within 24 hours.",
  }),
]);

/* ─── HOW IT WORKS ──────────────────────────────────────── */
const howData = data([
  blk("PageHero", {
    title: "How It Works",
    gradientWord: "Works",
    subtitle: "From your idea to a rolling masterpiece in 6 simple steps.",
    halo: "accent",
  }),
  blk("StepTimeline", {
    steps: [
      { number: "01", icon: "CreditCard", title: "Configure & Pay Deposit", desc: "Use our interactive pricing tool to build your wrap. Pay the 25% deposit to kick off your project.", color: "from-accent to-accent2" },
      { number: "02", icon: "Palette", title: "Custom Artwork Design", desc: "Our anime artists craft an original design just for you. You'll be able to track the progress in your private portal.", color: "from-accent2 to-accent3" },
      { number: "03", icon: "MessageSquare", title: "Review & Approve", desc: "Review the final mockup. Request revisions, then approve and pay the second 25% installment.", color: "from-accent3 to-accent3" },
      { number: "04", icon: "Printer", title: "Premium Print", desc: "Your design is printed on Avery Dennison vinyl and laminated with high-gloss UV lamination for years of vibrant color.", color: "from-accent3 to-accent3" },
      { number: "05", icon: "Truck", title: "Ship or Install", desc: "Pay the final 50%. We ship nationwide in reinforced tubes or you can come to our Houston studio for a pro install.", color: "from-accent3 to-accent2" },
      { number: "06", icon: "CheckCircle2", title: "Hit the Road", desc: "Show off your new Itasha at meets, conventions, or just on your daily — and turn heads everywhere you go.", color: "from-accent2 to-accent" },
    ],
  }),
  blk("PaymentTiers", {
    eyebrow: "Payment Structure",
    heading: "Pay As We Progress",
    subhead: "We split your project into three payments tied to milestones — so your money only moves when the work does.",
    tiers: [
      {
        percent: "25%", label: "First Payment", title: "Kick Off Custom Art",
        items: [{ text: "Project consultation" }, { text: "Artist assignment" }, { text: "Initial concept sketches" }, { text: "Reference gathering" }],
        color: "from-accent to-accent2",
      },
      {
        percent: "25%", label: "Second Payment", title: "Design Approved",
        items: [{ text: "Final artwork delivery" }, { text: "Vehicle template mockup" }, { text: "All revisions completed" }, { text: "Print-ready file prep" }],
        color: "from-accent2 to-accent3",
      },
      {
        percent: "50%", label: "Final Payment", title: "Print & Ship/Install",
        items: [{ text: "60\" Avery vinyl print" }, { text: "High-gloss UV lamination" }, { text: "Quality inspection" }, { text: "Shipping or installation" }],
        color: "from-accent3 to-accent3",
      },
    ],
  }),
  blk("GuaranteeGrid", {
    heading: "Our Guarantees",
    items: [
      { icon: "Shield", title: "Quality Guarantee", desc: "Premium Avery Dennison vinyl rated for 5+ years outdoor durability." },
      { icon: "MessageSquare", title: "Unlimited Revisions", desc: "We don't stop until you love it. Revisions are included in your design package." },
      { icon: "Clock", title: "Transparent Timeline", desc: "Track every stage of your project in real-time through our public project board." },
      { icon: "CreditCard", title: "Milestone Payments", desc: "Pay as we progress. 25% deposit, 25% on approval, 50% on completion." },
    ],
  }),
  blk("CTABanner", {
    heading: "Ready to Get Started?",
    body: "Build your wrap in under 2 minutes with our instant pricing tool.",
    ctaLabel: "Start Now",
    ctaHref: "/pricing",
    background: "surface",
  }),
]);

/* ─── PORTFOLIO ─────────────────────────────────────────── */
const portfolioData = data([
  blk("PageHero", {
    title: "Our Portfolio",
    gradientWord: "Portfolio",
    subtitle: "Real builds. Real customers. Real anime art on real vehicles.",
    halo: "accent2",
  }),
  blk("VideoGallery", {
    eyebrow: "Video Gallery",
    heading: "Watch Our Builds",
    start: 0, count: 6,
  }),
  blk("PortfolioGallery", {
    showFilters: true,
    showCount: true,
  }),
]);

/* ─── upsert each page ──────────────────────────────────── */
const pages = [
  { slug: "home", title: "Home", in_nav: false, nav_label: "Home", nav_order: 0, data: homeData },
  { slug: "contact", title: "Contact", in_nav: true, nav_label: "Contact", nav_order: 4, data: contactData },
  { slug: "how-it-works", title: "How It Works", in_nav: true, nav_label: "How It Works", nav_order: 2, data: howData },
  { slug: "portfolio", title: "Portfolio", in_nav: true, nav_label: "Portfolio", nav_order: 1, data: portfolioData },
];

const now = new Date().toISOString();

for (const p of pages) {
  const row = {
    slug: p.slug,
    title: p.title,
    status: "published",
    draft_data: p.data,
    published_data: p.data,
    in_nav: p.in_nav,
    nav_label: p.nav_label,
    nav_order: p.nav_order,
    seo: { title: p.title, description: "" },
    published_at: now,
    updated_at: now,
  };
  const { error } = await supabase
    .from("builder_pages")
    .upsert(row, { onConflict: "slug" });
  if (error) {
    console.error(`✗ ${p.slug}:`, error.message);
    process.exitCode = 1;
  } else {
    console.log(`✓ Seeded /${p.slug}`);
  }
}
console.log("Done.");
