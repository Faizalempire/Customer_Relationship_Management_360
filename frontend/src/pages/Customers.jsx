import React, { useState } from "react";
import { getDB, saveDB, generateId } from "../lib/mockData";
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
import { Plus, Search, Trash2, Edit } from "lucide-react";
import { toast } from "sonner";

export default function Customers() {
  const { user } = useAuth();
  const [db, setDB] = useState(getDB());
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", contact: "", email: "", phone: "", value: 0, status: "active", assignedTo: "", tags: [], notes: "" });
  const [deleteId, setDeleteId] = useState(null);
  const refresh = () => setDB({ ...getDB() });

  const visible = db.customers
    .filter(c => user.role === "executive" ? c.assignedTo === user.id : true)
    .filter(c => statusFilter === "all" || c.status === statusFilter)
    .filter(c => !q || c.name.toLowerCase().includes(q.toLowerCase()) || c.contact.toLowerCase().includes(q.toLowerCase()));

  const openNew = () => { setEditing(null); setForm({ name: "", contact: "", email: "", phone: "", value: 0, status: "active", assignedTo: user.role === "executive" ? user.id : "", tags: [], notes: "" }); setOpen(true); };
  const openEdit = (c) => { setEditing(c); setForm({ ...c }); setOpen(true); };
  const save = () => {
    if (!form.name) return toast.error("Name is required");
    const cur = getDB();
    if (editing) {
      cur.customers = cur.customers.map(x => x.id === editing.id ? { ...x, ...form, value: Number(form.value) } : x);
      toast.success("Customer updated");
    } else {
      cur.customers.unshift({ id: generateId("c"), ...form, value: Number(form.value), created: new Date().toISOString().slice(0, 10) });
      toast.success("Customer added");
    }
    saveDB(cur); refresh(); setOpen(false);
  };
  const confirmDelete = () => {
    const id = deleteId;
    if (!id) return;
    const cur = getDB();
    cur.customers = cur.customers.filter(c => c.id !== id);
    saveDB(cur); refresh();
    setDeleteId(null);
    toast.success("Customer deleted");
  };

  return (
    <div data-testid="customers-page">
      <SectionTitle eyebrow="Accounts" title="Customers" right={
        <Button onClick={openNew} className="bg-emerald-500 hover:bg-emerald-600 text-black font-semibold" data-testid="new-customer-btn">
          <Plus className="h-4 w-4 mr-1" /> Add Customer
        </Button>
      } />
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[260px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <Input placeholder="Search customers..." value={q} onChange={e => setQ(e.target.value)} className="pl-9 bg-white/[0.02] border-white/5 focus-visible:border-emerald-500" data-testid="customers-search-input" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40 bg-white/[0.02] border-white/5"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent className="bg-[#121214] border-white/10 text-white">
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="churn-risk">Churn risk</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-white/5 hover:bg-transparent">
              <TableHead className="text-zinc-500 uppercase text-[10px] tracking-wider">Company</TableHead>
              <TableHead className="text-zinc-500 uppercase text-[10px] tracking-wider">Contact</TableHead>
              <TableHead className="text-zinc-500 uppercase text-[10px] tracking-wider">Status</TableHead>
              <TableHead className="text-zinc-500 uppercase text-[10px] tracking-wider">Value</TableHead>
              <TableHead className="text-zinc-500 uppercase text-[10px] tracking-wider">Owner</TableHead>
              <TableHead className="text-zinc-500 uppercase text-[10px] tracking-wider">Tags</TableHead>
              <TableHead className="text-right text-zinc-500 uppercase text-[10px] tracking-wider">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visible.map(c => (
              <TableRow key={c.id} className="border-white/5 hover:bg-white/[0.02]" data-testid={`customer-row-${c.id}`}>
                <TableCell className="font-medium">{c.name}</TableCell>
                <TableCell><div>{c.contact}</div><div className="text-xs text-zinc-500">{c.email}</div></TableCell>
                <TableCell><StatusPill status={c.status} /></TableCell>
                <TableCell className="font-semibold text-emerald-400">{currency(c.value)}</TableCell>
                <TableCell className="text-sm text-zinc-400">{db.users.find(u => u.id === c.assignedTo)?.name || "—"}</TableCell>
                <TableCell className="text-xs text-zinc-400">{(c.tags || []).join(", ")}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button size="icon" variant="ghost" onClick={() => openEdit(c)} className="h-8 w-8 hover:bg-white/5" data-testid={`edit-customer-${c.id}`}><Edit className="h-4 w-4" /></Button>
                    {["admin", "manager"].includes(user.role) && <Button size="icon" variant="ghost" onClick={() => setDeleteId(c.id)} className="h-8 w-8 hover:bg-red-500/10 hover:text-red-400" data-testid={`delete-customer-${c.id}`}><Trash2 className="h-4 w-4" /></Button>}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {visible.length === 0 && <div className="p-12 text-center text-zinc-500 text-sm">No customers found.</div>}
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-[#121214] border-white/10 text-white max-w-lg">
          <DialogHeader><DialogTitle className="font-display">{editing ? "Edit customer" : "Add customer"}</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2"><Label className="text-zinc-400 text-xs">Company</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="bg-zinc-900 border-zinc-800 mt-1" data-testid="customer-form-name" /></div>
            <div><Label className="text-zinc-400 text-xs">Contact</Label><Input value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })} className="bg-zinc-900 border-zinc-800 mt-1" /></div>
            <div><Label className="text-zinc-400 text-xs">Email</Label><Input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="bg-zinc-900 border-zinc-800 mt-1" /></div>
            <div><Label className="text-zinc-400 text-xs">Phone</Label><Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="bg-zinc-900 border-zinc-800 mt-1" /></div>
            <div><Label className="text-zinc-400 text-xs">Value (₹)</Label><Input type="number" value={form.value} onChange={e => setForm({ ...form, value: e.target.value })} className="bg-zinc-900 border-zinc-800 mt-1" /></div>
            <div><Label className="text-zinc-400 text-xs">Status</Label>
              <Select value={form.status} onValueChange={v => setForm({ ...form, status: v })}>
                <SelectTrigger className="bg-zinc-900 border-zinc-800 mt-1"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-[#121214] border-white/10 text-white"><SelectItem value="active">Active</SelectItem><SelectItem value="churn-risk">Churn risk</SelectItem><SelectItem value="inactive">Inactive</SelectItem></SelectContent>
              </Select>
            </div>
            {["admin", "manager"].includes(user.role) && (
              <div><Label className="text-zinc-400 text-xs">Assigned to</Label>
                <Select value={form.assignedTo} onValueChange={v => setForm({ ...form, assignedTo: v })}>
                  <SelectTrigger className="bg-zinc-900 border-zinc-800 mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-[#121214] border-white/10 text-white">{db.users.filter(u => u.role === "executive").map(u => <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            )}
            <div className="col-span-2"><Label className="text-zinc-400 text-xs">Notes</Label><Textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} className="bg-zinc-900 border-zinc-800 mt-1" rows={3} /></div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={save} className="bg-emerald-500 hover:bg-emerald-600 text-black font-semibold" data-testid="customer-form-save">{editing ? "Save" : "Add"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(v) => !v && setDeleteId(null)}>
        <AlertDialogContent className="bg-[#121214] border-white/10 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display">Delete this customer?</AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400">This action cannot be undone. The customer record will be permanently removed.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-white/10 text-white hover:bg-white/5">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-500 hover:bg-red-600 text-white" data-testid="confirm-delete-customer">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
