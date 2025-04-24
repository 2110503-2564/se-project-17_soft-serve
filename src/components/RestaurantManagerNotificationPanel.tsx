'use client';
import { useRouter } from 'next/navigation';

export default function RestaurantManagerNotificationPanel() {
    const router = useRouter();

    const handleClick = () => {
        router.replace('/manager/notifications/create');
    };

    return (
        <div>
            <div className="w-screen flex justify-between items-center h-[80px] px-8 bg-myred border-b border-myred">
                <h1 className="text-2xl font-bold text-white">
                    Sent & Received Notifications
                </h1>
                <button onClick={handleClick}
                    className='block bg-white border border-white text-myred text-xl font-semibold w-[150px] py-2 px-4 rounded-xl shadow-sm hover:bg-white hover:text-red-600 hover:border hover:border-red-600 disabled:bg-gray-400 disabled:text-gray-200 disabled:hover:bg-gray-400 disabled:hover:text-gray-200 disabled:cursor-not-allowed'>
                    Create
                </button>
            </div>
        </div>
    );
}
