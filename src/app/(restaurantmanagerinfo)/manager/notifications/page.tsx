'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import getUserProfile from '@/libs/getUserProfile';
import getNotifications from '@/libs/getNotifications';
import { NotificationItem } from '../../../../../interfaces';
import { User } from '../../../../../interfaces';
import { useSession } from 'next-auth/react';
import RestaurantManagerNotificationBox from '@/components/RestaurantManagerNotificationBox'
import RestaurantManagerNotificationPanel from '@/components/RestaurantManagerNotificationPanel';

export default function RestaurantManagerNotificationTogglePanel() {
    const [selectedTab, setSelectedTab] = useState<'sent' | 'received'>('sent');
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [user, setUser] = useState<User | null>(null);
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

                setUser(userProfile.data);
                const notificationJson = await getNotifications({ token });
                setNotifications(notificationJson.data);
            } catch (error) {
                console.error("Error fetching data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [router, session]);

    if (loading) return <div>Loading...</div>;

    const adminNotifications = notifications.filter(item => item.createdBy === 'admin');
    const managerNotifications = notifications.filter(item => item.createdBy === 'restaurantManager');

    const handleTabClick = (tab: 'sent' | 'received') => {
        setSelectedTab(tab);
    };

    const renderAdminNotification = (notificationItem: NotificationItem) => (
        <RestaurantManagerNotificationBox
            key={notificationItem._id}
            notificationItem={notificationItem}
        />
    );

    const renderManagerNotification = (notificationItem: NotificationItem) => (
        <RestaurantManagerNotificationBox
            key={notificationItem._id}
            notificationItem={notificationItem}
        />
    );

    return (
        <div className="bg-myred min-h-screen pb-10">
            <RestaurantManagerNotificationPanel/>
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

            <div className="w-full border border-gray-300 overflow-hidden">
                {(selectedTab === 'sent' ? managerNotifications.map(renderManagerNotification) : adminNotifications.map(renderAdminNotification))}
            </div>
        </div>
    );
}