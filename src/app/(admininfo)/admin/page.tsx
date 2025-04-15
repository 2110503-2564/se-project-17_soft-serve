'use client'
import getUserProfile from "@/libs/getUserProfile";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Admin() {
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
        <main className="h-[100%] pb-10">
            
            <div className='bg-[#D40303] flex flex-col items-center space--5'>
            <div className="text-3xl font-bold text-white pt-7 pb-7">
                Admin Panel
            </div>
            </div>
            <div>
                <Link href="/admin/notifications" className="flex flex-col items-center text-[#D40303] text-2xl font-bold pt-10 hover:underline">Notifications</Link>
                <Link href="/admin/reservations" className="flex flex-col items-center text-[#D40303] text-2xl font-bold pt-10 hover:underline">Reservations</Link>
                <Link href="/admin/restaurants" className="flex flex-col items-center text-[#D40303] text-2xl font-bold pt-10 hover:underline">Restaurants</Link>
                <Link href="/admin/verify" className="flex flex-col items-center text-[#D40303] text-2xl font-bold pt-10 hover:underline">Verify Restaurant Account</Link>
                <Link href="/admin/reviews" className="flex flex-col items-center text-[#D40303] text-2xl font-bold pt-10 hover:underline">Review & Rating</Link>
            </div>
        </main>
    );
}