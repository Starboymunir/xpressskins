"use client";

import { AnimatedSection } from "@/components/AnimatedSection";
import Link from "next/link";
import {
  ArrowRight,
  Palette,
  MessageSquare,
  Printer,
  Truck,
  CheckCircle2,
  CreditCard,
  Clock,
  Shield,
} from "lucide-react";

const steps = [
  {
    icon: CreditCard,
    step: "01",
    title: "Configure & Pay Deposit",
    description:
      "Use our interactive pricing tool to select your vehicle, coverage, and design tier. Pay 25% deposit to kick off your project.",
    color: "from-accent to-accent2",
  },
  {
    icon: Palette,
    step: "02",
    title: "Custom Artwork Design",
    description:
      "Our artists create your unique Itasha design. You'll see progress in your customer portal and can request revisions until it's perfect.",
    color: "from-accent2 to-accent3",
  },
  {
    icon: MessageSquare,
    step: "03",
    title: "Review & Approve",
    description:
      "Review the final mockup on a digital template of your vehicle. Once approved, pay the second 25% and we move to production.",
    color: "from-accent3 to-accent3",
  },
  {
    icon: Printer,
    step: "04",
    title: "Premium Print",
    description:
      "Printed on 60\" Avery Dennison vinyl with high-gloss UV lamination for vibrant colors and protection against sun, rain, and scratches.",
    color: "from-accent3 to-accent3",
  },
  {
    icon: Truck,
    step: "05",
    title: "Ship or Install",
    description:
      "Pay the final 50%. We'll ship your wrap anywhere in the US, or schedule professional installation at our Houston studio.",
    color: "from-accent3 to-accent2",
  },
  {
    icon: CheckCircle2,
    step: "06",
    title: "Hit the Road",
    description:
      "Show off your new Itasha at car meets, anime conventions, or just on your daily commute. Turn heads everywhere you go.",
    color: "from-accent2 to-accent",
  },
];

const guarantees = [
  {
    icon: Shield,
    title: "Quality Guarantee",
    description: "Premium Avery Dennison vinyl rated for 5+ years outdoor durability.",
  },
  {
    icon: MessageSquare,
    title: "Unlimited Revisions",
    description:
      "We don't stop until you love it. Revisions are included in your design package.",
  },
  {
    icon: Clock,
    title: "Transparent Timeline",
    description:
      "Track every stage of your project in real-time through our public project board.",
  },
  {
    icon: CreditCard,
    title: "Milestone Payments",
    description:
      "Pay as we progress. 25% deposit, 25% on approval, 50% on completion.",
  },
];

export default function HowItWorksPage() {
  return (
    <>
      {/* Header */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-background" />
        <div className="absolute top-0 right-1/4 w-[600px] h-[400px] bg-accent3/[0.05] rounded-full blur-[120px]" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <AnimatedSection>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6">
              How It{" "}
              <span className="bg-gradient-to-r from-accent3 to-accent3 bg-clip-text text-transparent">
                Works
              </span>
            </h1>
            <p className="text-muted-light text-lg max-w-xl mx-auto">
              From concept to cruising — here&apos;s exactly how we bring your anime
              vision to life on your vehicle.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Steps */}
      <section className="relative pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-background" />

        <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8">
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-accent via-accent2 to-accent3 hidden md:block" />

            <div className="space-y-12">
              {steps.map((step, i) => (
                <AnimatedSection key={step.step} delay={i * 0.1} direction="left">
                  <div className="flex gap-8 items-start">
                    {/* Icon */}
                    <div className="hidden md:flex shrink-0">
                      <div
                        className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg`}
                      >
                        <step.icon size={24} className="text-white" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-dark-500 text-sm font-mono">Step {step.step}</span>
                        <div className="md:hidden">
                          <div
                            className={`w-8 h-8 rounded-lg bg-gradient-to-br ${step.color} flex items-center justify-center`}
                          >
                            <step.icon size={16} className="text-white" />
                          </div>
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                      <p className="text-muted-light leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Payment Structure */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-surface-0" />
        <div className="absolute top-0 left-1/2 w-[600px] h-[600px] bg-accent/[0.05] rounded-full blur-[120px]" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <span className="inline-block text-accent text-sm font-semibold tracking-wider uppercase mb-4">
              Payment Structure
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
              Pay As We Progress
            </h2>
            <p className="text-muted-light max-w-xl mx-auto">
              We split your project into three payments tied to milestones — so your money
              only moves when the work does.
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              {
                percent: "25%",
                label: "First Payment",
                title: "Kick Off Custom Art",
                items: [
                  "Project consultation",
                  "Artist assignment",
                  "Initial concept sketches",
                  "Reference gathering",
                ],
                color: "from-accent to-accent2",
              },
              {
                percent: "25%",
                label: "Second Payment",
                title: "Design Approved",
                items: [
                  "Final artwork delivery",
                  "Vehicle template mockup",
                  "All revisions completed",
                  "Print-ready file prep",
                ],
                color: "from-accent2 to-accent3",
              },
              {
                percent: "50%",
                label: "Final Payment",
                title: "Print & Ship/Install",
                items: [
                  "60\" Avery vinyl print",
                  "High-gloss UV lamination",
                  "Quality inspection",
                  "Shipping or installation",
                ],
                color: "from-accent3 to-accent3",
              },
            ].map((payment, i) => (
              <AnimatedSection key={payment.title} delay={i * 0.15}>
                <div className="h-full p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all">
                  <div
                    className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${payment.color} mb-6`}
                  >
                    <span className="text-xl font-black text-white">{payment.percent}</span>
                  </div>
                  <p className="text-muted text-xs uppercase tracking-wider mb-1">
                    {payment.label}
                  </p>
                  <h3 className="text-lg font-bold text-white mb-4">{payment.title}</h3>
                  <ul className="space-y-2">
                    {payment.items.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-muted-light text-sm">
                        <CheckCircle2 size={14} className="text-accent3 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Guarantees */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-background" />
        <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              Our Guarantees
            </h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-6">
            {guarantees.map((item, i) => (
              <AnimatedSection key={item.title} delay={i * 0.1}>
                <div className="flex gap-5 p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                  <div className="w-10 h-10 rounded-xl bg-accent/[0.08] flex items-center justify-center shrink-0">
                    <item.icon size={20} className="text-accent" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold mb-1">{item.title}</h3>
                    <p className="text-muted-light text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-surface-0" />
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-transparent" />
        <div className="relative z-10 max-w-3xl mx-auto px-6 lg:px-8 text-center">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-muted-light mb-8">
              Build your wrap in under 2 minutes with our instant pricing tool.
            </p>
            <Link
              href="/pricing"
              className="group inline-flex items-center gap-3 px-10 py-4 text-base font-bold text-white bg-gradient-to-r from-accent to-accent2 rounded-full hover:shadow-[0_0_40px_#ff2d7b44] hover:scale-105 transition-all"
            >
              Build Your Wrap
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
