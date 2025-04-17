'use client'
import { useParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react'
import EditRestaurantBox from "@/components/EditRestaurantBox";
import getUserProfile from '@/libs/getUserProfile';

export default function EditRestaurant() {
    const { data: session } = useSession();
    const { restaurantId } = useParams();
    const router = useRouter();

    const [isLoadingRoleCheck, setIsLoadingRoleCheck] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        const checkRole = async () => {
            if (!restaurantId) {
                router.push('/');
                return;
            }
            if (!session?.user?.token) {
                router.push('/');
                return;
            }
            try {
                const userProfile = await getUserProfile(session.user.token);
                if (userProfile?.data?.role === 'admin') {
                    setIsAuthorized(true);
                    return;
                }
                if (userProfile?.data?.role === 'restaurantManager') {
                    // Check if the restaurant ID in the route matches the manager's restaurant
                    if (userProfile?.data?.restaurant?.toString() === restaurantId) {
                        setIsAuthorized(true);
                    } else {
                        router.push('/');
                    }
                    return;
                }
                router.push('/');
            } catch (error) {
                console.error("Failed to fetch user profile:", error);
                router.push('/');
            } finally {
                setIsLoadingRoleCheck(false);
            }
        };
        checkRole();
    }, [restaurantId, session, router]);
    if (isLoadingRoleCheck) {
        return <div>Loading...</div>; // Or a spinner
    }
    if (!isAuthorized) {
        return null; // Or maybe a "Not Authorized" message, though the redirect should handle this
    }
    if (!restaurantId || !session || !session.user?.token) {
        return null; // Or a loading state, or a message
    }

    return (
        <main className="bg-myred min-h-screen pb-10">
            <div className='flex flex-col items-center space--5'>
                <EditRestaurantBox restaurantId={restaurantId.toString()} token={session.user.token}/>
            </div>
        </main>
    );
}