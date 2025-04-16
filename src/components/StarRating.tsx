interface StarRatingProps {
  rating: number;
  maxStars?: number;
  showRatingNumber?: boolean;
}

export default function StarRating({ rating, maxStars = 5, showRatingNumber = true }: StarRatingProps) {
  return (
    <div className="flex items-center">
      {[...Array(maxStars)].map((_, i) => (
        <span key={i} className="text-xl">
          {i < Math.floor(rating) ? (
            <span className="text-yellow-400">★</span>
          ) : i < rating ? (
            <span className="text-yellow-400">☆</span>
          ) : (
            <span className="text-gray-300">☆</span>
          )}
        </span>
      ))}
      {showRatingNumber && (
        <span className="ml-1 text-sm text-gray-600">({rating.toFixed(1)})</span>
      )}
    </div>
  );
}
