'use client'
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";

export default function ManagerReviewsFilter() {
  const [minRating, setMinRating] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  useState(() => {
    const ratingParam = searchParams.get('rating') || "";
    const fromParam = searchParams.get('from') || "";
    const toParam = searchParams.get('to') || "";
    
    setMinRating(ratingParam);
    setDateFrom(fromParam);
    setDateTo(toParam);
  });

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (minRating) params.set('rating', minRating);
    if (dateFrom) params.set('from', dateFrom);
    if (dateTo) params.set('to', dateTo);
    router.push(`/manager/reviews?${params.toString()}`);
  };

  const handleClearFilters = () => {
    setMinRating("");
    setDateFrom("");
    setDateTo("");
    router.push('/manager/reviews');
  };

  return (
    <main>
      <div className="flex flex-center p-5 w-[90vw] mt-10 h-fit rounded-lg shadow-lg bg-white mx-auto px-5">
        <Stack spacing={2} sx={{ width: "100%" }}>
          <div className="flex items-center">
            <label className="w-28 mr-5 font-medium text-black">Min Rating</label>
            <TextField
              select
              id="minRatingSelect"
              value={minRating}
              onChange={(e) => setMinRating(e.target.value)}
              SelectProps={{
                native: true,
              }}
              sx={{ flex: 1,
                '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'gray',
                },
                '& .MuiOutlinedInput-root:focus-within .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'red',
                },
              }}
            >
              <option value="">All ratings</option>
              <option value="1">1 star & above</option>
              <option value="2">2 stars & above</option>
              <option value="3">3 stars & above</option>
              <option value="4">4 stars & above</option>
              <option value="5">5 stars only</option>
            </TextField>
          </div>
          <div className="flex items-center">
            <label className="w-28 mr-5 font-medium text-black">From Date</label>
            <TextField
              type="date"
              id="dateFromInput"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              sx={{ flex: 1,
                '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'gray',
                },
                '& .MuiOutlinedInput-root:focus-within .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'red',
                },
              }}
            />
          </div>
          <div className="flex items-center">
            <label className="w-28 mr-5 font-medium text-black">To Date</label>
            <TextField
              type="date"
              id="dateToInput"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              sx={{ flex: 1,
                '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'gray',
                },
                '& .MuiOutlinedInput-root:focus-within .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'red',
                },
              }}
            />
          </div>
          <div className="flex gap-4">
            <button
              onClick={handleSearch}
              id="filter"
              className="bg-myred w-[150px] h-[45px] text-white font-semibold py-2 px-4 rounded-lg shadow-sm hover:shadow-2xl hover:bg-white hover:text-myred hover:border hover:border-myred"
            >
              Filter Reviews
            </button>
            <button
              onClick={handleClearFilters}
              id="clear"
              className="bg-gray-200 w-[150px] h-[45px] text-gray-800 font-semibold py-2 px-4 rounded-lg shadow-sm hover:shadow-2xl hover:bg-white hover:text-gray-800 hover:border hover:border-mygray"
            >
              Clear Filters
            </button>
          </div>
        </Stack>
      </div>
    </main>
  );
}