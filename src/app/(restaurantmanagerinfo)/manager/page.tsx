'use client'
import getUserProfile from "@/libs/getUserProfile";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Loader from '@/components/Loader';

export default function Manager() {
    const { data: session } = useSession();
    const router = useRouter();
    const [restaurantId, setRestaurantId] = useState<string | null>(null);
    const [isManager, setIsManager] = useState<boolean | null>(null);

    useEffect(() => {
        const checkManager = async () => {
            if (!session || !session.user?.token) {
                setIsManager(false);
                router.push('/');
                return;
            }
            try {
                const user = await getUserProfile(session.user.token);
                const isManager = user.data.role === 'restaurantManager';
                setRestaurantId(user.data.restaurant.toString());
                setIsManager(isManager);
                // redirect only after role is known
                if (!isManager) {
                    router.push('/');
                }
            } catch (error) {
                console.error("Failed to fetch user profile:", error);
                setIsManager(false);
                router.push('/');
            }
        };
        checkManager();
    }, [session, router]);
    if (isManager === null) return <Loader loadingtext="Loading ..." />;
    if (!isManager) return null; // wait for router.push to trigger
    

    return (
        <main className="h-[100%] pb-10">
            <div className='bg-myred flex flex-col items-center space--5'>
            <div className="text-3xl font-bold text-white pt-7 pb-7">
                Restaurant Manager Panel
            </div>
            </div>
            <div>
                <Link href={`/restaurants/${restaurantId}`} className="flex flex-col items-center text-myred text-2xl font-bold pt-10 hover:underline">View my Restaurant</Link>
                <Link href={`/restaurants/edit/${restaurantId}`} className="flex flex-col items-center text-myred text-2xl font-bold pt-10 hover:underline">Edit my Restaurant</Link>
                <Link href="/manager/reviews" className="flex flex-col items-center text-myred text-2xl font-bold pt-10 hover:underline">Reviews from Customers</Link>
                <Link href="/manager/notifications" className="flex flex-col items-center text-myred text-2xl font-bold pt-10 hover:underline">View my Notifications</Link>
            </div>
        </main>
    );
}