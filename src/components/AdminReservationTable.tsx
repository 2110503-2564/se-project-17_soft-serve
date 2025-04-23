'use client';
import { useEffect, useState } from 'react';
import AdminRow from './AdminReservationRow';
import { ReservationItem } from "../../interfaces";
import { useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Loader from './Loader';

// Function to format the date for comparison
const formatDateForComparison = (date: Date) => {
    return date.toISOString().split('T')[0]; // Convert to YYYY-MM-DD
};

export default function AdminReservationTable() {
    const [reservations, setReservations] = useState<ReservationItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const searchParams = useSearchParams();
    const { data: session, status } = useSession();

    useEffect(() => {
        const fetchReservationsData = async () => {
            if (status === "loading") return;
            if (!session?.user?.token) {
                setError("User not authenticated");
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                const apiUrl = `${process.env.BACKEND_URL}api/v1/reservations`;

                const response = await fetch(apiUrl, {
                    headers: {
                        Authorization: `Bearer ${session.user.token}`,
                    },
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Failed to fetch reservations data.');
                }

                let formattedData = Array.isArray(data.data) ? data.data : [data.data];

                // Filter by restaurant
                const restaurantParam = searchParams.get('restaurant');
                if (restaurantParam) {
                    formattedData = formattedData.filter((item: ReservationItem) =>
                        item.restaurant.name.toLowerCase().includes(restaurantParam.toLowerCase())
                    );
                }

                // Filter by date
                const dateParam = searchParams.get('date');
                if (dateParam) {
                    formattedData = formattedData.filter((item: ReservationItem) => {
                        const formattedRevDate = formatDateForComparison(new Date(item.revDate)); // Convert revDate to YYYY-MM-DD
                        const formattedDateParam = dateParam.split('/').reverse().join('-'); // Convert input date (20/04/2025) to YYYY-MM-DD
                        return formattedRevDate === formattedDateParam; // Compare dates
                    });
                }

                // Filter by time
                const timeParam = searchParams.get('time');
                if (timeParam) {
                    formattedData = formattedData.filter((item: ReservationItem) => {
                        const reservationTime = new Date(item.revDate).toLocaleTimeString('en-GB', {
                            timeZone: 'UTC', hour: '2-digit', minute: '2-digit' });
                        return reservationTime === timeParam;
                    });
                }

                setReservations(formattedData);
            } catch (err: any) {
                setError(`Error fetching reservations: ${err.message}`);
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchReservationsData();
    }, [session, searchParams]);

    if (isLoading) {
        return <Loader loadingtext="Loading reservations..." />;
    }

    if (error) {
        return <div className='text-lg text-white m-10'>Error: {error}</div>;
    }

    return (
        <main>
            <div className="flex flex-center p-5 w-[90vw] mt-10 h-fit rounded-lg shadow-lg bg-white mx-auto px-5">
                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border border-gray-300 px-4 py-2">Reservation Id</th>
                            <th className="border border-gray-300 px-4 py-2">Date</th>
                            <th className="border border-gray-300 px-4 py-2">Time</th>
                            <th className="border border-gray-300 px-4 py-2">User Id</th>
                            <th className="border border-gray-300 px-4 py-2">Guests</th>
                            <th className="border border-gray-300 px-4 py-2">Restaurant</th>
                            <th className="border border-gray-300 px-4 py-2">Edit</th>
                            <th className="border border-gray-300 px-4 py-2">Cancel</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reservations.length > 0 ? (
                            reservations.map((reservationItem: ReservationItem) => (
                                <AdminRow reservationItem={reservationItem} key={reservationItem._id} />
                            ))
                        ) : (
                            <tr>
                                <td colSpan={8} className="text-center py-4">No reservations found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </main>
    );
}
