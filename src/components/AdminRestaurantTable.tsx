// import { ReservationJson, ReservationItem } from "@/../interfaces";
// import getReservations from "@/libs/getReservations";
// /import getUserProfile from "@/libs/getUserProfile";
// import { getServerSession } from "next-auth";
// import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';
// import { redirect } from 'next/navigation';
import AdminRow from './AdminRestaurantRow';

export default async function AdminRestaurantTable() {
    /*const session = await getServerSession(authOptions);
    
    if (!session || !session.user || !session.user.token) return null;

    const token = session.user.token;
    const user = await getUserProfile(token);

    if (user.data.role !== 'admin') {
        redirect('/');
        return null;
    }

    const reservationJson: ReservationJson = await getReservations({ token });*/

    // Mock Data
    interface RestaurantItem {
        mid: string; // manager id
        status: 'pending' | 'approved';
        name: string;
        email: string;
    }

    const mockRestaurantData: RestaurantItem[] = [
        {
            mid: '1',
            name: 'Hotpot Man',
            status: 'approved',
            email: 'restaurant1@gmail.com'
        },
        {
            mid: '2',
            name: 'Gan Mala',
            status: 'pending',
            email: 'restaurant2@gmail.com'
        }
    ]

    const restaurantJson = {
        data: mockRestaurantData,
    };

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
                            <th className="border border-gray-300 px-4 py-2" style={{ width: '12%' }}>View</th>
                            <th className="border border-gray-300 px-4 py-2" style={{ width: '12%' }}>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {restaurantJson.data.map((restaurantItem: RestaurantItem) => {
                            return (
                                <AdminRow restaurantItem={restaurantItem} key={restaurantItem.mid} />
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </main>
    );
}