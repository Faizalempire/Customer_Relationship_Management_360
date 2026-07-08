import React, { useState } from "react";
import { getDB, saveDB, generateId } from "../lib/mockData";
import { Card, SectionTitle, StatusPill } from "../components/UIKit";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Plus, Trash2, Edit, Power, KeyRound } from "lucide-react";
import { toast } from "sonner";

export default function UserManagement() {
  const [db, setDB] = useState(getDB());
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", role: "executive", password: "" });
  const refresh = () => setDB({ ...getDB() });

  const openNew = () => { setEditing(null); setForm({ name: "", email: "", phone: "", role: "executive", password: "" }); setOpen(true); };
  const openEdit = (u) => { setEditing(u); setForm({ ...u, password: "" }); setOpen(true); };
  const save = () => {
    if (!form.name || !form.email) return toast.error("Name & email required");
    const cur = getDB();
    if (editing) {
      cur.users = cur.users.map(x => x.id === editing.id ? { ...x, ...form, password: form.password || x.password } : x);
      toast.success("User updated");
    } else {
      if (!form.password) return toast.error("Password required for new user");
      cur.users.push({ id: generateId("u"), ...form, avatar: form.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase(), status: "active", joined: new Date().toISOString().slice(0, 10) });
      cur.activity.unshift({ id: generateId("a"), userId: "u1", action: "created", entity: "user", entityId: "u", description: `Created user '${form.name}'`, timestamp: new Date().toISOString() });
      toast.success("User created");
    }
    saveDB(cur); refresh(); setOpen(false);
  };
  const toggleActive = (u) => {
    const cur = getDB();
    cur.users = cur.users.map(x => x.id === u.id ? { ...x, status: x.status === "active" ? "inactive" : "active" } : x);
    saveDB(cur); refresh();
    toast.success(`User ${u.status === "active" ? "deactivated" : "activated"}`);
  };
  const resetPwd = (u) => {
    const newPwd = "reset_" + Math.random().toString(36).slice(2, 8);
    const cur = getDB();
    cur.users = cur.users.map(x => x.id === u.id ? { ...x, password: newPwd } : x);
    saveDB(cur); refresh();
    toast.success(`New password: ${newPwd}`);
  };
  const remove = (id) => {
    if (!window.confirm("Delete user?")) return;
    const cur = getDB();
    cur.users = cur.users.filter(u => u.id !== id);
    saveDB(cur); refresh();
    toast.success("User deleted");
  };

  return (
    <div data-testid="users-page">
      <SectionTitle eyebrow="Access control" title="User Management" right={
        <Button onClick={openNew} className="bg-emerald-500 hover:bg-emerald-600 text-black font-semibold" data-testid="new-user-btn">
          <Plus className="h-4 w-4 mr-1" /> New User
        </Button>
      } />
      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-white/5 hover:bg-transparent">
              <TableHead className="text-zinc-500 uppercase text-[10px] tracking-wider">User</TableHead>
              <TableHead className="text-zinc-500 uppercase text-[10px] tracking-wider">Role</TableHead>
              <TableHead className="text-zinc-500 uppercase text-[10px] tracking-wider">Status</TableHead>
              <TableHead className="text-zinc-500 uppercase text-[10px] tracking-wider">Joined</TableHead>
              <TableHead className="text-right text-zinc-500 uppercase text-[10px] tracking-wider">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {db.users.map(u => (
              <TableRow key={u.id} className="border-white/5 hover:bg-white/[0.02]" data-testid={`user-row-${u.id}`}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-xs font-semibold">{u.avatar}</div>
                    <div><div className="font-medium">{u.name}</div><div className="text-xs text-zinc-500">{u.email}</div></div>
                  </div>
                </TableCell>
                <TableCell className="capitalize text-sm text-zinc-300">{u.role}</TableCell>
                <TableCell><StatusPill status={u.status} /></TableCell>
                <TableCell className="text-sm text-zinc-400">{u.joined}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button size="icon" variant="ghost" onClick={() => toggleActive(u)} className="h-8 w-8 hover:bg-white/5" title={u.status === "active" ? "Deactivate" : "Activate"} data-testid={`toggle-user-${u.id}`}><Power className="h-4 w-4" /></Button>
                    <Button size="icon" variant="ghost" onClick={() => resetPwd(u)} className="h-8 w-8 hover:bg-white/5" title="Reset password"><KeyRound className="h-4 w-4" /></Button>
                    <Button size="icon" variant="ghost" onClick={() => openEdit(u)} className="h-8 w-8 hover:bg-white/5" data-testid={`edit-user-${u.id}`}><Edit className="h-4 w-4" /></Button>
                    <Button size="icon" variant="ghost" onClick={() => remove(u.id)} className="h-8 w-8 hover:bg-red-500/10 hover:text-red-400" data-testid={`delete-user-${u.id}`}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-[#121214] border-white/10 text-white max-w-lg">
          <DialogHeader><DialogTitle className="font-display">{editing ? "Edit user" : "New user"}</DialogTitle></DialogHeader>
          <div className="grid gap-4">
            <div><Label className="text-zinc-400 text-xs">Full name</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="bg-zinc-900 border-zinc-800 mt-1" data-testid="user-form-name" /></div>
            <div><Label className="text-zinc-400 text-xs">Email</Label><Input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="bg-zinc-900 border-zinc-800 mt-1" data-testid="user-form-email" /></div>
            <div><Label className="text-zinc-400 text-xs">Phone</Label><Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="bg-zinc-900 border-zinc-800 mt-1" /></div>
            <div><Label className="text-zinc-400 text-xs">Role</Label>
              <Select value={form.role} onValueChange={v => setForm({ ...form, role: v })}>
                <SelectTrigger className="bg-zinc-900 border-zinc-800 mt-1"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-[#121214] border-white/10 text-white"><SelectItem value="admin">Admin</SelectItem><SelectItem value="manager">Manager</SelectItem><SelectItem value="executive">Executive</SelectItem></SelectContent>
              </Select>
            </div>
            <div><Label className="text-zinc-400 text-xs">{editing ? "New password (optional)" : "Password"}</Label><Input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="bg-zinc-900 border-zinc-800 mt-1" /></div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={save} className="bg-emerald-500 hover:bg-emerald-600 text-black font-semibold" data-testid="user-form-save">{editing ? "Save" : "Create"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
