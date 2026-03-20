"use client";

import { useState } from "react";

const PRICE_RANGES = [
  { label: "Under Rs. 500", min: 0, max: 500 },
  { label: "Rs. 500 - 2,000", min: 500, max: 2000 },
  { label: "Rs. 2,000 - 10,000", min: 2000, max: 10000 },
  { label: "Rs. 10,000 - 50,000", min: 10000, max: 50000 },
  { label: "Over Rs. 50,000", min: 50000, max: 999999 },
];

interface PriceFilterProps {
  onFilterChange: (minPrice?: number, maxPrice?: number) => void;
}

export default function PriceFilter({ onFilterChange }: PriceFilterProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [customMin, setCustomMin] = useState("");
  const [customMax, setCustomMax] = useState("");

  const handlePresetSelect = (label: string, min: number, max: number) => {
    setSelected(label);
    setCustomMin("");
    setCustomMax("");
    onFilterChange(min, max);
  };

  const handleCustomFilter = () => {
    const min = customMin ? parseInt(customMin) : undefined;
    const max = customMax ? parseInt(customMax) : undefined;
    setSelected(null);
    onFilterChange(min, max);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Price Range</h3>

      <div className="space-y-3 mb-6">
        {PRICE_RANGES.map((range) => (
          <label key={range.label} className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="price"
              checked={selected === range.label}
              onChange={() => handlePresetSelect(range.label, range.min, range.max)}
              className="w-4 h-4 text-blue-500 focus:ring-2 focus:ring-blue-500"
            />
            <span className="ml-3 text-gray-700">{range.label}</span>
          </label>
        ))}
      </div>

      {/* Custom Range */}
      <div className="border-t pt-4">
        <p className="text-sm font-medium text-gray-700 mb-3">Custom Range</p>
        <div className="flex gap-2 mb-3">
          <input
            type="number"
            value={customMin}
            onChange={(e) => setCustomMin(e.target.value)}
            placeholder="Min"
            className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            value={customMax}
            onChange={(e) => setCustomMax(e.target.value)}
            placeholder="Max"
            className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={handleCustomFilter}
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors font-medium"
        >
          Apply Custom Range
        </button>
      </div>
    </div>
  );
}
