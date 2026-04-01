import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select } from "./ui/select";
import { toast } from "./ui/toast";

const STATUS_OPTIONS = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "converted", label: "Converted" },
  { value: "lost", label: "Lost" },
];

export function AddLeadModal({ onClose, onAdd }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", source: "", status: "new", notes: "" });
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onAdd(form);
      toast("Lead created successfully!", "success");
      onClose();
    } catch (err) {
      toast(err.message || "Failed to create lead", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-slate-900 rounded-xl shadow-2xl w-full max-w-md border border-slate-800 relative">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <h2 className="text-lg font-semibold text-white">Add New Lead</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">Full Name *</label>
              <Input name="name" value={form.name} onChange={set("name")} required placeholder="John Doe" />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">Email *</label>
              <Input name="email" type="email" value={form.email} onChange={set("email")} required placeholder="john@example.com" />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">Phone</label>
              <Input name="phone" value={form.phone} onChange={set("phone")} placeholder="+1 555 000 0000" />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">Source</label>
              <Input name="source" value={form.source} onChange={set("source")} placeholder="Website, Referral..." />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">Status</label>
              <Select value={form.status} onChange={(v) => setForm((p) => ({ ...p, status: v }))} options={STATUS_OPTIONS} />
            </div>
            <div className="col-span-2">
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">Initial Note</label>
              <textarea
                value={form.notes}
                onChange={set("notes")}
                rows={3}
                placeholder="Any notes about this lead..."
                className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-orange-500 resize-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Lead"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
