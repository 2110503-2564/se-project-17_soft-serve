'use client'
import React, { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import getUserProfile from '@/libs/getUserProfile';
import ManagerNotificationCreate from '@/components/ManagerNotificationCreate';

export default function RestaurantManagerNotification() {
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    const checkRestaurantManager = async () => {
      if (!session || !session.user?.token) {
        router.push('/');
        return;
      }
      
      try {
        const user = await getUserProfile(session.user.token);
        // Redirect if user is not a restaurant manager
        if (user.data.role !== 'restaurantManager') {
          router.push('/');
        }
        // Additional check for verified status could be added here
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
        router.push('/');
      }
    };
    
    checkRestaurantManager();
  }, [session, router]);

  // Only render the form if the user is authenticated
  if (!session || !session.user?.token) {
    return null; // Or a loading state
  }

  return (
    <main className="bg-myred h-[calc(100vh-60px)] flex justify-center items-center flex-col md:px-8 lg:px-16 overflow-auto">
      <ManagerNotificationCreate token={session.user.token} />
    </main>
  );
}