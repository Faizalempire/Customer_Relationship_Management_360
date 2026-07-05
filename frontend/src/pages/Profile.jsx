import React, { useState } from "react";
import { useAuth } from "../lib/auth";
import { SectionTitle, Card } from "../components/UIKit";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { getDB, saveDB } from "../lib/mockData";
import { toast } from "sonner";

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const db = getDB();
  const full = db.users.find(u => u.id === user.id) || {};
  const [form, setForm] = useState({ name: full.name || "", email: full.email || "", phone: full.phone || "" });
  const [pwd, setPwd] = useState({ current: "", next: "", confirm: "" });

  const save = () => {
    if (!form.name || !form.email) return toast.error("Name & email required");
    const cur = getDB();
    cur.users = cur.users.map(u => u.id === user.id ? { ...u, ...form } : u);
    saveDB(cur);
    updateProfile({ name: form.name, email: form.email });
    toast.success("Profile updated");
  };
  const changePwd = () => {
    if (pwd.current !== full.password) return toast.error("Current password incorrect");
    if (pwd.next.length < 6) return toast.error("New password too short");
    if (pwd.next !== pwd.confirm) return toast.error("Passwords do not match");
    const cur = getDB();
    cur.users = cur.users.map(u => u.id === user.id ? { ...u, password: pwd.next } : u);
    saveDB(cur);
    setPwd({ current: "", next: "", confirm: "" });
    toast.success("Password updated");
  };

  return (
    <div data-testid="profile-page">
      <SectionTitle eyebrow="Account" title="Profile" />
      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="p-6 lg:col-span-1 text-center">
          <div className="h-24 w-24 rounded-full mx-auto bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-3xl font-bold">{full.avatar}</div>
          <div className="mt-4 font-display text-xl font-semibold">{full.name}</div>
          <div className="text-xs uppercase tracking-wider text-emerald-400 mt-1">{full.role}</div>
          <div className="text-sm text-zinc-500 mt-3">{full.email}</div>
          <div className="text-xs text-zinc-600 mt-3">Joined {full.joined}</div>
        </Card>
        <Card className="p-6 lg:col-span-2">
          <h3 className="font-display font-semibold mb-4">Edit information</h3>
          <div className="grid gap-4">
            <div><Label className="text-zinc-400 text-xs">Full name</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="bg-zinc-900 border-zinc-800 mt-1" data-testid="profile-name-input" /></div>
            <div><Label className="text-zinc-400 text-xs">Email</Label><Input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="bg-zinc-900 border-zinc-800 mt-1" /></div>
            <div><Label className="text-zinc-400 text-xs">Phone</Label><Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="bg-zinc-900 border-zinc-800 mt-1" /></div>
          </div>
          <Button onClick={save} className="mt-6 bg-emerald-500 hover:bg-emerald-600 text-black font-semibold" data-testid="profile-save-btn">Save changes</Button>

          <div className="mt-10 pt-6 border-t border-white/5">
            <h3 className="font-display font-semibold mb-4">Change password</h3>
            <div className="grid gap-4 max-w-md">
              <div><Label className="text-zinc-400 text-xs">Current password</Label><Input type="password" value={pwd.current} onChange={e => setPwd({ ...pwd, current: e.target.value })} className="bg-zinc-900 border-zinc-800 mt-1" /></div>
              <div><Label className="text-zinc-400 text-xs">New password</Label><Input type="password" value={pwd.next} onChange={e => setPwd({ ...pwd, next: e.target.value })} className="bg-zinc-900 border-zinc-800 mt-1" /></div>
              <div><Label className="text-zinc-400 text-xs">Confirm new password</Label><Input type="password" value={pwd.confirm} onChange={e => setPwd({ ...pwd, confirm: e.target.value })} className="bg-zinc-900 border-zinc-800 mt-1" /></div>
            </div>
            <Button onClick={changePwd} variant="outline" className="mt-4 border-white/10 bg-white/5 hover:bg-white/10 text-white">Update password</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
