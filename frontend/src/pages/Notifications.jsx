import React, { useState, useEffect } from "react";
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "../api/notificationApi";
import { useAuth } from "../lib/auth";
import { SectionTitle, Card } from "../components/UIKit";
import { Bell, CheckCheck, Target, AlertTriangle, User } from "lucide-react";
import { Button } from "../components/ui/button";

const iconFor = (t) => {
  if (t === "lead") return Target;
  if (t === "task") return CheckCheck;
  if (t === "warning") return AlertTriangle;
  if (t === "user") return User;
  return Bell;
};

export default function Notifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    try {
      const data = await getNotifications();
      setNotifications(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const mine = notifications
    .filter((n) =>
      user.role === "sales_executive"
        ? (n.userId?._id || n.userId) === (user._id || user.id)
        : true
    )
    .sort(
      (a, b) =>
        new Date(b.createdAt || b.created) -
        new Date(a.createdAt || a.created)
    );

  const markAll = async () => {
    try {
      await markAllNotificationsRead();
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };
  const markRead = async (id) => {
    try {
      await markNotificationRead(id);
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div data-testid="notifications-page">
      <SectionTitle eyebrow="Inbox" title="Notifications" right={
        <Button onClick={markAll} variant="outline" className="border-white/10 bg-white/5 hover:bg-white/10 text-white" data-testid="mark-all-read-btn">Mark all read</Button>
      } />
      <div className="space-y-2">
        {mine.length === 0 && <Card className="p-12 text-center text-zinc-500 text-sm">You're all caught up.</Card>}
        {mine.map(n => {
          const Icon = iconFor(n.type);
          return (
            <Card key={n.id} className={`p-5 flex items-start gap-4 card-hover cursor-pointer ${!n.read ? "border-emerald-500/30" : ""}`} onClick={() => markRead(n.id)} data-testid={`notif-${n.id}`}>
              <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${!n.read ? "bg-emerald-500/10 border border-emerald-500/20" : "bg-white/5 border border-white/5"}`}>
                <Icon className={`h-5 w-5 ${!n.read ? "text-emerald-400" : "text-zinc-500"}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between gap-3">
                  <div className={`font-medium ${!n.read ? "text-white" : "text-zinc-400"}`}>{n.title}</div>
                  {!n.read && <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0 mt-2" />}
                </div>
                <div className="text-sm text-zinc-500 mt-1">{n.message}</div>
                <div className="text-xs text-zinc-600 mt-2">{new Date(n.createdAt || n.created).toLocaleString()}</div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
