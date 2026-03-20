"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUserProducts, deleteProduct } from "../services/product.service";
import Link from "next/link";
import { Product } from "../types";
import { Plus, Edit2, Trash2, ArrowLeft } from "lucide-react";

export default function MyItemsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        // Only load AVAILABLE items for Active Listings page
        const data = await getUserProducts("AVAILABLE");
        setProducts(data);
      } catch (error) {
        console.error("Failed to load products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  const handleDelete = async (productId: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this item?");
    if (!confirmed) return;

    try {
      setDeletingId(productId);
      setDeleteError(null);
      await deleteProduct(productId);
      setProducts((previous) => previous.filter((product) => product.id !== productId));
    } catch (error) {
      console.error("Failed to delete product:", error);
      const message = error instanceof Error ? error.message : "Failed to delete item";
      setDeleteError(message);
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-500">Loading your items...</p>
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
          onClick={() => {}}
          className="font-semibold text-blue-600 border-b-2 border-blue-600 pb-3 px-1 transition"
        >
          Active Listings
        </button>
        <button
          onClick={() => router.push("/modules/uni-mart/sales-history")}
          className="text-gray-500 hover:text-gray-700 pb-3 px-1 transition border-b-2 border-transparent hover:border-gray-300"
        >
          Sales History
        </button>
      </div>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Active Listings</h1>
          <p className="text-gray-600 mt-2">Items available for buyers</p>
        </div>
        <Link
          href="/modules/uni-mart/new"
          className="flex items-center gap-2 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 font-medium"
        >
          <Plus size={20} />
          Post New Item
        </Link>
      </div>

      {deleteError && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-3 text-red-700 text-sm">
          {deleteError}
        </div>
      )}

      {products.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
            <Plus className="text-gray-400" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No Items Yet</h2>
          <p className="text-gray-600 mb-6">
            You haven't posted any items yet. Start selling today!
          </p>
          <Link
            href="/uni-mart/new"
            className="inline-block bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 font-medium"
          >
            Post Your First Item
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Image */}
              <div className="relative h-40 bg-gray-200">
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

              {/* Content */}
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-1">
                  {product.title}
                </h3>
                <p className="text-2xl font-bold text-blue-600 mb-3">
                  Rs. {product.price.toLocaleString()}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <span>{product.category}</span>
                  <span className="bg-gray-100 px-2 py-1 rounded">
                    {product.condition}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t">
                  <Link
                    href={`/uni-mart/my-items/${product.id}/edit`}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-50 text-blue-600 py-2 rounded-lg hover:bg-blue-100 font-medium transition-colors"
                  >
                    <Edit2 size={16} />
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(product.id)}
                    disabled={deletingId === product.id}
                    className="flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-600 py-2 rounded-lg hover:bg-red-100 font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <Trash2 size={16} />
                    {deletingId === product.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
