"use client";

import { useState } from "react";
import { AnimatedSection } from "@/components/AnimatedSection";
import { Phone, Mail, MapPin, Send, MessageCircle, Clock } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    vehicle: "",
    message: "",
    designType: "fullcustom",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          vehicle_info: formData.vehicle,
          wrap_type: formData.designType,
          message: formData.message,
        }),
      });
      if (!res.ok) throw new Error("Failed to submit");
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again or call us directly.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Header */}
      <section className="relative pt-32 pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-background" />
        <div className="absolute top-0 right-0 w-[600px] h-[400px] bg-accent/[0.05] rounded-full blur-[120px]" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <AnimatedSection>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-4">
              Let&apos;s{" "}
              <span className="bg-gradient-to-r from-accent to-accent2 bg-clip-text text-transparent">
                Talk
              </span>
            </h1>
            <p className="text-muted-light text-lg max-w-xl mx-auto">
              Have a question or want to discuss your project? We&apos;re here to help
              bring your Itasha vision to life.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Contact Content */}
      <section className="relative pb-32">
        <div className="absolute inset-0 bg-background" />
        <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-2 space-y-8">
              <AnimatedSection direction="right">
                <div className="space-y-6">
                  <a
                    href="tel:+13463177987"
                    className="flex items-start gap-4 p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-accent/20 transition-all group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-accent/[0.08] flex items-center justify-center shrink-0 group-hover:bg-accent/20 transition-colors">
                      <Phone size={20} className="text-accent" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold mb-1">Call Us</h3>
                      <p className="text-muted-light text-sm">(346) 317-7987</p>
                      <p className="text-muted text-xs mt-1">Mon-Sat, 9AM-6PM CT</p>
                    </div>
                  </a>

                  <a
                    href="mailto:info@xpressskins.com"
                    className="flex items-start gap-4 p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-accent/20 transition-all group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-accent2/10 flex items-center justify-center shrink-0 group-hover:bg-accent2/20 transition-colors">
                      <Mail size={20} className="text-accent2" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold mb-1">Email</h3>
                      <p className="text-muted-light text-sm">info@xpressskins.com</p>
                      <p className="text-muted text-xs mt-1">We reply within 24 hours</p>
                    </div>
                  </a>

                  <div className="flex items-start gap-4 p-5 rounded-2xl bg-white/[0.02] border border-white/5">
                    <div className="w-12 h-12 rounded-xl bg-accent3/[0.08] flex items-center justify-center shrink-0">
                      <MapPin size={20} className="text-accent3" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold mb-1">Studio</h3>
                      <p className="text-muted-light text-sm">
                        1804 W Sam Houston Pkwy N
                        <br />
                        Houston, TX 77043
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-5 rounded-2xl bg-white/[0.02] border border-white/5">
                    <div className="w-12 h-12 rounded-xl bg-accent3/10 flex items-center justify-center shrink-0">
                      <Clock size={20} className="text-accent3" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold mb-1">Business Hours</h3>
                      <p className="text-muted-light text-sm">
                        Monday - Saturday: 9AM - 6PM CT
                        <br />
                        Sunday: Closed
                      </p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>

              {/* Social links */}
              <AnimatedSection direction="right" delay={0.2}>
                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5">
                  <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                    <MessageCircle size={16} className="text-accent" />
                    Follow Us
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {[
                      { label: "Instagram", href: "https://www.instagram.com/xpressskins/" },
                      { label: "TikTok", href: "https://www.tiktok.com/@xpress_skins_" },
                      { label: "YouTube", href: "https://www.youtube.com/@XpressSkins" },
                      { label: "Facebook", href: "https://www.facebook.com/xpressskins2018/" },
                    ].map((social) => (
                      <a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-full text-sm font-medium bg-white/5 text-muted-light hover:bg-accent/[0.08] hover:text-accent border border-white/5 hover:border-accent/20 transition-all"
                      >
                        {social.label}
                      </a>
                    ))}
                  </div>
                </div>
              </AnimatedSection>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-3">
              <AnimatedSection>
                {submitted ? (
                  <div className="p-12 rounded-3xl bg-white/[0.02] border border-accent3/20 text-center">
                    <div className="w-16 h-16 rounded-full bg-accent3/10 flex items-center justify-center mx-auto mb-6">
                      <Send size={24} className="text-accent3" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">Message Sent!</h3>
                    <p className="text-muted-light">
                      Thank you for reaching out. We&apos;ll get back to you within 24 hours.
                    </p>
                  </div>
                ) : (
                  <form
                    onSubmit={handleSubmit}
                    className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 space-y-6"
                  >
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-muted-light mb-2">
                          Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          className="w-full px-4 py-3 rounded-xl bg-surface-2 border border-white/10 text-white placeholder:text-dark-500 focus:border-accent focus:outline-none transition-colors"
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-muted-light mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          className="w-full px-4 py-3 rounded-xl bg-surface-2 border border-white/10 text-white placeholder:text-dark-500 focus:border-accent focus:outline-none transition-colors"
                          placeholder="you@email.com"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-muted-light mb-2">
                          Phone
                        </label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                          className="w-full px-4 py-3 rounded-xl bg-surface-2 border border-white/10 text-white placeholder:text-dark-500 focus:border-accent focus:outline-none transition-colors"
                          placeholder="(555) 123-4567"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-muted-light mb-2">
                          Vehicle (Year Make Model)
                        </label>
                        <input
                          type="text"
                          value={formData.vehicle}
                          onChange={(e) =>
                            setFormData({ ...formData, vehicle: e.target.value })
                          }
                          className="w-full px-4 py-3 rounded-xl bg-surface-2 border border-white/10 text-white placeholder:text-dark-500 focus:border-accent focus:outline-none transition-colors"
                          placeholder="2024 Honda Civic"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-muted-light mb-2">
                        Design Type
                      </label>
                      <select
                        value={formData.designType}
                        onChange={(e) =>
                          setFormData({ ...formData, designType: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-xl bg-surface-2 border border-white/10 text-white focus:border-accent focus:outline-none transition-colors"
                      >
                        <option value="premade">Pre-Made Design</option>
                        <option value="semicustom">Semi-Custom</option>
                        <option value="fullcustom">Fully Custom Itasha</option>
                        <option value="other">Other / Not Sure</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-muted-light mb-2">
                        Tell Us About Your Vision *
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={formData.message}
                        onChange={(e) =>
                          setFormData({ ...formData, message: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-xl bg-surface-2 border border-white/10 text-white placeholder:text-dark-500 focus:border-accent focus:outline-none transition-colors resize-none"
                        placeholder="Which anime/character? What kind of wrap coverage? Any reference images?"
                      />
                    </div>

                    {error && (
                      <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
                        {error}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-bold text-white bg-gradient-to-r from-accent to-accent2 rounded-full hover:shadow-[0_0_40px_#ff2d7b44] hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? "Sending…" : "Send Message"}
                      {!submitting && <Send size={18} />}
                    </button>

                    <p className="text-dark-500 text-xs text-center">
                      We typically respond within 24 hours. For urgent inquiries, call us directly.
                    </p>
                  </form>
                )}
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
