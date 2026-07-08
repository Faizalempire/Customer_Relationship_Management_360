import React from "react";

export const Card = ({ className = "", children, ...props }) => (
  <div className={`rounded-xl border border-white/5 bg-white/[0.02] ${className}`} {...props}>{children}</div>
);

export const CardHeader = ({ children, className = "" }) => (
  <div className={`p-6 pb-0 ${className}`}>{children}</div>
);

export const CardBody = ({ children, className = "" }) => (
  <div className={`p-6 ${className}`}>{children}</div>
);

export const SectionTitle = ({ eyebrow, title, right }) => (
  <div className="flex items-end justify-between mb-6">
    <div>
      {eyebrow && <div className="text-xs uppercase tracking-[0.2em] text-emerald-400 mb-2">{eyebrow}</div>}
      <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">{title}</h1>
    </div>
    {right}
  </div>
);

export const KpiCard = ({ label, value, delta, icon: Icon, testid }) => (
  <div className="p-6 rounded-xl border border-white/5 bg-white/[0.02] card-hover" data-testid={testid}>
    <div className="flex items-start justify-between">
      <div className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">{label}</div>
      {Icon && (
        <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
          <Icon className="h-4 w-4 text-emerald-400" />
        </div>
      )}
    </div>
    <div className="mt-4 font-display text-3xl font-bold">{value}</div>
    {delta && <div className={`mt-1 text-xs ${delta.startsWith("-") ? "text-red-400" : "text-emerald-400"}`}>{delta}</div>}
  </div>
);

export const StatusPill = ({ status }) => {
  const map = {
    New: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    Contacted: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    Qualified: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    Proposal: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    Negotiation: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    Won: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    Lost: "bg-red-500/10 text-red-400 border-red-500/20",
    active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    inactive: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
    "churn-risk": "bg-red-500/10 text-red-400 border-red-500/20",
    pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    "in-progress": "bg-blue-500/10 text-blue-400 border-blue-500/20",
    completed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    overdue: "bg-red-500/10 text-red-400 border-red-500/20",
    scheduled: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    high: "bg-red-500/10 text-red-400 border-red-500/20",
    medium: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    low: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
  };
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md border text-xs font-medium ${map[status] || "bg-zinc-500/10 text-zinc-400 border-zinc-500/20"}`}>{status}</span>;
};

export const EmptyState = ({ title, desc }) => (
  <div className="p-12 text-center rounded-xl border border-dashed border-white/10">
    <div className="text-lg font-display font-semibold text-zinc-300">{title}</div>
    <div className="text-sm text-zinc-500 mt-2">{desc}</div>
  </div>
);

export const currency = (n) => `₹${(n / 100000).toFixed(1)}L`;
