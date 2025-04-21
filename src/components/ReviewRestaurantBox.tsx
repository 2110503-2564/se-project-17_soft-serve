'use client'
import { StarIcon } from '@heroicons/react/20/solid'
import React from "react";
import Box from '@mui/material/Box';
import { useParams } from "next/navigation";
import TotalRate from '@/components/OverallRating';
import Link from "next/link";

export default function ReviewRestaurantBox({
  restaurantDetail,
}: {
  restaurantDetail: any;
}) {
  const { rid } = useParams();

  if (!restaurantDetail) return null;

  return (
    <Box
      component="div"
      sx={{ '& .MuiTextField-root': { m: 2, width: 'full' } }}
      className='border border-gray-300 py-2 px-10 rounded-xl items-center'
    >
        <div className="text-[26px] font-bold">Reviews & Ratings</div>

        <div className="flex flex-row items-center">
        <Box
        component="div"
        sx={{ '& .MuiTextField-root': { m: 2, width: '50ch' } }}
        className="flex flex-col w-[400px] py-2 px-10 mt-3 space-y-2">
            <div className="flex flex-col items-center">
            <div className="text-5xl font-bold">
                {restaurantDetail.data.ratingrating}
            </div>
            <h2 className="text-sm font-normal mb-4 text-gray-500 ">
            {restaurantDetail.data.reviewCount} Ratings
            </h2>
            <Link href={`/rating/${rid}/view`}>
                <button className='bg-white border border-[#00C642] text-[#00C642] text-sm font-semibold py-2 px-10 rounded-xl shadow-sm hover:bg-[#00C642] hover:text-white'>
                    View more reviews
                </button>
            </Link>
            </div>  
        </Box>

        <Box
        component="div"
        sx={{ '& .MuiTextField-root': { m: 2, width: '50ch' } }}
        className="flex flex-col py-2 px-10 mt-3 space-y-2">
            
            <div className="mt-4 space-y-3">
            {[5, 4, 3, 2, 1].map((star) => {
                const count = restaurantDetail.data.starCount?.[star] || 0;
                const total = restaurantDetail.data.reviewCount || 1;
                const percent = (count / total) * 100;

                return (
                <div key={star} className="flex items-center gap-4">
                    {/* Star Icons (Always show 5 stars, some grayed out) */}
                    <div className="flex w-[700px] justify-end mx-3">
                    {[...Array(5)].map((_, i) => (
                        <StarIcon
                        key={i}
                        className={`h-10 w-10 ${
                            i < star ? "text-yellow-400" : "text-gray-300"
                        }`}
                        />
                    ))}
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                        className="bg-yellow-400 h-3 rounded-full transition-all duration-300"
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
