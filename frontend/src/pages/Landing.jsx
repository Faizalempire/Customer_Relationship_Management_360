import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, BarChart3, Users, Target, Zap, Shield, Sparkles, Check, ChevronRight, Kanban, Bell, Calendar as CalIcon } from "lucide-react";
import Logo from "../components/Logo";
import { Button } from "../components/ui/button";

const features = [
  { icon: Kanban, title: "Visual Pipeline", desc: "Kanban-first sales pipeline. Drag, drop, close — never lose a deal." },
  { icon: Target, title: "Lead Intelligence", desc: "Score, assign and route leads with rules that convert 2× faster." },
  { icon: Users, title: "Team Orchestration", desc: "Role-based access for Admins, Managers and Executives. Zero friction." },
  { icon: BarChart3, title: "Real-time Analytics", desc: "Revenue, conversion and executive performance in one glance." },
  { icon: Bell, title: "Smart Follow-ups", desc: "Never miss a beat. Automated reminders keep every promise on time." },
  { icon: Shield, title: "Enterprise-grade", desc: "Audit logs, granular permissions and single-tenant data isolation." },
];

const kpis = [
  { value: "42%", label: "avg. conversion lift" },
  { value: "3.1×", label: "faster deal cycle" },
  { value: "180+", label: "teams onboarded" },
  { value: "99.9%", label: "platform uptime" },
];

const roleCards = [
  { title: "Admin", tag: "Command everything", pts: ["Full system control", "User & role management", "Audit logs", "Global reports"], color: "from-emerald-500/20 to-transparent" },
  { title: "Sales Manager", tag: "Coach the team", pts: ["Assign & reassign leads", "Team performance", "Pipeline oversight", "Forecasting"], color: "from-emerald-400/20 to-transparent" },
  { title: "Sales Executive", tag: "Close more deals", pts: ["My leads & customers", "Follow-up tracker", "Task board", "Personal KPIs"], color: "from-emerald-300/20 to-transparent" },
];

export default function Landing() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white overflow-hidden" data-testid="landing-page">
      {/* NAV */}
      <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? "glass-panel border-b border-white/5" : ""}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <Logo />
          <nav className="hidden md:flex items-center gap-8 text-sm text-zinc-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#roles" className="hover:text-white transition-colors">Roles</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#testimonials" className="hover:text-white transition-colors">Customers</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link to="/login" data-testid="nav-login-link">
              <Button variant="ghost" className="text-zinc-300 hover:text-white hover:bg-white/5">Sign in</Button>
            </Link>
            <Link to="/signup" data-testid="nav-signup-link">
              <Button className="bg-emerald-500 hover:bg-emerald-600 text-black font-semibold shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                Get started <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative pt-40 pb-24 grid-bg noise">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0A0A0B]" />
        <div className="absolute top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-emerald-500/20 blur-[120px] -z-0" />
        <div className="relative max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-xs font-medium mb-6">
              <Sparkles className="h-3.5 w-3.5" /> New — Pipeline forecasting is here
            </div>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05]">
              The CRM that <span className="text-emerald-400 text-glow-emerald">closes itself.</span>
            </h1>
            <p className="mt-6 text-lg text-zinc-400 max-w-2xl leading-relaxed">
              CRM360 unifies leads, pipeline, follow-ups and analytics into one elegant workspace built for Admins, Sales Managers and Executives — no bloat, no compromises.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link to="/signup" data-testid="hero-cta-signup">
                <Button className="h-12 px-6 bg-emerald-500 hover:bg-emerald-600 text-black font-semibold rounded-lg shadow-[0_0_30px_rgba(16,185,129,0.4)]">
                  Start free trial <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/login" data-testid="hero-cta-login">
                <Button variant="outline" className="h-12 px-6 border-white/15 bg-white/5 text-white hover:bg-white/10 rounded-lg">
                  Sign in
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* KPI STRIP */}
          <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-white/5 pt-10">
            {kpis.map((k, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                <div className="font-display text-4xl font-bold text-white">{k.value}</div>
                <div className="text-xs uppercase tracking-[0.2em] text-zinc-500 mt-1">{k.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-[1fr_2fr] gap-16">
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-emerald-400 mb-4">Features</div>
              <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tight">
                Every workflow, engineered.
              </h2>
              <p className="mt-6 text-zinc-400 leading-relaxed">
                From first touch to closed-won, CRM360 removes friction at every step. Designed with sales teams that actually ship revenue.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {features.map((f, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                  className="p-6 rounded-xl border border-white/5 bg-white/[0.02] card-hover"
                  data-testid={`feature-card-${i}`}
                >
                  <div className="h-10 w-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4">
                    <f.icon className="h-5 w-5 text-emerald-400" />
                  </div>
                  <h3 className="font-display text-lg font-semibold">{f.title}</h3>
                  <p className="text-sm text-zinc-400 mt-2 leading-relaxed">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ROLES */}
      <section id="roles" className="py-32 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl mb-16">
            <div className="text-xs uppercase tracking-[0.2em] text-emerald-400 mb-4">Built for teams</div>
            <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tight">Three roles. One platform.</h2>
            <p className="mt-4 text-zinc-400">Purpose-built dashboards for every seat in your revenue engine.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {roleCards.map((r, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className={`relative p-8 rounded-2xl border border-white/5 bg-gradient-to-br ${r.color} bg-white/[0.02] card-hover overflow-hidden`}
              >
                <div className="absolute top-0 right-0 h-32 w-32 bg-emerald-500/10 rounded-full blur-3xl" />
                <div className="text-xs uppercase tracking-[0.2em] text-emerald-400 mb-3">{r.tag}</div>
                <h3 className="font-display text-2xl font-bold mb-6">{r.title}</h3>
                <ul className="space-y-3">
                  {r.pts.map((p, j) => (
                    <li key={j} className="flex items-center gap-3 text-sm text-zinc-300">
                      <Check className="h-4 w-4 text-emerald-400 shrink-0" /> {p}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* IMAGE SPLIT */}
      <section className="py-32 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative rounded-2xl overflow-hidden border border-white/5 h-[420px]">
            <img src="https://images.pexels.com/photos/36713443/pexels-photo-36713443.jpeg" alt="team" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0B] via-transparent to-transparent" />
          </div>
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-emerald-400 mb-4">Command Room</div>
            <h2 className="font-display text-4xl font-bold tracking-tight">Your sales team, coordinated in real-time.</h2>
            <p className="mt-6 text-zinc-400 leading-relaxed">
              Managers see the full picture. Executives see their focus zone. Admins see everything. Every user gets exactly what they need — nothing more, nothing less.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/signup"><Button className="bg-emerald-500 hover:bg-emerald-600 text-black font-semibold h-11 px-6">Try it free <ChevronRight className="ml-1 h-4 w-4" /></Button></Link>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-32 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl mb-16">
            <div className="text-xs uppercase tracking-[0.2em] text-emerald-400 mb-4">Pricing</div>
            <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tight">Simple. Fair. Unlimited.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Starter", price: "$0", period: "forever", pts: ["Up to 3 users", "500 contacts", "Basic pipeline", "Email support"], featured: false },
              { name: "Growth", price: "$29", period: "per user / month", pts: ["Unlimited contacts", "Full pipeline & reports", "Automations", "Priority support"], featured: true },
              { name: "Enterprise", price: "Custom", period: "annual contract", pts: ["SSO & audit logs", "Dedicated CSM", "SLA guaranteed", "Custom integrations"], featured: false },
            ].map((p, i) => (
              <div key={i} className={`p-8 rounded-2xl border card-hover ${p.featured ? "border-emerald-500/50 bg-emerald-500/[0.03] glow-emerald" : "border-white/5 bg-white/[0.02]"}`}>
                {p.featured && <div className="text-xs uppercase tracking-[0.2em] text-emerald-400 mb-3">Most popular</div>}
                <h3 className="font-display text-xl font-semibold">{p.name}</h3>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="font-display text-4xl font-bold">{p.price}</span>
                  <span className="text-sm text-zinc-500">{p.period}</span>
                </div>
                <ul className="mt-6 space-y-3">
                  {p.pts.map((pt, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-zinc-300"><Check className="h-4 w-4 text-emerald-400" /> {pt}</li>
                  ))}
                </ul>
                <Link to="/signup" className="block mt-8">
                  <Button className={`w-full ${p.featured ? "bg-emerald-500 hover:bg-emerald-600 text-black" : "bg-white/5 hover:bg-white/10 border border-white/10 text-white"} font-semibold`}>
                    Get started
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="py-32 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl mb-16">
            <div className="text-xs uppercase tracking-[0.2em] text-emerald-400 mb-4">Loved by teams</div>
            <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tight">Words from the field.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Kavya Iyer", role: "VP Sales, Orion", quote: "CRM360 replaced three tools. Our team actually enjoys using it." },
              { name: "Manish Gupta", role: "Founder, NovaTech", quote: "Pipeline visibility jumped from murky to crystal in one week." },
              { name: "Farah Khan", role: "Head of Growth, Zenith", quote: "The role-based dashboards are chef's kiss. Everyone gets what they need." },
            ].map((t, i) => (
              <div key={i} className="p-8 rounded-2xl border border-white/5 bg-white/[0.02] card-hover">
                <div className="text-emerald-400 mb-4 text-2xl">"</div>
                <p className="text-zinc-300 leading-relaxed">{t.quote}</p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-semibold">{t.name[0]}</div>
                  <div>
                    <div className="font-semibold">{t.name}</div>
                    <div className="text-xs text-zinc-500">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-display text-5xl sm:text-6xl font-bold tracking-tight">Close more. <span className="text-emerald-400">Stress less.</span></h2>
          <p className="mt-6 text-zinc-400 text-lg">Start free. No credit card. 14-day full-feature trial.</p>
          <div className="mt-10 flex justify-center gap-4">
            <Link to="/signup" data-testid="footer-cta-signup"><Button className="h-12 px-8 bg-emerald-500 hover:bg-emerald-600 text-black font-semibold shadow-[0_0_40px_rgba(16,185,129,0.5)]">Start free <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <Logo />
          <div className="text-sm text-zinc-500">© 2026 CRM360 — Built with care.</div>
        </div>
      </footer>
    </div>
  );
}
