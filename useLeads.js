import { useState, useEffect, useCallback } from "react";
import { api } from "../utils/api";

export function useLeads(filters = {}) {
  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState({ total: 0, new: 0, contacted: 0, converted: 0, lost: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const buildQuery = (f) => {
    const params = new URLSearchParams();
    if (f.status && f.status !== "all") params.set("status", f.status);
    if (f.search) params.set("search", f.search);
    if (f.startDate) params.set("startDate", f.startDate);
    if (f.endDate) params.set("endDate", f.endDate);
    const q = params.toString();
    return q ? `?${q}` : "";
  };

  const fetchLeads = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [leadsData, statsData] = await Promise.all([
        api.get(`/leads${buildQuery(filters)}`),
        api.get("/leads/stats"),
      ]);
      setLeads(leadsData.leads || []);
      setStats(statsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const addLead = useCallback(async (leadData) => {
    const newLead = await api.post("/leads", leadData);
    setLeads((prev) => [newLead, ...prev]);
    setStats((prev) => ({ ...prev, total: prev.total + 1, new: prev.new + 1 }));
    return newLead;
  }, []);

  const updateLead = useCallback(async (id, updates) => {
    const updated = await api.put(`/leads/${id}`, updates);
    setLeads((prev) => prev.map((l) => (l._id === id ? updated : l)));
    // refresh stats since status may have changed
    api.get("/leads/stats").then(setStats).catch(() => {});
    return updated;
  }, []);

  const deleteLead = useCallback(async (id) => {
    await api.delete(`/leads/${id}`);
    setLeads((prev) => prev.filter((l) => l._id !== id));
    api.get("/leads/stats").then(setStats).catch(() => {});
  }, []);

  const addNote = useCallback(async (id, text) => {
    const updated = await api.post(`/leads/${id}/notes`, { text });
    setLeads((prev) => prev.map((l) => (l._id === id ? updated : l)));
    return updated;
  }, []);

  const deleteNote = useCallback(async (leadId, noteId) => {
    const updated = await api.delete(`/leads/${leadId}/notes/${noteId}`);
    setLeads((prev) => prev.map((l) => (l._id === leadId ? updated : l)));
  }, []);

  return {
    leads,
    stats,
    isLoading,
    error,
    refetch: fetchLeads,
    addLead,
    updateLead,
    deleteLead,
    addNote,
    deleteNote,
  };
}
