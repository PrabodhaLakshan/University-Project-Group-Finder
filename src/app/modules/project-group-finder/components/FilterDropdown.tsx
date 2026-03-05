// components/groupFinder/FilterDropdown.tsx
"use client";

import * as React from "react";

type Option = { label: string; value: string };

type Props = {
  label: string;
  name: string;
  value: string;
  onChange: (name: string, value: string) => void;
  options: Option[];
  placeholder?: string;
  disabled?: boolean;
};

export default function FilterDropdown({
  label,
  name,
  value,
  onChange,
  options,
  placeholder = "Select",
  disabled = false,
}: Props) {
  const id = React.useId();
  const hasValue = value !== "";

  return (
    <div className="space-y-1.5">
      {/* Label */}
      <label
        htmlFor={id}
        className="block text-sm font-semibold text-slate-700"
      >
        {label}
      </label>

      {/* Select wrapper */}
      <div className="relative">
        <select
          id={id}
          name={name}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(name, e.target.value)}
          className={[
            "w-full appearance-none rounded-xl border px-4 py-3 pr-10",
            "text-sm outline-none transition-all duration-150",
            "disabled:cursor-not-allowed disabled:opacity-50",
            hasValue
              ? "border-blue-300 bg-blue-50 text-blue-900 font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-100",
          ].join(" ")}
        >
          <option value="" className="text-slate-400">
            {placeholder}
          </option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="text-slate-900 bg-white">
              {opt.label}
            </option>
          ))}
        </select>

        {/* Chevron icon */}
        <svg
          className={[
            "pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors",
            hasValue ? "text-blue-500" : "text-slate-400",
          ].join(" ")}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </div>
  );
}