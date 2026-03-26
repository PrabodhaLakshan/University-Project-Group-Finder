"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUserProducts } from "../services/product.service";
import { Product } from "../types";
import { ArrowLeft, TrendingUp } from "lucide-react";

export default function SalesHistoryPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSoldProducts = async () => {
      try {
        setIsLoading(true);
        // Load SOLD items for Sales History page
        const data = await getUserProducts("SOLD");
        setProducts(data);
      } catch (error) {
        console.error("Failed to load sold products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSoldProducts();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-500">Loading sales history...</p>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium mb-6"
      >
        <ArrowLeft size={20} />
        Back
      </button>

      {/* Tabs Navigation */}
      <div className="flex gap-6 border-b mb-8 pb-0">
        <button
          onClick={() => router.push("/modules/uni-mart/my-items")}
          className="text-gray-500 hover:text-gray-700 pb-3 px-1 transition border-b-2 border-transparent hover:border-gray-300"
        >
          Active Listings
        </button>
        <button
          onClick={() => {}}
          className="font-semibold text-blue-600 border-b-2 border-blue-600 pb-3 px-1 transition"
        >
          Sales History
        </button>
      </div>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Sales History</h1>
          <p className="text-gray-600 mt-2">Items you've successfully sold</p>
        </div>
        <div className="text-right">
          <p className="text-gray-600 text-sm">Total Sales</p>
          <p className="text-3xl font-bold text-green-600">{products.length}</p>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
            <TrendingUp className="text-gray-400" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No Sales Yet</h2>
          <p className="text-gray-600 mb-6">
            You haven't sold any items yet. Start with your active listings!
          </p>
          <button
            onClick={() => router.push("/modules/uni-mart/my-items")}
            className="inline-block bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 font-medium"
          >
            View Active Listings
          </button>
        </div>
      ) : (
        <div>
          {/* Revenue Summary */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-green-700 text-sm font-medium mb-1">Total Revenue</p>
                <p className="text-3xl font-bold text-green-900">
                  Rs. {products.reduce((sum, p) => sum + p.price, 0).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-green-700 text-sm font-medium mb-1">Items Sold</p>
                <p className="text-3xl font-bold text-green-900">{products.length}</p>
              </div>
              <div>
                <p className="text-green-700 text-sm font-medium mb-1">Average Price</p>
                <p className="text-3xl font-bold text-green-900">
                  Rs. {Math.round(products.reduce((sum, p) => sum + p.price, 0) / products.length).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Sales List */}
          <div className="space-y-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                  {/* Product Image */}
                  <div className="md:col-span-1">
                    <div className="w-full aspect-square rounded-lg overflow-hidden bg-gray-200">
                      {product.images[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          No image
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="md:col-span-2">
                    <h3 className="text-lg font-bold text-gray-900 line-clamp-2">
                      {product.title}
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">
                      Category: {product.category}
                    </p>
                    <p className="text-gray-600 text-sm">
                      Condition: {product.condition}
                    </p>
                    <p className="text-gray-500 text-xs mt-2">
                      ID: {product.id.slice(0, 8)}...
                    </p>
                  </div>

                  {/* Price */}
                  <div className="md:col-span-1">
                    <p className="text-gray-600 text-sm">Sold Price</p>
                    <p className="text-2xl font-bold text-green-600">
                      Rs. {product.price.toLocaleString()}
                    </p>
                  </div>

                  {/* Date */}
                  <div className="md:col-span-1">
                    <p className="text-gray-600 text-sm">Sold On</p>
                    <p className="font-semibold text-gray-900 text-sm">
                      {new Date(product.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-gray-500 text-xs">
                      {new Date(product.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
