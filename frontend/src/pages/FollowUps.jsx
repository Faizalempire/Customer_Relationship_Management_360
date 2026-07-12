import React, { useState, useEffect } from "react";
import {
  getFollowUps,
  createFollowUp,
  updateFollowUp,
  deleteFollowUp,

} from "../api/followupApi";

import { useAuth } from "../lib/auth";
import { Card, SectionTitle, StatusPill } from "../components/UIKit";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../components/ui/dialog";
import { Plus, Check } from "lucide-react";
import { toast } from "sonner";

export default function FollowUps() {
  const { user } = useAuth();

  const [followups, setFollowups] = useState([]);
  const [tab, setTab] = useState("upcoming");
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    title: "",
    date: "",
    notes: "",
    leadId: "",
    customerId: "",
  });

  const fetchFollowups = async () => {
    try {
      const data = await getFollowUps();
      setFollowups(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load follow-ups");
    }
  };

  useEffect(() => {
    fetchFollowups();
  }, []);

  const now = new Date();

  const visible = followups
    .filter((f) =>
      user.role === "sales_executive"
        ? (f.assignedTo?._id || f.assignedTo) === (user._id || user.id)
        : true
    )
    .filter((f) => {
      if (tab === "today")
        return new Date(f.date).toDateString() === now.toDateString();

      if (tab === "upcoming")
        return (
          f.status === "scheduled" &&
          new Date(f.date) >= now
        );

      if (tab === "missed")
        return (
          f.status === "overdue" ||
          (f.status === "scheduled" &&
            new Date(f.date) < now)
        );

      if (tab === "completed")
        return f.status === "completed";

      return true;
    });

  const create = async () => {
    if (!form.title || !form.date) {
      return toast.error("Title & Date are required");
    }

    try {
      await createFollowUp({
        ...form,
        assignedTo: user._id || user.id,
        status: "scheduled",
      });

      toast.success("Follow-up scheduled");

      fetchFollowups();

      setOpen(false);

      setForm({
        title: "",
        date: "",
        notes: "",
        leadId: "",
        customerId: "",
      });
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message ||
          "Failed to create follow-up"
      );
    }
  };

  const setStatus = async (id, status) => {
    try {
      await updateFollowUp(id, { status });

      fetchFollowups();

      toast.success("Updated");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update");
    }
  };

  return (
    <div data-testid="followups-page">

      <SectionTitle
        eyebrow="Cadence"
        title="Follow-ups"
        right={
          <Button
            onClick={() => setOpen(true)}
            className="bg-emerald-500 hover:bg-emerald-600 text-black font-semibold"
          >
            <Plus className="h-4 w-4 mr-1" />
            New Follow-up
          </Button>
        }
      />

      <div className="flex gap-2 mb-6 flex-wrap">
        {["today", "upcoming", "missed", "completed", "all"].map(
          (s) => (
            <button
              key={s}
              onClick={() => setTab(s)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                tab === s
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                  : "bg-white/[0.02] text-zinc-400 border border-white/5 hover:bg-white/5"
              }`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          )
        )}
      </div>

      <div className="grid gap-3">

        {visible.map((f) => (

          <Card key={f._id} className="p-5">

            <div className="flex items-start justify-between">

              <div>

                <div className="flex items-center gap-3">

                  <div className="font-medium">
                    {f.title}
                  </div>

                  <StatusPill status={f.status} />

                </div>

                <div className="text-xs text-zinc-500 mt-1">
                  {new Date(f.date).toLocaleString()}
                </div>

                {f.notes && (
                  <div className="text-sm text-zinc-400 mt-2">
                    {f.notes}
                  </div>
                )}

              </div>

              <div className="flex gap-2">

                {f.status !== "completed" && (
                  <Button
                    size="sm"
                    onClick={() =>
                      setStatus(f._id, "completed")
                    }
                    className="bg-emerald-500 hover:bg-emerald-600 text-black"
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Complete
                  </Button>
                )}

                {f.status === "scheduled" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      setStatus(f._id, "overdue")
                    }
                  >
                    Mark Missed
                  </Button>
                )}

              </div>

            </div>

          </Card>

        ))}

        {visible.length === 0 && (
          <div className="p-12 text-center text-zinc-500 border border-dashed rounded-xl">
            No follow-ups found.
          </div>
        )}

      </div>

      <Dialog open={open} onOpenChange={setOpen}>

        <DialogContent className="bg-[#121214] border-white/10 text-white max-w-lg">

          <DialogHeader>
            <DialogTitle>
              Schedule Follow-up
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4">

            <div>
              <Label>Title</Label>

              <Input
                value={form.title}
                onChange={(e) =>
                  setForm({
                    ...form,
                    title: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <Label>Date & Time</Label>

              <Input
                type="datetime-local"
                value={form.date}
                onChange={(e) =>
                  setForm({
                    ...form,
                    date: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <Label>Notes</Label>

              <Textarea
                rows={3}
                value={form.notes}
                onChange={(e) =>
                  setForm({
                    ...form,
                    notes: e.target.value,
                  })
                }
              />
            </div>

          </div>

          <DialogFooter>

            <Button
              variant="ghost"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>

            <Button
              onClick={create}
              className="bg-emerald-500 hover:bg-emerald-600 text-black"
            >
              Schedule
            </Button>

          </DialogFooter>

        </DialogContent>

      </Dialog>

    </div>
  );
}