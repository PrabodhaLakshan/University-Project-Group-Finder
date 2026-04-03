"use client";

import * as React from "react";
import FilterDropdown from "./FilterDropdown";

export type GroupSearchFilters = {
  year: string;
  semester: string;
  batch: string;
  specialization: string;
};

const YEAR_OPTS = [
  { label: "Year 1", value: "1" },
  { label: "Year 2", value: "2" },
  { label: "Year 3", value: "3" },
  { label: "Year 4", value: "4" },
];

const SEM_OPTS = [
  { label: "Semester 1", value: "1" },
  { label: "Semester 2", value: "2" },
];

const BATCH_OPTS = [
  { label: "Batch 1.1", value: "1.1" },
  { label: "Batch 1.2", value: "1.2" },
  { label: "Batch 2.1", value: "2.1" },
  { label: "Batch 2.2", value: "2.2" },
  { label: "Batch 3.1", value: "3.1" },
  { label: "Batch 3.2", value: "3.2" },
  { label: "Batch 4.1", value: "4.1" },
  { label: "Batch 4.2", value: "4.2" },
  { label: "Batch 5.1", value: "5.1" },
  { label: "Batch 5.2", value: "5.2" },
  { label: "Batch 6.1", value: "6.1" },
  { label: "Batch 6.2", value: "6.2" },
  { label: "Batch 7.1", value: "7.1" },
  { label: "Batch 7.2", value: "7.2" },
  { label: "Batch 8.1", value: "8.1" },
  { label: "Batch 8.2", value: "8.2" },
  { label: "Batch 9.1", value: "9.1" },
  { label: "Batch 9.2", value: "9.2" },
  { label: "Batch 10.1", value: "10.1" },
  { label: "Batch 10.2", value: "10.2" },
];

const SPECIALIZATIONS_OPTS = [
  { label: "IT", value: "IT" },
  { label: "Software Engineering (SE)", value: "Software Engineering (SE)" },
  { label: "Data Science (DS)", value: "Data Science (DS)" },
  { label: "Cyber Security (CSNE)", value: "Cyber Security (CSNE)" },
  { label: "Interactive Media (IM)", value: "Interactive Media (IM)" },
  { label: "Information Systems (IS)", value: "Information Systems (IS)" },
  {
    label: "Computer Systems and Network Engineering (CSNE)",
    value: "Computer Systems and Network Engineering (CSNE)",
  },
  { label: "Business Management", value: "Business Management" },
  { label: "Engineering", value: "Engineering" },
  { label: "Other", value: "Other" },
];

export default function GroupSearchForm({
  value,
  onChange,
  onSearch,
  onReset,
  onClearResults,
  loading,
}: {
  value: GroupSearchFilters;
  onChange: (next: GroupSearchFilters) => void;
  onSearch: (filters: GroupSearchFilters) => void;
  onReset?: () => void;
  onClearResults?: () => void;
  loading?: boolean;
}) {
  const setField = (name: string, v: string) => {
    onChange({ ...value, [name]: v });
  };

  const canSearch = value.year && value.semester && value.batch && value.specialization && !loading;

  return (
    <section className="relative overflow-hidden rounded-2xl border border-blue-100/60 bg-white/95 p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] backdrop-blur-xl">
      <div className="pointer-events-none absolute left-0 right-0 top-0 h-32 bg-gradient-to-b from-sky-400/20 to-transparent" />

      <div className="relative z-10 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Group Finder</h2>
          <p className="mt-1 text-sm text-slate-500">Search by Year, Semester, Batch, and Specialization.</p>
        </div>

        <button
          type="button"
          className="flex-shrink-0 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 transition hover:bg-blue-100"
        >
          + Smart Match
        </button>
      </div>

      <div className="relative z-10 mt-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FilterDropdown
            label="Year"
            name="year"
            value={value.year}
            onChange={setField}
            options={YEAR_OPTS}
            placeholder="Select year"
            disabled={!!loading}
          />
          <FilterDropdown
            label="Semester"
            name="semester"
            value={value.semester}
            onChange={setField}
            options={SEM_OPTS}
            placeholder="Select semester"
            disabled={!!loading}
          />
          <FilterDropdown
            label="Batch"
            name="batch"
            value={value.batch}
            onChange={setField}
            options={BATCH_OPTS}
            placeholder="Select batch"
            disabled={!!loading}
          />
          <FilterDropdown
            label="Specialization"
            name="specialization"
            value={value.specialization}
            onChange={setField}
            options={SPECIALIZATIONS_OPTS}
            placeholder="Select specialization"
            disabled={!!loading}
          />
        </div>

        <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
          <button
            type="button"
            onClick={() => {
              onChange({ year: "", semester: "", batch: "", specialization: "" });
              onReset?.();
            }}
            disabled={!!loading}
            className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Reset
          </button>

          <button
            type="button"
            onClick={() => onClearResults?.()}
            disabled={!!loading}
            className="rounded-xl border border-blue-200 bg-blue-50 px-5 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Clear Results
          </button>

          <button
            type="button"
            onClick={() => onSearch(value)}
            disabled={!canSearch}
            className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
                Searching...
              </span>
            ) : (
              "Search"
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
