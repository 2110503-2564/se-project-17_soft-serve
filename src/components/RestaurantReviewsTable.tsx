'use client';
import { useState, useCallback, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import StarRating from '@/components/StarRating';
import { ReviewJson, ReviewItem } from '../../interfaces';
import { useEffect } from 'react';
import getReviewOneRestaurant from '@/libs/getReviewsOneRestaurant';

export default function RestaurantReviewsTable({ restaurantId}: { restaurantId: string}) {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();

  useEffect(() => {
    console.log("Session status:", status); // Add status check to log if session is loading
    if (status === 'loading') {
      // If session is loading, don't fetch the reviews yet
      console.log("Session is loading...");
      return;
    }

    // If session is not loading and has token, fetch reviews
    if (session?.user?.token) {
      console.log("Session available, fetching reviews...");
      const fetchReviews = async () => {
        try {
          setLoading(true);
          const ratingParam = searchParams.get('rating');
          const data:ReviewJson = await getReviewOneRestaurant({
            restaurantId,
            token: session.user.token,
          });

          let filteredReviews = data.data;
          if(data){
            setReviews(data.data);
          }
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
      };

      fetchReviews();
    } else {
      console.log("No session token available.");
    }
  }, [searchParams, session, status, error]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (status === 'loading') {
    return <div className="flex justify-center p-10">Loading session...</div>;
  }

  if (loading) {
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
              <div key={review._id} className="border rounded-lg p-4 shadow-sm bg-white">
                <div className="flex mt-3">
                  {/* Left Column - Customer Info & Rating */}
                  <div className="w-48 flex flex-col justify-center items-center text-center mr-5">
                  <div className="text-lg font-semibold text-black mb-1">
                  Customer: {review.customerId?.name || 'Unknown Customer'}
                    </div>

                    <div className="mb-1">
                      <StarRating rating={review.rating} showRatingNumber={false} />
                    </div>
                    <div className="text-xs text-gray-600">
                      {formatDate(review.createdAt)}
                    </div>
                  </div>

                  {/* Middle Column - Review Text */}
                  <div className="flex-1 px-4">
                    <p className="text-gray-800">{review.review}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 