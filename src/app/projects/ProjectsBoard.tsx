"use client";

import type { Project } from "@/lib/types";
import { AnimatedSection } from "@/components/AnimatedSection";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

type Stage = "design" | "revision" | "approved" | "printing" | "shipping" | "installing" | "completed";

const stageLabels: Record<Stage, string> = {
  design: "Artwork In Progress",
  revision: "Revision",
  approved: "Approved",
  printing: "Printing",
  shipping: "Shipping",
  installing: "Installing",
  completed: "Complete",
};

const stageColors: Record<Stage, { bg: string; text: string; dot: string }> = {
  design: { bg: "bg-yellow-500/10", text: "text-yellow-400", dot: "bg-yellow-400" },
  revision: { bg: "bg-orange-500/10", text: "text-orange-400", dot: "bg-orange-400" },
  approved: { bg: "bg-green-500/10", text: "text-green-400", dot: "bg-green-400" },
  printing: { bg: "bg-blue-500/10", text: "text-blue-400", dot: "bg-blue-400" },
  shipping: { bg: "bg-purple-500/10", text: "text-purple-400", dot: "bg-purple-400" },
  installing: { bg: "bg-accent/[0.08]", text: "text-accent", dot: "bg-accent" },
  completed: { bg: "bg-accent3/10", text: "text-accent3", dot: "bg-accent3" },
};

const stageOrder: Stage[] = ["design", "revision", "approved", "printing", "shipping", "installing", "completed"];

// Fallback demo data shown when DB has no projects
const DEMO_PROJECTS: Omit<Project, "id" | "created_at" | "updated_at">[] = [
  { title: "Zero Two Full Itasha", customer_name: "Alex M.", customer_email: "", vehicle_info: "2024 Honda Civic Si", wrap_type: "Full Wrap", cover_image: "", status: "design", progress: 15, start_date: "2026-02-05", estimated_completion: "2026-03-15", notes: "", images: [], quote_id: null },
  { title: "Miku Racing Edition", customer_name: "Jordan K.", customer_email: "", vehicle_info: "2023 Toyota GR86", wrap_type: "Full Wrap", cover_image: "", status: "printing", progress: 60, start_date: "2026-01-28", estimated_completion: "2026-03-01", notes: "", images: [], quote_id: null },
  { title: "Evangelion Unit-01", customer_name: "Sam T.", customer_email: "", vehicle_info: "2025 Subaru WRX", wrap_type: "Half Wrap", cover_image: "", status: "revision", progress: 25, start_date: "2026-02-01", estimated_completion: "2026-03-10", notes: "", images: [], quote_id: null },
  { title: "Demon Slayer Tanjiro", customer_name: "Chris R.", customer_email: "", vehicle_info: "2024 Ford Mustang", wrap_type: "Side Panels", cover_image: "", status: "approved", progress: 40, start_date: "2026-01-20", estimated_completion: "2026-02-25", notes: "", images: [], quote_id: null },
  { title: "JJK Gojo Custom", customer_name: "Morgan L.", customer_email: "", vehicle_info: "2023 Nissan Z", wrap_type: "Full Wrap", cover_image: "", status: "shipping", progress: 75, start_date: "2026-01-10", estimated_completion: "2026-02-15", notes: "", images: [], quote_id: null },
  { title: "Chainsaw Man Power", customer_name: "River N.", customer_email: "", vehicle_info: "2025 BMW M4", wrap_type: "Hood + Roof", cover_image: "", status: "design", progress: 10, start_date: "2026-02-08", estimated_completion: "2026-03-20", notes: "", images: [], quote_id: null },
  { title: "Spy x Family Anya", customer_name: "Casey D.", customer_email: "", vehicle_info: "2023 Tesla Model 3", wrap_type: "Partial Wrap", cover_image: "", status: "installing", progress: 90, start_date: "2026-01-05", estimated_completion: "2026-02-10", notes: "", images: [], quote_id: null },
];

export function ProjectsBoard({ projects }: { projects: Project[] }) {
  const items = projects.length > 0 ? projects : (DEMO_PROJECTS as Project[]);

  const projectsByStage = stageOrder.reduce((acc, stage) => {
    acc[stage] = items.filter((p) => p.status === stage);
    return acc;
  }, {} as Record<Stage, Project[]>);

  return (
    <>
      {/* Header */}
      <section className="relative pt-32 pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-background" />
        <div className="absolute top-0 left-0 w-[600px] h-[400px] bg-accent3/5 rounded-full blur-[120px]" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <AnimatedSection>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-4">
              Active{" "}
              <span className="bg-gradient-to-r from-accent3 to-accent3 bg-clip-text text-transparent">
                Projects
              </span>
            </h1>
            <p className="text-muted-light text-lg max-w-xl mx-auto">
              See what we&apos;re currently building. Every Itasha project is tracked publicly
              so you can watch the magic happen.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Stage counts */}
      <section className="relative pb-8">
        <div className="absolute inset-0 bg-background" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-wrap gap-4 justify-center">
            {stageOrder.map((stage) => {
              const colors = stageColors[stage];
              const count = projectsByStage[stage]?.length || 0;
              return (
                <div
                  key={stage}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${colors.bg} ${colors.text} text-xs font-medium`}
                >
                  <span className={`w-2 h-2 rounded-full ${colors.dot} animate-pulse`} />
                  {stageLabels[stage]} ({count})
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Project cards */}
      <section className="relative pb-32">
        <div className="absolute inset-0 bg-background" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          {items.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-light text-lg">No active projects right now.</p>
              <Link href="/pricing" className="mt-4 inline-flex items-center gap-2 text-accent text-sm font-semibold hover:underline">
                Start your build <ArrowRight size={14} />
              </Link>
            </div>
          ) : (
            <div className="grid gap-4">
              {items.map((project, i) => {
                const stage = project.status as Stage;
                const colors = stageColors[stage] ?? stageColors.design;
                const stageIdx = stageOrder.indexOf(stage);
                const progress = project.progress || ((stageIdx + 1) / stageOrder.length) * 100;

                return (
                  <AnimatedSection key={project.id ?? i} delay={i * 0.05}>
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start gap-3 mb-2">
                            <span
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
                              {stageLabels[stage] ?? stage}
                            </span>
                          </div>
                          <h3 className="text-lg font-bold text-white mb-1">{project.title}</h3>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-light">
                            <span>{project.vehicle_info}</span>
                            <span className="text-dark-500">•</span>
                            <span>{project.wrap_type}</span>
                            <span className="text-dark-500">•</span>
                            <span>{project.customer_name}</span>
                            {project.start_date && (
                              <>
                                <span className="text-dark-500">•</span>
                                <span className="text-muted">
                                  Started {new Date(project.start_date).toLocaleDateString()}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="lg:w-64">
                          <div className="flex items-center justify-between text-xs mb-1.5">
                            <span className="text-muted">Progress</span>
                            <span className="text-muted-light font-medium">{Math.round(progress)}%</span>
                          </div>
                          <div className="h-2 rounded-full bg-surface-2 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${progress}%` }}
                              transition={{ duration: 1, delay: i * 0.1, ease: "easeOut" }}
                              className="h-full rounded-full bg-gradient-to-r from-accent to-accent2"
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </AnimatedSection>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
