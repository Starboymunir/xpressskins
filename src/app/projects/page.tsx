"use client";

import { AnimatedSection } from "@/components/AnimatedSection";
import { motion } from "framer-motion";

type ProjectStage =
  | "Artwork In Progress"
  | "Revision"
  | "Approved"
  | "Printing"
  | "Shipping"
  | "Installing"
  | "Complete";

interface ActiveProject {
  id: string;
  customerAlias: string;
  vehicle: string;
  designTitle: string;
  stage: ProjectStage;
  startDate: string;
  coverageType: string;
}

const stageColors: Record<ProjectStage, { bg: string; text: string; dot: string }> = {
  "Artwork In Progress": { bg: "bg-yellow-500/10", text: "text-yellow-400", dot: "bg-yellow-400" },
  "Revision": { bg: "bg-orange-500/10", text: "text-orange-400", dot: "bg-orange-400" },
  "Approved": { bg: "bg-green-500/10", text: "text-green-400", dot: "bg-green-400" },
  "Printing": { bg: "bg-blue-500/10", text: "text-blue-400", dot: "bg-blue-400" },
  "Shipping": { bg: "bg-purple-500/10", text: "text-purple-400", dot: "bg-purple-400" },
  "Installing": { bg: "bg-neon-pink/10", text: "text-neon-pink", dot: "bg-neon-pink" },
  "Complete": { bg: "bg-neon-cyan/10", text: "text-neon-cyan", dot: "bg-neon-cyan" },
};

const stageOrder: ProjectStage[] = [
  "Artwork In Progress",
  "Revision",
  "Approved",
  "Printing",
  "Shipping",
  "Installing",
  "Complete",
];

// Demo data - this would come from a CMS or database in production
const activeProjects: ActiveProject[] = [
  {
    id: "XS-2026-001",
    customerAlias: "Alex M.",
    vehicle: "2024 Honda Civic Si",
    designTitle: "Zero Two Full Itasha",
    stage: "Artwork In Progress",
    startDate: "Feb 5, 2026",
    coverageType: "Full Wrap",
  },
  {
    id: "XS-2026-002",
    customerAlias: "Jordan K.",
    vehicle: "2023 Toyota GR86",
    designTitle: "Miku Racing Edition",
    stage: "Printing",
    startDate: "Jan 28, 2026",
    coverageType: "Full Wrap",
  },
  {
    id: "XS-2026-003",
    customerAlias: "Sam T.",
    vehicle: "2025 Subaru WRX",
    designTitle: "Evangelion Unit-01",
    stage: "Revision",
    startDate: "Feb 1, 2026",
    coverageType: "Half Wrap",
  },
  {
    id: "XS-2026-004",
    customerAlias: "Chris R.",
    vehicle: "2024 Ford Mustang",
    designTitle: "Demon Slayer Tanjiro",
    stage: "Approved",
    startDate: "Jan 20, 2026",
    coverageType: "Side Panels",
  },
  {
    id: "XS-2026-005",
    customerAlias: "Morgan L.",
    vehicle: "2023 Nissan Z",
    designTitle: "JJK Gojo Custom",
    stage: "Shipping",
    startDate: "Jan 10, 2026",
    coverageType: "Full Wrap",
  },
  {
    id: "XS-2026-006",
    customerAlias: "Taylor W.",
    vehicle: "2024 Dodge Challenger",
    designTitle: "Dragon Ball Z Vegeta",
    stage: "Complete",
    startDate: "Dec 15, 2025",
    coverageType: "Full Wrap",
  },
  {
    id: "XS-2026-007",
    customerAlias: "River N.",
    vehicle: "2025 BMW M4",
    designTitle: "Chainsaw Man Power",
    stage: "Artwork In Progress",
    startDate: "Feb 8, 2026",
    coverageType: "Hood + Roof",
  },
  {
    id: "XS-2026-008",
    customerAlias: "Casey D.",
    vehicle: "2023 Tesla Model 3",
    designTitle: "Spy x Family Anya",
    stage: "Installing",
    startDate: "Jan 5, 2026",
    coverageType: "Partial Wrap",
  },
];

export default function ProjectsPage() {
  // Group projects by stage
  const projectsByStage = stageOrder.reduce((acc, stage) => {
    acc[stage] = activeProjects.filter((p) => p.stage === stage);
    return acc;
  }, {} as Record<ProjectStage, ActiveProject[]>);

  return (
    <>
      {/* Header */}
      <section className="relative pt-32 pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-[#050505]" />
        <div className="absolute top-0 left-0 w-[600px] h-[400px] bg-neon-cyan/5 rounded-full blur-[120px]" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <AnimatedSection>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-4">
              Active{" "}
              <span className="bg-gradient-to-r from-neon-cyan to-neon-blue bg-clip-text text-transparent">
                Projects
              </span>
            </h1>
            <p className="text-dark-300 text-lg max-w-xl mx-auto">
              See what we&apos;re currently building. Every Itasha project is tracked publicly
              so you can watch the magic happen.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Stats */}
      <section className="relative pb-8">
        <div className="absolute inset-0 bg-[#050505]" />
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
                  {stage} ({count})
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Projects Board */}
      <section className="relative pb-32">
        <div className="absolute inset-0 bg-[#050505]" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          {/* Card view */}
          <div className="grid gap-4">
            {activeProjects.map((project, i) => {
              const colors = stageColors[project.stage];
              const stageIndex = stageOrder.indexOf(project.stage);
              const progress = ((stageIndex + 1) / stageOrder.length) * 100;

              return (
                <AnimatedSection key={project.id} delay={i * 0.05}>
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-3 mb-2">
                          <span className="text-dark-500 text-xs font-mono">{project.id}</span>
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
                            {project.stage}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-white mb-1">
                          {project.designTitle}
                        </h3>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-dark-300">
                          <span>{project.vehicle}</span>
                          <span className="text-dark-500">•</span>
                          <span>{project.coverageType}</span>
                          <span className="text-dark-500">•</span>
                          <span>{project.customerAlias}</span>
                          <span className="text-dark-500">•</span>
                          <span className="text-dark-400">Started {project.startDate}</span>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="lg:w-64">
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <span className="text-dark-400">Progress</span>
                          <span className="text-dark-300 font-medium">
                            {Math.round(progress)}%
                          </span>
                        </div>
                        <div className="h-2 rounded-full bg-dark-700 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1, delay: i * 0.1, ease: "easeOut" }}
                            className="h-full rounded-full bg-gradient-to-r from-neon-pink to-neon-purple"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
