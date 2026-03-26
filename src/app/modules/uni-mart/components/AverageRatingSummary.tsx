"use client";

interface AverageRatingSummaryProps {
  averageRating: number;
  totalReviews: number;
}

export const AverageRatingSummary: React.FC<AverageRatingSummaryProps> = ({
  averageRating,
  totalReviews,
}) => {
  if (totalReviews === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          ⭐ Customer Ratings
        </h3>
        <p className="text-gray-600">No reviews yet. Be the first to review!</p>
      </div>
    );
  }

  const filledStars = Math.round(averageRating);
  const renderStarDisplay = () => {
    let stars = "";
    for (let i = 0; i < 5; i++) {
      if (i < filledStars) {
        stars += "★";
      } else {
        stars += "☆";
      }
    }
    return stars;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6">
        ⭐ Customer Ratings
      </h3>

      <div className="flex flex-col md:flex-row items-center gap-8">
        {/* Left Side - Big Rating Display */}
        <div className="flex flex-col items-center">
          <div className="text-5xl font-bold text-gray-900 mb-2">
            {averageRating.toFixed(1)}
          </div>
          <div className="text-2xl text-yellow-500 mb-2">
            {renderStarDisplay()}
          </div>
          <div className="text-gray-600 text-sm font-medium">
            out of 5 stars
          </div>
          <div className="text-gray-500 text-sm mt-2">
            Based on {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
          </div>
        </div>

        {/* Divider */}
        <div className="hidden md:block w-px h-32 bg-gray-200" />

        {/* Right Side - Additional Info */}
        <div className="flex-1 space-y-3">
          <div className="bg-gradient-to-r from-yellow-50 to-transparent rounded-lg p-3">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Highly Rated</span> - Customers love this product
            </p>
          </div>
          <div className="text-sm text-gray-600">
            ✓ Verified buyers have shared their experiences with this product
          </div>
        </div>
      </div>
    </div>
  );
};
