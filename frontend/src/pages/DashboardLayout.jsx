import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth";
import Logo from "../components/Logo";
import { Home, Users, Target, Kanban, CheckSquare, Calendar, UsersRound, BarChart3, Bell, ScrollText, Settings as SettingsIcon, User as UserIcon, LogOut, Search, ChevronDown, Menu, X, Repeat } from "lucide-react";
import { Input } from "../components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../components/ui/dropdown-menu";
import { Badge } from "../components/ui/badge";
import { getDB } from "../lib/mockData";

const menuByRole = {
  admin: [
    { to: "/dashboard", label: "Dashboard", icon: Home, end: true },
    { to: "/dashboard/users", label: "User Management", icon: Users },
    { to: "/dashboard/customers", label: "Customers", icon: UsersRound },
    { to: "/dashboard/leads", label: "Leads", icon: Target },
    { to: "/dashboard/pipeline", label: "Sales Pipeline", icon: Kanban },
    { to: "/dashboard/tasks", label: "Tasks", icon: CheckSquare },
    { to: "/dashboard/calendar", label: "Calendar", icon: Calendar },
    { to: "/dashboard/team", label: "Teams", icon: UsersRound },
    { to: "/dashboard/reports", label: "Reports & Analytics", icon: BarChart3 },
    { to: "/dashboard/notifications", label: "Notifications", icon: Bell },
    { to: "/dashboard/activity", label: "Activity Logs", icon: ScrollText },
    { to: "/dashboard/settings", label: "Settings", icon: SettingsIcon },
    { to: "/dashboard/profile", label: "Profile", icon: UserIcon },
  ],
  manager: [
    { to: "/dashboard", label: "Dashboard", icon: Home, end: true },
    { to: "/dashboard/leads", label: "Leads", icon: Target },
    { to: "/dashboard/customers", label: "Customers", icon: UsersRound },
    { to: "/dashboard/pipeline", label: "Sales Pipeline", icon: Kanban },
    { to: "/dashboard/tasks", label: "Tasks", icon: CheckSquare },
    { to: "/dashboard/followups", label: "Follow-ups", icon: Repeat },
    { to: "/dashboard/team", label: "Team Management", icon: UsersRound },
    { to: "/dashboard/reports", label: "Reports & Analytics", icon: BarChart3 },
    { to: "/dashboard/notifications", label: "Notifications", icon: Bell },
    { to: "/dashboard/profile", label: "Profile", icon: UserIcon },
  ],
  executive: [
    { to: "/dashboard", label: "Dashboard", icon: Home, end: true },
    { to: "/dashboard/leads", label: "Leads", icon: Target },
    { to: "/dashboard/customers", label: "Customers", icon: UsersRound },
    { to: "/dashboard/followups", label: "Follow-ups", icon: Repeat },
    { to: "/dashboard/tasks", label: "Tasks", icon: CheckSquare },
    { to: "/dashboard/notifications", label: "Notifications", icon: Bell },
    { to: "/dashboard/profile", label: "Profile", icon: UserIcon },
  ],
};

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const [open, setOpen] = useState(false);

  const items = menuByRole[user?.role] || [];
  const db = getDB();
  const unread = db.notifications.filter(n => n.userId === user?.id && !n.read).length;

  const doLogout = () => { logout(); nav("/login"); };

  return (
    <div className="min-h-screen bg-[#0A0A0B] flex text-white" data-testid="dashboard-layout">
      {/* Sidebar */}
      <aside className={`${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 fixed lg:sticky top-0 left-0 z-40 h-screen w-64 border-r border-white/5 bg-[#0A0A0B] transition-transform flex flex-col`}>
        <div className="p-6 flex items-center justify-between">
          <Logo />
          <button className="lg:hidden text-zinc-400" onClick={() => setOpen(false)}><X className="h-5 w-5" /></button>
        </div>
        <div className="px-3 pb-2">
          <div className="text-[10px] uppercase tracking-[0.2em] text-zinc-600 px-3 mb-2">
            {user?.role === "admin" ? "Administrator" : user?.role === "manager" ? "Manager" : "Executive"}
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 space-y-1">
          {items.map((it) => (
            <NavLink key={it.to} to={it.to} end={it.end} onClick={() => setOpen(false)}
              className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${isActive ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent"}`}
              data-testid={`nav-${it.label.toLowerCase().replace(/\s+/g, "-").replace(/&/g, "and")}`}>
              <it.icon className="h-4 w-4" />
              <span className="font-medium">{it.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-white/5">
          <button onClick={doLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition" data-testid="sidebar-logout-btn">
            <LogOut className="h-4 w-4" /> <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 glass-panel border-b border-white/5">
          <div className="flex items-center gap-4 px-6 py-3">
            <button className="lg:hidden text-zinc-400" onClick={() => setOpen(true)}><Menu className="h-5 w-5" /></button>
            <div className="relative flex-1 max-w-xl">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <Input placeholder="Search leads, customers, tasks..." className="pl-9 bg-white/[0.02] border-white/5 h-10 text-sm focus-visible:border-emerald-500" data-testid="topbar-search-input" />
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => nav("/dashboard/notifications")} className="relative p-2 rounded-lg hover:bg-white/5 transition" data-testid="topbar-notifications-btn">
                <Bell className="h-5 w-5 text-zinc-400" />
                {unread > 0 && <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-emerald-500" />}
              </button>
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg hover:bg-white/5 transition" data-testid="topbar-profile-menu">
                  <div className="h-8 w-8 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-semibold text-xs">{user?.avatar}</div>
                  <div className="text-left hidden sm:block">
                    <div className="text-sm font-medium">{user?.name}</div>
                    <div className="text-[10px] text-zinc-500 uppercase tracking-wider">{user?.role}</div>
                  </div>
                  <ChevronDown className="h-3.5 w-3.5 text-zinc-500" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-[#121214] border-white/10 text-white w-56">
                  <DropdownMenuLabel className="text-zinc-400 text-xs">Signed in as</DropdownMenuLabel>
                  <DropdownMenuItem disabled className="text-zinc-300 opacity-100">{user?.email}</DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/5" />
                  <DropdownMenuItem onClick={() => nav("/dashboard/profile")} className="cursor-pointer hover:bg-white/5">
                    <UserIcon className="h-4 w-4 mr-2" /> Profile
                  </DropdownMenuItem>
                  {user?.role === "admin" && (
                    <DropdownMenuItem onClick={() => nav("/dashboard/settings")} className="cursor-pointer hover:bg-white/5">
                      <SettingsIcon className="h-4 w-4 mr-2" /> Settings
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator className="bg-white/5" />
                  <DropdownMenuItem onClick={doLogout} className="cursor-pointer text-red-400 hover:bg-red-500/10 focus:text-red-400" data-testid="dropdown-logout-btn">
                    <LogOut className="h-4 w-4 mr-2" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 lg:p-8 max-w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
