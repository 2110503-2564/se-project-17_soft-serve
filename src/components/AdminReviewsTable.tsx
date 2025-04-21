'use client'
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import StarRating from '@/components/StarRating';
import Loader from './Loader';

interface Review {
  _id: string;
  rating: number;
  review: string;
  customerId: {
    _id: string;
    name: string;
  };
  restaurantId: {
    _id: string;
    name: string;
    province: string;
    imgPath: string;
  };
  createdAt: string;
}

export default function AdminReviewsTable() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const { data: session } = useSession();

  useEffect(() => {
    const fetchReviews = async () => {
      if (!session?.user?.token) return;

      try {
        setLoading(true);

        const restaurantParam = searchParams.get('restaurant');
        const ratingParam = searchParams.get('rating');

        let apiUrl = `${process.env.BACKEND_URL}api/v1/reviews`;

        if (restaurantParam) {
          const restaurantsRes = await fetch(`${process.env.BACKEND_URL}api/v1/restaurants?name=${encodeURIComponent(restaurantParam)}`, {
            headers: {
              Authorization: `Bearer ${session.user.token}`,
            },
          });

          const restaurantsData = await restaurantsRes.json();

          if (restaurantsData.success && restaurantsData.data.length > 0) {
            apiUrl = `${process.env.BACKEND_URL}api/v1/restaurants/${restaurantsData.data[0]._id}/reviews`;
          }
        }

        const response = await fetch(apiUrl, {
          headers: {
            Authorization: `Bearer ${session.user.token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch reviews');
        }

        let filteredReviews = data.data;

        if (ratingParam) {
          const minRating = parseInt(ratingParam);
          filteredReviews = filteredReviews.filter(
            (review: Review) => review.rating >= minRating
          );
        }

        setReviews(filteredReviews);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [searchParams, session]);

  const handleDeleteReview = async (reviewId: string) => {
    if (!session?.user?.token) return;

    if (confirm('Are you sure you want to delete this review?')) {
      try {
        const response = await fetch(`${process.env.BACKEND_URL}api/v1/reviews/${reviewId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${session.user.token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to delete review');
        }

        setReviews(prevReviews => prevReviews.filter(review => review._id !== reviewId));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete review');
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  if (loading) return <Loader loadingtext='Loading Reviews...'/>;

  if (error) return <div className="bg-red-100 p-4 text-red-700 rounded mt-5">{error}</div>;

  return (
    <div className="flex flex-center p-5 w-[90vw] mt-10 h-fit rounded-lg shadow-lg bg-white mx-auto px-5">
      <div className="w-full">
        <h2 className="text-xl font-semibold mb-4 text-black">
          {reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'} Found
        </h2>

        {reviews.length === 0 ? (
          <div className="text-center py-10 text-black">No reviews found.</div>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div
                key={review._id}
                className="w-full bg-white border border-gray-300 py-4 px-6 rounded-md shadow-sm"
              >
                <div className="flex items-center">
                  {/* Left Column - Review Info (centered) */}
                  <div className="w-48 flex flex-col justify-center items-center text-center mr-5">
                    <div className="text-lg font-semibold text-black mb-1">
                      {review.restaurantId.name}
                    </div>
                    <div className="text-sm text-gray-700 mb-1">
                      Customer: {review.customerId?.name || 'Unknown Customer'}
                    </div>
                    <StarRating rating={review.rating} showRatingNumber={false}/>
                    <div className="text-xs text-gray-600 mt-1">
                      {formatDate(review.createdAt)}
                    </div>
                  </div>

                  {/* Middle Column - Review Text */}
                  <div className="flex-1 px-4">
                    <p className="text-gray-800">{review.review}</p>
                  </div>

                  {/* Right Column - Delete Button */}
                  <div className="ml-2 flex items-center">
                    <button
                      onClick={() => handleDeleteReview(review._id)}
                      className="bg-red-600 text-white font-medium py-2 px-4 rounded-md hover:bg-red-700"
                    >
                      delete
                    </button>
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
