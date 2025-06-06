'use client';
import { useEffect, useState, KeyboardEventHandler } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Autocomplete from "@mui/material/Autocomplete";
import getRestaurants from "@/libs/getRestaurants";

export default function AdminSearchBox({ token }: { token: string }) {
    const router = useRouter();
    const [restaurantNames, setRestaurantNames] = useState<string[]>([]);
    const [selectedRestaurant, setSelectedRestaurant] = useState("");
    const [selectedStatus, setSelectedStatus] = useState(""); // "Approved" | "Pending" | ""
    const searchParams = useSearchParams();
    
    useEffect(() => {
        // Set initial values from URL params
        const restaurantParam = searchParams.get('restaurant') || "";
        setSelectedRestaurant(restaurantParam);

        const statusParam = searchParams.get('status') || "";
        const statusDisplay = statusParam === "true" ? "Approved" :
                              statusParam === "false" ? "Pending" : "";
        setSelectedStatus(statusDisplay);

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

        if (selectedStatus) {
            const statusValue = selectedStatus === "Approved" ? "true" :
                                selectedStatus === "Pending" ? "false" : "";
            if (statusValue) params.set('status', statusValue);
        }

        router.push(`/admin/restaurants?${params.toString()}`);
    };

    const handleClearFilters = () => {
        setSelectedRestaurant("");
        setSelectedStatus(""); // Clear status filter
        router.push('/admin/restaurants');
    };

    const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <main className="flex flex-center p-5 w-[90vw] mt-10 h-fit rounded-lg shadow-lg bg-white mx-auto px-6 py-6">
            <Stack spacing={2} sx={{ width: "100%" }}>
                <div className="flex items-center">
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
                <div className="flex items-center">
                    <label className="w-40 mr-5 font-semibold text-gray-800">
                        Status
                    </label>
                    <Autocomplete
                        freeSolo
                        options={["Approved", "Pending"]}
                        value={selectedStatus}
                        onChange={(_, value) => setSelectedStatus(value || "")}
                        renderInput={(params) => (
                            <TextField {...params} placeholder="All status" onKeyDown={handleKeyDown}/>
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
                <div className="flex gap-4">
                    <button
                        onClick={handleSearch}
                        className="bg-myred w-[100px] h-[45px] text-white font-semibold py-2 px-4 rounded-lg shadow-sm hover:shadow-2xl hover:bg-white hover:text-myred hover:border hover:border-myred"
                    >
                        Search
                    </button>
                    <button
                        onClick={handleClearFilters}
                        className="bg-gray-200 w-[100px] h-[45px] text-gray-800 font-semibold py-2 px-4 rounded-lg shadow-sm hover:shadow-2xl hover:bg-white hover:text-gray-800 hover:border hover:border-mygray"
                    >
                        Clear
                    </button>
                </div>
            </Stack>
        </main>
    );
}
