'use client'
import { useParams } from "next/navigation"
import { useSession } from "next-auth/react"
import EditRestaurantBox from "@/components/EditRestaurantBox";

export default function EditRestaurant() {
    const { data: session } = useSession();
    const { restaurantId } = useParams();

    if (!restaurantId) return;
    if (!session || !session.user?.token || !restaurantId) return null;

    return (
        <main className="bg-myred min-h-screen pb-10">
            <div className='flex flex-col items-center space--5'>
                <EditRestaurantBox restaurantId={restaurantId.toString()} token={session.user.token}/>
            </div>
        </main>
    );
}