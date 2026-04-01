import { useState } from "react";
import { AlertCircle, Zap } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export function LoginPage({ onLogin }) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const form = e.target;
    try {
      await onLogin(form.email.value, form.password.value);
    } catch (err) {
      setError(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-600/5 rounded-full blur-3xl" />
      </div>

      <div className="relative bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-sm p-8">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center mb-3 shadow-lg shadow-orange-600/25">
            <Zap className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">LeadFlow</h1>
          <p className="text-slate-400 text-sm mt-1">Sign in to your CRM</p>
        </div>

        {error && (
          <div className="mb-5 p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Email</label>
            <Input
              name="email"
              type="email"
              placeholder="admin@puneethreos.com"
              required
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
            <Input
              name="password"
              type="password"
              placeholder="••••••••"
              required
            />
          </div>

          <Button type="submit" className="w-full mt-2" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <p className="text-xs text-center text-slate-600 mt-6">
          Demo: <span className="text-slate-400">admin@puneethreos.com</span> / <span className="text-slate-400">admin123</span>
        </p>
      </div>
    </div>
  );
}
