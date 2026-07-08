import React, { useState } from "react";
import { getDB, saveDB, generateId } from "../lib/mockData";
import { useAuth } from "../lib/auth";
import { Card, SectionTitle, StatusPill } from "../components/UIKit";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Plus, Check } from "lucide-react";
import { toast } from "sonner";

export default function FollowUps() {
  const { user } = useAuth();
  const [db, setDB] = useState(getDB());
  const [tab, setTab] = useState("upcoming");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", date: "", notes: "", leadId: "", customerId: "" });
  const refresh = () => setDB({ ...getDB() });

  const now = new Date();
  const visible = db.followups.filter(f => user.role === "executive" ? f.assignedTo === user.id : true).filter(f => {
    if (tab === "today") return new Date(f.date).toDateString() === now.toDateString();
    if (tab === "upcoming") return f.status === "scheduled" && new Date(f.date) >= now;
    if (tab === "missed") return f.status === "overdue" || (f.status === "scheduled" && new Date(f.date) < now);
    if (tab === "completed") return f.status === "completed";
    return true;
  });

  const create = () => {
    if (!form.title || !form.date) return toast.error("Title & date required");
    const cur = getDB();
    cur.followups.unshift({ id: generateId("f"), title: form.title, date: form.date, notes: form.notes, leadId: form.leadId || null, customerId: form.customerId || null, status: "scheduled", assignedTo: user.id });
    saveDB(cur); refresh(); setOpen(false);
    setForm({ title: "", date: "", notes: "", leadId: "", customerId: "" });
    toast.success("Follow-up scheduled");
  };
  const setStatus = (id, status) => {
    const cur = getDB();
    cur.followups = cur.followups.map(f => f.id === id ? { ...f, status } : f);
    saveDB(cur); refresh();
    toast.success("Updated");
  };

  return (
    <div data-testid="followups-page">
      <SectionTitle eyebrow="Cadence" title="Follow-ups" right={
        <Button onClick={() => setOpen(true)} className="bg-emerald-500 hover:bg-emerald-600 text-black font-semibold" data-testid="new-followup-btn">
          <Plus className="h-4 w-4 mr-1" /> New Follow-up
        </Button>
      } />
      <div className="flex gap-2 mb-6 flex-wrap">
        {["today", "upcoming", "missed", "completed", "all"].map(s => (
          <button key={s} onClick={() => setTab(s)} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${tab === s ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30" : "bg-white/[0.02] text-zinc-400 border border-white/5 hover:bg-white/5"}`}>
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>
      <div className="grid gap-3">
        {visible.map(f => (
          <Card key={f.id} className="p-5 card-hover">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <div className="font-medium">{f.title}</div>
                  <StatusPill status={f.status} />
                </div>
                <div className="text-xs text-zinc-500 mt-1">{new Date(f.date).toLocaleString()}</div>
                {f.notes && <div className="text-sm text-zinc-400 mt-2">{f.notes}</div>}
              </div>
              <div className="flex gap-2 shrink-0">
                {f.status !== "completed" && <Button size="sm" onClick={() => setStatus(f.id, "completed")} className="bg-emerald-500 hover:bg-emerald-600 text-black"><Check className="h-4 w-4 mr-1" /> Complete</Button>}
                {f.status === "scheduled" && <Button size="sm" variant="outline" onClick={() => setStatus(f.id, "overdue")} className="border-white/10 text-white hover:bg-white/5">Mark missed</Button>}
              </div>
            </div>
          </Card>
        ))}
        {visible.length === 0 && <div className="p-12 text-center text-zinc-500 text-sm rounded-xl border border-dashed border-white/10">No follow-ups here.</div>}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-[#121214] border-white/10 text-white max-w-lg">
          <DialogHeader><DialogTitle className="font-display">Schedule follow-up</DialogTitle></DialogHeader>
          <div className="grid gap-4">
            <div><Label className="text-zinc-400 text-xs">Title</Label><Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="bg-zinc-900 border-zinc-800 mt-1" data-testid="followup-form-title" /></div>
            <div><Label className="text-zinc-400 text-xs">Date & time</Label><Input type="datetime-local" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="bg-zinc-900 border-zinc-800 mt-1" /></div>
            <div><Label className="text-zinc-400 text-xs">Related lead (optional)</Label>
              <Select value={form.leadId} onValueChange={v => setForm({ ...form, leadId: v })}>
                <SelectTrigger className="bg-zinc-900 border-zinc-800 mt-1"><SelectValue placeholder="Select lead" /></SelectTrigger>
                <SelectContent className="bg-[#121214] border-white/10 text-white">{db.leads.map(l => <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label className="text-zinc-400 text-xs">Notes</Label><Textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} className="bg-zinc-900 border-zinc-800 mt-1" rows={3} /></div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={create} className="bg-emerald-500 hover:bg-emerald-600 text-black font-semibold" data-testid="followup-form-save">Schedule</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
