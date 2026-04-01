import { useState, useCallback, useEffect } from "react";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";
import { cn } from "../../utils/cn";

const ICONS = {
  success: <CheckCircle className="h-4 w-4 text-green-400" />,
  error: <AlertCircle className="h-4 w-4 text-red-400" />,
  info: <Info className="h-4 w-4 text-blue-400" />,
};

let toastFn = null;
export function toast(message, type = "info") {
  if (toastFn) toastFn(message, type);
}

export function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    toastFn = (message, type) => {
      const id = Date.now();
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
    };
    return () => { toastFn = null; };
  }, []);

  return (
    <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-lg shadow-xl border text-sm text-white min-w-[260px] max-w-sm animate-in slide-in-from-right",
            t.type === "success" && "bg-slate-800 border-green-500/40",
            t.type === "error" && "bg-slate-800 border-red-500/40",
            t.type === "info" && "bg-slate-800 border-blue-500/40"
          )}
        >
          {ICONS[t.type]}
          <span className="flex-1">{t.message}</span>
          <button
            onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}
            className="text-slate-400 hover:text-white"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ))}
    </div>
  );
}
