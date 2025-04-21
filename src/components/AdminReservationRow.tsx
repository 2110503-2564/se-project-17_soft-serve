'use client'
import Link from "next/link";
import { ReservationItem } from "../../interfaces";
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation'
import { useState } from "react";
import deleteReservation from "@/libs/deleteReservation";

export default function AdminReservationRow({reservationItem} : {reservationItem : ReservationItem}) {
    
    const reservationDate = new Date(reservationItem.revDate);
    
    const { data: session } = useSession();
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);

    if(isDeleting) return null;
    
    const handleCancelReservation = async () => {
        if (!session || !session.user.token) return;
        setIsDeleting(true);
        try {
            await deleteReservation({ reservationId: reservationItem._id, token: session.user.token });
            router.refresh();
        } catch (error) {
            console.error('Failed to delete reservation:', error);
        }
    }
    
    return (
        <tr key={reservationItem._id} className="border-t border-gray-300">
            <td className="border border-gray-300 px-4 py-2">{reservationItem._id}</td>
            <td className="border border-gray-300 px-4 py-2">
                {reservationDate.toLocaleDateString('en-GB')}
            </td>
            <td className="border border-gray-300 px-4 py-2 text-center">{reservationDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
            <td className="border border-gray-300 px-4 py-2">{reservationItem.user}</td>
            <td className="border border-gray-300 px-4 py-2 text-center">{reservationItem.numberOfPeople}</td>
            <td className="border border-gray-300 px-4 py-2">{reservationItem.restaurant.name}</td> 
            <td className="border border-gray-300 px-4 py-2 text-center">
                <Link href={`/reservations/edit/${reservationItem._id}`} passHref>
                <button className="bg-green-600 text-white font-bold py-2 px-4 rounded shadow-lg hover:bg-green-700">Edit</button>
                </Link>
            </td>
            <td className="border border-gray-300 px-4 py-2 text-center">
                <button onClick={handleCancelReservation} className="bg-[#D40303] text-white font-bold py-2 px-4 rounded shadow-lg hover:bg-red-700">Cancle</button>
            </td>
        </tr>
    );
}
