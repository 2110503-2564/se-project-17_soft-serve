'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import getUserProfile from '@/libs/getUserProfile';
import getNotifications from '@/libs/getNotifications';
import { NotificationItem } from '../../interfaces';
import { User } from '../../interfaces';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';
import { useSession } from 'next-auth/react';

export default function RestaurantManagerNotificationTogglePanel() {
    const [selectedTab, setSelectedTab] = useState<'sent' | 'received'>('sent');
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const {data: session}= useSession();

    // Fetch user profile and notifications
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
                const notificationJson = await getNotifications({token });

                setNotifications(notificationJson.data);
            } catch (error) {
                console.error("Error fetching data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [router]);

    if (loading) {
        return <div>Loading...</div>;
    }

    const adminNotifications = notifications.filter(
        (item) => item.createdBy === 'admin'
    );

    const managerNotifications = notifications.filter(
        (item) => item.createdBy === 'restaurantManager'
    );

    const handleTabClick = (tab: 'sent' | 'received') => {
        setSelectedTab(tab);
    };

    return (
        <div className="relative flex justify-center mt-10 w-full">
            {/* Main Box with Shadow */}
            <div className="bg-white w-full max-w-4xl rounded-lg shadow-xl p-6 pl-12">
                {/* Conditional Content */}
                <div>
                    {selectedTab === 'sent' ? (
                        <div>
                            {/* Replace with actual sent notifications */}
                            <ul>
                                {adminNotifications.map((notification) => (
                                    <li key={notification._id} className="text-gray-700">
                                        {notification.message}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : (
                        <div>
                            {/* Replace with actual received notifications */}
                            <ul>
                                {managerNotifications.map((notification) => (
                                    <li key={notification._id} className="text-gray-700">
                                        {notification.message}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>

            {/* Tab Buttons Box outside the main box */}
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 flex flex-col bg-white shadow-xl border border-gray-300 rounded-lg">
                <button
                    onClick={() => handleTabClick('sent')}
                    className={`px-6 py-3 rounded-t-lg text-sm font-semibold text-left w-32 ${
                        selectedTab === 'sent'
                            ? 'bg-myred text-white'
                            : 'text-gray-800 hover:bg-gray-100'
                    }`}
                >
                    Sent
                </button>
                <button
                    onClick={() => handleTabClick('received')}
                    className={`px-6 py-3 rounded-b-lg text-sm font-semibold text-left w-32 ${
                        selectedTab === 'received'
                            ? 'bg-myred text-white'
                            : 'text-gray-800 hover:bg-gray-100'
                    }`}
                >
                    Received
                </button>
            </div>
        </div>
    );
}
