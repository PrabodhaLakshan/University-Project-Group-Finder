"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SearchBar from "../components/SearchBar";
import ProductGrid from "../components/ProductGrid";
import CategoryFilter from "../components/CategoryFilter";
import PriceFilter from "../components/PriceFilter";
import { getAllProducts } from "../services/product.service";
import { Product } from "../types";
import { ArrowLeft } from "lucide-react";

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<{
    min?: number;
    max?: number;
  }>({});
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        const data = await getAllProducts({
          query: searchQuery,
          category: selectedCategories[0],
         minPrice: priceRange.min,
         maxPrice: priceRange.max,
       });
        setProducts(data.items);
      } catch (error) {
        console.error("Failed to load products:", error);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(loadProducts, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategories, priceRange]);

  const handleSort = (sortValue: string) => {
    setSortBy(sortValue);
    let sorted = [...products];

    switch (sortValue) {
      case "price-low":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      default:
        sorted.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }

    setProducts(sorted);
  };

  return (
    <div className="space-y-8">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium"
      >
        <ArrowLeft size={20} />
        Back
      </button>
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Browse Products</h1>
        <p className="text-gray-600">
          Explore all available items in our marketplace
        </p>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <SearchBar onSearch={setSearchQuery} placeholder="Search all products..." />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters */}
        <div className="space-y-6 lg:col-span-1">
          <CategoryFilter onFilterChange={setSelectedCategories} />
          <PriceFilter
            onFilterChange={(min, max) =>
              setPriceRange({ min: min, max: max })
            }
          />
        </div>

        {/* Products */}
        <div className="lg:col-span-3">
          {/* Sort Bar */}
          <div className="flex items-center justify-between mb-6 bg-white rounded-lg p-4 shadow-sm">
            <span className="text-gray-700 font-medium">
              {isLoading ? "Loading..." : `${products.length} products found`}
            </span>
            <select
              value={sortBy}
              onChange={(e) => handleSort(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>

          <ProductGrid products={products} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}
