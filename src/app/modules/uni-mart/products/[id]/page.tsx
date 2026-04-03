"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { getProductById, deleteProduct } from "../../services/product.service";
import { startConversation } from "../../services/message.service";
import { Product } from "../../types";
import { ArrowLeft, Share2, Heart, Trash2, Edit2, MessageCircle, ShoppingCart, Package, ArrowUpDown, SlidersHorizontal, ChevronDown } from "lucide-react";
import Image from "next/image";
import { getToken } from "@/lib/auth";
import { Oxanium, Inter } from "next/font/google";

const oxanium = Oxanium({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

type SellerStats = {
  averageRating: number;
  totalReviews: number;
  soldProducts: number;
};

type SellerReview = {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  buyer?: {
    id: string;
    name: string;
    student_id: string;
  };
  product?: {
    id: string;
    title: string;
  };
};

export default function ProductDetailsPage() {
  const ZOOM_LENS_SIZE = 160;
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [sellerReviews, setSellerReviews] = useState<SellerReview[]>([]);
  const [sellerReviewsAverage, setSellerReviewsAverage] = useState(0);
  const [sellerReviewsCount, setSellerReviewsCount] = useState(0);
  const [sellerStats, setSellerStats] = useState<SellerStats | null>(null);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [sellerStatsLoading, setSellerStatsLoading] = useState(false);
  const [isStartingChat, setIsStartingChat] = useState(false);
  const [isZooming, setIsZooming] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const [reviewSort, setReviewSort] = useState<"high-to-low" | "low-to-high" | "newest">("high-to-low");
  const [reviewFilterStar, setReviewFilterStar] = useState<"all" | "5" | "4" | "3" | "2" | "1">("all");
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const sortMenuRef = useRef<HTMLDivElement | null>(null);
  const filterMenuRef = useRef<HTMLDivElement | null>(null);

  const sortOptions: Array<{ value: "high-to-low" | "low-to-high" | "newest"; label: string }> = [
    { value: "high-to-low", label: "Rating: High to Low" },
    { value: "low-to-high", label: "Rating: Low to High" },
    { value: "newest", label: "Newest First" },
  ];

  const filterOptions: Array<{ value: "all" | "5" | "4" | "3" | "2" | "1"; label: string }> = [
    { value: "all", label: "All Star" },
    { value: "5", label: "5 Star" },
    { value: "4", label: "4 Star" },
    { value: "3", label: "3 Star" },
    { value: "2", label: "2 Star" },
    { value: "1", label: "1 Star" },
  ];

  function formatPrice(value: number | string) {
    const numericValue =
      typeof value === "number"
        ? value
        : Number(String(value).replace(/[^0-9.-]/g, ""));

    return Number.isFinite(numericValue)
      ? `Rs. ${numericValue.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`
      : "Rs. 0.00";
  }

  const selectedSortLabel = sortOptions.find((option) => option.value === reviewSort)?.label || "Sort";
  const selectedFilterLabel = filterOptions.find((option) => option.value === reviewFilterStar)?.label || "All Star";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const targetNode = event.target as Node;

      if (sortMenuRef.current && !sortMenuRef.current.contains(targetNode)) {
        setIsSortMenuOpen(false);
      }

      if (filterMenuRef.current && !filterMenuRef.current.contains(targetNode)) {
        setIsFilterMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  useEffect(() => {
    const loadSellerReviews = async () => {
      if (!product?.sellerId) return;

      try {
        setReviewsLoading(true);
        const response = await fetch(`/api/unimart/reviews?sellerId=${product.sellerId}`);

        if (!response.ok) {
          throw new Error("Failed to load seller reviews");
        }

        const data = await response.json();
        setSellerReviews(data.reviews || []);
        setSellerReviewsAverage(data.average || 0);
        setSellerReviewsCount(data.count || 0);
      } catch (error) {
        console.error("Failed to load seller reviews:", error);
        setSellerReviews([]);
        setSellerReviewsAverage(0);
        setSellerReviewsCount(0);
      } finally {
        setReviewsLoading(false);
      }
    };

    loadSellerReviews();
  }, [product?.sellerId]);

  useEffect(() => {
    const loadSellerStats = async () => {
      if (!product?.sellerId) return;

      try {
        setSellerStatsLoading(true);
        const response = await fetch(`/api/unimart/sellers/${product.sellerId}/stats`);
        if (!response.ok) {
          throw new Error("Failed to fetch seller stats");
        }
        const data = await response.json();
        setSellerStats(data);
      } catch (error) {
        console.error("Failed to load seller stats:", error);
        setSellerStats(null);
      } finally {
        setSellerStatsLoading(false);
      }
    };

    loadSellerStats();
  }, [product?.sellerId]);

  const handleDelete = async () => {
    if (!product) return;

    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(product.id);
        router.push("/modules/uni-mart/my-items");
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

  const handleImageMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const lensHalfWidthPercent = (ZOOM_LENS_SIZE / 2 / rect.width) * 100;
    const lensHalfHeightPercent = (ZOOM_LENS_SIZE / 2 / rect.height) * 100;

    const rawX = ((event.clientX - rect.left) / rect.width) * 100;
    const rawY = ((event.clientY - rect.top) / rect.height) * 100;

    const clampedX = Math.min(Math.max(rawX, lensHalfWidthPercent), 100 - lensHalfWidthPercent);
    const clampedY = Math.min(Math.max(rawY, lensHalfHeightPercent), 100 - lensHalfHeightPercent);

    setZoomPosition({ x: clampedX, y: clampedY });
  };

  const maskReviewerName = (name?: string) => {
    const cleaned = (name || "Anonymous").replace(/\s+/g, "").trim();
    if (cleaned.length <= 1) return "A**";
    if (cleaned.length === 2) return `${cleaned[0]}**${cleaned[1]}`;
    return `${cleaned[0]}**${cleaned[cleaned.length - 1]}`;
  };

  const getSellerRatingBreakdown = () => {
    const breakdown: Record<1 | 2 | 3 | 4 | 5, number> = {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    };

    sellerReviews.forEach((review) => {
      const value = review.rating as 1 | 2 | 3 | 4 | 5;
      if (breakdown[value] !== undefined) {
        breakdown[value] += 1;
      }
    });

    return breakdown;
  };

  const productStatusLabel =
    product?.status === "AVAILABLE"
      ? "Available"
      : product?.status === "RESERVED"
      ? "Reserved"
      : "Sold Out";

  const productStatusClass =
    product?.status === "AVAILABLE"
      ? "bg-emerald-100 text-emerald-700 border-emerald-200"
      : product?.status === "RESERVED"
      ? "bg-amber-100 text-amber-700 border-amber-200"
      : "bg-slate-200 text-slate-700 border-slate-300";

  const sellerRatingBreakdown = getSellerRatingBreakdown();
  const filteredSellerReviews = sellerReviews.filter((review) => {
    if (reviewFilterStar === "all") return true;
    return review.rating === Number(reviewFilterStar);
  });

  const visibleSellerReviews = [...filteredSellerReviews].sort((a, b) => {
    if (reviewSort === "newest") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    if (reviewSort === "low-to-high") {
      return a.rating - b.rating;
    }
    return b.rating - a.rating;
  });

  const isAnyReviewMenuOpen = isSortMenuOpen || isFilterMenuOpen;

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="rounded-2xl border border-white/70 bg-white/70 px-8 py-6 text-center shadow-[0_10px_30px_rgba(15,23,42,0.08)] backdrop-blur-md">
          <p className={`${oxanium.className} text-lg font-semibold text-gray-800`}>Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-12 text-center">
        <div className="mx-auto max-w-md rounded-2xl border border-white/70 bg-white/70 p-8 shadow-[0_10px_30px_rgba(15,23,42,0.08)] backdrop-blur-md">
          <p className={`${oxanium.className} mb-4 text-xl font-semibold text-gray-800`}>Product not found</p>
        </div>
        <button
          onClick={() => router.back()}
          className="mt-4 rounded-xl bg-blue-600 px-5 py-2.5 font-semibold text-white transition-colors hover:bg-blue-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className={`${inter.className} mx-auto w-full max-w-[1400px] space-y-8 px-2 sm:px-4 lg:px-6`}>
      {/* Header */}
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 rounded-xl border border-white/70 bg-white/70 px-4 py-2.5 font-semibold text-gray-700 shadow-[0_8px_22px_rgba(15,23,42,0.06)] transition-all hover:-translate-y-0.5 hover:bg-white"
      >
        <ArrowLeft size={20} />
        Back to Products
      </button>

      {/* Main Content */}
      <div className="relative grid grid-cols-1 gap-8 lg:grid-cols-5 lg:gap-10">
        {/* Images Section */}
        <div className="lg:col-span-3 space-y-4">
          {/* Main Image */}
          <div
            className="relative h-[32rem] cursor-crosshair overflow-hidden rounded-2xl border border-white/70 bg-white/70 shadow-[0_16px_36px_rgba(15,23,42,0.08)] backdrop-blur-md lg:h-[38rem]"
            onMouseEnter={() => setIsZooming(true)}
            onMouseLeave={() => setIsZooming(false)}
            onMouseMove={handleImageMouseMove}
          >
            {product.images[selectedImage] ? (
              <img
                src={product.images[selectedImage]}
                alt={product.title}
                className="h-full w-full object-contain p-5"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-gray-400">
                No image available
              </div>
            )}

            {isZooming && product.images[selectedImage] && (
              <>
                <div
                  className="pointer-events-none absolute z-10 rounded-lg border-2 border-white/90 bg-white/20 shadow-[0_0_0_1px_rgba(15,23,42,0.15)]"
                  style={{
                    width: `${ZOOM_LENS_SIZE}px`,
                    height: `${ZOOM_LENS_SIZE}px`,
                    left: `calc(${zoomPosition.x}% - ${ZOOM_LENS_SIZE / 2}px)`,
                    top: `calc(${zoomPosition.y}% - ${ZOOM_LENS_SIZE / 2}px)`,
                  }}
                />
              </>
            )}

            <div className="absolute right-4 top-4 rounded-full bg-blue-600 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-white shadow-sm">
              {product.condition}
            </div>
          </div>

          {/* Thumbnail Images */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto rounded-2xl border border-white/70 bg-white/70 p-3 shadow-[0_10px_24px_rgba(15,23,42,0.06)] backdrop-blur-md">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                    selectedImage === index
                      ? "border-blue-500 shadow-[0_6px_18px_rgba(59,130,246,0.30)]"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {isZooming && product.images[selectedImage] && (
          <div className="pointer-events-none absolute right-0 top-0 z-30 hidden w-[40%] rounded-2xl border border-white/80 bg-white/95 p-2 shadow-[0_14px_30px_rgba(15,23,42,0.18)] lg:block">
            <div className="h-[22rem] overflow-hidden rounded-xl bg-gray-100">
              <img
                src={product.images[selectedImage]}
                alt={`${product.title} zoom preview`}
                className="h-full w-full object-cover"
                style={{
                  transform: "scale(2.3)",
                  transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                }}
              />
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Price & Title */}
          <div className="rounded-2xl border border-white/70 bg-white/70 p-6 shadow-[0_16px_36px_rgba(15,23,42,0.08)] backdrop-blur-md">
            <h1 className={`${oxanium.className} text-3xl font-bold text-gray-900 mb-4`}>
              {product.title}
            </h1>

            <div className="mb-6 flex items-end justify-between gap-3">
              <p className={`${oxanium.className} text-4xl font-bold text-orange-500`}>
                {formatPrice(product.price)}
              </p>
              <span className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${productStatusClass}`}>
                {productStatusLabel}
              </span>
            </div>

            <div className="mb-6">
              {!isOwner && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => {
                        if (product.status === "AVAILABLE") {
                          router.push(`/modules/uni-mart/checkout/${product.id}`);
                        }
                      }}
                      disabled={product.status !== "AVAILABLE"}
                      className={`group flex items-stretch overflow-hidden rounded-xl border-2 shadow-sm transition-transform hover:-translate-y-0.5 ${
                        product.status !== "AVAILABLE"
                          ? "border-gray-400 bg-gray-400 cursor-not-allowed"
                          : "border-violet-500 bg-violet-500 hover:border-violet-600 hover:bg-violet-600"
                      }`}
                    >
                      <span className={`flex w-[45px] sm:w-[50px] shrink-0 items-center justify-center rounded-r-xl bg-white transition-colors ${
                        product.status !== "AVAILABLE" ? "text-gray-400" : "text-violet-500 group-hover:text-violet-600"
                      }`}>
                        <ShoppingCart size={20} strokeWidth={2.5} />
                      </span>
                      <span className="flex flex-1 items-center justify-center px-1 sm:px-2 py-2.5 text-xs sm:text-sm font-extrabold uppercase tracking-wide text-white text-center">
                        Add to Cart
                      </span>
                    </button>

                    <button
                      onClick={() => {
                        if (product.status === "AVAILABLE") {
                          router.push(`/modules/uni-mart/checkout/${product.id}`);
                        }
                      }}
                      disabled={product.status !== "AVAILABLE"}
                      className={`group flex items-stretch overflow-hidden rounded-xl border-2 shadow-sm transition-transform hover:-translate-y-0.5 ${
                        product.status !== "AVAILABLE"
                          ? "border-gray-400 bg-gray-400 cursor-not-allowed"
                          : "border-pink-500 bg-pink-500 hover:border-pink-600 hover:bg-pink-600"
                      }`}
                    >
                      <span className={`flex w-[45px] sm:w-[50px] shrink-0 items-center justify-center rounded-r-xl bg-white transition-colors ${
                        product.status !== "AVAILABLE" ? "text-gray-400" : "text-pink-500 group-hover:text-pink-600"
                      }`}>
                        <Package size={20} strokeWidth={2.5} />
                      </span>
                      <span className="flex flex-1 items-center justify-center px-1 sm:px-2 py-2.5 text-xs sm:text-sm font-extrabold uppercase tracking-wide text-white text-center">
                        Buy Now
                      </span>
                    </button>
                  </div>

                  <div className="grid grid-cols-[minmax(0,1fr)_46px_46px] gap-3">
                    <button
                      onClick={handleChatWithSeller}
                      disabled={isStartingChat}
                      className={`group flex items-stretch overflow-hidden rounded-xl border-2 shadow-sm transition-transform hover:-translate-y-0.5 ${
                        isStartingChat
                          ? "border-gray-400 bg-gray-400 cursor-not-allowed"
                          : "border-amber-500 bg-amber-500 hover:border-amber-600 hover:bg-amber-600"
                      }`}
                    >
                      <span className={`flex w-[50px] shrink-0 items-center justify-center rounded-r-xl bg-white transition-colors ${
                        isStartingChat ? "text-gray-400" : "text-amber-500 group-hover:text-amber-600"
                      }`}>
                        <MessageCircle size={20} strokeWidth={2.5} />
                      </span>
                      <span className="flex flex-1 items-center justify-center px-2 py-2.5 text-sm font-extrabold uppercase tracking-wide text-white">
                        {isStartingChat ? "Opening..." : "Chat with Seller"}
                      </span>
                    </button>

                    <button
                      onClick={() => setIsFavorite(!isFavorite)}
                      aria-label="Toggle favorite"
                      className={`h-[46px] w-[46px] rounded-xl border-2 transition-all hover:-translate-y-0.5 flex items-center justify-center ${
                        isFavorite
                          ? "border-red-500 bg-red-50 text-red-500"
                          : "border-gray-300 bg-gray-100 text-gray-600 hover:border-gray-400"
                      }`}
                    >
                      <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
                    </button>

                    <button
                      aria-label="Share product"
                      className="h-[46px] w-[46px] rounded-xl border-2 border-gray-300 bg-gray-100 text-gray-600 transition-all hover:-translate-y-0.5 hover:border-gray-400 flex items-center justify-center"
                    >
                      <Share2 size={20} />
                    </button>
                  </div>
                </div>
              )}

              {isOwner && (
                <div className="flex flex-wrap gap-2">
                <>
                  {product.status === "AVAILABLE" && (
                    <>
                      <button
                        onClick={() => router.push(`/modules/uni-mart/my-items/${product.id}/edit`)}
                        className="flex-1 min-w-[150px] rounded-xl bg-blue-600 py-3 font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-blue-700 flex items-center justify-center gap-2"
                      >
                        <Edit2 size={20} />
                        Edit
                      </button>
                      <button
                        onClick={handleDelete}
                        className="flex-1 min-w-[150px] rounded-xl bg-red-500 py-3 font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-red-600 flex items-center justify-center gap-2"
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
                </div>
              )}
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
            <div className="grid grid-cols-1 gap-3 text-gray-700 sm:grid-cols-2">
              <div className="rounded-xl border border-gray-100 bg-white/80 p-3">
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">Category</p>
                <p className="font-medium">{product.category}</p>
              </div>
              {product.location && (
                <div className="rounded-xl border border-gray-100 bg-white/80 p-3">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">Location</p>
                  <p className="font-medium">{product.location}</p>
                </div>
              )}
              <div className="rounded-xl border border-gray-100 bg-white/80 p-3">
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">Posted</p>
                <p className="font-medium">
                  {new Date(product.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Seller Card */}
          <div className="rounded-2xl border border-white/70 bg-white/70 p-6 shadow-[0_16px_36px_rgba(15,23,42,0.08)] backdrop-blur-md">
            <h3 className={`${oxanium.className} text-xl font-bold text-gray-900 mb-4`}>Seller Info</h3>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600" />
              <div>
                <p className="font-semibold text-gray-900">
                  {product.sellerName}
                </p>
                {!sellerStatsLoading && sellerStats && (
                  <div className="flex items-center gap-1 text-sm">
                    <span className="text-yellow-400">★</span>
                    <span className="font-semibold text-gray-800">{sellerStats.averageRating.toFixed(1)} / 5</span>
                    <span className="text-gray-500">({sellerStats.totalReviews} reviews)</span>
                  </div>
                )}
                {sellerStatsLoading && (
                  <p className="text-sm text-gray-500">Loading seller ratings...</p>
                )}
                {!sellerStatsLoading && !sellerStats && (
                  <p className="text-sm text-gray-500">No seller ratings yet</p>
                )}
              </div>
            </div>

            {sellerStats && (
              <div className="mb-4 rounded-xl border border-blue-100 bg-blue-50 px-3 py-2 text-sm text-blue-900">
                <span className="font-semibold">Completed sales:</span> {sellerStats.soldProducts}
              </div>
            )}

            <button className="w-full rounded-xl border border-gray-300 py-2.5 font-semibold text-gray-700 transition-colors hover:bg-gray-50">
              View Seller Profile
            </button>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="rounded-2xl border border-white/70 bg-white/70 p-8 shadow-[0_16px_36px_rgba(15,23,42,0.08)] backdrop-blur-md">
        <h2 className={`${oxanium.className} text-2xl font-bold text-gray-900 mb-4`}>Description</h2>
        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
          {product.description}
        </p>
      </div>

      {/* Seller Reviews Section */}
      <div className="space-y-6">
        <div
          className={`overflow-visible rounded-2xl border border-white/70 bg-white/70 shadow-[0_16px_36px_rgba(15,23,42,0.08)] backdrop-blur-md ${
            isAnyReviewMenuOpen ? "relative z-40" : "relative z-10"
          }`}
        >
          <div className="grid gap-8 border-b border-gray-200/80 p-8 md:grid-cols-[260px_1fr]">
            <div>
              <p className={`${oxanium.className} text-6xl font-bold leading-none text-gray-900`}>
                {sellerReviewsAverage.toFixed(1)}
                <span className="ml-1 text-4xl text-gray-400">/5</span>
              </p>

              <div className="mt-4 flex gap-1 text-4xl leading-none text-amber-400">
                {[1, 2, 3, 4, 5].map((star) => {
                  const isFilled = star <= Math.round(sellerReviewsAverage);
                  return (
                    <span key={star} className={isFilled ? "text-amber-400" : "text-gray-300"}>
                      ★
                    </span>
                  );
                })}
              </div>

              <p className="mt-3 text-base font-medium text-gray-600">
                {sellerReviewsCount} Ratings
              </p>
            </div>

            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = sellerRatingBreakdown[star as 1 | 2 | 3 | 4 | 5] || 0;
                const percent = sellerReviewsCount > 0 ? (count / sellerReviewsCount) * 100 : 0;

                return (
                  <div key={star} className="flex items-center gap-4">
                    <div className="w-24 text-lg font-semibold text-amber-400">
                      {"★".repeat(star)}
                      <span className="text-gray-300">{"★".repeat(5 - star)}</span>
                    </div>

                    <div className="h-4 flex-1 overflow-hidden rounded-full bg-gray-200">
                      <div
                        className="h-full rounded-full bg-amber-400 transition-all"
                        style={{ width: `${percent}%` }}
                      />
                    </div>

                    <div className="w-10 text-right text-lg text-gray-700">{count}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {reviewsLoading ? (
            <div className="p-8 text-gray-500">Loading seller reviews...</div>
          ) : sellerReviewsCount === 0 ? (
            <div className="p-8">
              <div className="rounded-xl border border-gray-200 bg-white/80 p-6 text-center text-gray-500">
              No seller reviews yet
              </div>
            </div>
          ) : (
            <>
              <div className="relative z-50 flex flex-wrap items-center justify-between gap-3 border-b border-gray-200/80 px-8 py-4">
                <h2 className={`${oxanium.className} text-2xl font-bold text-gray-900`}>
                  Seller Reviews
                </h2>

                <div className="flex flex-wrap items-center gap-3">
                  <div ref={sortMenuRef} className="relative">
                    <button
                      type="button"
                      onClick={() => {
                        setIsSortMenuOpen((prev) => {
                          const next = !prev;
                          if (next) setIsFilterMenuOpen(false);
                          return next;
                        });
                      }}
                      className="group flex items-center gap-2 rounded-xl border border-gray-200/90 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm transition-all hover:border-gray-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    >
                      <ArrowUpDown size={15} className="text-gray-500" />
                      <span className="font-medium text-gray-600">Sort</span>
                      <span className="font-semibold text-gray-900">{selectedSortLabel}</span>
                      <span className="font-semibold text-gray-900">
                      <ChevronDown size={15} className={`text-gray-400 transition-transform ${isSortMenuOpen ? "rotate-180" : ""}`} />
                      </span>
                    </button>

                    {isSortMenuOpen && (
                      <div className="absolute right-0 top-[calc(100%+0.5rem)] z-[120] w-60 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-[0_16px_36px_rgba(15,23,42,0.16)]">
                        {sortOptions.map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => {
                              setReviewSort(option.value);
                              setIsSortMenuOpen(false);
                            }}
                            className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${
                              reviewSort === option.value
                                ? "bg-blue-600 font-semibold text-white"
                                : "text-gray-700 hover:bg-blue-50"
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div ref={filterMenuRef} className="relative">
                    <button
                      type="button"
                      onClick={() => {
                        setIsFilterMenuOpen((prev) => {
                          const next = !prev;
                          if (next) setIsSortMenuOpen(false);
                          return next;
                        });
                      }}
                      className="group flex items-center gap-2 rounded-xl border border-gray-200/90 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm transition-all hover:border-gray-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    >
                      <SlidersHorizontal size={15} className="text-gray-500" />
                      <span className="font-medium text-gray-600">Filter</span>
                      <span className="font-semibold text-gray-900">{selectedFilterLabel}</span>
                      <ChevronDown size={15} className={`text-gray-400 transition-transform ${isFilterMenuOpen ? "rotate-180" : ""}`} />
                    </button>

                    {isFilterMenuOpen && (
                      <div className="absolute right-0 top-[calc(100%+0.5rem)] z-[120] w-44 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-[0_16px_36px_rgba(15,23,42,0.16)]">
                        {filterOptions.map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => {
                              setReviewFilterStar(option.value);
                              setIsFilterMenuOpen(false);
                            }}
                            className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${
                              reviewFilterStar === option.value
                                ? "bg-blue-600 font-semibold text-white"
                                : "text-gray-700 hover:bg-blue-50"
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {!reviewsLoading && sellerReviewsCount > 0 && (
          <div className="relative z-0 space-y-4">
            {visibleSellerReviews.length === 0 && (
              <div className="rounded-2xl border border-white/70 bg-white/70 p-6 text-center text-gray-500 shadow-[0_10px_24px_rgba(15,23,42,0.06)] backdrop-blur-md">
                No reviews found for selected filter
              </div>
            )}

            {visibleSellerReviews.map((review) => (
              <div
                key={review.id}
                className="rounded-2xl border border-white/70 bg-white/70 p-6 shadow-[0_10px_24px_rgba(15,23,42,0.06)] backdrop-blur-md"
              >
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className={`${oxanium.className} font-semibold text-gray-900`}>{maskReviewerName(review.buyer?.name)}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="rounded-lg bg-amber-50 px-2.5 py-1 text-sm font-semibold text-amber-700">
                    {review.rating} ★
                  </div>
                </div>

                {review.product?.title && (
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Product: {review.product.title}
                  </p>
                )}

                <p className="text-[15px] leading-relaxed text-gray-700">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>

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