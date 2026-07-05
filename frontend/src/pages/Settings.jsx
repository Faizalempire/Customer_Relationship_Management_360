import React, { useState } from "react";
import { SectionTitle, Card } from "../components/UIKit";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Switch } from "../components/ui/switch";
import { Textarea } from "../components/ui/textarea";
import { toast } from "sonner";
import { resetDB } from "../lib/mockData";

const ACCENTS = [
  { hex: "#10B981", name: "Emerald", hue: "158 84% 39%" },
  { hex: "#3B82F6", name: "Blue", hue: "217 91% 60%" },
  { hex: "#F59E0B", name: "Amber", hue: "43 96% 58%" },
  { hex: "#A855F7", name: "Violet", hue: "280 84% 65%" },
  { hex: "#EF4444", name: "Red", hue: "0 72% 51%" },
];

const applyAccent = (hue) => {
  const root = document.documentElement;
  root.style.setProperty("--primary", hue);
  root.style.setProperty("--accent", hue);
  root.style.setProperty("--ring", hue);
  root.style.setProperty("--chart-1", hue);
};

export default function Settings() {
  const [company, setCompany] = useState({ name: "CRM360 Solutions", email: "hello@crm360.com", address: "Bengaluru, India" });
  const [notif, setNotif] = useState({ email: true, push: true, sms: false });
  const [accent, setAccent] = useState(() => localStorage.getItem("crm360_accent") || "#10B981");

  React.useEffect(() => {
    const found = ACCENTS.find(a => a.hex === accent);
    if (found) applyAccent(found.hue);
  }, [accent]);

  const selectAccent = (a) => {
    setAccent(a.hex);
    localStorage.setItem("crm360_accent", a.hex);
    applyAccent(a.hue);
    toast.success(`Accent set to ${a.name}`);
  };

  return (
    <div data-testid="settings-page">
      <SectionTitle eyebrow="Configuration" title="Settings" />
      <div className="grid lg:grid-cols-2 gap-4">
        <Card className="p-6">
          <h3 className="font-display font-semibold mb-4">Company</h3>
          <div className="grid gap-4">
            <div><Label className="text-zinc-400 text-xs">Company name</Label><Input value={company.name} onChange={e => setCompany({ ...company, name: e.target.value })} className="bg-zinc-900 border-zinc-800 mt-1" /></div>
            <div><Label className="text-zinc-400 text-xs">Contact email</Label><Input value={company.email} onChange={e => setCompany({ ...company, email: e.target.value })} className="bg-zinc-900 border-zinc-800 mt-1" /></div>
            <div><Label className="text-zinc-400 text-xs">Address</Label><Textarea value={company.address} onChange={e => setCompany({ ...company, address: e.target.value })} className="bg-zinc-900 border-zinc-800 mt-1" rows={2} /></div>
          </div>
          <Button onClick={() => toast.success("Company info saved")} className="mt-4 bg-emerald-500 hover:bg-emerald-600 text-black font-semibold">Save</Button>
        </Card>

        <Card className="p-6">
          <h3 className="font-display font-semibold mb-4">Notifications</h3>
          <div className="space-y-4">
            {[
              { k: "email", label: "Email notifications" },
              { k: "push", label: "Push notifications" },
              { k: "sms", label: "SMS alerts" },
            ].map(({ k, label }) => (
              <div key={k} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/5">
                <span className="text-sm">{label}</span>
                <Switch checked={notif[k]} onCheckedChange={(v) => setNotif({ ...notif, [k]: v })} data-testid={`notif-switch-${k}`} />
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-display font-semibold mb-4">Branding</h3>
          <div className="grid gap-4">
            <div>
              <Label className="text-zinc-400 text-xs">Accent color</Label>
              <div className="mt-2 flex gap-3 flex-wrap">
                {ACCENTS.map(a => (
                  <button
                    key={a.hex}
                    type="button"
                    onClick={() => selectAccent(a)}
                    className="group flex flex-col items-center gap-1"
                    data-testid={`accent-${a.name.toLowerCase()}`}
                    title={a.name}
                  >
                    <span
                      className="h-10 w-10 rounded-lg border-2 transition-transform group-hover:scale-110"
                      style={{
                        backgroundColor: a.hex,
                        borderColor: accent === a.hex ? "#fff" : "transparent",
                        boxShadow: accent === a.hex ? `0 0 20px ${a.hex}66` : "none",
                      }}
                    />
                    <span className={`text-[10px] ${accent === a.hex ? "text-white" : "text-zinc-500"}`}>{a.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-display font-semibold mb-4">Data</h3>
          <p className="text-sm text-zinc-400 mb-4">Reset demo data to seed values. This will clear any changes made in this session.</p>
          <Button variant="outline" onClick={() => { resetDB(); window.location.reload(); }} className="border-red-500/30 text-red-400 hover:bg-red-500/10" data-testid="reset-data-btn">Reset demo data</Button>
        </Card>
      </div>
    </div>
  );
}
