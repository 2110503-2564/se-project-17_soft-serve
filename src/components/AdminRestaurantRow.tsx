'use client'
// import Link from "next/link";
// import { RestaurantItem } from "../../interfaces";
// import { useSession } from "next-auth/react";
// import { useRouter } from 'next/navigation'
// import { useState } from "react";
// import deleteRestaurant from "@/libs/deleteRestaurant";

// Mock Data
interface RestaurantItem {
    mid: string; // manager id
    status: 'pending' | 'approved';
    name: string;
    email: string;
}

interface AdminRowProps {
    restaurantItem: RestaurantItem;
}

export default function AdminRestaurantRow({ restaurantItem }: AdminRowProps) {
    
    /*const reservationDate = new Date(reservationItem.revDate);
    
    const { data: session } = useSession();
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);

    if(isDeleting) return null;
    
    const handleCancelReservation = async () => {
        if (!session || !session.user.token) return;
        setIsDeleting(true);
        try {
            await //deleteReservation({ reservationId: reservationItem._id, token: session.user.token });
            router.refresh();
        } catch (error) {
            console.error('Failed to delete reservation:', error);
        }
    }*/

    // Mock Data
    const mockRestaurant = [
        {mid: "001", status: "approved", name: "Hotpot Man", email: "res1@gmail.com"},
        {mid: "002", status: "pending", name: "Gan Mala", email: "res2@gmail.com"}
    ]
    
    const statusColor = restaurantItem.status === 'pending' ? 'text-orange-600' :
        (restaurantItem.status === 'approved' ? 'text-green-600' : 'text-gray-800');
    
    return (
        <tr key={restaurantItem.mid} className="border-t border-gray-300">
            <td className="border border-gray-300 px-2 py-2 text-gray-800 text-center">{restaurantItem.mid}</td>
            <td className={`border border-gray-300 px-4 py-2 text-gray-800 text-center font-medium ${statusColor}`}>{restaurantItem.status}</td>
            <td className="border border-gray-300 px-10 py-2 text-gray-800">{restaurantItem.name}</td>
            <td className="border border-gray-300 px-8 py-2 text-gray-800">{restaurantItem.email}</td>
            <td className="border border-gray-300 px-4 py-2 text-gray-800 text-center">
                <button className="bg-[#838383] w-[100px] text-white font-bold py-2 px-4 rounded shadow-lg hover:bg-[#707070]">
                    View
                </button>
            </td>
            <td className="border border-gray-300 px-4 py-2 text-gray-800 text-center">
                {restaurantItem.status !== 'pending' && (
                <button className="bg-myred w-[100px] text-white font-bold py-2 px-4 rounded shadow-lg hover:bg-red-700">
                    Delete
                </button>
                )}
            
            </td>
        </tr>
    );
}