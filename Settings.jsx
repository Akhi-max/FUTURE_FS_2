import { User, Shield, Bell, Info } from "lucide-react";

export function Settings({ user }) {
  return (
    <div className="max-w-xl space-y-5">
      {/* Profile */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex items-center gap-3 mb-4">
          <User className="h-4 w-4 text-orange-400" />
          <h3 className="text-sm font-semibold text-white">Profile</h3>
        </div>
        <div className="space-y-3">
          {[
            { label: "Name", value: user?.name },
            { label: "Email", value: user?.email },
            { label: "Role", value: user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1) },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between py-2 border-b border-slate-800 last:border-0">
              <span className="text-sm text-slate-400">{label}</span>
              <span className="text-sm text-white font-medium">{value || "—"}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Security */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="h-4 w-4 text-green-400" />
          <h3 className="text-sm font-semibold text-white">Security</h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-slate-800">
            <span className="text-sm text-slate-400">Authentication</span>
            <span className="text-xs bg-green-500/15 text-green-400 border border-green-500/30 px-2 py-0.5 rounded-full">JWT Active</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-slate-400">Session Expiry</span>
            <span className="text-sm text-white font-medium">24 hours</span>
          </div>
        </div>
      </div>

      {/* About */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex items-center gap-3 mb-4">
          <Info className="h-4 w-4 text-blue-400" />
          <h3 className="text-sm font-semibold text-white">About</h3>
        </div>
        <div className="space-y-2 text-sm text-slate-400">
          <div className="flex justify-between py-1.5 border-b border-slate-800">
            <span>Application</span><span className="text-white">LeadFlow – Mini CRM</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-slate-800">
            <span>Version</span><span className="text-white">1.0.0</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-slate-800">
            <span>Backend</span><span className="text-white">Node.js + Express</span>
          </div>
          <div className="flex justify-between py-1.5">
            <span>Database</span><span className="text-white">MongoDB</span>
          </div>
        </div>
      </div>
    </div>
  );
}
