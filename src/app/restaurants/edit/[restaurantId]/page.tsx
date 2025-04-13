'use client'
import { useSession } from "next-auth/react"
import { useParams } from "next/navigation"
import EditRestaurantBox from "@/components/EditRestaurantBox";

export default function EditRestaurant() {
    const { data: session } = useSession();
    const { restaurantId } = useParams();

    //if (!session || !session.user?.token || !restaurantId) return null;

    return (
        <main className="bg-myred min-h-screen pb-10">
            <div className='flex flex-col items-center space--5'>
                <EditRestaurantBox/>
            </div>
        </main>
    );
}

/*<EditBox reservationId={reserveId.toString()} token={session.user.token}/>*/