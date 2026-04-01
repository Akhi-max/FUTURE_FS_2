import { Users, UserPlus, PhoneCall, TrendingUp, UserX } from "lucide-react";

const CARDS = [
  { key: "total", label: "Total Leads", icon: Users, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
  { key: "new", label: "New", icon: UserPlus, color: "text-sky-400", bg: "bg-sky-500/10 border-sky-500/20" },
  { key: "contacted", label: "Contacted", icon: PhoneCall, color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20" },
  { key: "converted", label: "Converted", icon: TrendingUp, color: "text-green-400", bg: "bg-green-500/10 border-green-500/20" },
  { key: "lost", label: "Lost", icon: UserX, color: "text-red-400", bg: "bg-red-500/10 border-red-500/20" },
];

export function StatsCards({ stats }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
      {CARDS.map(({ key, label, icon: Icon, color, bg }) => (
        <div
          key={key}
          className={`rounded-xl border p-4 flex flex-col gap-2 ${bg}`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">{label}</span>
            <Icon className={`h-4 w-4 ${color}`} />
          </div>
          <p className={`text-2xl font-bold ${color}`}>{stats?.[key] ?? 0}</p>
        </div>
      ))}
    </div>
  );
}
