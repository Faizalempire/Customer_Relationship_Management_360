import React, { useState, useEffect } from "react";
import {
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getSalesExecutives,
} from "../api/customerApi";
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
  const [db, setDB] = useState({
    customers: [],
    users: [],
  });
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    customerName: "",
    email: "",
    phone: "",
    company: "",
    status: "Lead",
    assignedTo: "",
    notes: "",
  });
  const [deleteId, setDeleteId] = useState(null);

  const fetchCustomers = async () => {
    try {
      const customers = await getCustomers();
      const users = await getSalesExecutives();

      setDB({
        customers,
        users,
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to load customers");
    }
  };
  useEffect(() => {
    fetchCustomers();
  }, []);

  const visible = db.customers
    .filter(c =>
      user.role === "sales_executive"
        ? (c.assignedTo?._id || c.assignedTo) === user.id
        : true
    )
    .filter(c => statusFilter === "all" || c.status === statusFilter)
    .filter(
      c =>
        !q ||
        c.customerName.toLowerCase().includes(q.toLowerCase()) ||
        c.email.toLowerCase().includes(q.toLowerCase())
    );

  const openNew = () => {
    setEditing(null);

    setForm({
      customerName: "",
      email: "",
      phone: "",
      company: "",
      status: "Lead",
      assignedTo:
        user.role === "sales_executive" ? user.id : "",
      notes: "",
    });

    setOpen(true);
  };
  const openEdit = (customer) => {
    setEditing(customer);

    setForm({
      customerName: customer.customerName || "",
      email: customer.email || "",
      phone: customer.phone || "",
      company: customer.company || "",
      status: customer.status || "Lead",
      assignedTo: customer.assignedTo?._id || customer.assignedTo || "",
      notes: customer.notes || "",
    });

    setOpen(true);
  };
  const save = async () => {
    try {
      if (editing) {
        await updateCustomer(editing._id, form);
        toast.success("Customer updated successfully");
      } else {
        await createCustomer(form);
        toast.success("Customer created successfully");
      }

      fetchCustomers();      // Reload customers from MongoDB
      setOpen(false);        // Close dialog

      // Reset form
      setForm({
        customerName: "",
        email: "",
        phone: "",
        company: "",
        status: "Lead",
        assignedTo: "",
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
      await deleteCustomer(deleteId);

      toast.success("Customer deleted successfully");

      fetchCustomers();      // Reload customers
      setDeleteId(null);     // Close dialog
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to delete customer");
    }
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
            <SelectItem value="Lead">Lead</SelectItem>
            <SelectItem value="Qualified">Qualified</SelectItem>
            <SelectItem value="Proposal">Proposal</SelectItem>
            <SelectItem value="Negotiation">Negotiation</SelectItem>
            <SelectItem value="Won">Won</SelectItem>
            <SelectItem value="Lost">Lost</SelectItem>
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
              <TableHead className="text-zinc-500 uppercase text-[10px] tracking-wider">Owner</TableHead>
              <TableHead className="text-right text-zinc-500 uppercase text-[10px] tracking-wider">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visible.map(c => (
              <TableRow key={c._id} className="border-white/5 hover:bg-white/[0.02]" data-testid={`customer-row-${c._id}`}>
                <TableCell className="font-medium">{c.customerName}</TableCell>
                <TableCell>
                  <div>{c.email}</div>
                  <div className="text-xs text-zinc-500">{c.phone}</div>
                </TableCell>
                <TableCell><StatusPill status={c.status} /></TableCell>
                <TableCell className="text-sm text-zinc-400">
                  {c.assignedTo?.fullName || "—"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button size="icon" variant="ghost" onClick={() => openEdit(c)} className="h-8 w-8 hover:bg-white/5" data-testid={`edit-customer-${c._id}`}><Edit className="h-4 w-4" /></Button>
                    {["admin", "sales_manager"].includes(user.role) && <Button size="icon" variant="ghost" onClick={() => setDeleteId(c._id)} className="h-8 w-8 hover:bg-red-500/10 hover:text-red-400" data-testid={`delete-customer-${c._id}`}><Trash2 className="h-4 w-4" /></Button>}
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
            <div className="col-span-2"><Label className="text-zinc-400 text-xs">Company</Label><Input value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} className="bg-zinc-900 border-zinc-800 mt-1" data-testid="customer-form-name" /></div>
            <div><Label className="text-zinc-400 text-xs">Customer Name</Label>

              <Input
                value={form.customerName}
                onChange={e =>
                  setForm({
                    ...form,
                    customerName: e.target.value,
                  })
                }
                className="bg-zinc-900 border-zinc-800 mt-1"
              /></div>
            <div><Label className="text-zinc-400 text-xs">Email</Label><Input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="bg-zinc-900 border-zinc-800 mt-1" /></div>
            <div><Label className="text-zinc-400 text-xs">Phone</Label><Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="bg-zinc-900 border-zinc-800 mt-1" /></div>
            <div><Label className="text-zinc-400 text-xs">Status</Label>
              <Select value={form.status} onValueChange={v => setForm({ ...form, status: v })}>
                <SelectTrigger className="bg-zinc-900 border-zinc-800 mt-1"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-[#121214] border-white/10 text-white"><SelectItem value="Lead">Lead</SelectItem>
                  <SelectItem value="Qualified">Qualified</SelectItem>
                  <SelectItem value="Proposal">Proposal</SelectItem>
                  <SelectItem value="Negotiation">Negotiation</SelectItem>
                  <SelectItem value="Won">Won</SelectItem>
                  <SelectItem value="Lost">Lost</SelectItem></SelectContent>
              </Select>
            </div>
            {["admin", "sales_manager"].includes(user.role) && (
              <div><Label className="text-zinc-400 text-xs">Assigned to</Label>
                <Select value={form.assignedTo} onValueChange={v => setForm({ ...form, assignedTo: v })}>
                  <SelectTrigger className="bg-zinc-900 border-zinc-800 mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-[#121214] border-white/10 text-white">
                    {db.users.map((u) => (
                      <SelectItem
                        key={u._id}
                        value={u._id}
                      >
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
