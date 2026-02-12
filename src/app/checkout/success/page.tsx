import Link from "next/link";
import { CheckCircle, ArrowRight, Home, Package } from "lucide-react";

export default function CheckoutSuccessPage() {
  return (
    <section className="relative min-h-screen flex items-center justify-center">
      <div className="absolute inset-0 bg-background" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-green-500/[0.04] rounded-full blur-[120px]" />
      <div className="relative z-10 max-w-lg mx-auto px-6 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/10 text-green-400 mb-6">
          <CheckCircle size={40} />
        </div>

        <h1 className="text-3xl md:text-4xl font-black text-white mb-3">
          Payment Received!
        </h1>
        <p className="text-muted-light text-lg mb-2">
          Your 25% deposit has been processed successfully.
        </p>
        <p className="text-muted text-sm mb-8">
          You&apos;ll receive a confirmation email shortly. Our team will reach out within 24 hours to kick off your build.
        </p>

        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] mb-8 text-left space-y-3">
          <h3 className="text-white font-bold text-sm">What happens next?</h3>
          <div className="flex items-start gap-3">
            <span className="shrink-0 w-6 h-6 rounded-full bg-accent/10 text-accent text-xs font-bold flex items-center justify-center">1</span>
            <p className="text-muted-light text-sm">Our design team contacts you for reference images &amp; preferences</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="shrink-0 w-6 h-6 rounded-full bg-accent2/10 text-accent2 text-xs font-bold flex items-center justify-center">2</span>
            <p className="text-muted-light text-sm">We create concept mockups and send them for your approval</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="shrink-0 w-6 h-6 rounded-full bg-accent3/10 text-accent3 text-xs font-bold flex items-center justify-center">3</span>
            <p className="text-muted-light text-sm">Once approved, we print, ship &amp; install your wrap</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/portal"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold text-white bg-gradient-to-r from-accent to-accent2 rounded-full hover:shadow-[0_0_30px_#ff2d7b44] hover:scale-105 transition-all"
          >
            <Package size={16} /> Track My Order
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-muted-light border border-white/10 rounded-full hover:bg-white/5 hover:text-white transition-all"
          >
            <Home size={16} /> Back Home
          </Link>
        </div>
      </div>
    </section>
  );
}
