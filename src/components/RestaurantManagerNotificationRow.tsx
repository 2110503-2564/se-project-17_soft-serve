'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import getNotifications from "@/libs/getNotifications";
import getUserProfile from "@/libs/getUserProfile";
import { NotificationJson, NotificationItem } from "../../interfaces";
import { useSession } from 'next-auth/react';
import RestaurantManagerNotificationBox from './RestaurantManagerNotificationBox';
import RestaurantManagerNotificationPanel from './RestaurantManagerNotificationPanel';

export default function RestaurantManagerNotificationRow() {
  const [selectedTab, setSelectedTab] = useState<'sent' | 'received'>('sent');
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const { data: session } = useSession();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!session || !session.user?.token) {
          return;
        }

        const token = session.user.token;
        const userProfile = await getUserProfile(token);

        if (userProfile.data.role !== 'restaurantManager') {
          router.push('/');
          return;
        }

        setUser(userProfile.data);

        const notificationJson: NotificationJson = await getNotifications({ token });
        setNotifications(notificationJson.data);
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [session, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-myred">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  const adminNotifications = notifications.filter(
    (item: NotificationItem) => item.createdBy === 'admin'
  ).sort((a, b) => new Date(b.publishAt).getTime() - new Date(a.publishAt).getTime());

  const managerNotifications = notifications.filter(
    (item: NotificationItem) => item.createdBy === 'restaurantManager'
  ).sort((a, b) => new Date(b.publishAt).getTime() - new Date(a.publishAt).getTime());

  const handleTabClick = (tab: 'sent' | 'received') => {
    setSelectedTab(tab);
  };

  return (
    <div>
      <div className="flex mt-4">
        <div className="flex">
          <button
            onClick={() => handleTabClick('sent')}
            className={`px-10 py-2 text-xl font-semibold rounded-t-lg ${
              selectedTab === 'sent' ? 'bg-white text-myred border' : 'bg-myred text-white'
            }`}
          >
            Sent
          </button>
          <button
            onClick={() => handleTabClick('received')}
            className={`px-10 py-2 text-xl font-semibold rounded-t-lg ${
              selectedTab === 'received' ? 'bg-white text-myred border' : 'bg-myred text-white'
            }`}
          >
            Received
          </button>
        </div>
      </div>

      {/* White panel wrapping the notifications */}
      <div className="w-full bg-white border border-gray-300 min-h-[400px]">
        {/* Conditional message if no notifications */}
        {(selectedTab === 'sent' && managerNotifications.length === 0) ||
        (selectedTab === 'received' && adminNotifications.length === 0) ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center text-gray-500">No notifications yet.</div>
          </div>
        ) : (
          // Render notifications sorted by publishAt
          (selectedTab === 'sent'
            ? managerNotifications.map((notification) => (
                <RestaurantManagerNotificationBox key={notification._id} notificationItem={notification} />
              ))
            : adminNotifications.map((notification) => (
                <RestaurantManagerNotificationBox key={notification._id} notificationItem={notification} />
              )))
        )}
      </div>
    </div>
  );
}
