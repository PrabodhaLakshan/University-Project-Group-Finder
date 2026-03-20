import { Star } from "lucide-react";

interface RatingStarsProps {
  rating: number;
  size?: number;
  showText?: boolean;
}

export function RatingStars({ rating, size = 16, showText = true }: RatingStarsProps) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => {
          const isFull = i < fullStars;
          const isHalf = i === fullStars && hasHalfStar;

          return (
            <div key={i} className="relative">
              <Star
                size={size}
                className="text-gray-300"
                fill="currentColor"
              />
              {(isFull || isHalf) && (
                <div
                  className="absolute top-0 left-0 overflow-hidden"
                  style={{ width: isFull ? "100%" : "50%" }}
                >
                  <Star
                    size={size}
                    className="text-yellow-400"
                    fill="currentColor"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
      {showText && (
        <span className="text-sm font-semibold text-gray-700">
          {rating.toFixed(1)} / 5
        </span>
      )}
    </div>
  );
}

interface AverageRatingProps {
  average: number;
  count: number;
}

export function AverageRating({ average, count }: AverageRatingProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="text-center">
        <div className="text-3xl font-bold text-gray-900">{average.toFixed(1)}</div>
        <div className="text-sm text-gray-600">{count} reviews</div>
      </div>
      <RatingStars rating={average} size={24} showText={false} />
    </div>
  );
}
