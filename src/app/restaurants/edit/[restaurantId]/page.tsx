'use client'
import { useParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { useRouter } from 'next/navigation';
import { useEffect } from 'react'
import EditRestaurantBox from "@/components/EditRestaurantBox";

export default function EditRestaurant() {
    const { data: session } = useSession();
    const { restaurantId } = useParams();
    const router = useRouter();

    useEffect(() => {
        if (!restaurantId) {
            router.push('/');
            return;
        }
        if (!session || !session.user?.token) {
            router.push('/');
            return;
        }
    }, [restaurantId, session, router]);

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