'use client';
import { useEffect, useState, KeyboardEventHandler } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Autocomplete from "@mui/material/Autocomplete";
import getRestaurants from "@/libs/getRestaurants";

export default function AdminSearchBox({ token }: { token: string }) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [restaurantNames, setRestaurantNames] = useState<string[]>([]);
    const [selectedRestaurant, setSelectedRestaurant] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [seletedTime, setSelectedTime] = useState("");

    useEffect(() => {
        const restaurantParam = searchParams.get('restaurant') || "";
        const dateParam = searchParams.get('date') || "";
        const timeParam = searchParams.get('time') || "";
        setSelectedRestaurant(restaurantParam);
        setSelectedDate(dateParam);
        setSelectedTime(timeParam);

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
        if (selectedDate) params.set('date', selectedDate);
        if (seletedTime) params.set('time', seletedTime);
        router.push(`/admin/reservations?${params.toString()}`);
    };

    const handleClearFilters = () => {
        setSelectedRestaurant("");
        setSelectedDate("");
        setSelectedTime("");
        router.push('/admin/reservations');
    };

    const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (event) => {
        if (event.key === 'Enter') {
          handleSearch();
        }
      };

    return (
        <main className="flex flex-center p-5 w-[90vw] mt-10 h-fit rounded-lg shadow-lg bg-white mx-auto px-6 py-6">
            <Stack spacing={2} sx={{ width: "100%" }}>
                <div className="flex items-center mb-2">
                    <label className="w-40 mr-5 font-semibold text-gray-800">
                        Restaurant Name
                    </label>
                    <Autocomplete
                        freeSolo
                        options={restaurantNames}
                        value={selectedRestaurant}
                        onChange={(_, value) => setSelectedRestaurant(value || "")}
                        renderInput={(params) => (
                            <TextField {...params} placeholder="All restaurants" onKeyDown={handleKeyDown}/>
                        )}
                        sx={{
                            flex: 1,
                            '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'gray',
                            },
                            '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'red',
                            },
                        }}
                    />
                </div>

                <div className="flex items-center mb-2">
                    <label className="w-40 mr-5 font-semibold text-gray-800">
                        Reservation Date
                    </label>
                    <TextField
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        onKeyDown={handleKeyDown}
                        sx={{
                            flex: 1,
                            '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'gray',
                            },
                            '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'red',
                            },
                        }}
                        inputProps={{ max: "9999-12-31" }}
                    />
                </div>

                <div className="flex items-center mb-2">
                    <label className="w-40 mr-5 font-semibold text-gray-800">
                        Reservation Time
                    </label>
                    <TextField
                        type="time"
                        value={seletedTime}
                        onChange={(e) => setSelectedTime(e.target.value)}
                        onKeyDown={handleKeyDown}
                        sx={{
                            flex: 1,
                            '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'gray',
                            },
                            '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'red',
                            },
                        }}
                    />
                </div>

                <div className="flex gap-4 mt-2">
                    <button
                        onClick={handleSearch}
                        className="bg-[#D40303] text-white font-bold py-2 px-4 rounded shadow-lg hover:bg-red-700"
                    >
                        Search
                    </button>
                    <button
                        onClick={handleClearFilters}
                        className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded shadow-lg hover:bg-gray-300"
                    >
                        Clear
                    </button>
                </div>
            </Stack>
        </main>
    );
}
