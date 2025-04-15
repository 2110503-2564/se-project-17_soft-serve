import { redirect } from 'next/navigation';
import { getServerSession } from "next-auth";
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';
import getUserProfile from "@/libs/getUserProfile";
import AdminSearchBox from "@/components/AdminSearchBox";
import AdminReservationTable from "@/components/AdminReservationTable";

export default async function ReservationsList() {
    const session = await getServerSession(authOptions);
        //console.log('session', session);
        if (!session || !session.user || !session.user.token) redirect('/');
        
        const token = session.user.token;
        const user = await getUserProfile(token);
        //console.log('role', user.data.role);
        if (user.data.role !== 'admin') {
            redirect('/');
        }

    return (
        <main className="bg-myred h-[100%] pb-10">
            
            <div className='flex flex-col items-center space--5'>
            <div className="text-3xl font-bold text-white pt-10">
                Reservations List   
            </div>
                <AdminSearchBox/>
                <AdminReservationTable/>
            </div>
        </main>
    );
}