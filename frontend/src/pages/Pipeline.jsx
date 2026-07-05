import React, { useState } from "react";
import { getDB, saveDB, generateId, STAGES } from "../lib/mockData";
import { useAuth } from "../lib/auth";
import { Card, SectionTitle, StatusPill, currency } from "../components/UIKit";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";

export default function Pipeline() {
  const { user } = useAuth();
  const [db, setDB] = useState(getDB());
  const [execFilter, setExecFilter] = useState("all");
  const [drag, setDrag] = useState(null);

  const refresh = () => setDB({ ...getDB() });

  const filtered = db.leads.filter(l => execFilter === "all" || l.assignedTo === execFilter);

  const onDrop = (stage) => {
    if (!drag) return;
    const cur = getDB();
    cur.leads = cur.leads.map(l => l.id === drag ? { ...l, stage } : l);
    cur.activity.unshift({ id: generateId("a"), userId: user.id, action: "moved", entity: "lead", entityId: drag, description: `Moved lead to ${stage}`, timestamp: new Date().toISOString() });
    saveDB(cur); refresh();
    toast.success(`Moved to ${stage}`);
    setDrag(null);
  };

  const stageValue = (s) => filtered.filter(l => l.stage === s).reduce((sum, l) => sum + l.value, 0);

  return (
    <div data-testid="pipeline-page">
      <SectionTitle eyebrow="Kanban" title="Sales Pipeline" right={
        <Select value={execFilter} onValueChange={setExecFilter}>
          <SelectTrigger className="w-52 bg-white/[0.02] border-white/5"><SelectValue placeholder="Filter" /></SelectTrigger>
          <SelectContent className="bg-[#121214] border-white/10 text-white">
            <SelectItem value="all">All executives</SelectItem>
            {db.users.filter(u => u.role === "executive").map(u => <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>)}
          </SelectContent>
        </Select>
      } />
      <div className="grid grid-flow-col auto-cols-[280px] gap-4 overflow-x-auto pb-4">
        {STAGES.map(stage => (
          <div key={stage} className="flex flex-col" data-testid={`kanban-col-${stage.toLowerCase()}`}
            onDragOver={(e) => e.preventDefault()} onDrop={() => onDrop(stage)}>
            <div className="flex items-center justify-between px-3 py-3 rounded-t-xl bg-white/[0.03] border-x border-t border-white/5">
              <div className="flex items-center gap-2">
                <StatusPill status={stage} />
                <span className="text-xs text-zinc-500">{filtered.filter(l => l.stage === stage).length}</span>
              </div>
              <span className="text-xs text-emerald-400 font-semibold">{currency(stageValue(stage))}</span>
            </div>
            <div className="flex-1 min-h-[500px] p-2 space-y-2 rounded-b-xl bg-zinc-950/40 border border-white/5">
              {filtered.filter(l => l.stage === stage).map(l => (
                <motion.div key={l.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                  draggable onDragStart={() => setDrag(l.id)}
                  className="p-3 rounded-lg border border-white/5 bg-[#121214] hover:border-emerald-500/40 hover:shadow-lg cursor-grab active:cursor-grabbing transition-all"
                  data-testid={`kanban-card-${l.id}`}>
                  <div className="text-sm font-medium">{l.name}</div>
                  <div className="text-xs text-zinc-500 mt-0.5">{l.contact}</div>
                  <div className="flex items-center justify-between mt-3">
                    <StatusPill status={l.priority} />
                    <span className="text-xs font-semibold text-emerald-400">{currency(l.value)}</span>
                  </div>
                  <div className="text-[10px] text-zinc-600 mt-2">{db.users.find(u => u.id === l.assignedTo)?.name || "Unassigned"}</div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 text-xs text-zinc-500">Tip: Drag any card between columns to update its stage.</div>
    </div>
  );
}
