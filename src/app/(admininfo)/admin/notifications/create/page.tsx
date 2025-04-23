// app/admin/notifications/create/page.tsx
'use client'
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import getUserProfile from '@/libs/getUserProfile';
import AdminCreateNotification from '@/components/AdminNotificationCreate';
import Loader from "@/components/Loader";

export default function CreateNotification() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAdmin = async () => {
      if (!session || !session.user?.token) {
        setIsAdmin(false);
        router.push('/');
        return;
      }
      try {
        const userProfile = await getUserProfile(session.user.token);
        const isUserAdmin = userProfile.data.role === 'admin';
        setIsAdmin(isUserAdmin);
        // redirect only after role is known
        if (!isUserAdmin) {
          router.push('/');
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
        setIsAdmin(false);
        router.push('/');
      }
    };
    checkAdmin();
  }, [session, router]);

  if (isAdmin === null) return <Loader loadingtext="Loading ..." />;
  if (!isAdmin || !session?.user?.token) return null; // wait for router.push to trigger

  return (
    <main className="bg-myred h-[calc(100vh-60px)] flex justify-center items-center flex-col md:px-20 lg:px-80 overflow-auto">
      <AdminCreateNotification token={session.user.token} />
    </main>
  );
}