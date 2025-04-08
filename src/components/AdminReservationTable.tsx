import { ReservationJson, ReservationItem } from "@/../interfaces";
import getReservations from "@/libs/getReservations";
import getUserProfile from "@/libs/getUserProfile";
import { getServerSession } from "next-auth";
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';
import { redirect } from 'next/navigation';
import AdminRow from "./AdminRow";

export default async function AdminReservationTable() {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user || !session.user.token) return null;

    const token = session.user.token;
    const user = await getUserProfile(token);

    if (user.data.role !== 'admin') {
        redirect('/');
        return null;
    }

    const reservationJson: ReservationJson = await getReservations({ token });

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
                            <th className="border border-gray-300 px-4 py-2">Cancle</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reservationJson.data.map((reservationItem: ReservationItem) => {
                            return (
                                <AdminRow reservationItem={reservationItem} key={reservationItem._id}/>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </main>
    );
}