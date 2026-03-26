"use client";

import { useState, useEffect } from "react";
import { getToken } from "@/lib/auth";
import { ReviewForm } from "../components/ReviewForm";
import { ReviewsList } from "../components/ReviewsList";
import { AverageRating } from "../components/RatingStars";

interface ProductWithReviews {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  seller: {
    id: string;
    name: string;
  };
}

interface VerifiedOrder {
  id: string;
  paymentStatus: string;
}

interface ProductReviewSectionProps {
  productId: string;
}

/**
 * Example integration of the Review system on a product page.
 * This component shows:
 * 1. Average rating display
 * 2. Review form (for verified buyers)
 * 3. Reviews list
 */
export default function ProductReviewSection({ productId }: ProductReviewSectionProps) {
  const [product, setProduct] = useState<ProductWithReviews | null>(null);
  const [verifiedOrders, setVerifiedOrders] = useState<VerifiedOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    loadData();
  }, [productId]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const token = getToken();

      if (!token) {
        return;
      }

      // Fetch product details
      const productRes = await fetch(`/api/unimart/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (productRes.ok) {
        const data = await productRes.json();
        setProduct(data);
      }

      // Fetch verified orders for this product (to check if user can review)
      const ordersRes = await fetch(
        `/api/unimart/orders/buyer?productId=${productId}&status=VERIFIED`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (ordersRes.ok) {
        const data = await ordersRes.json();
        setVerifiedOrders(data.orders || []);
      }
    } catch (error) {
      console.error("Failed to load product data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const canReview = verifiedOrders.length > 0;
  const verifiedOrder = verifiedOrders[0];

  if (isLoading) {
    return <div className="text-center py-8">Loading reviews...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Review Form - Show only if user has verified order */}
      {canReview && verifiedOrder && (
        <ReviewForm
          productId={productId}
          orderId={verifiedOrder.id}
          onReviewSubmitted={() => setRefreshKey(prev => prev + 1)}
        />
      )}

      {/* Reviews List */}
      <ReviewsList key={refreshKey} productId={productId} />
    </div>
  );
}
