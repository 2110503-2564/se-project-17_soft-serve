// pages/admin/reviews/index.tsx
import { getServerSession } from "next-auth";
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';
import { redirect } from 'next/navigation';
import getUserProfile from "@/libs/getUserProfile";
import AdminReviewsTable from "@/components/AdminReviewsTable";
import AdminReviewsFilter from "@/components/AdminReviewsFilter";

export default async function AdminReviewsDashboard() {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user || !session.user.token) redirect('/');

    const token = session.user.token;
    const user = await getUserProfile(token);

    if (user.data.role !== 'admin') {
        redirect('/');
    }

    return (
        <main className="bg-myred h-[100%] pb-10">
            <div className='flex flex-col items-center space--5'>
                <div className="text-3xl font-bold text-white pt-10">
                    Restaurant Reviews Dashboard
                </div>
                <AdminReviewsFilter />
                <AdminReviewsTable />
            </div>
        </main>
    );
}