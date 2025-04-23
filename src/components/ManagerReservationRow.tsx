'use client'
import { ReservationItem } from "../../interfaces";
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation'
import { useState } from "react";
import deleteReservation from "@/libs/deleteReservation";

export default function ManagerReservationRow({reservationItem} : {reservationItem : ReservationItem}) {
    
    const reservationDate = new Date(reservationItem.revDate);
    const { data: session } = useSession();
    const router = useRouter();        

    return (
        <tr key={reservationItem._id} className="border-t border-gray-300">
            <td className="border border-gray-300 px-4 py-2">
                {typeof reservationItem.user === 'object' && reservationItem.user !== null && 'name' in reservationItem.user
                    ? (reservationItem.user as { name: string }).name
                : reservationItem.user}
            </td>

            <td className="border border-gray-300 px-4 py-2 text-center">{reservationItem.numberOfPeople}</td>
            <td className="border border-gray-300 px-4 py-2">
                {reservationDate.toLocaleDateString('en-GB')}
            </td>
            <td className="border border-gray-300 px-4 py-2 text-center">
                {reservationDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </td>
        </tr>
    );
}
