import { redirect } from 'next/navigation';
import { getServerSession } from "next-auth";
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';
import getUserProfile from "@/libs/getUserProfile";
import ManagerSearchBox from '@/components/ManagerSearchboxReservation';
import ManagerReservationTable from '@/components/ManagerReservationTable';

export default async function RestaurantsList() {
    const session = await getServerSession(authOptions);
    console.log('session', session);
    if (!session || !session.user || !session.user.token) redirect('/');
    
    const token = session.user.token;
    const user = await getUserProfile(token);
    console.log('role', user.data.role);
    if (user.data.role !== 'restaurantManager') {
        redirect('/');
    }

    return (
        <main className="bg-myred min-h-screen pb-10">
            <div className="text-3xl font-bold text-white pt-10 mx-10">
                Reservations List   
            </div>
            <div className='flex flex-col items-center space--5'>
            
                <ManagerSearchBox token={session.user.token}/>
                <ManagerReservationTable/>
            </div>
        </main>
    );
}