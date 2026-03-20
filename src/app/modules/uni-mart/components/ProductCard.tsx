"use client";

import { useState, useEffect } from "react";
import { Product } from "../types";
import Link from "next/link";
import Image from "next/image";
import { Star, MapPin } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

interface SellerStats {
  averageRating: number;
  totalReviews: number;
  soldProducts: number;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [sellerStats, setSellerStats] = useState<SellerStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSellerStats = async () => {
      try {
        // Validate sellerId exists and is not empty
        if (!product.sellerId || typeof product.sellerId !== "string") {
          console.warn("Invalid sellerId:", product.sellerId);
          setError("Seller ID not available");
          setSellerStats(null);
          setIsLoading(false);
          return;
        }

        setIsLoading(true);
        setError(null);
        
        const url = `/api/unimart/sellers/${encodeURIComponent(product.sellerId)}/stats`;
        console.log(`Fetching seller stats from: ${url}`);
        
        const response = await fetch(url);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`API error ${response.status}:`, errorText);
          throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("Seller stats received:", data);
        setSellerStats(data);
      } catch (err) {
        console.error("Failed to fetch seller stats:", err);
        setError(err instanceof Error ? err.message : "Failed to load stats");
        setSellerStats(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSellerStats();
  }, [product.sellerId]);
  return (
    <Link href={`/uni-mart/products/${product.id}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden h-full flex flex-col cursor-pointer">
        {/* Product Image */}
        <div className="relative h-48 w-full bg-gray-200">
          {product.images[0] ? (
            <Image
              src={product.images[0]}
              alt={product.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No image
            </div>
          )}
          <div className="absolute top-2 right-2 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
            {product.condition}
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="text-lg font-bold text-gray-800 line-clamp-2 mb-2">
            {product.title}
          </h3>

          <p className="text-gray-600 text-sm line-clamp-2 mb-3">
            {product.description}
          </p>

          {/* Price */}
          <div className="mb-3">
            <p className="text-2xl font-bold text-blue-600">
              Rs. {product.price.toLocaleString()}
            </p>
          </div>

          {/* Location */}
          {product.location && (
            <div className="flex items-center text-gray-500 text-sm mb-3">
              <MapPin size={16} className="mr-1" />
              {product.location}
            </div>
          )}

          {/* Seller Info & Rating */}
          <div className="border-t pt-3 mt-auto">
            <p className="text-gray-900 text-sm font-semibold mb-3">
              {product.sellerName}
            </p>
            
            {!isLoading && sellerStats ? (
              <div className="space-y-2">
                {/* Rating Stars & Review Count */}
                <div className="flex items-center gap-2">
                  <div className="flex text-yellow-400 gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        fill={i < Math.floor(sellerStats.averageRating) ? "currentColor" : "none"}
                        strokeWidth={i < Math.floor(sellerStats.averageRating) ? 0 : 1}
                      />
                    ))}
                  </div>
                  <span className="text-gray-700 text-sm font-medium">
                    {sellerStats.averageRating.toFixed(1)}
                  </span>
                  <span className="text-gray-500 text-xs">
                    ({sellerStats.totalReviews} {sellerStats.totalReviews === 1 ? "review" : "reviews"})
                  </span>
                </div>

                {/* Sold Products Count */}
                {sellerStats.soldProducts > 0 && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-green-600 font-bold">✓</span>
                    <span className="text-gray-700 text-xs font-medium">
                      {sellerStats.soldProducts} sold
                    </span>
                  </div>
                )}
              </div>
            ) : isLoading ? (
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded w-20 animate-pulse"></div>
              </div>
            ) : (
              <div className="text-gray-500 text-xs">
                No rating yet
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
