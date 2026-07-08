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
import { Plus, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function Tasks() {
  const { user } = useAuth();
  const [db, setDB] = useState(getDB());
  const [tab, setTab] = useState("all");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", assignedTo: "", dueDate: "", priority: "medium", status: "pending" });
  const refresh = () => setDB({ ...getDB() });

  const visible = db.tasks
    .filter(t => user.role === "executive" ? t.assignedTo === user.id : true)
    .filter(t => tab === "all" || t.status === tab);

  const canAssign = ["admin", "manager"].includes(user.role);

  const create = () => {
    if (!form.title) return toast.error("Title required");
    const cur = getDB();
    cur.tasks.unshift({ id: generateId("t"), ...form, assignedBy: user.id, relatedTo: null });
    cur.activity.unshift({ id: generateId("a"), userId: user.id, action: "created", entity: "task", entityId: "t", description: `Created task '${form.title}'`, timestamp: new Date().toISOString() });
    saveDB(cur); refresh(); setOpen(false);
    setForm({ title: "", description: "", assignedTo: "", dueDate: "", priority: "medium", status: "pending" });
    toast.success("Task created");
  };
  const complete = (id) => {
    const cur = getDB();
    cur.tasks = cur.tasks.map(t => t.id === id ? { ...t, status: "completed" } : t);
    saveDB(cur); refresh();
    toast.success("Task completed");
  };
  const setStatus = (id, status) => {
    const cur = getDB();
    cur.tasks = cur.tasks.map(t => t.id === id ? { ...t, status } : t);
    saveDB(cur); refresh();
  };

  return (
    <div data-testid="tasks-page">
      <SectionTitle eyebrow="Work" title="Tasks" right={
        <Button onClick={() => setOpen(true)} className="bg-emerald-500 hover:bg-emerald-600 text-black font-semibold" data-testid="new-task-btn">
          <Plus className="h-4 w-4 mr-1" /> New Task
        </Button>
      } />

      <div className="flex gap-2 mb-6 flex-wrap">
        {["all", "pending", "in-progress", "completed", "overdue"].map(s => (
          <button key={s} onClick={() => setTab(s)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${tab === s ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30" : "bg-white/[0.02] text-zinc-400 border border-white/5 hover:bg-white/5"}`}
            data-testid={`task-tab-${s}`}>
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid gap-3">
        {visible.map(t => (
          <Card key={t.id} className="p-5 card-hover" dataataid={`task-item-${t.id}`}>
            <div className="flex items-start gap-4">
              <button onClick={() => complete(t.id)} className={`shrink-0 h-6 w-6 rounded-full border-2 flex items-center justify-center transition ${t.status === "completed" ? "bg-emerald-500 border-emerald-500" : "border-zinc-600 hover:border-emerald-500"}`}
                data-testid={`task-complete-${t.id}`}>
                {t.status === "completed" && <CheckCircle2 className="h-4 w-4 text-black" />}
              </button>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className={`font-medium ${t.status === "completed" ? "line-through text-zinc-500" : ""}`}>{t.title}</div>
                    {t.description && <div className="text-sm text-zinc-500 mt-1">{t.description}</div>}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <StatusPill status={t.priority} />
                    <StatusPill status={t.status} />
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-zinc-500">
                  <div className="flex gap-4">
                    <span>Due: {t.dueDate}</span>
                    <span>Assignee: {db.users.find(u => u.id === t.assignedTo)?.name || "—"}</span>
                  </div>
                  {t.status !== "completed" && (
                    <Select value={t.status} onValueChange={(v) => setStatus(t.id, v)}>
                      <SelectTrigger className="h-7 w-32 bg-transparent border-white/10 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent className="bg-[#121214] border-white/10 text-white">
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in-progress">In progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="overdue">Overdue</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
        {visible.length === 0 && <div className="p-12 text-center text-zinc-500 text-sm rounded-xl border border-dashed border-white/10">No tasks yet.</div>}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-[#121214] border-white/10 text-white max-w-lg">
          <DialogHeader><DialogTitle className="font-display">New task</DialogTitle></DialogHeader>
          <div className="grid gap-4">
            <div><Label className="text-zinc-400 text-xs">Title</Label><Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="bg-zinc-900 border-zinc-800 mt-1" data-testid="task-form-title" /></div>
            <div><Label className="text-zinc-400 text-xs">Description</Label><Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="bg-zinc-900 border-zinc-800 mt-1" rows={3} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label className="text-zinc-400 text-xs">Due date</Label><Input type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} className="bg-zinc-900 border-zinc-800 mt-1" /></div>
              <div><Label className="text-zinc-400 text-xs">Priority</Label>
                <Select value={form.priority} onValueChange={v => setForm({ ...form, priority: v })}>
                  <SelectTrigger className="bg-zinc-900 border-zinc-800 mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-[#121214] border-white/10 text-white"><SelectItem value="high">High</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="low">Low</SelectItem></SelectContent>
                </Select>
              </div>
            </div>
            <div><Label className="text-zinc-400 text-xs">Assign to</Label>
              <Select value={form.assignedTo} onValueChange={v => setForm({ ...form, assignedTo: v })}>
                <SelectTrigger className="bg-zinc-900 border-zinc-800 mt-1"><SelectValue placeholder="Select user" /></SelectTrigger>
                <SelectContent className="bg-[#121214] border-white/10 text-white">
                  {canAssign ? db.users.map(u => <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>) : <SelectItem value={user.id}>{user.name}</SelectItem>}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={create} className="bg-emerald-500 hover:bg-emerald-600 text-black font-semibold" data-testid="task-form-save">Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
