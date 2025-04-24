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
      const publishAt= new Date(notificationItem.publishAt);
      const now = new Date();
      const diffInHours = (now.getTime() - publishAt.getTime()) / (1000 * 60 * 60);
      //const diffInMins = (now.getTime() - publishAt.getTime()) / (1000 * 60);

      if(diffInHours >= 24)
      {
        setIsExpired(true);
      }
    };

    checkExpiration();

    //optional: check every minute
    //const interval = setInterval(checkExpiration, 1000);

    //optional: check every hour
    const interval = setInterval(checkExpiration, 1000 * 60 * 60);

    return () => clearInterval(interval);
  }, [notificationItem.publishAt]);

  return (
    <div className="w-full bg-white border border-gray-300 px-8 py-4 rounded-md shadow-sm flex justify-between items-center justify-between">
      <div className="flex flex-col w-full justify-center">
        <h2 className="text-lg font-semibold mb-2">{notificationItem.title}</h2>
        <p className="text-gray-700 mb-1.25">{notificationItem.message}</p>
      </div>

      <div className={`w-8 h-8 rounded-full ${isExpired ? 'bg-gray-400' : 'bg-green-500'} mr-8`}></div>
    </div>
  );
}
