"use client";

import { useRef, type ReactNode, type MouseEvent } from "react";
import Link from "next/link";
import { motion, useInView, useMotionValue, useSpring, useScroll, useTransform } from "framer-motion";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/** Lines of text that slide up out of a clipped box, one after another. */
export function SplitLines({ lines, className = "", delay = 0, as: Tag = "h2", once = true }: {
  lines: ReactNode[]; className?: string; delay?: number; as?: "h1" | "h2" | "h3" | "p" | "div"; once?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, margin: "-10% 0px" });
  return (
    <Tag ref={ref as never} className={className}>
      {lines.map((l, i) => (
        <span key={i} className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
          <motion.span
            className="block will-change-transform"
            initial={{ y: "110%", rotate: 2 }}
            animate={inView ? { y: 0, rotate: 0 } : { y: "110%", rotate: 2 }}
            transition={{ duration: 1.1, delay: delay + i * 0.09, ease: EASE }}
          >
            {l}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

/** Fade + rise on enter. */
export function Rise({ children, className = "", delay = 0, y = 40 }: { children: ReactNode; className?: string; delay?: number; y?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-8% 0px" });
  return (
    <motion.div ref={ref} className={className} initial={{ opacity: 0, y }} animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y }} transition={{ duration: 1, delay, ease: EASE }}>
      {children}
    </motion.div>
  );
}

/** Image/clip that reveals with a wipe and a slow inner scale. */
export function ClipReveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  return (
    <motion.div ref={ref} className={`overflow-hidden ${className}`} initial={{ clipPath: "inset(100% 0 0 0)" }} animate={inView ? { clipPath: "inset(0% 0 0 0)" } : {}} transition={{ duration: 1.3, delay, ease: EASE }}>
      <motion.div className="h-full w-full" initial={{ scale: 1.25 }} animate={inView ? { scale: 1 } : {}} transition={{ duration: 1.6, delay, ease: EASE }}>
        {children}
      </motion.div>
    </motion.div>
  );
}

/** Button that leans toward the cursor. */
export function Magnetic({ children, className = "", strength = 0.35 }: { children: ReactNode; className?: string; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0); const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 18 }); const sy = useSpring(y, { stiffness: 200, damping: 18 });
  const onMove = (e: MouseEvent) => {
    const r = ref.current!.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength); y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  return (
    <motion.div ref={ref} className={`inline-block ${className}`} style={{ x: sx, y: sy }} onMouseMove={onMove} onMouseLeave={() => { x.set(0); y.set(0); }}>
      {children}
    </motion.div>
  );
}

export function PillLink({ href, children, variant = "light", className = "" }: { href: string; children: ReactNode; variant?: "light" | "ghost" | "accent"; className?: string }) {
  return (
    <Magnetic className={className}>
      <Link href={href} className={`btn-pill btn-pill-${variant}`}>
        <span className="btn-pill-txt">{children}</span>
      </Link>
    </Magnetic>
  );
}

/** Number that counts up when visible. */
export function CountUp({ to, suffix = "", className = "" }: { to: number; suffix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { stiffness: 40, damping: 18 });
  const txt = useTransform(spring, (v) => `${Math.round(v).toLocaleString()}${suffix}`);
  if (inView) mv.set(to);
  return <motion.span ref={ref} className={className}>{txt}</motion.span>;
}

/** Child moves slower/faster than scroll. */
export function Parallax({ children, className = "", amount = 80 }: { children: ReactNode; className?: string; amount?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [amount, -amount]);
  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div style={{ y }} className="h-full w-full">{children}</motion.div>
    </div>
  );
}
