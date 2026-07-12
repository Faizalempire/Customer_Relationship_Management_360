import React, { useState, useEffect } from "react";
import {
  getLeads,
  createLead,
  updateLead,
  deleteLead,
} from "../api/leadApi";
import { useAuth } from "../lib/auth";
import { Card, SectionTitle, StatusPill, currency } from "../components/UIKit";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Plus, Search, Trash2, Edit, Repeat2 } from "lucide-react";
import { toast } from "sonner";
import { createCustomer } from "../api/customerApi";
import { getSalesExecutives } from "../api/userApi";


export default function Leads() {
  const { user } = useAuth();
  const [db, setDB] = useState({
    leads: [],
    users: [],
    stages: ["New", "Qualified", "Proposal", "Won", "Lost"],
  });
  const [q, setQ] = useState("");
  const [stageFilter, setStageFilter] = useState("all");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", contact: "", email: "", phone: "", source: "Website", value: 0, stage: "New", assignedTo: "", priority: "medium", notes: "" });
  const [deleteId, setDeleteId] = useState(null);

  const fetchLeads = async () => {
    try {
      const leads = await getLeads();

      setDB((prev) => ({
        ...prev,
        leads,
      }));
    } catch (err) {
      console.error(err);
      toast.error("Failed to load leads");
    }
  };

  useEffect(() => {
    fetchLeads();
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const users = await getSalesExecutives();

      setDB((prev) => ({
        ...prev,
        users,
      }));
    } catch (err) {
      console.error(err);
      toast.error("Failed to load sales executives");
    }
  };

  const visible = db.leads
    .filter(
      l =>
        user.role === "sales_executive"
          ? (l.assignedTo?._id || l.assignedTo) === user.id
          : true
    )
    .filter(l => stageFilter === "all" || l.stage === stageFilter)
    .filter(l => !q || l.name.toLowerCase().includes(q.toLowerCase()) || l.contact.toLowerCase().includes(q.toLowerCase()));

  const canWrite = ["admin", "sales_manager"].includes(user.role) || user.role === "sales_executive";

  const openNew = () => {
    setEditing(null);
    setForm({ name: "", contact: "", email: "", phone: "", source: "Website", value: 0, stage: "New", assignedTo: user.role === "sales_executive" ? user.id : "", priority: "medium", notes: "" });
    setOpen(true);
  };
  const openEdit = (lead) => {
    setEditing(lead);

    setForm({
      name: lead.name || "",
      contact: lead.contact || "",
      email: lead.email || "",
      phone: lead.phone || "",
      source: lead.source || "Website",
      value: lead.value || 0,
      stage: lead.stage || "New",
      assignedTo: lead.assignedTo?._id || lead.assignedTo || "",
      priority: lead.priority || "medium",
      notes: lead.notes || "",
    });

    setOpen(true);
  };
  const save = async () => {
    if (!form.name || !form.contact) {
      return toast.error("Name & Contact are required");
    }

    try {
      if (editing) {
        // Update existing lead
        await updateLead(editing._id, form);
        toast.success("Lead updated successfully");
      } else {
        // Create new lead
        await createLead(form);
        toast.success("Lead created successfully");
      }

      fetchLeads();     // Reload data
      setOpen(false);   // Close dialog

      // Reset form
      setForm({
        name: "",
        contact: "",
        email: "",
        phone: "",
        source: "Website",
        value: 0,
        stage: "New",
        assignedTo: "",
        priority: "medium",
        notes: "",
      });

      setEditing(null);

    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Operation failed");
    }
  };
  const confirmDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteLead(deleteId);

      toast.success("Lead deleted successfully");

      fetchLeads();      // Refresh the table
      setDeleteId(null); // Close the delete dialog
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to delete lead");
    }
  };
  const convert = async (lead) => {
    try {
      // Create customer from lead
      await createCustomer({
        customerName: lead.contact,
        company: lead.name,
        email: lead.email,
        phone: lead.phone,
        status: "Won",
        assignedTo: lead.assignedTo?._id || lead.assignedTo,
      });

      // Update lead stage to Won
      await updateLead(lead._id, {
        ...lead,
        stage: "Won",
      });

      toast.success("Lead converted to customer");

      await fetchLeads();

    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message || "Failed to convert lead"
      );
    }
  };

  return (
    <div data-testid="leads-page">
      <SectionTitle eyebrow="Pipeline" title="Leads" right={
        canWrite && (
          <Button onClick={openNew} className="bg-emerald-500 hover:bg-emerald-600 text-black font-semibold" data-testid="new-lead-btn">
            <Plus className="h-4 w-4 mr-1" /> New Lead
          </Button>
        )
      } />
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[260px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <Input placeholder="Search leads..." value={q} onChange={(e) => setQ(e.target.value)} className="pl-9 bg-white/[0.02] border-white/5 focus-visible:border-emerald-500" data-testid="leads-search-input" />
        </div>
        <Select value={stageFilter} onValueChange={setStageFilter}>
          <SelectTrigger className="w-40 bg-white/[0.02] border-white/5"><SelectValue placeholder="Stage" /></SelectTrigger>
          <SelectContent className="bg-[#121214] border-white/10 text-white">
            <SelectItem value="all">All stages</SelectItem>
            {db.stages.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-white/5 hover:bg-transparent">
              <TableHead className="text-zinc-500 uppercase text-[10px] tracking-wider">Company</TableHead>
              <TableHead className="text-zinc-500 uppercase text-[10px] tracking-wider">Contact</TableHead>
              <TableHead className="text-zinc-500 uppercase text-[10px] tracking-wider">Stage</TableHead>
              <TableHead className="text-zinc-500 uppercase text-[10px] tracking-wider">Value</TableHead>
              <TableHead className="text-zinc-500 uppercase text-[10px] tracking-wider">Assigned</TableHead>
              <TableHead className="text-zinc-500 uppercase text-[10px] tracking-wider">Priority</TableHead>
              <TableHead className="text-right text-zinc-500 uppercase text-[10px] tracking-wider">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visible.map(l => (
              <TableRow key={l._id} className="border-white/5 hover:bg-white/[0.02]" data-testid={`lead-row-${l._id}`}>
                <TableCell className="font-medium">{l.name}</TableCell>
                <TableCell><div>{l.contact}</div><div className="text-xs text-zinc-500">{l.email}</div></TableCell>
                <TableCell><StatusPill status={l.stage} /></TableCell>
                <TableCell className="font-semibold text-emerald-400">{currency(l.value)}</TableCell>
                <TableCell className="text-sm text-zinc-400">{l.assignedTo?.fullName || "—"}</TableCell>
                <TableCell><StatusPill status={l.priority} /></TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    {l.stage !== "Won" && l.stage !== "Lost" && (
                      <Button size="icon" variant="ghost" onClick={() => convert(l)} className="h-8 w-8 hover:bg-emerald-500/10 hover:text-emerald-400" title="Convert to customer" data-testid={`convert-lead-${l._id}`}><Repeat2 className="h-4 w-4" /></Button>
                    )}
                    <Button size="icon" variant="ghost" onClick={() => openEdit(l)} className="h-8 w-8 hover:bg-white/5" data-testid={`edit-lead-${l._id}`}><Edit className="h-4 w-4" /></Button>
                    {["admin", "sales_manager"].includes(user.role) && <Button size="icon" variant="ghost" onClick={() => setDeleteId(l._id)} className="h-8 w-8 hover:bg-red-500/10 hover:text-red-400" data-testid={`delete-lead-${l._id}`}><Trash2 className="h-4 w-4" /></Button>}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {visible.length === 0 && <div className="p-12 text-center text-zinc-500 text-sm">No leads found.</div>}
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-[#121214] border-white/10 text-white max-w-lg">
          <DialogHeader><DialogTitle className="font-display">{editing ? "Edit lead" : "New lead"}</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2"><Label className="text-zinc-400 text-xs">Company</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="bg-zinc-900 border-zinc-800 mt-1" data-testid="lead-form-name" /></div>
            <div><Label className="text-zinc-400 text-xs">Contact person</Label><Input value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })} className="bg-zinc-900 border-zinc-800 mt-1" data-testid="lead-form-contact" /></div>
            <div><Label className="text-zinc-400 text-xs">Email</Label><Input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="bg-zinc-900 border-zinc-800 mt-1" /></div>
            <div><Label className="text-zinc-400 text-xs">Phone</Label><Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="bg-zinc-900 border-zinc-800 mt-1" /></div>
            <div><Label className="text-zinc-400 text-xs">Value (₹)</Label><Input type="number" value={form.value} onChange={e => setForm({ ...form, value: e.target.value })} className="bg-zinc-900 border-zinc-800 mt-1" /></div>
            <div><Label className="text-zinc-400 text-xs">Stage</Label>
              <Select value={form.stage} onValueChange={v => setForm({ ...form, stage: v })}>
                <SelectTrigger className="bg-zinc-900 border-zinc-800 mt-1"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-[#121214] border-white/10 text-white">{db.stages.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label className="text-zinc-400 text-xs">Priority</Label>
              <Select value={form.priority} onValueChange={v => setForm({ ...form, priority: v })}>
                <SelectTrigger className="bg-zinc-900 border-zinc-800 mt-1"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-[#121214] border-white/10 text-white"><SelectItem value="high">High</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="low">Low</SelectItem></SelectContent>
              </Select>
            </div>
            <div><Label className="text-zinc-400 text-xs">Source</Label>
              <Select value={form.source} onValueChange={v => setForm({ ...form, source: v })}>
                <SelectTrigger className="bg-zinc-900 border-zinc-800 mt-1"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-[#121214] border-white/10 text-white">{["Website", "Referral", "Cold Email", "LinkedIn", "Event"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            {["admin", "sales_manager"].includes(user.role) && (
              <div className="col-span-2"><Label className="text-zinc-400 text-xs">Assign to</Label>
                <Select value={form.assignedTo} onValueChange={v => setForm({ ...form, assignedTo: v })}>
                  <SelectTrigger className="bg-zinc-900 border-zinc-800 mt-1"><SelectValue placeholder="Select user" /></SelectTrigger>
                  <SelectContent className="bg-[#121214] border-white/10 text-white">
                    {db.users
                      .filter((u) => u.role === "sales_executive")
                      .map((u) => (
                        <SelectItem key={u._id} value={u._id}>
                          {u.fullName}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="col-span-2"><Label className="text-zinc-400 text-xs">Notes</Label><Textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} className="bg-zinc-900 border-zinc-800 mt-1" rows={3} /></div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={save} className="bg-emerald-500 hover:bg-emerald-600 text-black font-semibold" data-testid="lead-form-save">{editing ? "Save" : "Create"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(v) => !v && setDeleteId(null)}>
        <AlertDialogContent className="bg-[#121214] border-white/10 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display">Delete this lead?</AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400">This action cannot be undone. The lead will be permanently removed.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-white/10 text-white hover:bg-white/5">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-500 hover:bg-red-600 text-white" data-testid="confirm-delete-lead">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
