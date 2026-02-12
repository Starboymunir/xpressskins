"use client";

import { AnimatedSection } from "@/components/AnimatedSection";
import { Eye, Filter } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const categories = ["All", "Full Wrap", "Half Wrap", "Partial", "Hood"];

// Placeholder portfolio items - replace with real images from Ed
const portfolioItems = [
  {
    id: 1,
    title: "Zero Two Full Itasha",
    vehicle: "Honda Civic",
    category: "Full Wrap",
    image: "https://images.unsplash.com/photo-1619405399517-d7fce0f13302?w=600&q=80",
    tags: ["Darling in the FranXX", "Full Wrap"],
  },
  {
    id: 2,
    title: "Miku Racing Edition",
    vehicle: "Toyota GR86",
    category: "Full Wrap",
    image: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600&q=80",
    tags: ["Hatsune Miku", "Full Wrap"],
  },
  {
    id: 3,
    title: "Evangelion Hood Design",
    vehicle: "Subaru WRX",
    category: "Hood",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&q=80",
    tags: ["Evangelion", "Hood Only"],
  },
  {
    id: 4,
    title: "Demon Slayer Side Panels",
    vehicle: "Ford Mustang",
    category: "Half Wrap",
    image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=600&q=80",
    tags: ["Demon Slayer", "Half Wrap"],
  },
  {
    id: 5,
    title: "Dragon Ball Full Wrap",
    vehicle: "Dodge Challenger",
    category: "Full Wrap",
    image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=600&q=80",
    tags: ["Dragon Ball Z", "Full Wrap"],
  },
  {
    id: 6,
    title: "Naruto Partial Wrap",
    vehicle: "Nissan 370Z",
    category: "Partial",
    image: "https://images.unsplash.com/photo-1542362567-b07e54358753?w=600&q=80",
    tags: ["Naruto", "Partial"],
  },
  {
    id: 7,
    title: "Attack on Titan Hood",
    vehicle: "BMW M4",
    category: "Hood",
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&q=80",
    tags: ["Attack on Titan", "Hood"],
  },
  {
    id: 8,
    title: "One Piece Full Build",
    vehicle: "Toyota Supra",
    category: "Full Wrap",
    image: "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=600&q=80",
    tags: ["One Piece", "Full Wrap"],
  },
];

export default function PortfolioPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedItem, setSelectedItem] = useState<number | null>(null);

  const filteredItems =
    activeCategory === "All"
      ? portfolioItems
      : portfolioItems.filter((item) => item.category === activeCategory);

  const selectedProject =
    selectedItem !== null ? portfolioItems.find((p) => p.id === selectedItem) : null;

  return (
    <>
      {/* Header */}
      <section className="relative pt-32 pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-[#050505]" />
        <div className="absolute top-0 right-0 w-[600px] h-[400px] bg-neon-purple/5 rounded-full blur-[120px]" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <AnimatedSection>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-4">
              Our{" "}
              <span className="bg-gradient-to-r from-neon-purple to-neon-pink bg-clip-text text-transparent">
                Portfolio
              </span>
            </h1>
            <p className="text-dark-300 text-lg max-w-xl mx-auto">
              Every wrap tells a story. Browse our completed Itasha builds and get
              inspired for yours.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Filters */}
      <section className="relative pb-8">
        <div className="absolute inset-0 bg-[#050505]" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center gap-3 flex-wrap">
            <Filter size={16} className="text-dark-400" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? "bg-neon-pink text-white"
                    : "bg-white/5 text-dark-300 hover:bg-white/10"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="relative pb-32">
        <div className="absolute inset-0 bg-[#050505]" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <AnimatePresence>
              {filteredItems.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="group cursor-pointer"
                  onClick={() => setSelectedItem(item.id)}
                >
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-dark-800 border border-white/5 hover:border-neon-pink/30 transition-all">
                    {/* Placeholder colored gradient for demo */}
                    <div
                      className="absolute inset-0 bg-gradient-to-br from-dark-700 to-dark-800"
                      style={{
                        backgroundImage: `url(${item.image})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-12 h-12 rounded-full bg-neon-pink/80 flex items-center justify-center">
                        <Eye size={20} className="text-white" />
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform">
                      <h3 className="text-white font-bold text-sm">{item.title}</h3>
                      <p className="text-dark-300 text-xs">{item.vehicle}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {filteredItems.length === 0 && (
            <div className="text-center py-20">
              <p className="text-dark-400">No projects in this category yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-6"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-3xl w-full rounded-3xl bg-dark-800 border border-white/10 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="aspect-video bg-dark-700"
                style={{
                  backgroundImage: `url(${selectedProject.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              <div className="p-6">
                <h3 className="text-2xl font-bold text-white mb-2">
                  {selectedProject.title}
                </h3>
                <p className="text-dark-300 mb-4">{selectedProject.vehicle}</p>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 text-xs rounded-full bg-neon-pink/10 text-neon-pink border border-neon-pink/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
