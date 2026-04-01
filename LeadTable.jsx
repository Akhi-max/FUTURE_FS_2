import { useState } from "react";
import { Search, Filter, Pencil, ChevronDown } from "lucide-react";
import { Input } from "./ui/input";
import { Select } from "./ui/select";
import { StatusBadge } from "./ui/badge";
import { Button } from "./ui/button";
import { LeadDetailPanel } from "./LeadDetailPanel";
import { EditLeadModal } from "./EditLeadModal";
import { formatDate } from "../utils/formatTime";

const STATUS_FILTER_OPTIONS = [
  { value: "all", label: "All Status" },
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "converted", label: "Converted" },
  { value: "lost", label: "Lost" },
];

export function LeadTable({ leads, onUpdate, onDelete, onAddNote, onDeleteNote, filters, setFilters }) {
  const [selectedLead, setSelectedLead] = useState(null);
  const [editLead, setEditLead] = useState(null);

  // Update selected lead when leads array changes (after note add, etc.)
  const currentSelected = selectedLead
    ? leads.find((l) => l._id === selectedLead._id) || selectedLead
    : null;

  return (
    <>
      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <Input
            placeholder="Search leads..."
            value={filters.search}
            onChange={(e) => setFilters((p) => ({ ...p, search: e.target.value }))}
            className="pl-9"
          />
        </div>

        <div className="w-40">
          <Select
            value={filters.status}
            onChange={(v) => setFilters((p) => ({ ...p, status: v }))}
            options={STATUS_FILTER_OPTIONS}
          />
        </div>

        <Input
          type="date"
          value={filters.startDate}
          onChange={(e) => setFilters((p) => ({ ...p, startDate: e.target.value }))}
          className="w-38"
          title="From date"
        />
        <Input
          type="date"
          value={filters.endDate}
          onChange={(e) => setFilters((p) => ({ ...p, endDate: e.target.value }))}
          className="w-38"
          title="To date"
        />

        {(filters.search || filters.status !== "all" || filters.startDate || filters.endDate) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setFilters({ search: "", status: "all", startDate: "", endDate: "" })}
            className="text-slate-400 text-xs"
          >
            Clear
          </Button>
        )}
      </div>

      {/* Table */}
      <div className="rounded-xl border border-slate-800 overflow-hidden bg-slate-900/50">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900">
                {["Name", "Email", "Phone", "Source", "Status", "Created", ""].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {leads.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-500">
                    No leads found
                  </td>
                </tr>
              )}
              {leads.map((lead) => (
                <tr
                  key={lead._id}
                  className="border-b border-slate-800/50 hover:bg-slate-800/40 cursor-pointer transition-colors"
                  onClick={() => setSelectedLead(lead)}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-orange-600/20 flex items-center justify-center text-orange-400 text-xs font-bold shrink-0">
                        {lead.name?.[0]?.toUpperCase()}
                      </div>
                      <span className="font-medium text-white truncate max-w-[120px]">{lead.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-300 truncate max-w-[160px]">{lead.email}</td>
                  <td className="px-4 py-3 text-slate-400">{lead.phone || "—"}</td>
                  <td className="px-4 py-3 text-slate-400">{lead.source || "—"}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={lead.status} />
                  </td>
                  <td className="px-4 py-3 text-slate-500 text-xs">{formatDate(lead.createdAt)}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={(e) => { e.stopPropagation(); setEditLead(lead); }}
                      className="text-slate-500 hover:text-orange-400 transition-colors p-1"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {leads.length > 0 && (
          <div className="px-4 py-3 border-t border-slate-800 text-xs text-slate-500">
            Showing {leads.length} lead{leads.length !== 1 ? "s" : ""}
          </div>
        )}
      </div>

      {/* Detail Panel */}
      {currentSelected && (
        <LeadDetailPanel
          lead={currentSelected}
          onClose={() => setSelectedLead(null)}
          onUpdate={onUpdate}
          onAddNote={onAddNote}
          onDeleteNote={onDeleteNote}
          onDelete={onDelete}
        />
      )}

      {/* Edit Modal */}
      {editLead && (
        <EditLeadModal
          lead={editLead}
          onClose={() => setEditLead(null)}
          onUpdate={onUpdate}
        />
      )}
    </>
  );
}
