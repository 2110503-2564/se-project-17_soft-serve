'use client';
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import getUserProfile from '@/libs/getUserProfile';
import ManagerNotificationCreate from '@/components/ManagerNotificationCreate';
import Loader from '@/components/Loader';

export default function RestaurantManagerNotification() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isManager, setIsManager] = useState<boolean | null>(null);
  const [restaurant, setRestaurant] = useState<string | null>(null);

  useEffect(() => {
    const checkRestaurantManager = async () => {
      if (!session || !session.user?.token) {
        setIsManager(false);
        router.push('/');
        return;
      }

      try {
        const user = await getUserProfile(session.user.token);
        const isManager = user.data.role === 'restaurantManager';
        setIsManager(isManager);
        setRestaurant(user.data.restaurant); // Make sure this is a string
        if (!isManager) {
          router.push('/');
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
        setIsManager(false);
        router.push('/');
      }
    };
    checkRestaurantManager();
  }, [session, router]);

  if (!session || !session.user?.token) return null;
  if (isManager === null || restaurant === null) return <Loader loadingtext="Loading ..." />;
  if (!isManager) return null;

  return (
    <main className="bg-myred h-[calc(100vh-60px)] flex justify-center items-center flex-col md:px-8 lg:px-16 overflow-auto">
      <ManagerNotificationCreate 
        token={session.user.token} 
        restaurantId={restaurant} 
      />
    </main>
  );
}
