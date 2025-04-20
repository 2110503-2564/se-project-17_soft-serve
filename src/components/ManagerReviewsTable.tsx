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

export default function ManagerReviewsTable() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [restaurantDetails, setRestaurantDetails] = useState<{name: string, province: string} | null>(null);
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  
  useEffect(() => {
    const fetchReviews = async () => {
      if (!session?.user?.token) return;
      
      try {
        setLoading(true);
        const ratingParam = searchParams.get('rating');
        const fromDateParam = searchParams.get('from');
        const toDateParam = searchParams.get('to');
        

        const apiUrl = `${process.env.BACKEND_URL}api/v1/reviews`;
        
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
        
        if (fromDateParam) {
          const fromDate = new Date(fromDateParam);
          filteredReviews = filteredReviews.filter(
            (review: Review) => new Date(review.createdAt) >= fromDate
          );
        }
        
        if (toDateParam) {
          const toDate = new Date(toDateParam);
          toDate.setHours(23, 59, 59, 999);
          filteredReviews = filteredReviews.filter(
            (review: Review) => new Date(review.createdAt) <= toDate
          );
        }
        
        if (filteredReviews.length > 0 && filteredReviews[0].restaurantId) {
          setRestaurantDetails({
            name: filteredReviews[0].restaurantId.name,
            province: filteredReviews[0].restaurantId.province
          });
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
  
  if (loading) return <Loader loadingtext="Loading Reviews..." />;
  
  if (error) return <div className="bg-red-100 p-4 text-red-700 rounded mt-5">{error}</div>;
  
  return (
    <div className="flex flex-center p-5 w-[90vw] mt-10 h-fit rounded-lg shadow-lg bg-white mx-auto px-5">
      <div className="w-full">
        {restaurantDetails && (
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-black">{restaurantDetails.name}</h2>
            <p className="text-black">{restaurantDetails.province}</p>
          </div>
        )}
        
        <h2 className="text-xl font-semibold mb-4 text-black">
          {reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'} Found
        </h2>
        
        {reviews.length === 0 ? (
          <div className="text-center py-10 text-black">No reviews found matching your criteria</div>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review._id} className="border rounded-lg p-4 shadow-sm">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <StarRating rating={review.rating} />
                    <span className="text-black text-sm">
                      {formatDate(review.createdAt)}
                    </span>
                  </div>
                </div>
                
                <div className="mt-3">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-black">Customer: </p>
                    <span className="text-black">{review.customerId?.name || 'Anonymous Customer'}</span>
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