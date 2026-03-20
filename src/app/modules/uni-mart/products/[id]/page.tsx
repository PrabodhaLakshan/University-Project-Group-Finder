"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { getProductById, deleteProduct } from "../../services/product.service";
import { startConversation } from "../../services/message.service";
import { Product } from "../../types";
import { ArrowLeft, Share2, Heart, Trash2, Edit2, MessageCircle, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { getToken } from "@/lib/auth";
import { RatingBreakdown } from "../../components/RatingBreakdown";
import { ReviewsList } from "../../components/ReviewsList";

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [ratingStats, setRatingStats] = useState<any>(null);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [isStartingChat, setIsStartingChat] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setIsLoading(true);
        if (params.id && typeof params.id === "string") {
          const data = await getProductById(params.id);
          setProduct(data);
        }
      } catch (error) {
        console.error("Failed to load product:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [params.id]);

  // Check if current user is the product owner
  useEffect(() => {
    const checkOwnership = async () => {
      try {
        const token = getToken();
        if (!token) return;

        // Decode token to get user ID
        const payload = JSON.parse(
          atob(token.split(".")[1])
        );
        setCurrentUserId(payload.userId || payload.sub);

        if (product && payload.userId === product.sellerId) {
          setIsOwner(true);
        }
      } catch (error) {
        console.error("Failed to check ownership:", error);
      }
    };

    if (product) {
      checkOwnership();
    }
  }, [product]);

  // Load rating stats only (ReviewsList will load reviews itself)
  const loadRatingStats = async () => {
    if (!product) return;
    
    try {
      setReviewsLoading(true);
      
      // Fetch rating stats for breakdown display
      const statsResponse = await fetch(
        `/api/unimart/reviews/stats?productId=${product.id}`
      );
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setRatingStats(statsData);
      }
    } catch (error) {
      console.error("Failed to load rating stats:", error);
    } finally {
      setReviewsLoading(false);
    }
  };

  useEffect(() => {
    if (product) {
      loadRatingStats();
    }
  }, [product]);

  const handleDelete = async () => {
    if (!product) return;

    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(product.id);
        router.push("/uni-mart/my-items");
      } catch (error) {
        console.error("Failed to delete product:", error);
        alert("Failed to delete product");
      }
    }
  };

  const handleChatWithSeller = async () => {
    if (!product || isStartingChat) return;

    try {
      const token = getToken();
      if (!token) {
        router.push("/login");
        return;
      }

      setIsStartingChat(true);
      const conversation = await startConversation({
        productId: product.id,
        sellerId: product.sellerId,
      });

      router.push(`/modules/uni-mart/messages/${conversation.id}`);
    } catch (error) {
      console.error("Failed to start chat:", error);
      alert(error instanceof Error ? error.message : "Failed to start chat with seller");
    } finally {
      setIsStartingChat(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-500">Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg mb-4">Product not found</p>
        <button
          onClick={() => router.back()}
          className="text-blue-500 hover:text-blue-700 font-medium"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium"
      >
        <ArrowLeft size={20} />
        Back to Products
      </button>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Images Section */}
        <div className="lg:col-span-2 space-y-4">
          {/* Main Image */}
          <div className="relative h-96 bg-gray-200 rounded-lg overflow-hidden">
            {product.images[selectedImage] ? (
              <img
                src={product.images[selectedImage]}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No image available
              </div>
            )}

            <div className="absolute top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-full font-semibold">
              {product.condition}
            </div>
          </div>

          {/* Thumbnail Images */}
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === index
                      ? "border-blue-500"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="space-y-6">
          {/* Price & Title */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {product.title}
            </h1>

            <p className="text-4xl font-bold text-blue-600 mb-6">
              Rs. {product.price.toLocaleString()}
            </p>

            <div className="flex gap-2 mb-6">
              {!isOwner && (
                <>
                  <button
                    onClick={() => {
                      if (product.status === "AVAILABLE") {
                        router.push(`/modules/uni-mart/checkout/${product.id}`);
                      }
                    }}
                    disabled={product.status !== "AVAILABLE"}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition ${
                      product.status !== "AVAILABLE"
                        ? "bg-gray-400 text-white cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    <ShoppingCart size={20} />
                    {product.status === "AVAILABLE"
                      ? "Buy Now"
                      : product.status === "RESERVED"
                      ? "Reserved"
                      : "Sold Out"}
                  </button>
                  <button
                    onClick={handleChatWithSeller}
                    disabled={isStartingChat}
                    className="flex-1 flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 font-medium disabled:bg-gray-200 disabled:text-gray-500"
                  >
                    <MessageCircle size={20} />
                    {isStartingChat ? "Opening Chat..." : "Chat with Seller"}
                  </button>
                </>
              )}
              {isOwner && (
                <>
                  {product.status === "AVAILABLE" && (
                    <>
                      <button
                        onClick={() => router.push(`/modules/uni-mart/my-items/${product.id}/edit`)}
                        className="flex-1 flex items-center justify-center gap-2 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 font-medium"
                      >
                        <Edit2 size={20} />
                        Edit
                      </button>
                      <button
                        onClick={handleDelete}
                        className="flex-1 flex items-center justify-center gap-2 bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 font-medium"
                      >
                        <Trash2 size={20} />
                        Delete
                      </button>
                    </>
                  )}
                  
                  {product.status === "RESERVED" && (
                    <div className="w-full bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="font-semibold text-blue-900 text-sm">💳 Payment Pending Verification</p>
                      <p className="text-xs text-blue-700 mt-1">A buyer has submitted payment. Review and verify to complete sale.</p>
                    </div>
                  )}

                  {product.status === "SOLD" && (
                    <div className="w-full bg-green-50 border border-green-200 rounded-lg p-3">
                      <p className="font-semibold text-green-900 text-sm">✅ Item Sold</p>
                      <p className="text-xs text-green-700 mt-1">This item has been successfully sold.</p>
                    </div>
                  )}
                </>
              )}
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className={`px-4 py-3 rounded-lg border-2 transition-colors ${
                  isFavorite
                    ? "border-red-500 bg-red-50 text-red-500"
                    : "border-gray-300 text-gray-600 hover:border-gray-400"
                }`}
              >
                <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
              </button>
              <button className="px-4 py-3 rounded-lg border-2 border-gray-300 text-gray-600 hover:border-gray-400">
                <Share2 size={20} />
              </button>
            </div>

            {/* Status Messages for Non-Owners */}
            {!isOwner && product.status === "RESERVED" && (
              <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="font-semibold text-yellow-900 text-sm">⏳ Item Reserved</p>
                <p className="text-xs text-yellow-700 mt-1">This item is currently reserved by another buyer.</p>
              </div>
            )}
            {!isOwner && product.status === "SOLD" && (
              <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="font-semibold text-green-900 text-sm">✅ Item Sold</p>
                <p className="text-xs text-green-700 mt-1">This item has been sold.</p>
              </div>
            )}

            {/* Quick Info */}
            <div className="space-y-3 text-gray-700">
              <div>
                <p className="text-sm text-gray-500 mb-1">Category</p>
                <p className="font-medium">{product.category}</p>
              </div>
              {product.location && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Location</p>
                  <p className="font-medium">{product.location}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-500 mb-1">Posted</p>
                <p className="font-medium">
                  {new Date(product.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Seller Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-bold text-gray-900 mb-4">Seller Info</h3>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600" />
              <div>
                <p className="font-semibold text-gray-900">
                  {product.sellerName}
                </p>
                {product.rating && (
                  <div className="flex items-center gap-1 text-yellow-400 text-sm">
                    <span>★</span>
                    <span>{product.rating} ({product.reviews} reviews)</span>
                  </div>
                )}
              </div>
            </div>

            <button className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 font-medium">
              View Seller Profile
            </button>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
          {product.description}
        </p>
      </div>

      {/* Reviews & Ratings Section */}
      {!reviewsLoading && ratingStats && (
        <div className="space-y-6">
          {/* Rating Breakdown */}
          {ratingStats.totalReviews > 0 && (
            <RatingBreakdown
              breakdown={ratingStats.breakdown}
              totalReviews={ratingStats.totalReviews}
            />
          )}

          {/* Reviews List */}
          <ReviewsList productId={product.id} />
        </div>
      )}

      {reviewsLoading && (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-500">Loading reviews...</p>
        </div>
      )}

      {/* Action Buttons (for product owner) */}
      {isOwner && (
        <div className="flex gap-4 pb-8 border-t pt-8">
          <button className="flex-1 flex items-center justify-center gap-2 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 font-medium">
            <MessageCircle size={20} />
            Contact Seller
          </button>
        </div>
      )}
    </div>
  );
}
