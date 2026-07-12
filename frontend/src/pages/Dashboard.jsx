import React from "react";
import { useAuth } from "../lib/auth";
import { getDB } from "../lib/mockData";
import { KpiCard, Card, StatusPill, SectionTitle, currency } from "../components/UIKit";
import { Users, Target, DollarSign, TrendingUp, CheckSquare, Clock, Repeat, Trophy } from "lucide-react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { motion } from "framer-motion";
import { getDashboardStats } from "../api/dashboardApi";

const chartTheme = { stroke: "#3f3f46", tick: "#71717a" };

export default function Dashboard() {
  const { user } = useAuth();
  const db = getDB();

  const [stats, setStats] = React.useState({
    totalCustomers: 0,
    totalLeads: 0,
    activeLeads: 0,
    wonDeals: 0,
    lostDeals: 0,
    revenue: 0,

    totalUsers: 0,
    admins: 0,
    salesManagers: 0,
    salesExecutives: 0,

    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    inProgressTasks: 0,

    leadStageData: [],
    recentCustomers: [],
    recentLeads: [],
    recentTasks: [],
  });

  React.useEffect(() => {
    const loadDashboard = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (err) {
        console.error(err);
      }
    };

    loadDashboard();
  }, []);
  if (!user) return null;

  if (user.role === "admin") return <AdminDashboard db={db} stats={stats} />;
  if (user.role === "sales_manager") return <ManagerDashboard db={db} user={user} />;
  return <ExecutiveDashboard db={db} user={user} />;
}

function AdminDashboard({ db, stats

}) {
  const totalRev = db.leads.filter(l => l.stage === "Won").reduce((s, l) => s + l.value, 0);
  const pipelineVal = db.leads.filter(l => !["Won", "Lost"].includes(l.stage)).reduce((s, l) => s + l.value, 0);
  const conv = Math.round((db.leads.filter(l => l.stage === "Won").length / db.leads.length) * 100);

  const stageData = stats.leadStageData.map(stage => ({
    name: stage._id,
    count: stage.count,
  }));
  const revenueByMonth = [
    { m: "Sep", rev: 4.2 }, { m: "Oct", rev: 5.8 }, { m: "Nov", rev: 6.1 }, { m: "Dec", rev: 7.4 }, { m: "Jan", rev: 8.9 }, { m: "Feb", rev: 9.6 },
  ];
  const roleData = [
    {
      name: "Admin",
      value: stats.admins,
    },
    {
      name: "Sales Manager",
      value: stats.salesManagers,
    },
    {
      name: "Sales Executive",
      value: stats.salesExecutives,
    },
  ];
  const COLORS = ["#10B981", "#3B82F6", "#F59E0B"];

  return (
    <div data-testid="admin-dashboard">
      <SectionTitle eyebrow="Command room" title="Admin Overview" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KpiCard
          label="Customers"
          value={stats.totalCustomers} delta="+2 this month" icon={Users} testid="kpi-users" />
        <KpiCard
          label="Revenue Won"
          value={currency(stats.revenue)} delta="+18% MoM" icon={DollarSign} testid="kpi-revenue" />
        <KpiCard
          label="Active Leads"
          value={stats.activeLeads} delta="+12% MoM" icon={TrendingUp} testid="kpi-pipeline" />
        <KpiCard
          label="Won Deals"
          value={stats.wonDeals}
          delta={`${stats.lostDeals} Lost`}
          icon={Trophy}
          testid="kpi-conversion"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mb-8">
        <Card className="lg:col-span-2 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-display font-semibold">Revenue trend</h3>
            <span className="text-xs text-zinc-500">Last 6 months (₹L)</span>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={revenueByMonth}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.stroke} />
              <XAxis dataKey="m" stroke={chartTheme.tick} />
              <YAxis stroke={chartTheme.tick} />
              <Tooltip contentStyle={{ background: "#121214", border: "1px solid #27272a", borderRadius: 8 }} />
              <Line type="monotone" dataKey="rev" stroke="#10B981" strokeWidth={3} dot={{ fill: "#10B981", r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="font-display font-semibold mb-6">Team composition</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={roleData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80}>
                {roleData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "#121214", border: "1px solid #27272a" }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-4">
            {roleData.map((r, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2"><div className="h-2.5 w-2.5 rounded-full" style={{ background: COLORS[i] }} /> <span className="text-zinc-400">{r.name}</span></div>
                <span className="font-semibold">{r.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card className="p-6">
          <h3 className="font-display font-semibold mb-6">Pipeline by stage</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={stageData}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.stroke} />
              <XAxis dataKey="name" stroke={chartTheme.tick} tick={{ fontSize: 11 }} />
              <YAxis stroke={chartTheme.tick} />
              <Tooltip contentStyle={{ background: "#121214", border: "1px solid #27272a" }} />
              <Bar dataKey="count" fill="#10B981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="font-display font-semibold mb-6">Recent activity</h3>
          <div className="space-y-3">

            {stats.recentCustomers?.map((customer, i) => (
              <motion.div
                key={`customer-${customer._id}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/5"
              >
                <div className="h-8 w-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 text-xs font-semibold">
                  C
                </div>

                <div className="flex-1">
                  <div className="text-sm text-zinc-200">
                    Customer <strong>{customer.customerName}</strong> created
                  </div>

                  <div className="text-[10px] text-zinc-500">
                    {new Date(customer.createdAt).toLocaleString()}
                  </div>
                </div>
              </motion.div>
            ))}

            {stats.recentLeads?.map((lead, i) => (
              <motion.div
                key={`lead-${lead._id}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/5"
              >
                <div className="h-8 w-8 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 text-xs font-semibold">
                  L
                </div>

                <div className="flex-1">
                  <div className="text-sm text-zinc-200">
                    Lead <strong>{lead.name}</strong> added
                  </div>

                  <div className="text-[10px] text-zinc-500">
                    {new Date(lead.createdAt).toLocaleString()}
                  </div>
                </div>
              </motion.div>
            ))}

            {stats.recentTasks?.map((task, i) => (
              <motion.div
                key={`task-${task._id}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/5"
              >
                <div className="h-8 w-8 rounded-full bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-400 text-xs font-semibold">
                  T
                </div>

                <div className="flex-1">
                  <div className="text-sm text-zinc-200">
                    Task <strong>{task.title}</strong> created
                  </div>

                  <div className="text-[10px] text-zinc-500">
                    {new Date(task.createdAt).toLocaleString()}
                  </div>
                </div>
              </motion.div>
            ))}

          </div>
        </Card>
      </div>
    </div>
  );
}

function ManagerDashboard({ db, user }) {
  const teamLeads = db.leads;
  const won = teamLeads.filter(l => l.stage === "Won");
  const pipelineVal = teamLeads.filter(l => !["Won", "Lost"].includes(l.stage)).reduce((s, l) => s + l.value, 0);
  const overdueTasks = db.tasks.filter(t => t.status === "overdue").length;
  const execs = db.users.filter(u => u.role === "sales_executive");

  const execPerf = execs.map(e => ({
    name: e.name.split(" ")[0],
    won: db.leads.filter(l => l.assignedTo === e.id && l.stage === "Won").length,
    active: db.leads.filter(l => l.assignedTo === e.id && !["Won", "Lost"].includes(l.stage)).length,
  }));

  return (
    <div data-testid="manager-dashboard">
      <SectionTitle eyebrow="Team overview" title="Manager Dashboard" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KpiCard label="Team Leads" value={teamLeads.length} icon={Target} testid="kpi-team-leads" />
        <KpiCard label="Deals Won" value={won.length} delta="+3 this month" icon={Trophy} testid="kpi-won" />
        <KpiCard label="Pipeline Value" value={currency(pipelineVal)} icon={TrendingUp} testid="kpi-pipeline" />
        <KpiCard label="Overdue Tasks" value={overdueTasks} icon={Clock} testid="kpi-overdue" />
      </div>

      <div className="grid lg:grid-cols-2 gap-4 mb-8">
        <Card className="p-6">
          <h3 className="font-display font-semibold mb-6">Executive performance</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={execPerf}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.stroke} />
              <XAxis dataKey="name" stroke={chartTheme.tick} />
              <YAxis stroke={chartTheme.tick} />
              <Tooltip contentStyle={{ background: "#121214", border: "1px solid #27272a" }} />
              <Bar dataKey="won" fill="#10B981" radius={[6, 6, 0, 0]} name="Won" />
              <Bar dataKey="active" fill="#3B82F6" radius={[6, 6, 0, 0]} name="Active" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card className="p-6">
          <h3 className="font-display font-semibold mb-6">Upcoming follow-ups</h3>
          <div className="space-y-2">
            {db.followups.filter(f => f.status === "scheduled").slice(0, 5).map(f => (
              <div key={f.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5">
                <div className="h-9 w-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 text-xs font-semibold">
                  {new Date(f.date).getDate()}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">{f.title}</div>
                  <div className="text-xs text-zinc-500">{new Date(f.date).toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function ExecutiveDashboard({ db, user }) {
  const myLeads = db.leads.filter(l => l.assignedTo === user.id);
  const myWon = myLeads.filter(l => l.stage === "Won").length;
  const myLost = myLeads.filter(l => l.stage === "Lost").length;
  const myTasks = db.tasks.filter(t => t.assignedTo === user.id && t.status !== "completed");
  const myFollowUps = db.followups.filter(f => f.assignedTo === user.id && f.status === "scheduled");

  return (
    <div data-testid="executive-dashboard">
      <SectionTitle eyebrow={`Hello, ${user.name.split(" ")[0]}`} title="Your workspace" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KpiCard label="Assigned Leads" value={myLeads.length} icon={Target} testid="kpi-my-leads" />
        <KpiCard label="Deals Won" value={myWon} icon={Trophy} testid="kpi-my-won" />
        <KpiCard label="Deals Lost" value={myLost} icon={Clock} testid="kpi-my-lost" />
        <KpiCard label="Open Tasks" value={myTasks.length} icon={CheckSquare} testid="kpi-my-tasks" />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card className="p-6">
          <h3 className="font-display font-semibold mb-4">Today's follow-ups</h3>
          <div className="space-y-2">
            {myFollowUps.length === 0 && <div className="text-sm text-zinc-500 py-6 text-center">No follow-ups scheduled.</div>}
            {myFollowUps.map(f => (
              <div key={f.id} className="p-3 rounded-lg border border-white/5 bg-white/[0.02] hover:border-emerald-500/30 transition">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">{f.title}</div>
                  <StatusPill status={f.status} />
                </div>
                <div className="text-xs text-zinc-500 mt-1">{new Date(f.date).toLocaleString()}</div>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-6">
          <h3 className="font-display font-semibold mb-4">My open tasks</h3>
          <div className="space-y-2">
            {myTasks.length === 0 && <div className="text-sm text-zinc-500 py-6 text-center">All caught up!</div>}
            {myTasks.map(t => (
              <div key={t.id} className="p-3 rounded-lg border border-white/5 bg-white/[0.02] hover:border-emerald-500/30 transition">
                <div className="flex items-center justify-between gap-2">
                  <div className="text-sm font-medium truncate">{t.title}</div>
                  <StatusPill status={t.status} />
                </div>
                <div className="text-xs text-zinc-500 mt-1">Due {t.dueDate}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
