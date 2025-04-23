'use client';
import { useRouter } from 'next/navigation';

export default function RestaurantManagerNotificationPanel() {
    const router = useRouter();

    const handleClick = () => {
        router.replace('/admin/notifications/create');
    };

    return (
        <div className="w-screen flex justify-end items-center h-[80px] px-8 bg-myred">
            <button
                onClick={handleClick}
                className='bg-white border border-white text-myred text-xl font-semibold w-[150px] py-2 px-4 rounded-xl shadow-sm hover:bg-white hover:text-red-600 hover:border hover:border-red-600 disabled:bg-gray-400 disabled:text-gray-200 disabled:hover:bg-gray-400 disabled:hover:text-gray-200 disabled:cursor-not-allowed'
            >
                Create
            </button>
        </div>
    );
}
