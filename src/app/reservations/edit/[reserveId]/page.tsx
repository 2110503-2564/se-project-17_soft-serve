'use client'

import { useSession } from "next-auth/react"
import { useParams } from "next/navigation"
import EditBox from "@/components/EditBox"

export default function Reservation() {
    const { data: session } = useSession();
    const { reserveId } = useParams();

    if (!session || !session.user?.token || !reserveId) return null;
        
    return (
        <main className="w-[100%] flex flex-col items-center justify-center">
            <EditBox reservationId={reserveId.toString()} token={session.user.token}/>
        </main>
    )
}