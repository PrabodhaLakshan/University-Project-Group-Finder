"use client";

import { useState } from "react";

const CATEGORIES = [
  "Electronics",
  "Books",
  "Clothing",
  "Furniture",
  "Sports",
  "Notes & Study Materials",
  "Laptops & Accessories",
  "Phones & Tablets",
  "Other",
];

interface CategoryFilterProps {
  onFilterChange: (categories: string[]) => void;
}

export default function CategoryFilter({ onFilterChange }: CategoryFilterProps) {
  const [selected, setSelected] = useState<string[]>([]);

  const handleToggle = (category: string) => {
    const newSelected = selected.includes(category)
      ? selected.filter((c) => c !== category)
      : [...selected, category];

    setSelected(newSelected);
    onFilterChange(newSelected);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Categories</h3>

      <div className="space-y-3">
        {CATEGORIES.map((category) => (
          <label key={category} className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={selected.includes(category)}
              onChange={() => handleToggle(category)}
              className="w-4 h-4 text-blue-500 rounded focus:ring-2 focus:ring-blue-500"
            />
            <span className="ml-3 text-gray-700">{category}</span>
          </label>
        ))}
      </div>

      {selected.length > 0 && (
        <button
          onClick={() => {
            setSelected([]);
            onFilterChange([]);
          }}
          className="mt-4 w-full text-blue-500 hover:text-blue-700 font-medium text-sm"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
}
