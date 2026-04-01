import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from "recharts";

const STATUS_COLORS = {
  new: "#38bdf8",
  contacted: "#facc15",
  converted: "#4ade80",
  lost: "#f87171",
};

function groupByMonth(leads) {
  const map = {};
  leads.forEach((l) => {
    const d = new Date(l.createdAt);
    const key = d.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
    map[key] = (map[key] || 0) + 1;
  });
  return Object.entries(map)
    .slice(-6)
    .map(([name, count]) => ({ name, count }));
}

export function Analytics({ leads, stats }) {
  const pieData = ["new", "contacted", "converted", "lost"]
    .map((s) => ({ name: s, value: stats?.[s] || 0 }))
    .filter((d) => d.value > 0);

  const monthlyData = groupByMonth(leads);
  const conversionRate = stats?.total
    ? ((stats.converted / stats.total) * 100).toFixed(1)
    : "0.0";

  return (
    <div className="space-y-6">
      {/* KPI Row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Conversion Rate", value: `${conversionRate}%`, sub: "leads converted", color: "text-green-400" },
          { label: "Active Pipeline", value: (stats?.new || 0) + (stats?.contacted || 0), sub: "new + contacted", color: "text-blue-400" },
          { label: "Total Processed", value: stats?.total || 0, sub: "all time leads", color: "text-orange-400" },
        ].map(({ label, value, sub, color }) => (
          <div key={label} className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <p className="text-xs text-slate-400 mb-1">{label}</p>
            <p className={`text-3xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-slate-500 mt-1">{sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Pie */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Status Distribution</h3>
          {pieData.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-slate-500 text-sm">No data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((entry) => (
                    <Cell key={entry.name} fill={STATUS_COLORS[entry.name]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px", color: "#fff" }}
                  formatter={(v, name) => [v, name.charAt(0).toUpperCase() + name.slice(1)]}
                />
                <Legend
                  formatter={(v) => <span style={{ color: "#94a3b8", fontSize: 12 }}>{v.charAt(0).toUpperCase() + v.slice(1)}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Bar */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Leads Over Time (Last 6 Months)</h3>
          {monthlyData.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-slate-500 text-sm">No data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={monthlyData} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px", color: "#fff" }}
                />
                <Bar dataKey="count" name="Leads" fill="#ea580c" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Status breakdown table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-white mb-4">Pipeline Breakdown</h3>
        <div className="space-y-3">
          {["new", "contacted", "converted", "lost"].map((s) => {
            const count = stats?.[s] || 0;
            const pct = stats?.total ? Math.round((count / stats.total) * 100) : 0;
            return (
              <div key={s} className="flex items-center gap-4">
                <span className="text-sm text-slate-400 capitalize w-24">{s}</span>
                <div className="flex-1 bg-slate-800 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%`, backgroundColor: STATUS_COLORS[s] }}
                  />
                </div>
                <span className="text-sm font-medium text-white w-8 text-right">{count}</span>
                <span className="text-xs text-slate-500 w-10 text-right">{pct}%</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
