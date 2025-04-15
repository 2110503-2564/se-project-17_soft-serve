'use client';
import AdminSearchBox from "@/components/AdminSearchBoxRestaurant";
import AdminRestaurantTable from "@/components/AdminRestaurantTable";
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import getUserProfile from '@/libs/getUserProfile';

export default function RestaurantsList() {
    const { data: session } = useSession();
    const router = useRouter();
    const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

    useEffect(() => {
        const checkAdmin = async () => {
            if (!session || !session.user?.token) {
                setIsAdmin(false);
                return;
            }

            try {
                const userProfile = await getUserProfile(session.user.token);
                const isUserAdmin = userProfile.data.role === 'admin';
                setIsAdmin(isUserAdmin);

                // ❗ redirect only after role is known
                if (!isUserAdmin) {
                    router.push('/');
                }
            } catch (error) {
                console.error("Failed to fetch user profile:", error);
                setIsAdmin(false);
                router.push('/');
            }
        };

        checkAdmin();
    }, [session, router]);

    if (isAdmin === null) return <div>Loading...</div>;

    if (!isAdmin) return null; // wait for router.push to trigger

    return (
        <main className="bg-myred min-h-screen pb-10">
            <div className='flex flex-col items-center space--5'>
            <div className="text-3xl font-bold text-white pt-10">
                Restaurants List   
            </div>
                <AdminSearchBox/>
                <AdminRestaurantTable/>
            </div>
        </main>
    );
}