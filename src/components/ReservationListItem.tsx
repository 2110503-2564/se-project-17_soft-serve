'use client'
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react';
import { ReservationItem } from "../../interfaces";
import deleteReservation from "@/libs/deleteReservation";
import Loader from "@/components/Loader";

export default function ReservationListItem({ reservationItem, restaurantItem }: { reservationItem: ReservationItem, restaurantItem: { imgPath: string, name: string } }) {
    const { data: session } = useSession();
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);
    const [formattedDate, setFormattedDate] = useState('');
    const [formattedTime, setFormattedTime] = useState('');

    useEffect(() => {
        const date = new Date(reservationItem.revDate);
        setFormattedDate(date.toLocaleDateString('en-GB', {
            weekday: 'short',
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        }));

        setFormattedTime(date.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        }));
    }, [reservationItem.revDate]);

    const handleCancelReservation = async () => {
        if (!session || !session.user.token) return;
        setIsDeleting(true);
        try {
            await deleteReservation({ reservationId: reservationItem._id, token: session.user.token });
            router.refresh();
        } catch (error) {
            console.error('Failed to delete reservation:', error);
            alert(error);
        } finally {
            setIsDeleting(false);
        }
    }

    if (isDeleting) {
        return <Loader loadingtext="Cancleling ..." />;
    }

    return (
        <div className="mx-10 my-10 flex items-start transition-shadow duration-300 border-b border-gray-300 pb-10 text-gray-600">
            <div className="w-[200px] h-[200px] overflow-hidden rounded-xl shadow-lg hover:shadow-2xl">
                <Image className="object-cover w-full h-full"
                    src={restaurantItem.imgPath} alt="Restaurant Image" width={200} height={200} />
            </div>
            <div className="ml-10 font-bold font-inter text-[18px] flex flex-col justify-center">
                <div className="font-bold text-[36px] text-black">{restaurantItem.name}</div>
                <div className="text-gray-600 flex items-center">
                    <span>{formattedDate}</span>
                    <Image className="ml-5 mr-2" src="/icons/clock_icon.png" alt="Clock Icon" width={18} height={18} />
                    <span>{formattedTime}</span>
                </div>
                <div>{reservationItem.numberOfPeople} {reservationItem.numberOfPeople > 1 ? 'Guests' : 'Guest'}</div>
            </div>

            {
                new Date(reservationItem.revDate).getTime() - 3600000 > new Date().getTime() ?
                <div className="ml-auto flex flex-row space-x-4 self-end">
                    <Link href={`/reservations/edit/${reservationItem._id}`}>
                        <button className="w-[150px] bg-mygray text-white text-[22px] font-bold px-4 py-2 rounded-xl border border-whitehover:shadow-2xl hover:bg-white hover:text-mygray hover:border hover:border-mygray transition-all">
                            Edit
                        </button>
                    </Link>
                    <button onClick={handleCancelReservation}
                        className='w-[150px] bg-myred text-white text-[22px] font-bold px-4 py-2 rounded-xl border border-white hover:shadow-2xl hover:bg-white hover:text-myred hover:border hover:border-myred transition-all'>
                            Cancel
                    </button>
                </div> : null
            }
        </div>
    );
}