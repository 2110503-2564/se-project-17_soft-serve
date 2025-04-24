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
            <td className="border border-gray-300 px-4 py-2 text-center">
                {reservationDate.toLocaleDateString('en-GB', {timeZone:'UTC'})}
            </td>
            <td className="border border-gray-300 px-4 py-2 text-center">{reservationDate.toLocaleTimeString('en-GB', { timeZone: 'UTC', hour: '2-digit', minute: '2-digit' })}</td>
            <td className="border border-gray-300 px-4 py-2">{reservationItem.user}</td>
            <td className="border border-gray-300 px-4 py-2 text-center">{reservationItem.numberOfPeople}</td>
            <td className="border border-gray-300 px-4 py-2">{reservationItem.restaurant.name}</td> 
            <td className="border border-gray-300 px-4 py-2 text-center">
                <Link href={`/reservations/edit/${reservationItem._id}`} passHref>
                <button className="w-[90px] h-[40px] bg-mygray text-white font-bold py-2 px-4 rounded-xl shadow-lg hover:shadow-2xl hover:bg-white hover:text-mygray hover:border hover:border-mygray">Edit</button>
                </Link>
            </td>
            <td className="border border-gray-300 px-4 py-2 text-center">
                <button onClick={handleCancelReservation} className="w-[90px] h-[40px] bg-myred text-white font-bold py-2 px-4 rounded-xl shadow-lg hover:shadow-2xl hover:bg-white hover:text-myred hover:border hover:border-myred">Cancel</button>
            </td>
        </tr>
    );
}
