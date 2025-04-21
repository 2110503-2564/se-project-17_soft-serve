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
      sx={{ '& .MuiTextField-root': { m: 2, width: '50ch' } }}
      className='border border-gray-300 py-2 px-10 rounded-xl'
    >
      <div className="text-[26px] font-bold">Reviews & Ratings</div>

      <div className="flex flex-col mt-3 space-y-2">
        <div className="flex flex-col items-center ">
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

        
      </div>
    </Box>
  );
}
