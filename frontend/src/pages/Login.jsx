import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../lib/auth";
import { toast } from "sonner";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import Logo from "../components/Logo";
import { ArrowRight, Loader2 } from "lucide-react";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const submit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const res = await login(email, password);

      setLoading(false);

      if (!res.ok) {
        toast.error(res.error);
        return;
      }

      toast.success(`Welcome back, ${res.user.name.split(" ")[0]}`);
      nav("/dashboard");

    } catch (err) {
      setLoading(false);
      toast.error("Something went wrong.");
    }
  };
  const demo = (email, password) => { setEmail(email); setPassword(password); };

  return (
    <div className="min-h-screen bg-[#0A0A0B] flex" data-testid="login-page">
      {/* Left visual */}
      <div className="hidden lg:flex lg:w-1/2 relative grid-bg noise overflow-hidden">
        <div className="absolute top-1/3 -left-20 w-96 h-96 bg-emerald-500/25 rounded-full blur-[120px]" />
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <Link to="/"><Logo size="lg" /></Link>
          <div className="max-w-md">
            <div className="text-xs uppercase tracking-[0.2em] text-emerald-400 mb-4">Welcome back</div>
            <h1 className="font-display text-5xl font-bold leading-tight">Your revenue engine, <span className="text-emerald-400">right where you left it.</span></h1>
            <p className="mt-6 text-zinc-400 leading-relaxed">Sign in to command your pipeline, coach your team and close more deals — all from one elegant dashboard.</p>
          </div>
          <div className="text-xs text-zinc-600">© 2026 CRM360</div>
        </div>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="lg:hidden mb-8"><Link to="/"><Logo /></Link></div>
          <h2 className="font-display text-3xl font-bold">Sign in</h2>
          <p className="text-zinc-400 mt-2 text-sm">Enter your credentials to access your workspace.</p>

          <form onSubmit={submit} className="mt-8 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-zinc-400 text-xs uppercase tracking-wider">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                className="bg-zinc-900 border-zinc-800 h-12 text-white focus-visible:border-emerald-500 focus-visible:ring-emerald-500/30"
                placeholder="you@company.com" data-testid="login-email-input" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="password" className="text-zinc-400 text-xs uppercase tracking-wider">Password</Label>
                <button type="button" className="text-xs text-emerald-400 hover:text-emerald-300">Forgot?</button>
              </div>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                className="bg-zinc-900 border-zinc-800 h-12 text-white focus-visible:border-emerald-500 focus-visible:ring-emerald-500/30"
                placeholder="••••••••" data-testid="login-password-input" />
            </div>
            <Button type="submit" disabled={loading}
              className="w-full h-12 bg-emerald-500 hover:bg-emerald-600 text-black font-semibold shadow-[0_0_25px_rgba(16,185,129,0.35)]"
              data-testid="login-submit-btn">
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <>Sign in <ArrowRight className="ml-2 h-4 w-4" /></>}
            </Button>
          </form>

          <div className="mt-8">
            <div className="text-xs uppercase tracking-[0.2em] text-zinc-500 mb-3">Try a demo account</div>
            <div className="grid grid-cols-3 gap-2">
              <button onClick={() => demo("admin@crm360.com", "admin123")} className="p-3 rounded-lg border border-white/5 bg-white/[0.02] hover:border-emerald-500/40 hover:bg-emerald-500/5 transition text-left" data-testid="demo-admin-btn">
                <div className="text-xs text-emerald-400 font-medium">Admin</div>
                <div className="text-[10px] text-zinc-500 mt-0.5">admin@crm360.com</div>
              </button>
              <button onClick={() => demo("manager@crm360.com", "manager123")} className="p-3 rounded-lg border border-white/5 bg-white/[0.02] hover:border-emerald-500/40 hover:bg-emerald-500/5 transition text-left" data-testid="demo-manager-btn">
                <div className="text-xs text-emerald-400 font-medium">Manager</div>
                <div className="text-[10px] text-zinc-500 mt-0.5">manager@crm360.com</div>
              </button>
              <button onClick={() => demo("exec@crm360.com", "exec123")} className="p-3 rounded-lg border border-white/5 bg-white/[0.02] hover:border-emerald-500/40 hover:bg-emerald-500/5 transition text-left" data-testid="demo-exec-btn">
                <div className="text-xs text-emerald-400 font-medium">Executive</div>
                <div className="text-[10px] text-zinc-500 mt-0.5">exec@crm360.com</div>
              </button>
            </div>
          </div>

          <p className="mt-8 text-sm text-zinc-500 text-center">
            New to CRM360? <Link to="/signup" className="text-emerald-400 hover:text-emerald-300 font-medium" data-testid="link-to-signup">Create account</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
