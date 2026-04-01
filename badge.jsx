import * as React from "react";
import { cn } from "../../utils/cn";

const STATUS_STYLES = {
  new: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  contacted: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  converted: "bg-green-500/15 text-green-400 border-green-500/30",
  lost: "bg-red-500/15 text-red-400 border-red-500/30",
};

export function StatusBadge({ status }) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize",
        STATUS_STYLES[status] || "bg-slate-500/15 text-slate-400 border-slate-500/30"
      )}
    >
      {status}
    </span>
  );
}

export function Badge({ children, className, ...props }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors",
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
