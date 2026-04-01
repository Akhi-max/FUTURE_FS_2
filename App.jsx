import { useState } from "react";
import { useAuth } from "./hooks/useAuth";
import { useLeads } from "./hooks/useLeads";
import { Layout } from "./components/Layout";
import { LoginPage } from "./components/LoginPage";
import { StatsCards } from "./components/StatsCards";
import { LeadTable } from "./components/LeadTable";
import { Analytics } from "./components/Analytics";
import { Settings } from "./components/Settings";
import { AddLeadModal } from "./components/AddLeadModal";
import { Button } from "./components/ui/button";
import { ToastContainer, toast } from "./components/ui/toast";
import { Plus, RefreshCw } from "lucide-react";

export default function App() {
  const { user, isLoading: authLoading, login, logout } = useAuth();
  const [currentView, setCurrentView] = useState("dashboard");
  const [showAddModal, setShowAddModal] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    startDate: "",
    endDate: "",
  });

  const {
    leads,
    stats,
    isLoading: leadsLoading,
    error,
    refetch,
    addLead,
    updateLead,
    deleteLead,
    addNote,
    deleteNote,
  } = useLeads(filters);

  // ── Auth loading splash ──────────────────────────────────────────────────────
  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-orange-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  // ── Login page ───────────────────────────────────────────────────────────────
  if (!user) {
    return (
      <>
        <LoginPage onLogin={login} />
        <ToastContainer />
      </>
    );
  }

  // ── Handle add lead ──────────────────────────────────────────────────────────
  const handleAddLead = async (data) => {
    await addLead(data);
  };

  // ── Handle errors ────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950">
        <div className="text-center space-y-4">
          <p className="text-red-400 text-sm">{error}</p>
          <Button onClick={refetch} size="sm" variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" /> Retry
          </Button>
        </div>
      </div>
    );
  }

  // ── Main app ─────────────────────────────────────────────────────────────────
  return (
    <>
      <Layout
        currentView={currentView}
        setCurrentView={setCurrentView}
        user={user}
        onLogout={logout}
      >
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white capitalize">{currentView}</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {currentView === "dashboard" && `${stats.total} total leads`}
              {currentView === "analytics" && "Visual overview of your pipeline"}
              {currentView === "settings" && "Account & application settings"}
            </p>
          </div>

          {currentView === "dashboard" && (
            <div className="flex items-center gap-2">
              <Button size="sm" variant="ghost" onClick={refetch} disabled={leadsLoading}>
                <RefreshCw className={`h-4 w-4 ${leadsLoading ? "animate-spin" : ""}`} />
              </Button>
              <Button size="sm" onClick={() => setShowAddModal(true)}>
                <Plus className="h-4 w-4 mr-1.5" /> New Lead
              </Button>
            </div>
          )}
        </div>

        {/* Content */}
        {currentView === "dashboard" && (
          <>
            <StatsCards stats={stats} />
            {leadsLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-6 h-6 border-2 border-orange-600 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <LeadTable
                leads={leads}
                onUpdate={updateLead}
                onDelete={deleteLead}
                onAddNote={addNote}
                onDeleteNote={deleteNote}
                filters={filters}
                setFilters={setFilters}
              />
            )}
          </>
        )}

        {currentView === "analytics" && (
          <Analytics leads={leads} stats={stats} />
        )}

        {currentView === "settings" && (
          <Settings user={user} />
        )}
      </Layout>

      {/* Add Lead Modal */}
      {showAddModal && (
        <AddLeadModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddLead}
        />
      )}

      {/* Toast notifications */}
      <ToastContainer />
    </>
  );
}
