'use client'
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import StarRating from '@/components/StarRating';

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
interface RestaurantReviewsTableProps {
  restaurantId: string;
}

export default function RestaurantReviewsTable({ restaurantId }: RestaurantReviewsTableProps) {
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
        console.log("Restaurant Param:", restaurantParam);
        console.log("Rating Param:", ratingParam);

        let apiUrl = `${process.env.BACKEND_URL}api/v1/restaurants/${restaurantId}/reviews`;
        
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
        console.log("Fetched Data:", data);

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch reviews');
        }
        
        console.log("Fetched Reviews(data.data):", data.data);
        let filteredReviews = data.data;
        console.log("Fetched Reviews(filteredReviews):", filteredReviews);

        // Client-side filtering by minimum rating if needed
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
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };
  
  if (loading) return <div className="flex justify-center p-10">Loading reviews...</div>;
  
  if (error) return <div className="bg-red-100 p-4 text-red-700 rounded mt-5">{error}</div>;
  
  console.log("reviews.length ",reviews.length);
  return (
    <div className="flex flex-center p-5 w-[90vw] mt-10 h-fit rounded-lg shadow-lg bg-white mx-auto px-5">
      <div className="w-full">
        
        <h2 className="text-xl font-semibold mb-4 text-black">
          {reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'} Found
        </h2>
        
        {reviews.length === 0 ? (
          <div className="text-center py-10 text-black">No reviews found</div>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review._id} className="border rounded-lg p-4 shadow-sm">
                <div className="mt-3">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-black">Customer Name: </p>
                    <span className="text-black">{review.customerId?.name || 'Unknown Customer'}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-2">
                    <StarRating rating={review.rating} />
                    <span className="text-black text-sm">
                      {formatDate(review.createdAt)}
                    </span>
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