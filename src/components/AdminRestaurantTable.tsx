'use client';
import { useEffect, useState } from 'react';
import AdminRow from './AdminRestaurantRow';
import { RestaurantItem } from "../../interfaces";
import { useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function AdminRestaurantTable() {
    const [restaurants, setRestaurants] = useState<RestaurantItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const searchParams = useSearchParams();
    const { data: session, status } = useSession();

    useEffect(() => {
        const fetchRestaurantsData = async () => {
            if (status === "loading") return;
            if (!session?.user?.token) {
                setError("User not authenticated");
                setIsLoading(false);
                return;
            }
    
            try {
                setIsLoading(true);
                const apiUrl = `${process.env.BACKEND_URL}api/v1/restaurants`;
    
                const response = await fetch(apiUrl, {
                    headers: {
                        Authorization: `Bearer ${session.user.token}`,
                    },
                });
    
                const data = await response.json();
    
                if (!response.ok) {
                    throw new Error(data.message || 'Failed to fetch restaurants data.');
                }
    
                let formattedData = Array.isArray(data.data) ? data.data : [data.data];
    
                const restaurantParam = searchParams.get('restaurant');
                if (restaurantParam) {
                    formattedData = formattedData.filter((item: RestaurantItem) =>
                        item.name.toLowerCase().includes(restaurantParam.toLowerCase())
                    );
                }
    
                const statusParam = searchParams.get('status');
                if (statusParam) {
                    formattedData = formattedData.filter((item: RestaurantItem) =>
                        item.verified.toString() === statusParam // Use 'true'/'false' for Approved/Pending
                    );
                }
    
                setRestaurants(formattedData);
            } catch (err: any) {
                setError(`Error fetching restaurants: ${err.message}`);
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
    
        fetchRestaurantsData();
    }, [session, searchParams]);
    

    if (isLoading) {
        return <div className='text-lg text-white m-10'>Loading restaurants...</div>;
    }

    if (error) {
        return <div className='text-lg text-white m-10'>Error: {error}</div>;
    }

    return (
        <main>
            <div className="flex flex-center p-5 w-[90vw] mt-10 h-fit rounded-lg shadow-lg bg-white mx-auto px-6 py-6 overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 min-w-[600px]">
                    <thead>
                        <tr className="bg-gray-100 text-gray-800">
                            <th className="border border-gray-300 px-4 py-2" style={{ width: '12%' }}>Status</th>
                            <th className="border border-gray-300 px-4 py-2" style={{ width: '18%' }}>Restaurant Id</th>
                            <th className="border border-gray-300 px-4 py-2" style={{ width: '18%' }}>Restaurant Name</th>
                            <th className="border border-gray-300 px-4 py-2" style={{ width: '15%' }}>Tel</th>
                            <th className="border border-gray-300 px-4 py-2" style={{ width: '12%' }}>Edit / Verify</th>
                            <th className="border border-gray-300 px-4 py-2" style={{ width: '12%' }}>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {restaurants.length > 0 ? (
                            restaurants.map((restaurantItem: RestaurantItem) => (
                                <AdminRow restaurantItem={restaurantItem} key={restaurantItem._id || restaurantItem.name} />
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="text-center py-4">No restaurants found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </main>
    );
}
