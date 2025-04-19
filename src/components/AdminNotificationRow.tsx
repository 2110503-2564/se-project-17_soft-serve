import AdminNotificationBox from "./AdminNotificationBox";
import AdminNotificationPanel from "./AdminNotificationPanel";
import getNotifications from "@/libs/getNotifications";
import getUserProfile from "@/libs/getUserProfile";
import { redirect } from 'next/navigation';
import { NotificationJson, NotificationItem } from "../../interfaces";
import { getServerSession } from "next-auth";
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';

export default async function AdminNotificationRow() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.token) return null;

  const token = session.user.token;
  const user = await getUserProfile(token);
  if (user.data.role !== 'restaurantManager' && user.data.role !== 'admin') {
    redirect('/');
  }
  const notificationJson: NotificationJson = await getNotifications({ token });

  return (
    <main className="w-screen m-0 p-0">
      <AdminNotificationPanel />
      {notificationJson.count === 0 ? (
        <div className="text-center py-10 text-gray-500 text-lg">
          No notifications available.
        </div>
      ) : (
        notificationJson.data.map((notificationItem: NotificationItem) => (
          <AdminNotificationBox
            key={notificationItem._id}
            notificationItem={notificationItem}
          />
        ))
      )}
    </main>
  );
}