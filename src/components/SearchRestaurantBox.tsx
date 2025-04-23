'use client'
import { useEffect, useState, ChangeEvent, FocusEventHandler, KeyboardEventHandler } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import getRestaurants from "@/libs/getRestaurants";

export default function SearchBox() {
    const [restaurantNames, setRestaurantNames] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        // Set initial values from URL params
        const restaurantParam = searchParams.get('restaurant') || "";
        setSearchTerm(restaurantParam);

        // Fetch restaurants for autocomplete options
        const fetchRestaurants = async () => {
            const restaurantJson = await getRestaurants();
            const names = restaurantJson.data.map((restaurant: any) => restaurant.name);
            const sortedNames = names.sort((a: string, b: string) => a.localeCompare(b));
            setRestaurantNames(sortedNames);
        };
        fetchRestaurants();
    }, []);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchTerm(value);
        const newFilteredSuggestions = restaurantNames.filter(name =>
            name.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredSuggestions(newFilteredSuggestions);
        setShowSuggestions(true);
    };

    const handleSuggestionClick = (suggestion: string) => {
        setSearchTerm(suggestion);
        setShowSuggestions(false);
    };

    const handleBlur: FocusEventHandler<HTMLInputElement> = () => {
        // Delay เล็กน้อยเพื่อให้แน่ใจว่า onClick ของ suggestion ทำงานก่อน blur
        setTimeout(() => {
            setShowSuggestions(false);
        }, 100);
    };

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (searchTerm) {
          params.set('restaurant', searchTerm);
        } else {
          params.delete('restaurant'); // ลบ parameter ถ้าไม่มีคำค้นหา
        }
        router.push(`/restaurants?${params.toString()}`);
    }

    const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <main className="flex-grow flex justify-end mx-10">
            <div className="relative flex-row w-[25%] flex items-center">
                <input
                    className="bg-white rounded-lg w-full py-2 px-3"
                    type="text"
                    placeholder="Restaurant Name"
                    value={searchTerm}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                />
                {showSuggestions && filteredSuggestions.length > 0 && (
                    <ul className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-md shadow-md z-10 mt-1">
                        {filteredSuggestions.map((suggestion, index) => (
                            <li
                                key={index}
                                className="py-2 px-3 cursor-pointer hover:bg-gray-100"
                                onClick={() => handleSuggestionClick(suggestion)}
                            >
                                {suggestion}
                            </li>
                        ))}
                    </ul>
                )}
                <MagnifyingGlassIcon onClick={handleSearch}
                    className="text-gray-500 dark:text-gray-400 right-2 top-1/2 h-5 w-5 ml-2 cursor-pointer transform -translate-y-1/2 absolute" />
            </div>
        </main>
    );
}