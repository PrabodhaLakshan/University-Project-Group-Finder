"use client";

import { useState, useEffect } from "react";
import { RatingStars } from "./RatingStars";
import { MessageCircle } from "lucide-react";

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  buyer: {
    id: string;
    name: string;
    student_id: string;
  };
}

interface ReviewsListProps {
  productId: string;
  className?: string;
}

export function ReviewsList({ productId, className = "" }: ReviewsListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [average, setAverage] = useState(0);
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadReviews();
  }, [productId]);

  const loadReviews = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(
        `/api/unimart/reviews?productId=${productId}`
      );

      if (!response.ok) {
        throw new Error("Failed to load reviews");
      }

      const data = await response.json();
      setReviews(data.reviews);
      setAverage(data.average);
      setCount(data.count);
    } catch (err) {
      console.error("Failed to load reviews:", err);
      setError("Failed to load reviews");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <p className="text-gray-500">Loading reviews...</p>
      </div>
    );
  }

  if (count === 0) {
    return (
      <div className={`bg-gray-50 rounded-lg p-8 text-center ${className}`}>
        <MessageCircle className="mx-auto text-gray-300 mb-3" size={40} />
        <p className="text-gray-600 font-medium">No reviews yet</p>
        <p className="text-gray-500 text-sm mt-1">
          Be the first to review this product
        </p>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Average Rating Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Customer Reviews
        </h3>
        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900">
              {average.toFixed(1)}
            </div>
            <div className="text-sm text-gray-600 mt-1">{count} reviews</div>
          </div>
          <RatingStars rating={average} size={28} showText={false} />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 mb-4">
          {error}
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="bg-white rounded-lg border border-gray-200 p-4 hover:border-gray-300 transition"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="font-semibold text-gray-900">
                  {review.buyer?.name || "Anonymous"}
                </div>
                <div className="text-xs text-gray-500">
                  @{review.buyer?.student_id || "unknown"}
                </div>
              </div>
              <RatingStars rating={review.rating} size={18} showText={false} />
            </div>

            <p className="text-gray-700 mb-3">{review.comment}</p>

            <div className="text-xs text-gray-500">
              {new Date(review.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
