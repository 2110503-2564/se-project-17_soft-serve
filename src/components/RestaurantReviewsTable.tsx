'use client';
import { useState, useCallback, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import StarRating from '@/components/StarRating';
import { ReviewJson, ReviewItem } from '../../interfaces';
import getReviewOneRestaurant from '@/libs/getReviewsOneRestaurant';

export default function RestaurantReviewsTable({ restaurantId ,reviewJson}: { restaurantId: string ,reviewJson: ReviewJson }) {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();

  // Callback to fetch reviews based on session and search parameters
  const fetchReviews = useCallback(async () => {
    if (status === 'loading' || !session?.user?.token) {
      return; // Skip fetching while session is loading or if there's no session token
    }

    try {
      setLoading(true);
      const ratingParam = searchParams.get('rating');
      

      let filteredReviews = reviewJson.data;
      if (ratingParam) {
        const minRating = parseInt(ratingParam);
        filteredReviews = filteredReviews.filter(
          (review: ReviewItem) => review.rating >= minRating
        );
      }

      setReviews(filteredReviews);
    } catch (err) {
      setError(err instanceof Error ? `Failed to fetch reviews: ${err.message}` : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [session, status, searchParams, restaurantId]);

  // Memoize the loading and error states to avoid unnecessary re-renders
  const isLoadingOrError = useMemo(() => loading || error, [loading, error]);

  // Automatically call fetchReviews when session and searchParams change
  const checkSessionAndFetchReviews = useMemo(() => {
    fetchReviews(); // We call the fetch function when session and searchParams change
  }, [fetchReviews, session, searchParams]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (status === 'loading') {
    return <div className="flex justify-center p-10">Loading session...</div>;
  }

  if (isLoadingOrError) {
    return <div className="flex justify-center p-10">{loading ? 'Loading reviews...' : error}</div>;
  }

  return (
    <div className="flex flex-center p-5 w-[90vw] mt-10 h-fit rounded-lg shadow-lg bg-white mx-auto px-5">
      <div className="w-full">
        <h2 className="text-xl font-semibold mb-4 text-black">
          {reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'} Found
        </h2>

        {reviews.length === 0 ? (
          <div className="text-center py-10 text-black">
            No reviews found. <br /> Be the first to leave a review!
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review._id} className="border rounded-lg p-4 shadow-sm">
                <div className="mt-3">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-black">Customer Name:</p>
                    <span className="text-black">{review.customerId?.name || 'Unknown Customer'}</span>
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    <StarRating rating={review.rating} />
                    <span className="text-black text-sm">{formatDate(review.createdAt)}</span>
                  </div>

                  <p className="mt-3 text-black">{review.review}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
