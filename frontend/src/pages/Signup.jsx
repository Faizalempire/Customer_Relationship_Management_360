import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../lib/auth";
import { toast } from "sonner";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import Logo from "../components/Logo";
import { ArrowRight, Loader2, Crown, UserCog, User } from "lucide-react";

const roles = [
  { id: "admin", label: "Admin", desc: "Full system control", icon: Crown },
  { id: "manager", label: "Sales Manager", desc: "Coach the team", icon: UserCog },
  { id: "executive", label: "Sales Executive", desc: "Close deals", icon: User },
];

export default function Signup() {
  const { signup } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "executive" });
  const [loading, setLoading] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    if (form.password.length < 6) return toast.error("Password must be at least 6 characters");
    setLoading(true);
    setTimeout(() => {
      const res = signup(form);
      setLoading(false);
      if (!res.ok) return toast.error(res.error);
      toast.success(`Welcome to CRM360, ${res.user.name.split(" ")[0]}!`);
      nav("/dashboard");
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] flex" data-testid="signup-page">
      <div className="hidden lg:flex lg:w-1/2 relative grid-bg noise overflow-hidden">
        <div className="absolute top-1/2 -right-24 w-[500px] h-[500px] bg-emerald-500/20 rounded-full blur-[130px]" />
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <Link to="/"><Logo size="lg" /></Link>
          <div className="max-w-md">
            <div className="text-xs uppercase tracking-[0.2em] text-emerald-400 mb-4">Get started</div>
            <h1 className="font-display text-5xl font-bold leading-tight">Join the teams closing <span className="text-emerald-400">42% more</span> revenue.</h1>
            <p className="mt-6 text-zinc-400 leading-relaxed">Pick your role, get your dashboard, start closing.</p>
          </div>
          <div className="text-xs text-zinc-600">© 2026 CRM360</div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="lg:hidden mb-8"><Link to="/"><Logo /></Link></div>
          <h2 className="font-display text-3xl font-bold">Create account</h2>
          <p className="text-zinc-400 mt-2 text-sm">Distinguish your dashboard by choosing a role.</p>

          <form onSubmit={submit} className="mt-8 space-y-5">
            <div className="space-y-2">
              <Label className="text-zinc-400 text-xs uppercase tracking-wider">Select your role</Label>
              <div className="grid grid-cols-3 gap-2">
                {roles.map(r => (
                  <button type="button" key={r.id} onClick={() => setForm({ ...form, role: r.id })}
                    className={`p-3 rounded-lg border transition text-left ${form.role === r.id ? "border-emerald-500 bg-emerald-500/10" : "border-white/5 bg-white/[0.02] hover:border-white/20"}`}
                    data-testid={`role-select-${r.id}`}>
                    <r.icon className={`h-4 w-4 mb-2 ${form.role === r.id ? "text-emerald-400" : "text-zinc-400"}`} />
                    <div className={`text-xs font-medium ${form.role === r.id ? "text-emerald-400" : "text-white"}`}>{r.label}</div>
                    <div className="text-[10px] text-zinc-500 mt-0.5">{r.desc}</div>
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-400 text-xs uppercase tracking-wider">Full name</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="bg-zinc-900 border-zinc-800 h-12 text-white focus-visible:border-emerald-500" placeholder="Your full name" data-testid="signup-name-input" />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-400 text-xs uppercase tracking-wider">Work email</Label>
              <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required className="bg-zinc-900 border-zinc-800 h-12 text-white focus-visible:border-emerald-500" placeholder="you@company.com" data-testid="signup-email-input" />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-400 text-xs uppercase tracking-wider">Password</Label>
              <Input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required className="bg-zinc-900 border-zinc-800 h-12 text-white focus-visible:border-emerald-500" placeholder="At least 6 characters" data-testid="signup-password-input" />
            </div>
            <Button type="submit" disabled={loading} className="w-full h-12 bg-emerald-500 hover:bg-emerald-600 text-black font-semibold shadow-[0_0_25px_rgba(16,185,129,0.35)]" data-testid="signup-submit-btn">
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <>Create account <ArrowRight className="ml-2 h-4 w-4" /></>}
            </Button>
          </form>

          <p className="mt-6 text-sm text-zinc-500 text-center">
            Already have an account? <Link to="/login" className="text-emerald-400 hover:text-emerald-300 font-medium" data-testid="link-to-login">Sign in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
