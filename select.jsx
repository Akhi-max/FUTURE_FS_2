import * as React from "react";
import { cn } from "../../utils/cn";

export function Select({ value, onChange, options, className, placeholder }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        "h-9 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-1 text-sm text-white shadow-sm focus:outline-none focus:ring-1 focus:ring-orange-500 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
