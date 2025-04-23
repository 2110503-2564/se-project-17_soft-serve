import { redirect } from 'next/navigation';
import { getServerSession } from "next-auth";
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';
import RestaurantManagerNotificationPanel from '@/components/RestaurantManagerNotificationPanel';
import RestaurantManagerNotificationTogglePanel from '@/components/RestaurantManagerNotificationTogglePanel';
import getUserProfile from "@/libs/getUserProfile";

export default async function Notification() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.token) {
    redirect('/');
  }

  const token = session.user.token;
  const user = await getUserProfile(token);

  if (user.data.role !== 'restaurantManager') {
    redirect('/');
  }

  return (
    <main className="bg-myred min-h-screen pb-10">
      <div className="flex flex-col items-center space-y-5">
        
        
        {/* Notification Panel */}
        <RestaurantManagerNotificationPanel />
        <RestaurantManagerNotificationTogglePanel></RestaurantManagerNotificationTogglePanel>
      </div>
    </main>
  );
}
