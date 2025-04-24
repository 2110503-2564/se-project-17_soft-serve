'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { NotificationItem } from '../../interfaces';
import getUserProfile from '@/libs/getUserProfile';

export default function NotificationBox({ notificationItem }: { notificationItem: NotificationItem }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [restaurantName, setRestaurantName] = useState<string | null>(null);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const checkExpiration = () => {
      const publishAt = new Date(notificationItem.publishAt);
      const now = new Date();
      const diffInHours = (now.getTime() - publishAt.getTime()) / (1000 * 60 * 60);

      if (diffInHours >= 24) {
        setIsExpired(true);
      }
    };

    checkExpiration();

    // Optional: check every hour
    const interval = setInterval(checkExpiration, 1000 * 60 * 60);

    return () => clearInterval(interval);
  }, [notificationItem.publishAt]);

  useEffect(() => {
    if (notificationItem.restaurant) {
      setRestaurantName(notificationItem.restaurant.name);
    }
  }, [notificationItem]);

  return (
    <div className="w-full bg-white border border-gray-300 px-8 py-4 rounded-md shadow-sm flex justify-between items-center">
      <div className="flex flex-col w-full justify-center">
        <h2 className="text-lg font-semibold mb-2">{notificationItem.title}</h2>
        <p className="text-gray-700 mb-1.25">{notificationItem.message}</p>
        
        {/* Conditionally render restaurant name if available */}
        {restaurantName && (
          <p className="text-sm text-gray-500 mt-2">Restaurant : {restaurantName}</p>
        )}
      </div>

      <div className={`w-8 h-8 rounded-full ${isExpired ? 'bg-gray-400' : 'bg-green-500'} mr-8`}></div>
    </div>
  );
}
