'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import getUserProfile from '@/libs/getUserProfile';
import getNotifications from '@/libs/getNotifications';
import { NotificationItem } from '../../../../../interfaces';
import { User } from '../../../../../interfaces';

export default function RestaurantManagerNotificationTogglePanel() {
    const [selectedTab, setSelectedTab] = useState<'sent' | 'received'>('sent');
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const { data: session, status } = useSession();

    useEffect(() => {
        // This useEffect is used to trigger fetching notifications when session is available
        const fetchData = async () => {
            if (status === 'loading') {
                return; // Don't fetch data until session is fully loaded
            }

            if (!session?.user?.token) {
                setError('User not logged in or token missing.');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const token = session.user.token;
                const userProfile = await getUserProfile(token);

                // Check if the user is a restaurant manager
                if (userProfile.data.role !== 'restaurantManager') {
                    router.push('/');
                    return;
                }

                setUser(userProfile.data);
                const notificationJson = await getNotifications({ token });

                setNotifications(notificationJson.data);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('There was an error fetching the notifications.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        // Cleanup: Reset states when the component is unmounted
        return () => {
            setLoading(false);
            setNotifications([]);
        };
    }, [session, status, router]); // Depend on session and status to know when to trigger fetching

    const handleTabClick = (tab: 'sent' | 'received') => {
        setSelectedTab(tab);
    };

    // Only show loading message when data is loading or session is loading
    if (status === 'loading' || loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    // Filter notifications by type
    const adminNotifications = notifications.filter(
        (item) => item.createdBy === 'admin'
    );

    const managerNotifications = notifications.filter(
        (item) => item.createdBy === 'restaurantManager'
    );

    return (
        <div className="relative flex justify-center mt-10 w-full">
            {/* Main Box with Shadow */}
            <div className="bg-white w-full max-w-4xl rounded-lg shadow-xl p-6 pl-12">
                {/* Conditional Content */}
                <div>
                    {selectedTab === 'sent' ? (
                        <div>
                            <h3 className="text-lg font-semibold">Sent Notifications</h3>
                            <ul>
                                {adminNotifications.length > 0 ? (
                                    adminNotifications.map((notification) => (
                                        <li key={notification._id} className="text-gray-700">
                                            {notification.message}
                                        </li>
                                    ))
                                ) : (
                                    <p>No sent notifications.</p>
                                )}
                            </ul>
                        </div>
                    ) : (
                        <div>
                            <h3 className="text-lg font-semibold">Received Notifications</h3>
                            <ul>
                                {managerNotifications.length > 0 ? (
                                    managerNotifications.map((notification) => (
                                        <li key={notification._id} className="text-gray-700">
                                            {notification.message}
                                        </li>
                                    ))
                                ) : (
                                    <p>No received notifications.</p>
                                )}
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
