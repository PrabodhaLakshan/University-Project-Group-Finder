"use client";

import { useState, useEffect } from "react";
import { Product } from "../types";
import Link from "next/link";
import Image from "next/image";
import { Star, MapPin } from "lucide-react";
import { Oxanium } from "next/font/google";

const oxanium = Oxanium({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

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
  const condition = product.condition.toLowerCase();

  const conditionBadgeStyles: Record<string, string> = {
    new: "bg-blue-600/95 text-white ring-1 ring-blue-300/60",
    used: "bg-amber-500/95 text-white ring-1 ring-amber-300/60",
    refurbished: "bg-gradient-to-r from-amber-500 to-yellow-500 text-white ring-1 ring-yellow-300/70",
  };

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
      <div className={`${oxanium.className} group h-full cursor-pointer overflow-hidden rounded-2xl border border-white/70 bg-white/80 shadow-[0_10px_28px_rgba(15,23,42,0.08)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(37,99,235,0.16)]`}>
        {/* Product Image */}
        <div className="relative h-48 w-full bg-slate-100">
          {product.images[0] ? (
            <Image
              src={product.images[0]}
              alt={product.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm font-medium text-gray-400">
              No image
            </div>
          )}
          <div
            className={`${oxanium.className} absolute right-3 top-3 rounded-full px-3.5 py-1 text-xs font-semibold capitalize tracking-wide shadow-sm ${
              conditionBadgeStyles[condition] ?? "bg-slate-600/95 text-white"
            }`}
          >
            {condition}
          </div>
        </div>

        {/* Product Info */}
        <div className="flex h-[calc(100%-12rem)] flex-col p-5">
          <h3 className="mb-2 line-clamp-2 text-xl font-bold text-slate-900">
            {product.title}
          </h3>

          <p className="mb-4 min-h-[3.25rem] line-clamp-2 text-sm leading-relaxed text-gray-600">
            {product.description}
          </p>

          {/* Price */}
          <div className="mb-4">
            <p className="text-[1.75rem] font-bold leading-none text-indigo-600">
              Rs. {product.price.toLocaleString()}
            </p>
          </div>

          {/* Location */}
          {product.location && (
            <div className="mb-4 flex items-center gap-1.5 text-sm font-medium text-gray-500">
              <MapPin size={16} className="text-gray-400" />
              {product.location}
            </div>
          )}

          {/* Seller Info & Rating */}
          <div className="mt-auto border-t border-slate-200 pt-3">
            <p className="mb-3 text-base font-semibold text-slate-900">
              {product.sellerName}
            </p>
            
            {!isLoading && sellerStats ? (
              <div className="space-y-2">
                {/* Rating Stars & Review Count */}
                <div className="space-y-0.5">
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
                    <span className="text-sm font-semibold text-gray-700">
                      {sellerStats.averageRating.toFixed(1)}
                    </span>
                  </div>
                  <span className="block text-xs text-gray-500">
                    ({sellerStats.totalReviews} {sellerStats.totalReviews === 1 ? "review" : "reviews"})
                  </span>
                </div>

                {/* Sold Products Count */}
                {sellerStats.soldProducts > 0 && (
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1">
                    <span className="font-bold text-emerald-600">✓</span>
                    <span className="text-xs font-semibold text-emerald-700">
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
