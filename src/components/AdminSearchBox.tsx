'use client'
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Autocomplete from "@mui/material/Autocomplete";
import getRestaurants from "@/libs/getRestaurants";

export default function AdminSearchBox() {
  const [restaurantNames, setRestaurantNames] = useState<string[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchRestaurants = async () => {
      const restaurantJson = await getRestaurants();
      const names = restaurantJson.data.map((restaurant: any) => restaurant.name);
      const sortedNames = names.sort((a: string, b: string) => a.localeCompare(b));
      setRestaurantNames(sortedNames);
    };
    fetchRestaurants();
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (selectedRestaurant) params.set('restaurant', selectedRestaurant);
    if (selectedDate) params.set('date', selectedDate);
    router.push(`/admin?${params.toString()}`);
  };

  return (
    <main>
      <div className="flex flex-center p-5 w-[90vw] mt-10 h-fit rounded-lg shadow-lg bg-white mx-auto px-5">
        <Stack spacing={2} sx={{ width: "100%" }}>
          <div className="flex items-center">
            <label className="w-28 mr-5 font-medium">Restaurant Name</label>
            <Autocomplete
              freeSolo
              options={restaurantNames}
              value={selectedRestaurant}
              onChange={(_, value) => setSelectedRestaurant(value || "")}
              renderInput={(params) => (
                <TextField {...params} required />
              )}
              sx={{ flex: 1 }}
            />
          </div>
          <div className="flex items-center">
            <label className="w-28 mr-5 font-medium">Date</label>
            <TextField
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ flex: 1 }}
              required
            />
          </div>
          <button
            onClick={handleSearch}
            className="bg-[#D40303] text-white font-bold py-2 px-4 rounded shadow-lg hover:bg-red-700"
          >
            Search
          </button>
        </Stack>
      </div>
    </main>
  );
}
