import React from "react";
import { getDB } from "../lib/mockData";
import { useAuth } from "../lib/auth";
import { SectionTitle, Card, StatusPill, currency } from "../components/UIKit";

export default function Team() {
  const { user } = useAuth();
  const db = getDB();
  const scope = user.role === "admin" ? db.users.filter(u => u.role !== "admin") : db.users.filter(u => u.role === "executive");

  return (
    <div data-testid="team-page">
      <SectionTitle eyebrow={user.role === "admin" ? "Roster" : "Team Management"} title={user.role === "admin" ? "Teams" : "Sales Team"} />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {scope.map(u => {
          const leads = db.leads.filter(l => l.assignedTo === u.id);
          const won = leads.filter(l => l.stage === "Won").length;
          const active = leads.filter(l => !["Won", "Lost"].includes(l.stage)).length;
          const tasks = db.tasks.filter(t => t.assignedTo === u.id);
          const completedTasks = tasks.filter(t => t.status === "completed").length;
          const conv = leads.length ? Math.round((won / leads.length) * 100) : 0;
          return (
            <Card key={u.id} className="p-6 card-hover" data-testid={`team-card-${u.id}`}>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-semibold">{u.avatar}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{u.name}</div>
                  <div className="text-xs text-zinc-500 truncate">{u.email}</div>
                </div>
                <StatusPill status={u.status} />
              </div>
              <div className="mt-4 text-xs uppercase tracking-wider text-zinc-500">{u.role}</div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-center">
                <div className="p-3 rounded-lg bg-white/[0.03]"><div className="font-display text-2xl font-bold">{leads.length}</div><div className="text-[10px] uppercase text-zinc-500 mt-0.5">Leads</div></div>
                <div className="p-3 rounded-lg bg-white/[0.03]"><div className="font-display text-2xl font-bold text-emerald-400">{won}</div><div className="text-[10px] uppercase text-zinc-500 mt-0.5">Won</div></div>
                <div className="p-3 rounded-lg bg-white/[0.03]"><div className="font-display text-2xl font-bold">{active}</div><div className="text-[10px] uppercase text-zinc-500 mt-0.5">Active</div></div>
                <div className="p-3 rounded-lg bg-white/[0.03]"><div className="font-display text-2xl font-bold">{conv}%</div><div className="text-[10px] uppercase text-zinc-500 mt-0.5">Conversion</div></div>
              </div>
              <div className="mt-4 text-xs text-zinc-500">Tasks: {completedTasks}/{tasks.length} done</div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
