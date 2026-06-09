import { Link } from "@tanstack/react-router";

export function Pricing() {
  return (
    <section id="pricing" className="py-24">
      <div className="relative rounded-[32px] border border-accent/30 bg-card overflow-hidden p-12 md:p-20 text-center">
        <div className="absolute inset-0 bg-aura pointer-events-none" />
        <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent">Completely Free</span>
          <h2 className="text-4xl md:text-6xl font-serif leading-tight">
            Unlimited readings. <span className="italic text-accent">Zero cost.</span>
          </h2>
          <p className="text-foreground/70 text-base md:text-lg">
            Every palm scan, every rekha analysis, every Acharya conversation — fully unlocked. No paywall, no subscriptions, no limits. The Hasta Samudrika Shastra belongs to every seeker.
          </p>
          <ul className="grid sm:grid-cols-2 gap-3 text-left text-sm text-foreground/80 pt-4 max-w-lg mx-auto">
            <li className="flex items-center gap-2"><span className="text-accent">✧</span> Unlimited palm scans</li>
            <li className="flex items-center gap-2"><span className="text-accent">✧</span> Full destiny reading</li>
            <li className="flex items-center gap-2"><span className="text-accent">✧</span> Auto line tracing</li>
            <li className="flex items-center gap-2"><span className="text-accent">✧</span> Ask the Acharya, anytime</li>
          </ul>
          <Link
            to="/scan"
            className="inline-block bg-accent text-accent-foreground px-10 py-5 rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-gold mt-4"
          >
            Begin Your Free Reading
          </Link>
        </div>
      </div>
    </section>
  );
}
