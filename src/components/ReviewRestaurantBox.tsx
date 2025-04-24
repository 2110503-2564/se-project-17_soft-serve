'use client'
import { StarIcon } from '@heroicons/react/20/solid';
import React, { useEffect, useState } from "react";
import Box from '@mui/material/Box';
import { useParams } from "next/navigation";
import Link from "next/link";
import getReviewOneRestaurant from '@/libs/getReviewsOneRestaurant';
import { ReviewJson } from '@../../../interfaces';
import { useSession } from 'next-auth/react';

export default function ReviewRestaurantBox({avgRating} : {avgRating : number}) {
  const { rid } = useParams();
  const { data: session, status } = useSession();

  const [reviewStats, setReviewStats] = useState<{
    rating: number;
    reviewCount: number;
    starCount: { [key: number]: number };
  } | null>(null);

  useEffect(() => {
    if (status === 'loading') return;

    const fetchReviewStats = async () => {
      try {
        if (!session?.user?.token) return;

        const reviews: ReviewJson = await getReviewOneRestaurant({
          restaurantId: rid as string,
          token: session.user.token,
        });

        const reviewCount = reviews.count;
        const starCount = reviews.starCount;

        setReviewStats({
          rating: avgRating,
          reviewCount,
          starCount
        });

      } catch (err) {
        console.error('Error fetching review stats:', err);
      }
    };

    fetchReviewStats();
  }, [rid, session, status]);

  if (!reviewStats) {
    return null;
  }

  return (
    <Box
      component="div"
      sx={{ '& .MuiTextField-root': { m: 2, width: 'full' } }}
      className='border border-gray-300 py-2 px-10 rounded-xl items-center'
    >
      <div className="text-[26px] font-bold pt-5">Reviews & Ratings</div>

      <div className="flex flex-row items-center">
        {/* Left: Average Score */}
        <Box
          component="div"
          className="flex flex-col w-[400px] pb-10 py-2 px-10 mt-3 space-y-2">
          <div className="flex flex-col items-center">
            <div className="text-5xl font-bold">
              {reviewStats.rating}
            </div>
            <h2 className="text-sm font-normal mb-4 text-gray-500 ">
              {reviewStats.reviewCount} Ratings
            </h2>
            <Link href={`/rating/${rid}/view`}>
              <button className='bg-white border border-[#00C642] text-[#00C642] text-md font-semibold py-2 px-10 rounded-xl shadow-sm hover:bg-[#00C642] hover:text-white'>
                View more reviews
              </button>
            </Link>
          </div>
        </Box>

        {/* Right: Bar Chart */}
        <Box
          component="div"
          className="flex flex-col pb-10 py-2 px-10 mt-3 space-y-2">
          <div className="space-y-3 pb-5">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = reviewStats.starCount?.[star] || 0;
              const total = reviewStats.reviewCount || 1;
              const percent = (count / total) * 100;

              return (
                <div key={star} className="flex items-center gap-4">
                  {/* Star Icons */}
                  <div className="flex w-[700px] justify-end mx-3">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon
                        key={i}
                        className={`h-10 w-10 pr-2 ${i < star ? "text-yellow-400" : "text-gray-300"}`}
                      />
                    ))}
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-[#00C642] h-3 rounded-full transition-all duration-300"
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  {/* Count */}
                  <span className="text-sm text-gray-600 w-[40px] text-right">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </Box>
      </div>
    </Box>
  );
}
