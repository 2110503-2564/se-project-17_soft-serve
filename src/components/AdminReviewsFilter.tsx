'use client'
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Autocomplete from "@mui/material/Autocomplete";
import getRestaurants from "@/libs/getRestaurants";

export default function AdminReviewsFilter() {
  const [restaurantNames, setRestaurantNames] = useState<string[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState("");
  const [minRating, setMinRating] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Set initial values from URL params
    const restaurantParam = searchParams.get('restaurant') || "";
    const ratingParam = searchParams.get('rating') || "";
    
    setSelectedRestaurant(restaurantParam);
    setMinRating(ratingParam);
    
    // Fetch restaurants for filter
    const fetchRestaurants = async () => {
      const restaurantJson = await getRestaurants();
      const names = restaurantJson.data.map((restaurant: any) => restaurant.name);
      const sortedNames = names.sort((a: string, b: string) => a.localeCompare(b));
      setRestaurantNames(sortedNames);
    };
    fetchRestaurants();
  }, [searchParams]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (selectedRestaurant) params.set('restaurant', selectedRestaurant);
    if (minRating) params.set('rating', minRating);
    router.push(`/admin/reviews?${params.toString()}`);
  };

  const handleClearFilters = () => {
    setSelectedRestaurant("");
    setMinRating("");
    router.push('/admin/reviews');
  };

  return (
    <main>
      <div className="flex flex-center p-5 w-[90vw] mt-10 h-fit rounded-lg shadow-lg bg-white mx-auto px-5">
        <Stack spacing={2} sx={{ width: "100%" }}>
          <div className="flex items-center">
            <label className="w-28 mr-5 font-medium text-black">Restaurant</label>
            <Autocomplete
              freeSolo
              options={restaurantNames}
              value={selectedRestaurant}
              onChange={(_, value) => setSelectedRestaurant(value || "")}
              renderInput={(params) => (
                <TextField {...params} placeholder="All restaurants" />
              )}
              sx={{ flex: 1 }}
            />
          </div>
          <div className="flex items-center">
            <label className="w-28 mr-5 font-medium text-black">Rating</label>
            <TextField
              select
              value={minRating}
              onChange={(e) => setMinRating(e.target.value)}
              SelectProps={{
                native: true,
              }}
              sx={{ flex: 1 }}
            >
              <option value="">All ratings</option>
              <option value="1">1 star & above</option>
              <option value="2">2 stars & above</option>
              <option value="3">3 stars & above</option>
              <option value="4">4 stars & above</option>
              <option value="5">5 stars only</option>
            </TextField>
          </div>
          <div className="flex gap-4">
            <button
              onClick={handleSearch}
              className="bg-[#D40303] text-white font-bold py-2 px-4 rounded shadow-lg hover:bg-red-700"
            >
              Filter Reviews
            </button>
            <button
              onClick={handleClearFilters}
              className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded shadow-lg hover:bg-gray-300"
            >
              Clear Filters
            </button>
          </div>
        </Stack>
      </div>
    </main>
  );
}