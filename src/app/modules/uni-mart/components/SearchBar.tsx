"use client";

import { useState } from "react";
import { Search } from "lucide-react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export default function SearchBar({
  onSearch,
  placeholder = "Search products...",
}: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 rounded-xl border border-slate-300/80 bg-white/90 px-4 py-3 shadow-sm transition focus-within:border-blue-500/70 focus-within:ring-2 focus-within:ring-blue-500/20">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={20}
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-transparent pl-10 pr-2 text-slate-800 placeholder:text-slate-400 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
        >
          <Search size={18} />
          Search
        </button>
      </div>
    </form>
  );
}
