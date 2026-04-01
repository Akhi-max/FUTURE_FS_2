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

export function EditLeadModal({ lead, onClose, onUpdate }) {
  const [form, setForm] = useState({
    name: lead.name || "",
    email: lead.email || "",
    phone: lead.phone || "",
    source: lead.source || "",
    status: lead.status || "new",
  });
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onUpdate(lead._id, form);
      toast("Lead updated successfully!", "success");
      onClose();
    } catch (err) {
      toast(err.message || "Failed to update lead", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-slate-900 rounded-xl shadow-2xl w-full max-w-md border border-slate-800 relative">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <h2 className="text-lg font-semibold text-white">Edit Lead</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">Full Name *</label>
              <Input value={form.name} onChange={set("name")} required placeholder="John Doe" />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">Email *</label>
              <Input type="email" value={form.email} onChange={set("email")} required />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">Phone</label>
              <Input value={form.phone} onChange={set("phone")} />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">Source</label>
              <Input value={form.source} onChange={set("source")} />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">Status</label>
              <Select value={form.status} onChange={(v) => setForm((p) => ({ ...p, status: v }))} options={STATUS_OPTIONS} />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
