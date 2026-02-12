"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { AnimatedSection } from "@/components/AnimatedSection";
import {
  Palette,
  Truck,
  Shield,
  Sparkles,
  ArrowRight,
  Star,
  Zap,
  Eye,
  ChevronRight,
} from "lucide-react";

// Placeholder images - replace with real portfolio images
const heroImages = [
  "https://images.unsplash.com/photo-1619405399517-d7fce0f13302?w=800&q=80",
  "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80",
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80",
];

const stats = [
  { value: "500+", label: "Wraps Completed" },
  { value: "4.9", label: "Average Rating", icon: Star },
  { value: "5+", label: "Years Experience" },
  { value: "100%", label: "Satisfaction" },
];

const features = [
  {
    icon: Palette,
    title: "Custom Anime Artwork",
    description:
      "Original Itasha designs by talented artists, tailored to your vision and vehicle.",
  },
  {
    icon: Shield,
    title: "Premium Materials",
    description:
      "Avery Dennison & 3M vinyl with high-gloss UV lamination for lasting vibrancy.",
  },
  {
    icon: Truck,
    title: "Nationwide Shipping",
    description:
      "We ship finished wraps anywhere in the US, or install locally in Houston, TX.",
  },
  {
    icon: Sparkles,
    title: "Bold, Head-Turning",
    description:
      "Your car becomes a conversation piece. Stand out at meets, shows, or just on the road.",
  },
];

const processSteps = [
  {
    step: "01",
    title: "Configure Your Build",
    description: "Select your vehicle, coverage area, and design tier using our interactive pricing tool.",
  },
  {
    step: "02",
    title: "Custom Artwork",
    description: "Our artists create your unique Itasha design with revisions until you're 100% satisfied.",
  },
  {
    step: "03",
    title: "Premium Print",
    description: "Printed on 60\" Avery vinyl with high-gloss UV lamination for maximum impact.",
  },
  {
    step: "04",
    title: "Ship or Install",
    description: "Receive your wrap shipped to your door, or get professional installation in Houston.",
  },
];

export default function Home() {
  return (
    <>
      {/* ==================== HERO ==================== */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-[#050505]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-neon-pink/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-neon-purple/5 rounded-full blur-[120px]" />
        
        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-32 pb-20 w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left - Text */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-neon-pink/20 bg-neon-pink/5 text-neon-pink text-xs font-medium mb-8">
                  <Zap size={14} />
                  Houston&apos;s Premier Itasha Studio
                </div>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[0.95] tracking-tight mb-6"
              >
                <span className="text-white">YOUR RIDE.</span>
                <br />
                <span className="bg-gradient-to-r from-neon-pink via-neon-purple to-neon-blue bg-clip-text text-transparent">
                  YOUR ANIME.
                </span>
                <br />
                <span className="text-white">YOUR ART.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-lg text-dark-300 max-w-lg mb-10 leading-relaxed"
              >
                Transform your vehicle into a rolling masterpiece. Custom Itasha anime wraps
                designed, printed on premium Avery vinyl, and shipped or installed by
                Xpress Skins Inc.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link
                  href="/pricing"
                  className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 text-base font-bold text-white bg-gradient-to-r from-neon-pink to-neon-purple rounded-full overflow-hidden transition-all hover:shadow-[0_0_40px_#ff2d7b44] hover:scale-105"
                >
                  <span className="relative z-10">Build Your Wrap</span>
                  <ArrowRight size={18} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/portfolio"
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 text-base font-semibold text-white border border-white/10 rounded-full hover:bg-white/5 transition-all"
                >
                  <Eye size={18} />
                  View Portfolio
                </Link>
              </motion.div>
            </div>

            {/* Right - Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="relative hidden lg:block"
            >
              <div className="relative w-full aspect-square">
                {/* Main image placeholder */}
                <div className="absolute inset-8 rounded-3xl bg-gradient-to-br from-dark-700 to-dark-800 border border-white/5 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-neon-pink/10 to-neon-purple/10" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-8xl mb-4">🏎️</div>
                      <p className="text-dark-400 text-sm">Portfolio images will go here</p>
                    </div>
                  </div>
                </div>
                {/* Floating elements */}
                <div className="absolute top-4 right-4 px-4 py-2 rounded-xl bg-dark-800/80 backdrop-blur border border-white/10 text-sm">
                  <span className="text-neon-pink font-bold">★ 4.9</span>
                  <span className="text-dark-300 ml-2">200+ Reviews</span>
                </div>
                <div className="absolute bottom-4 left-4 px-4 py-2 rounded-xl bg-dark-800/80 backdrop-blur border border-white/10 text-sm">
                  <span className="text-neon-cyan font-bold">🔥 Trending</span>
                  <span className="text-dark-300 ml-2">Full Itasha</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="text-center p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-neon-pink/20 transition-colors"
              >
                <div className="text-3xl font-black text-white mb-1">{stat.value}</div>
                <div className="text-sm text-dark-400">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ==================== FEATURES ==================== */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-dark-900" />
        <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-neon-purple/5 rounded-full blur-[120px]" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <span className="inline-block text-neon-pink text-sm font-semibold tracking-wider uppercase mb-4">
              Why Xpress Skins
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              Not Just a Wrap.{" "}
              <span className="bg-gradient-to-r from-neon-pink to-neon-purple bg-clip-text text-transparent">
                A Statement.
              </span>
            </h2>
            <p className="text-dark-300 text-lg max-w-2xl mx-auto">
              We don&apos;t do generic. Every Itasha wrap is a custom piece of art that turns
              heads and starts conversations.
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <AnimatedSection key={feature.title} delay={i * 0.1}>
                <div className="group h-full p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-neon-pink/30 transition-all duration-500 hover:shadow-[0_0_40px_#ff2d7b11]">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-pink/20 to-neon-purple/20 flex items-center justify-center mb-6 group-hover:shadow-[0_0_20px_#ff2d7b33] transition-shadow">
                    <feature.icon size={22} className="text-neon-pink" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-dark-300 text-sm leading-relaxed">{feature.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== PROCESS ==================== */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[#050505]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-neon-blue/5 rounded-full blur-[120px]" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <span className="inline-block text-neon-cyan text-sm font-semibold tracking-wider uppercase mb-4">
              The Process
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              Four Steps to Your{" "}
              <span className="bg-gradient-to-r from-neon-cyan to-neon-blue bg-clip-text text-transparent">
                Dream Wrap
              </span>
            </h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {processSteps.map((step, i) => (
              <AnimatedSection key={step.step} delay={i * 0.15}>
                <div className="relative group p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-neon-cyan/20 transition-all h-full">
                  <span className="text-6xl font-black bg-gradient-to-b from-white/10 to-transparent bg-clip-text text-transparent">
                    {step.step}
                  </span>
                  <h3 className="text-lg font-bold text-white mt-4 mb-3">{step.title}</h3>
                  <p className="text-dark-300 text-sm leading-relaxed">{step.description}</p>
                  {i < 3 && (
                    <ChevronRight
                      size={20}
                      className="hidden lg:block absolute top-1/2 -right-3 text-dark-500"
                    />
                  )}
                </div>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection className="text-center mt-12" delay={0.6}>
            <Link
              href="/how-it-works"
              className="inline-flex items-center gap-2 text-neon-cyan font-medium hover:gap-3 transition-all"
            >
              Learn more about our process
              <ArrowRight size={16} />
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* ==================== PAYMENT STRUCTURE ==================== */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-dark-900" />
        <div className="absolute top-0 left-1/2 w-[600px] h-[600px] bg-neon-pink/5 rounded-full blur-[120px]" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <span className="inline-block text-neon-pink text-sm font-semibold tracking-wider uppercase mb-4">
              Flexible Payment
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              Pay As We{" "}
              <span className="bg-gradient-to-r from-neon-pink to-neon-purple bg-clip-text text-transparent">
                Progress
              </span>
            </h2>
            <p className="text-dark-300 text-lg max-w-2xl mx-auto">
              No surprises. You pay in milestones so you always know where your money goes.
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                percent: "25%",
                title: "Start Custom Art",
                description: "Kick off your project. Our artists begin creating your custom Itasha design.",
                color: "from-neon-pink to-neon-purple",
              },
              {
                percent: "25%",
                title: "Design Approval",
                description: "After revisions and final approval of your artwork.",
                color: "from-neon-purple to-neon-blue",
              },
              {
                percent: "50%",
                title: "Print & Ship/Install",
                description: "Final payment to print on premium vinyl and ship or install.",
                color: "from-neon-blue to-neon-cyan",
              },
            ].map((payment, i) => (
              <AnimatedSection key={payment.title} delay={i * 0.15}>
                <div className="relative p-8 rounded-2xl bg-white/[0.02] border border-white/5 text-center h-full hover:border-neon-pink/20 transition-all">
                  <div
                    className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br ${payment.color} mb-6`}
                  >
                    <span className="text-2xl font-black text-white">{payment.percent}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3">{payment.title}</h3>
                  <p className="text-dark-300 text-sm leading-relaxed">{payment.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== CTA ==================== */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[#050505]" />
        <div className="absolute inset-0 bg-gradient-to-b from-neon-pink/5 via-transparent to-transparent" />

        <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <AnimatedSection>
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
              Ready to Turn Heads?
            </h2>
            <p className="text-dark-300 text-lg max-w-2xl mx-auto mb-10">
              Join 500+ satisfied customers who turned their vehicles into anime masterpieces.
              Get your instant quote in under 2 minutes.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/pricing"
                className="group inline-flex items-center gap-3 px-10 py-5 text-lg font-bold text-white bg-gradient-to-r from-neon-pink to-neon-purple rounded-full hover:shadow-[0_0_60px_#ff2d7b44] hover:scale-105 transition-all"
              >
                Get Your Instant Quote
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-5 text-lg font-semibold text-dark-300 hover:text-white transition-colors"
              >
                or Contact Us
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
