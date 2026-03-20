"use client";

interface RatingBreakdownProps {
  breakdown: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  totalReviews: number;
}

export const RatingBreakdown: React.FC<RatingBreakdownProps> = ({
  breakdown,
  totalReviews,
}) => {
  if (totalReviews === 0) {
    return null;
  }

  const renderStars = (rating: number) => {
    return "★".repeat(rating) + "☆".repeat(5 - rating);
  };

  const getBarWidth = (count: number) => {
    if (totalReviews === 0) return 0;
    return (count / totalReviews) * 100;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6">
        Rating Breakdown
      </h3>

      <div className="space-y-4">
        {/* 5 Star */}
        <div className="flex items-center gap-4">
          <div className="w-12 text-sm font-medium text-gray-700">
            <span className="text-yellow-500">★★★★★</span>
          </div>
          <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-yellow-400 h-full transition-all"
              style={{ width: `${getBarWidth(breakdown[5])}%` }}
            />
          </div>
          <div className="w-12 text-sm text-gray-600 text-right">
            {breakdown[5]}
          </div>
        </div>

        {/* 4 Star */}
        <div className="flex items-center gap-4">
          <div className="w-12 text-sm font-medium text-gray-700">
            <span className="text-yellow-500">★★★★☆</span>
          </div>
          <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-yellow-400 h-full transition-all"
              style={{ width: `${getBarWidth(breakdown[4])}%` }}
            />
          </div>
          <div className="w-12 text-sm text-gray-600 text-right">
            {breakdown[4]}
          </div>
        </div>

        {/* 3 Star */}
        <div className="flex items-center gap-4">
          <div className="w-12 text-sm font-medium text-gray-700">
            <span className="text-yellow-500">★★★☆☆</span>
          </div>
          <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-yellow-400 h-full transition-all"
              style={{ width: `${getBarWidth(breakdown[3])}%` }}
            />
          </div>
          <div className="w-12 text-sm text-gray-600 text-right">
            {breakdown[3]}
          </div>
        </div>

        {/* 2 Star */}
        <div className="flex items-center gap-4">
          <div className="w-12 text-sm font-medium text-gray-700">
            <span className="text-yellow-500">★★☆☆☆</span>
          </div>
          <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-yellow-400 h-full transition-all"
              style={{ width: `${getBarWidth(breakdown[2])}%` }}
            />
          </div>
          <div className="w-12 text-sm text-gray-600 text-right">
            {breakdown[2]}
          </div>
        </div>

        {/* 1 Star */}
        <div className="flex items-center gap-4">
          <div className="w-12 text-sm font-medium text-gray-700">
            <span className="text-yellow-500">★☆☆☆☆</span>
          </div>
          <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-yellow-400 h-full transition-all"
              style={{ width: `${getBarWidth(breakdown[1])}%` }}
            />
          </div>
          <div className="w-12 text-sm text-gray-600 text-right">
            {breakdown[1]}
          </div>
        </div>
      </div>
    </div>
  );
};
