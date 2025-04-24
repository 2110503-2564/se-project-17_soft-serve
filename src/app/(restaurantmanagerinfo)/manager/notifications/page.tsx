'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import getUserProfile from '@/libs/getUserProfile';
import getNotifications from '@/libs/getNotifications';
import RestaurantManagerNotificationPanel from '@/components/RestaurantManagerNotificationPanel';
import RestaurantManagerNotificationRow from '@/components/RestaurantManagerNotificationRow';

export default function RestaurantManagerNotification() {
  const [selectedTab, setSelectedTab] = useState<'sent' | 'received'>('sent');
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!session || !session.user?.token) return;
        const token = session.user.token;
        const userProfile = await getUserProfile(token);

        if (userProfile.data.role !== 'restaurantManager') {
          router.push('/');
          return;
        }

        const notificationJson = await getNotifications({ token });
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [session, router]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="bg-myred min-h-screen pb-10">
      <RestaurantManagerNotificationPanel />
      <RestaurantManagerNotificationRow />
    </div>
  );
}
