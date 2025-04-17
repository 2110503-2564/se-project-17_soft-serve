'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import getUserProfile from '@/libs/getUserProfile';
import VerifyCard from '@/components/AdminVerifyCard';

export default function Verify() {
    const { data: session } = useSession();
    const router = useRouter();
    const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

    useEffect(() => {
        const checkAdmin = async () => {
            if (!session || !session.user?.token) {
                setIsAdmin(false);
                router.push('/');
                return;
            }
            try {
                const userProfile = await getUserProfile(session.user.token);
                const isUserAdmin = userProfile.data.role === 'admin';
                setIsAdmin(isUserAdmin);
                // redirect only after role is known
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
        <main>
            <div className="flex flex-col pl-7 space--5 bg-myred pb-7 text-3xl font-bold text-white pt-7">
                Verify Restaurant Accounts
            </div>
            <div>
                <VerifyCard />
            </div>
        </main>
    );
}
