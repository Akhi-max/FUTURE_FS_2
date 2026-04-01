import { LayoutDashboard, BarChart2, Settings, LogOut, Zap } from "lucide-react";
import { cn } from "../utils/cn";

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "analytics", label: "Analytics", icon: BarChart2 },
  { id: "settings", label: "Settings", icon: Settings },
];

export function Layout({ children, currentView, setCurrentView, user, onLogout }) {
  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-60 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0">
        {/* Logo */}
        <div className="flex items-center gap-2 px-5 py-5 border-b border-slate-800">
          <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <span className="text-white font-bold text-lg tracking-tight">LeadFlow</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setCurrentView(id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                currentView === id
                  ? "bg-orange-600/15 text-orange-400 border border-orange-600/25"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </nav>

        {/* User Footer */}
        <div className="border-t border-slate-800 p-3">
          <div className="flex items-center gap-3 px-2 py-2 mb-1">
            <div className="w-8 h-8 rounded-full bg-orange-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
              {user?.name?.[0]?.toUpperCase() || "A"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white font-medium truncate">{user?.name || "Admin"}</p>
              <p className="text-xs text-slate-500 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-6">{children}</main>
    </div>
  );
}
