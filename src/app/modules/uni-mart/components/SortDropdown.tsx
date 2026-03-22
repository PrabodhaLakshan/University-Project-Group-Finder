"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Sparkles, TrendingDown, TrendingUp, Star } from "lucide-react";
import { Oxanium } from "next/font/google";

const oxanium = Oxanium({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

interface SortOption {
  value: string;
  label: string;
  icon: React.ReactNode;
}

const sortOptions: SortOption[] = [
  { value: "newest", label: "Newest First", icon: <Sparkles size={16} /> },
  { value: "price-low", label: "Price: Low to High", icon: <TrendingDown size={16} /> },
  { value: "price-high", label: "Price: High to Low", icon: <TrendingUp size={16} /> },
  { value: "rating", label: "Highest Rated", icon: <Star size={16} /> },
];

export default function SortDropdown({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = sortOptions.find((opt) => opt.value === value);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Dropdown Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group inline-flex min-w-[220px] items-center justify-between rounded-2xl border border-white/70 bg-white/60 px-4 py-2.5 text-gray-800 shadow-[0_8px_24px_rgba(15,23,42,0.08)] backdrop-blur-md transition-all hover:-translate-y-0.5 hover:bg-white/75 hover:shadow-[0_12px_28px_rgba(37,99,235,0.16)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
      >
        <span className="flex items-center gap-3">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-blue-100/80 text-blue-700">
            {selectedOption?.icon}
          </span>
          <span className="flex flex-col items-start leading-tight">
            <span className="text-[11px] font-medium uppercase tracking-wide text-gray-500">Sort by</span>
            <span className={`${oxanium.className} text-base font-semibold text-gray-900`}>
              {selectedOption?.label}
            </span>
          </span>
        </span>
        <ChevronDown
          size={18}
          className={`transition-transform duration-300 text-blue-600 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full z-[120] mt-2 w-64 rounded-2xl border border-white/80 bg-white/85 p-2 shadow-[0_20px_45px_rgba(15,23,42,0.16)] backdrop-blur-md">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-all ${
                value === option.value
                  ? "border-blue-300/60 bg-blue-500/15 text-blue-900"
                  : "border-transparent text-gray-700 hover:border-blue-200/60 hover:bg-blue-50/70 hover:text-blue-900"
              }`}
            >
              <span className={`grid h-8 w-8 flex-shrink-0 place-items-center rounded-lg ${value === option.value ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-500"}`}>
                {option.icon}
              </span>
              <span className={`${oxanium.className} text-[15px] font-semibold`}>
                {option.label}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
