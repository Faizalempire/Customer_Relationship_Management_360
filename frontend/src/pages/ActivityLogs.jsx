import React from "react";
import { getDB } from "../lib/mockData";
import { SectionTitle, Card } from "../components/UIKit";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";

export default function ActivityLogs() {
  const db = getDB();
  const sorted = [...db.activity].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  return (
    <div data-testid="activity-page">
      <SectionTitle eyebrow="Audit trail" title="Activity Logs" />
      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-white/5 hover:bg-transparent">
              <TableHead className="text-zinc-500 uppercase text-[10px] tracking-wider">User</TableHead>
              <TableHead className="text-zinc-500 uppercase text-[10px] tracking-wider">Action</TableHead>
              <TableHead className="text-zinc-500 uppercase text-[10px] tracking-wider">Entity</TableHead>
              <TableHead className="text-zinc-500 uppercase text-[10px] tracking-wider">Description</TableHead>
              <TableHead className="text-zinc-500 uppercase text-[10px] tracking-wider">Timestamp</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.map(a => (
              <TableRow key={a.id} className="border-white/5 hover:bg-white/[0.02]">
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 text-[10px] font-semibold">{db.users.find(u => u.id === a.userId)?.avatar || "??"}</div>
                    <span className="text-sm">{db.users.find(u => u.id === a.userId)?.name || "System"}</span>
                  </div>
                </TableCell>
                <TableCell><span className="text-xs uppercase tracking-wider text-emerald-400">{a.action}</span></TableCell>
                <TableCell className="text-sm text-zinc-400 capitalize">{a.entity}</TableCell>
                <TableCell className="text-sm">{a.description}</TableCell>
                <TableCell className="text-xs text-zinc-500">{new Date(a.timestamp).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
