import React from "react";
import { getDB } from "../lib/mockData";
import { SectionTitle, Card, currency } from "../components/UIKit";
import { LineChart, Line, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";

const chartTheme = { stroke: "#3f3f46", tick: "#71717a" };

export default function Reports() {
  const db = getDB();

  const revenueTrend = [
    { m: "Sep", won: 4.2, lost: 1.1 }, { m: "Oct", won: 5.8, lost: 1.5 }, { m: "Nov", won: 6.1, lost: 1.2 }, { m: "Dec", won: 7.4, lost: 1.8 }, { m: "Jan", won: 8.9, lost: 2.0 }, { m: "Feb", won: 9.6, lost: 1.7 },
  ];
  const funnel = db.stages.map(s => ({ stage: s, count: db.leads.filter(l => l.stage === s).length }));
  const sources = ["Website", "Referral", "Cold Email", "LinkedIn", "Event"].map(s => ({ name: s, value: db.leads.filter(l => l.source === s).length }));
  const execs = db.users.filter(u => u.role === "executive").map(e => ({
    name: e.name.split(" ")[0],
    won: db.leads.filter(l => l.assignedTo === e.id && l.stage === "Won").length,
    revenue: db.leads.filter(l => l.assignedTo === e.id && l.stage === "Won").reduce((s, l) => s + l.value, 0) / 100000,
  }));

  const COLORS = ["#10B981", "#3B82F6", "#F59E0B", "#A855F7", "#EF4444"];

  return (
    <div data-testid="reports-page">
      <SectionTitle eyebrow="Insights" title="Reports & Analytics" />

      <div className="grid lg:grid-cols-3 gap-4 mb-4">
        <Card className="p-6"><div className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">Total Revenue</div><div className="font-display text-3xl font-bold mt-3">{currency(db.leads.filter(l => l.stage === "Won").reduce((s, l) => s + l.value, 0))}</div></Card>
        <Card className="p-6"><div className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">Deals Won</div><div className="font-display text-3xl font-bold mt-3 text-emerald-400">{db.leads.filter(l => l.stage === "Won").length}</div></Card>
        <Card className="p-6"><div className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">Total Customers</div><div className="font-display text-3xl font-bold mt-3">{db.customers.length}</div></Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-4 mb-4">
        <Card className="p-6">
          <h3 className="font-display font-semibold mb-4">Revenue trend</h3>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={revenueTrend}>
              <defs><linearGradient id="revA" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10B981" stopOpacity={0.4} /><stop offset="95%" stopColor="#10B981" stopOpacity={0} /></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.stroke} /><XAxis dataKey="m" stroke={chartTheme.tick} /><YAxis stroke={chartTheme.tick} />
              <Tooltip contentStyle={{ background: "#121214", border: "1px solid #27272a" }} /><Legend />
              <Area type="monotone" dataKey="won" stroke="#10B981" fill="url(#revA)" name="Won (₹L)" />
              <Area type="monotone" dataKey="lost" stroke="#EF4444" fill="transparent" name="Lost (₹L)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="font-display font-semibold mb-4">Conversion funnel</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={funnel} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.stroke} />
              <XAxis type="number" stroke={chartTheme.tick} /><YAxis dataKey="stage" type="category" stroke={chartTheme.tick} width={90} />
              <Tooltip contentStyle={{ background: "#121214", border: "1px solid #27272a" }} />
              <Bar dataKey="count" fill="#10B981" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card className="p-6">
          <h3 className="font-display font-semibold mb-4">Lead sources</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={sources} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} paddingAngle={2}>
                {sources.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "#121214", border: "1px solid #27272a" }} /><Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>
        <Card className="p-6">
          <h3 className="font-display font-semibold mb-4">Executive performance</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={execs}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.stroke} /><XAxis dataKey="name" stroke={chartTheme.tick} /><YAxis stroke={chartTheme.tick} />
              <Tooltip contentStyle={{ background: "#121214", border: "1px solid #27272a" }} /><Legend />
              <Bar dataKey="won" fill="#10B981" name="Won" radius={[6, 6, 0, 0]} />
              <Bar dataKey="revenue" fill="#3B82F6" name="Rev (₹L)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}
