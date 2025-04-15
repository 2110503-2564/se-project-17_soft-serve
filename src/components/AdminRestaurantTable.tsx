'use client';
import { useEffect, useState } from 'react';
import AdminRow from './AdminRestaurantRow';
import { RestaurantItem, RestaurantJson } from "../../interfaces";
import getRestaurants from '@/libs/getRestaurants';

export default function AdminRestaurantTable() {
    const [restaurants, setRestaurants] = useState<RestaurantItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRestaurantsData = async () => {
            setIsLoading(true);
            try {
                const restaurantJson: RestaurantJson = await getRestaurants();
                if (restaurantJson.success && restaurantJson.data) {
                    setRestaurants(restaurantJson.data);
                } else {
                    setError('Failed to fetch restaurants data.');
                }
            } catch (err: any) {
                setError(`Error fetching restaurants: ${err.message}`);
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchRestaurantsData();
    }, []);
    if (isLoading) {
        return <div className='text-lg text-white m-10'>Loading restaurants...</div>;
    }
    if (error) {
        return <div className='text-lg text-white m-10'>Error: {error}</div>;
    }

    return (
        <main>
            <div className="flex flex-center p-5 w-[90vw] mt-10 h-fit rounded-lg shadow-lg bg-white mx-auto px-6 py-6">
                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-100 text-gray-800">
                        <th className="border border-gray-300 px-4 py-2" style={{ width: '12%' }}>Manager Id</th>
                            <th className="border border-gray-300 px-4 py-2" style={{ width: '12%' }}>Status</th>
                            <th className="border border-gray-300 px-4 py-2" style={{ width: '18%' }}>Restaurant Name</th>
                            <th className="border border-gray-300 px-4 py-2" style={{ width: '18%' }}>Email</th>
                            <th className="border border-gray-300 px-4 py-2" style={{ width: '12%' }}>Edit</th>
                            <th className="border border-gray-300 px-4 py-2" style={{ width: '12%' }}>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {restaurants.map((restaurantItem: RestaurantItem) => {
                            return (
                                <AdminRow restaurantItem={restaurantItem} key={restaurantItem.id}/>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </main>
    );
}