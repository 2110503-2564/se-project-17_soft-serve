'use client'
import getRestaurants from "../../libs/getRestaurants";
import { RestaurantItem, RestaurantJson } from "../../../interfaces";
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import RestaurantListItem from "@/components/RestaurantListItem";
import SearchBox from "@/components/SearchRestaurantBox";
import Loader from "@/components/Loader";

export default function RestaurantList() {
    const searchParams = useSearchParams();
    const searchTerm = searchParams.get('restaurant');
    const [restaurants, setRestaurants] = useState<RestaurantItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    //pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        const fetchAndFilterRestaurants = async () => {
            setLoading(true);
            setError(null);
            try {
                const restaurantJson : RestaurantJson = await getRestaurants();
                let filteredRestaurants = restaurantJson.data;

                if (searchTerm) {
                    filteredRestaurants = filteredRestaurants.filter(restaurant =>
                        restaurant.name.toLowerCase().includes(searchTerm.toLowerCase())
                    );
                }
                // setRestaurants(filteredRestaurants);
                // Only include verified restaurants for pagination
                const verifiedRestaurants = filteredRestaurants.filter(r => r.verified);
                setRestaurants(verifiedRestaurants);
                setCurrentPage(1);
            } catch (err) {
                setError("Failed to load restaurant data");
            } finally {
                setLoading(false);
            }
        };
        fetchAndFilterRestaurants();
    }, [searchTerm]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentRestaurants = restaurants.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(restaurants.length / itemsPerPage);
    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
    };
    const handlePrev = () => {
        if (currentPage > 1) setCurrentPage(prev => prev - 1);
    };

    if (loading) {
        return <Loader loadingtext="Loading restaurants..." />;
    }
    if (error) {
        return <div className="m-5 text-lg text-medium">{error}</div>
    }

    return (
        <main>
            <div className="restaurant-header">
                <div className="w-full h-[90px] bg-[#D40303] flex items-center">
                    <div className="text-white font-bold font-inter text-[30px] mx-10">ร้านอาหารทั้งหมด</div>
                    <SearchBox/>
                </div>
            </div>

            {restaurants.length === 0 ? (
                <div className="text-center py-10 text-gray-800 text-lg">No restaurants found.</div>
            ) : (
            <>
                    <div className="restaurant-list mb-4">
                        {currentRestaurants.map((restaurantItem: RestaurantItem) => (
                            restaurantItem.verified ? (
                                <div key={restaurantItem.id}>
                                    <RestaurantListItem restaurantItem={restaurantItem} />
                                </div>
                            ) : null
                        ))}
                    </div>

                    <div className="flex justify-center mt-0 space-x-4">
                        <button
                            onClick={handlePrev}
                            disabled={currentPage === 1}
                            className="px-4 py-2 bg-gray-200 rounded border border-gray-200 hover:border-gray-400 disabled:opacity-50 "
                        >
                            Previous
                        </button>
                        <span className="flex items-center text-sm">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={handleNext}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 bg-gray-200 rounded border border-gray-200 hover:border-gray-400 disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </>
            )}
        </main>
    );
}