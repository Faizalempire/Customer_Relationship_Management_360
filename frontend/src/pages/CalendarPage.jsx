import React, { useState } from "react";
import { getDB } from "../lib/mockData";
import { SectionTitle, Card, StatusPill } from "../components/UIKit";

export default function CalendarPage() {
  const db = getDB();
  const [month, setMonth] = useState(new Date());

  const year = month.getFullYear();
  const m = month.getMonth();
  const firstDay = new Date(year, m, 1).getDay();
  const daysInMonth = new Date(year, m + 1, 0).getDate();

  const events = [
    ...db.followups.map(f => ({ ...f, kind: "follow-up", date: f.date })),
    ...db.tasks.filter(t => t.dueDate).map(t => ({ ...t, kind: "task", date: t.dueDate + "T09:00" })),
  ];

  const eventsOn = (day) => events.filter(e => {
    const d = new Date(e.date);
    return d.getFullYear() === year && d.getMonth() === m && d.getDate() === day;
  });

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const monthName = month.toLocaleString("default", { month: "long", year: "numeric" });

  return (
    <div data-testid="calendar-page">
      <SectionTitle eyebrow="Timeline" title="Calendar" right={
        <div className="flex gap-2 items-center">
          <button onClick={() => setMonth(new Date(year, m - 1, 1))} className="px-3 py-1.5 rounded-lg border border-white/10 text-sm hover:bg-white/5">‹</button>
          <div className="text-sm font-medium w-40 text-center">{monthName}</div>
          <button onClick={() => setMonth(new Date(year, m + 1, 1))} className="px-3 py-1.5 rounded-lg border border-white/10 text-sm hover:bg-white/5">›</button>
        </div>
      } />
      <Card className="p-6">
        <div className="grid grid-cols-7 gap-2 mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => <div key={d} className="text-xs uppercase tracking-wider text-zinc-500 text-center py-2">{d}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {cells.map((day, i) => (
            <div key={i} className={`min-h-[100px] p-2 rounded-lg border ${day ? "border-white/5 bg-white/[0.02]" : "border-transparent"}`}>
              {day && (
                <>
                  <div className="text-sm font-medium">{day}</div>
                  <div className="mt-1 space-y-1">
                    {eventsOn(day).slice(0, 3).map(e => (
                      <div key={e.id} className={`text-[10px] px-1.5 py-0.5 rounded ${e.kind === "task" ? "bg-blue-500/10 text-blue-400" : "bg-emerald-500/10 text-emerald-400"} truncate`}>{e.title}</div>
                    ))}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
