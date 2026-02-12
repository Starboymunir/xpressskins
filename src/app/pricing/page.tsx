"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedSection } from "@/components/AnimatedSection";
import {
  vehicleDatabase,
  coverageOptions,
  designTiers,
  finishOptions,
  installOptions,
  getAllMakes,
  getModelsForMake,
  calculatePrice,
} from "@/data/vehicles";
import {
  Car,
  Paintbrush,
  Layers,
  Sparkles,
  Wrench,
  ArrowRight,
  ArrowLeft,
  Check,
  Phone,
} from "lucide-react";
import Link from "next/link";

const steps = [
  { id: 1, label: "Vehicle", icon: Car },
  { id: 2, label: "Coverage", icon: Layers },
  { id: 3, label: "Design", icon: Paintbrush },
  { id: 4, label: "Finish", icon: Sparkles },
  { id: 5, label: "Install", icon: Wrench },
  { id: 6, label: "Quote", icon: Check },
];

export default function PricingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedMake, setSelectedMake] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedSqft, setSelectedSqft] = useState(0);
  const [selectedCoverage, setSelectedCoverage] = useState("");
  const [selectedDesign, setSelectedDesign] = useState("");
  const [selectedFinish, setSelectedFinish] = useState("gloss");
  const [selectedInstall, setSelectedInstall] = useState("");

  const allMakes = useMemo(() => getAllMakes(), []);
  const modelsForMake = useMemo(
    () => (selectedMake ? getModelsForMake(selectedMake) : []),
    [selectedMake]
  );

  const coverage = coverageOptions.find((c) => c.id === selectedCoverage);
  const design = designTiers.find((d) => d.id === selectedDesign);
  const finish = finishOptions.find((f) => f.id === selectedFinish);
  const install = installOptions.find((i) => i.id === selectedInstall);

  const quote = useMemo(() => {
    if (!selectedSqft || !coverage || !design || !finish || !install) return null;
    return calculatePrice(
      selectedSqft,
      coverage.multiplier,
      design.pricePerSqft,
      finish.priceAdd,
      install.price
    );
  }, [selectedSqft, coverage, design, finish, install]);

  const canProceed = () => {
    switch (currentStep) {
      case 1: return selectedMake && selectedModel && selectedSqft > 0;
      case 2: return !!selectedCoverage;
      case 3: return !!selectedDesign;
      case 4: return !!selectedFinish;
      case 5: return !!selectedInstall;
      default: return true;
    }
  };

  const next = () => {
    if (canProceed() && currentStep < 6) setCurrentStep(currentStep + 1);
  };

  const prev = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <>
      {/* Header */}
      <section className="relative pt-32 pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-[#050505]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-neon-pink/5 rounded-full blur-[120px]" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <AnimatedSection>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-4">
              Build Your{" "}
              <span className="bg-gradient-to-r from-neon-pink to-neon-purple bg-clip-text text-transparent">
                Itasha
              </span>
            </h1>
            <p className="text-dark-300 text-lg max-w-xl mx-auto">
              Get an instant quote in under 2 minutes. No humans needed — but we&apos;re
              always here if you want to talk.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Calculator */}
      <section className="relative pb-32">
        <div className="absolute inset-0 bg-[#050505]" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8">
          {/* Progress bar */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-4">
              {steps.map((step, i) => (
                <div key={step.id} className="flex items-center">
                  <button
                    onClick={() => {
                      if (step.id <= currentStep) setCurrentStep(step.id);
                    }}
                    className={`flex items-center gap-2 px-3 py-2 rounded-full text-xs font-semibold transition-all ${
                      step.id === currentStep
                        ? "bg-neon-pink text-white"
                        : step.id < currentStep
                        ? "bg-neon-pink/20 text-neon-pink"
                        : "bg-white/5 text-dark-400"
                    }`}
                  >
                    <step.icon size={14} />
                    <span className="hidden sm:inline">{step.label}</span>
                  </button>
                  {i < steps.length - 1 && (
                    <div
                      className={`hidden sm:block w-8 lg:w-16 h-px mx-2 ${
                        step.id < currentStep ? "bg-neon-pink/40" : "bg-white/10"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step content */}
          <div className="min-h-[400px] p-8 rounded-3xl bg-dark-800/50 border border-white/5 backdrop-blur">
            <AnimatePresence mode="wait">
              {/* Step 1: Vehicle */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-2xl font-bold text-white mb-2">Select Your Vehicle</h2>
                  <p className="text-dark-300 text-sm mb-8">
                    Choose your make and model so we can calculate the wrap area.
                  </p>

                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-dark-300 mb-2">Make</label>
                      <select
                        value={selectedMake}
                        onChange={(e) => {
                          setSelectedMake(e.target.value);
                          setSelectedModel("");
                          setSelectedSqft(0);
                        }}
                        className="w-full px-4 py-3 rounded-xl bg-dark-700 border border-white/10 text-white focus:border-neon-pink focus:outline-none transition-colors"
                      >
                        <option value="">Select make...</option>
                        {allMakes.map((make) => (
                          <option key={make} value={make}>
                            {make}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-dark-300 mb-2">Model</label>
                      <select
                        value={selectedModel}
                        onChange={(e) => {
                          const model = modelsForMake.find(
                            (m) => m.model === e.target.value
                          );
                          setSelectedModel(e.target.value);
                          setSelectedSqft(model?.totalSqft || 0);
                        }}
                        className="w-full px-4 py-3 rounded-xl bg-dark-700 border border-white/10 text-white focus:border-neon-pink focus:outline-none transition-colors"
                        disabled={!selectedMake}
                      >
                        <option value="">Select model...</option>
                        {modelsForMake.map((model) => (
                          <option key={model.model} value={model.model}>
                            {model.model} (~{model.totalSqft} sqft)
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {selectedSqft > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-xl bg-neon-pink/5 border border-neon-pink/20 text-sm"
                    >
                      <span className="text-neon-pink font-semibold">{selectedMake} {selectedModel}</span>
                      <span className="text-dark-300"> — Estimated total surface: </span>
                      <span className="text-white font-bold">{selectedSqft} sqft</span>
                    </motion.div>
                  )}

                  <div className="mt-6">
                    <p className="text-dark-400 text-xs">
                      Don&apos;t see your vehicle? <Link href="/contact" className="text-neon-pink underline">Contact us</Link> for a custom quote.
                    </p>
                  </div>

                  {/* Quick select by category */}
                  <div className="mt-8">
                    <p className="text-sm text-dark-400 mb-3">Or quick-select by category:</p>
                    <div className="flex flex-wrap gap-2">
                      {vehicleDatabase.map((cat) => (
                        <button
                          key={cat.type}
                          onClick={() => {
                            const firstModel = cat.models[0];
                            setSelectedMake(firstModel.make);
                            setSelectedModel(firstModel.model);
                            setSelectedSqft(firstModel.totalSqft);
                          }}
                          className="px-3 py-1.5 text-xs rounded-full bg-white/5 text-dark-300 hover:bg-neon-pink/10 hover:text-neon-pink border border-white/5 hover:border-neon-pink/20 transition-all"
                        >
                          {cat.type} (~{cat.avgSqft} sqft)
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Coverage */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-2xl font-bold text-white mb-2">Choose Coverage</h2>
                  <p className="text-dark-300 text-sm mb-8">
                    How much of your {selectedMake} {selectedModel} do you want wrapped?
                  </p>

                  <div className="grid sm:grid-cols-2 gap-4">
                    {coverageOptions.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setSelectedCoverage(opt.id)}
                        className={`p-5 rounded-2xl border text-left transition-all ${
                          selectedCoverage === opt.id
                            ? "border-neon-pink bg-neon-pink/5 shadow-[0_0_30px_#ff2d7b11]"
                            : "border-white/5 bg-white/[0.02] hover:border-white/10"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-white">{opt.label}</span>
                          <span className="text-xs text-dark-400">
                            ~{Math.round(selectedSqft * opt.multiplier)} sqft
                          </span>
                        </div>
                        <p className="text-dark-300 text-sm">{opt.description}</p>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Step 3: Design Tier */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-2xl font-bold text-white mb-2">Select Design Tier</h2>
                  <p className="text-dark-300 text-sm mb-8">
                    Choose the level of customization for your Itasha artwork.
                  </p>

                  <div className="grid gap-4">
                    {designTiers.map((tier) => (
                      <button
                        key={tier.id}
                        onClick={() => setSelectedDesign(tier.id)}
                        className={`p-6 rounded-2xl border text-left transition-all ${
                          selectedDesign === tier.id
                            ? "border-neon-pink bg-neon-pink/5 shadow-[0_0_30px_#ff2d7b11]"
                            : "border-white/5 bg-white/[0.02] hover:border-white/10"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-lg font-bold text-white">{tier.label}</span>
                          <span className="text-neon-pink font-bold">
                            ${tier.pricePerSqft}/sqft
                          </span>
                        </div>
                        <p className="text-dark-300 text-sm mb-2">{tier.description}</p>
                        <p className="text-dark-400 text-xs">Turnaround: {tier.turnaround}</p>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Step 4: Finish */}
              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-2xl font-bold text-white mb-2">Choose Finish</h2>
                  <p className="text-dark-300 text-sm mb-8">
                    Select the lamination finish for your vinyl wrap.
                  </p>

                  <div className="grid sm:grid-cols-3 gap-4">
                    {finishOptions.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setSelectedFinish(opt.id)}
                        className={`p-6 rounded-2xl border text-center transition-all ${
                          selectedFinish === opt.id
                            ? "border-neon-pink bg-neon-pink/5 shadow-[0_0_30px_#ff2d7b11]"
                            : "border-white/5 bg-white/[0.02] hover:border-white/10"
                        }`}
                      >
                        <span className="text-lg font-bold text-white block mb-1">{opt.label}</span>
                        <span className="text-dark-400 text-sm">
                          {opt.priceAdd === 0 ? "Included" : `+$${opt.priceAdd}/sqft`}
                        </span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Step 5: Installation */}
              {currentStep === 5 && (
                <motion.div
                  key="step5"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-2xl font-bold text-white mb-2">Installation</h2>
                  <p className="text-dark-300 text-sm mb-8">
                    How would you like to receive your wrap?
                  </p>

                  <div className="grid gap-4">
                    {installOptions.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setSelectedInstall(opt.id)}
                        className={`p-6 rounded-2xl border text-left transition-all ${
                          selectedInstall === opt.id
                            ? "border-neon-pink bg-neon-pink/5 shadow-[0_0_30px_#ff2d7b11]"
                            : "border-white/5 bg-white/[0.02] hover:border-white/10"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white">{opt.label}</span>
                          <span className="text-neon-pink font-bold">
                            {opt.price === 0 ? "Free" : `+$${opt.price}`}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Step 6: Quote */}
              {currentStep === 6 && quote && (
                <motion.div
                  key="step6"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-black text-white mb-2">Your Instant Quote</h2>
                    <p className="text-dark-300 text-sm">
                      Here&apos;s your estimated price for a custom Itasha wrap.
                    </p>
                  </div>

                  {/* Summary */}
                  <div className="max-w-lg mx-auto space-y-3 mb-8">
                    <div className="flex justify-between py-3 border-b border-white/5">
                      <span className="text-dark-300">Vehicle</span>
                      <span className="text-white font-medium">{selectedMake} {selectedModel}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-white/5">
                      <span className="text-dark-300">Coverage</span>
                      <span className="text-white font-medium">
                        {coverage?.label} ({quote.effectiveSqft} sqft)
                      </span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-white/5">
                      <span className="text-dark-300">Design Tier</span>
                      <span className="text-white font-medium">{design?.label}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-white/5">
                      <span className="text-dark-300">Finish</span>
                      <span className="text-white font-medium">{finish?.label}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-white/5">
                      <span className="text-dark-300">Installation</span>
                      <span className="text-white font-medium">{install?.label}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-white/5">
                      <span className="text-dark-300">Wrap Cost</span>
                      <span className="text-white font-medium">
                        ${quote.subtotal.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-white/5">
                      <span className="text-dark-300">Design Fee (refundable)</span>
                      <span className="text-white font-medium">${quote.designFee}</span>
                    </div>
                    {install && install.price > 0 && (
                      <div className="flex justify-between py-3 border-b border-white/5">
                        <span className="text-dark-300">Installation</span>
                        <span className="text-white font-medium">
                          ${install.price.toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Total */}
                  <div className="max-w-lg mx-auto p-6 rounded-2xl bg-gradient-to-r from-neon-pink/10 to-neon-purple/10 border border-neon-pink/20 text-center mb-8">
                    <p className="text-dark-300 text-sm mb-1">Estimated Total</p>
                    <p className="text-5xl font-black text-white">
                      ${quote.total.toLocaleString()}
                    </p>
                    <p className="text-dark-400 text-xs mt-2">
                      First payment: ${Math.round(quote.total * 0.25).toLocaleString()} (25% deposit)
                    </p>
                  </div>

                  {/* Payment breakdown */}
                  <div className="max-w-lg mx-auto grid grid-cols-3 gap-3 mb-8">
                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-center">
                      <p className="text-neon-pink font-bold text-lg">25%</p>
                      <p className="text-dark-400 text-xs">To Start Art</p>
                      <p className="text-white text-sm font-semibold">
                        ${Math.round(quote.total * 0.25).toLocaleString()}
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-center">
                      <p className="text-neon-purple font-bold text-lg">25%</p>
                      <p className="text-dark-400 text-xs">On Approval</p>
                      <p className="text-white text-sm font-semibold">
                        ${Math.round(quote.total * 0.25).toLocaleString()}
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-center">
                      <p className="text-neon-blue font-bold text-lg">50%</p>
                      <p className="text-dark-400 text-xs">Print & Ship</p>
                      <p className="text-white text-sm font-semibold">
                        ${Math.round(quote.total * 0.5).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* CTAs */}
                  <div className="max-w-lg mx-auto flex flex-col sm:flex-row gap-4">
                    <Link
                      href="/contact"
                      className="flex-1 inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-bold text-white bg-gradient-to-r from-neon-pink to-neon-purple rounded-full hover:shadow-[0_0_40px_#ff2d7b44] hover:scale-105 transition-all"
                    >
                      Start My Order
                      <ArrowRight size={18} />
                    </Link>
                    <a
                      href="tel:+13463177987"
                      className="flex-1 inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white border border-white/10 rounded-full hover:bg-white/5 transition-all"
                    >
                      <Phone size={18} />
                      Call Us
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Navigation buttons */}
          {currentStep < 6 && (
            <div className="flex items-center justify-between mt-6">
              <button
                onClick={prev}
                disabled={currentStep === 1}
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all ${
                  currentStep === 1
                    ? "text-dark-500 cursor-not-allowed"
                    : "text-white border border-white/10 hover:bg-white/5"
                }`}
              >
                <ArrowLeft size={16} />
                Back
              </button>
              <button
                onClick={next}
                disabled={!canProceed()}
                className={`inline-flex items-center gap-2 px-8 py-3 rounded-full text-sm font-bold transition-all ${
                  canProceed()
                    ? "text-white bg-gradient-to-r from-neon-pink to-neon-purple hover:shadow-[0_0_30px_#ff2d7b44] hover:scale-105"
                    : "text-dark-500 bg-dark-700 cursor-not-allowed"
                }`}
              >
                Next
                <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
