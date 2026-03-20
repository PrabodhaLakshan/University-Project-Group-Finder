// components/groupFinder/GroupSearchForm.tsx
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
  { label: "Computer Systems & Network Engineering (CSNE)", value: "Computer Systems & Network Engineering (CSNE)" },
  { label: "Business Management", value: "Business Management" },
  { label: "Engineering", value: "Engineering" },
  { label: "Other", value: "Other" },
];

export default function GroupSearchForm({
  value,
  onChange,
  onSearch,
  onReset,
  loading,
}: {
  value: GroupSearchFilters;
  onChange: (next: GroupSearchFilters) => void;
  onSearch: (filters: GroupSearchFilters) => void;
  onReset?: () => void;
  loading?: boolean;
}) {
  const setField = (name: string, v: string) => {
    onChange({ ...value, [name]: v });
  };

  const canSearch =
    value.year && value.semester && value.batch && value.specialization && !loading;

  return (
    <section className="rounded-2xl border border-blue-100 bg-white shadow-sm overflow-hidden">
      {/* Header strip with subtle blue gradient */}
      <div className="border-b border-blue-100 bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white">Group Finder</h2>
            <p className="mt-0.5 text-sm text-blue-100">
              Select your details and search matching students.
            </p>
          </div>

          {/* Smart Match badge */}
          <span className="flex-shrink-0 rounded-full border border-white/30 bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
            ✦ Smart Match
          </span>
        </div>
      </div>

      {/* Dropdowns */}
      <div className="p-6">
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

        {/* Action row */}
        <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
          <button
            type="button"
            onClick={() => {
              onChange({ year: "", semester: "", batch: "", specialization: "" });
              onReset?.();
            }}
            disabled={!!loading}
            className="rounded-xl border border-slate-200 bg-slate-50 px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Reset
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