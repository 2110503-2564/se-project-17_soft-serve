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
    const searchTerm = searchParams.get('restaurant'); // ดึงค่า parameter 'restaurant' จาก URL
    const [restaurants, setRestaurants] = useState<RestaurantItem[]>([]); // กำหนด Type ให้ State restaurants
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAndFilterRestaurants = async () => {
            setLoading(true);
            setError(null);
            try {
                const restaurantJson : RestaurantJson = await getRestaurants();
                let filteredRestaurants = restaurantJson.data;

                // กรองร้านอาหารถ้ามี searchTerm ใน URL
                if (searchTerm) {
                    filteredRestaurants = filteredRestaurants.filter(restaurant =>
                        restaurant.name.toLowerCase().includes(searchTerm.toLowerCase())
                    );
                }
                setRestaurants(filteredRestaurants);
            } catch (err) {
                setError("Failed to load restaurant data");
            } finally {
                setLoading(false);
            }
        };
        fetchAndFilterRestaurants();
    }, [searchTerm]); // useEffect จะทำงานใหม่เมื่อ searchTerm เปลี่ยนแปลง

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
            <div className="restaurant-list">
                {
                    restaurants.map((restaurantItem : RestaurantItem) => ( // เปลี่ยนจาก restaurantJson.data เป็น restaurants
                        restaurantItem.verified ? (
                            <div key={restaurantItem.id}>
                                <RestaurantListItem restaurantItem={restaurantItem}/>
                            </div>
                        ) : null
                    ))
                }
            </div>
            )}
        </main>
    );
}