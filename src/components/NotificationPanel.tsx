'use client';
import { useRouter } from 'next/navigation' 

export default function NotificationPanel() {
    const router = useRouter();



    return (
        <div className="w-screen flex justify-between items-center h-[80px] px-8 bg-myred border-b border-red-700">
            <h1 className="text-2xl font-bold text-white">
                Notifications
            </h1>

        </div>
    );
}