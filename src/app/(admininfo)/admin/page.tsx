import Link from "next/link";

export default function Admin() {
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