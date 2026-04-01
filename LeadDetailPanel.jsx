import { useState } from "react";
import { X, Trash2, Plus, MessageSquare } from "lucide-react";
import { Button } from "./ui/button";
import { StatusBadge } from "./ui/badge";
import { Select } from "./ui/select";
import { toast } from "./ui/toast";
import { formatRelativeTime, formatDate } from "../utils/formatTime";

const STATUS_OPTIONS = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "converted", label: "Converted" },
  { value: "lost", label: "Lost" },
];

export function LeadDetailPanel({ lead, onClose, onUpdate, onAddNote, onDeleteNote, onDelete }) {
  const [noteText, setNoteText] = useState("");
  const [addingNote, setAddingNote] = useState(false);
  const [statusChanging, setStatusChanging] = useState(false);

  const handleStatusChange = async (newStatus) => {
    if (newStatus === lead.status) return;
    setStatusChanging(true);
    try {
      await onUpdate(lead._id, { status: newStatus });
      toast(`Status updated to ${newStatus}`, "success");
    } catch {
      toast("Failed to update status", "error");
    } finally {
      setStatusChanging(false);
    }
  };

  const handleAddNote = async () => {
    if (!noteText.trim()) return;
    setAddingNote(true);
    try {
      await onAddNote(lead._id, noteText.trim());
      setNoteText("");
      toast("Note added", "success");
    } catch {
      toast("Failed to add note", "error");
    } finally {
      setAddingNote(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this lead permanently?")) return;
    try {
      await onDelete(lead._id);
      toast("Lead deleted", "success");
      onClose();
    } catch {
      toast("Failed to delete lead", "error");
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex">
      {/* Backdrop */}
      <div className="flex-1 bg-black/50" onClick={onClose} />

      {/* Panel */}
      <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 shrink-0">
          <div>
            <h3 className="font-semibold text-white text-base">{lead.name}</h3>
            <p className="text-xs text-slate-400 mt-0.5">{lead.email}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Phone", value: lead.phone || "—" },
              { label: "Source", value: lead.source || "—" },
              { label: "Created", value: formatDate(lead.createdAt) },
              { label: "Updated", value: formatRelativeTime(lead.updatedAt) },
            ].map(({ label, value }) => (
              <div key={label} className="bg-slate-800/60 rounded-lg p-3">
                <p className="text-xs text-slate-500 mb-1">{label}</p>
                <p className="text-sm text-white font-medium truncate">{value}</p>
              </div>
            ))}
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs text-slate-400 mb-2 font-medium">Status</label>
            <Select
              value={lead.status}
              onChange={handleStatusChange}
              options={STATUS_OPTIONS}
              disabled={statusChanging}
            />
          </div>

          {/* Notes */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare className="h-4 w-4 text-slate-400" />
              <h4 className="text-sm font-medium text-white">Notes ({lead.notes?.length || 0})</h4>
            </div>

            {/* Add note */}
            <div className="flex gap-2 mb-3">
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Add a note..."
                rows={2}
                className="flex-1 rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-orange-500 resize-none"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.ctrlKey) handleAddNote();
                }}
              />
              <Button size="icon" onClick={handleAddNote} disabled={addingNote || !noteText.trim()}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Notes list */}
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {lead.notes?.length === 0 && (
                <p className="text-xs text-slate-500 text-center py-4">No notes yet</p>
              )}
              {[...(lead.notes || [])].reverse().map((note) => (
                <div key={note._id} className="bg-slate-800/60 rounded-lg px-3 py-2.5 group">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm text-slate-300 flex-1">{note.text}</p>
                    <button
                      onClick={() => onDeleteNote(lead._id, note._id)}
                      className="text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all shrink-0 mt-0.5"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">{formatRelativeTime(note.createdAt)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-slate-800 shrink-0">
          <Button variant="destructive" size="sm" onClick={handleDelete} className="w-full">
            <Trash2 className="h-4 w-4 mr-2" /> Delete Lead
          </Button>
        </div>
      </div>
    </div>
  );
}
