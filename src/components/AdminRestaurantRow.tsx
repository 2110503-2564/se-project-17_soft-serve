'use client'
import { RestaurantItem } from "../../interfaces";
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation'
import { useState } from "react";
import deleteRestaurant from "@/libs/deleteRestaurant";

export default function AdminRestaurantRow({restaurantItem}: {restaurantItem: RestaurantItem}) {
    const { data: session } = useSession();
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);

    if(isDeleting) return null;

    const handleEditReservation = async () => {
        if (!session || !session.user.token) return;
        try {
            router.push(`/restaurants/edit/${restaurantItem.id}`);
        } catch (error) {
            console.error('Failed to edit restaurant:', error);
        }
    }

    const handleVerifyReservation = () => {
        router.push('/admin/verify');
      };
    
    const handleCancelReservation = async () => {
        const confirmed = window.confirm("Are you sure you want to DELETE the restaurant?");
        if (!confirmed) return;

        if (!session || !session.user.token) return;
        setIsDeleting(true);
        try {
            await deleteRestaurant({ restaurantId: restaurantItem.id, token: session.user.token });
            router.refresh();
        } catch (error) {
            console.error('Failed to delete restaurant:', error);
        }
    }
    
    const statusColor = restaurantItem.verified === true ? 'text-[#009900]' :
        (restaurantItem.verified === false ? 'text-[#FF3300]' : 'text-gray-800');
    
    return (
        <tr key={restaurantItem.id} className="border-t border-gray-300">
            <td className={`border border-gray-300 px-4 py-2 text-center font-medium ${statusColor}`}>{restaurantItem.verified ? 'Approved' : 'Pending'}</td>
            <td className="border border-gray-300 px-2 py-2 text-gray-800 text-center">{restaurantItem.id}</td>
            <td className="border border-gray-300 px-10 py-2 text-gray-800">{restaurantItem.name}</td>
            <td className="border border-gray-300 px-8 py-2 text-gray-800">{restaurantItem.tel}</td>
            <td className="border border-gray-300 px-4 py-2 text-gray-800 text-center">
                {restaurantItem.verified === true ? (
                <button className="bg-[#838383] w-[100px] text-white font-semibold py-2 px-4 rounded-lg shadow-sm hover:bg-[#707070]"
                    onClick={handleEditReservation}>
                    Edit
                </button>
                ) : (
                <button className="bg-[#00C642] w-[100px] text-white font-semibold py-2 px-4 rounded-lg shadow-sm hover:bg-[#7AF1A2]"
                    onClick={handleVerifyReservation}>
                    Verify
                </button>
                )}
            </td>
            <td className="border border-gray-300 px-4 py-2 text-gray-800 text-center">
                {restaurantItem.verified === true && (
                <button className="bg-myred w-[100px] text-white font-semibold py-2 px-4 rounded-lg shadow-sm hover:bg-[#F97F7F]"
                    onClick={handleCancelReservation}>
                    Delete
                </button>
                )}
            </td>
        </tr>
    );
}