import AdminNotificationBox from "./AdminNotificationBox";
import getNotifications from "@/libs/getNotifications";
import { NotificationJson, NotificationItem } from "../../interfaces";
import getUserProfile from "@/libs/getUserProfile";
import { getServerSession } from "next-auth";
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';

export default async function AdminNotificationRow() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.token) return null;

  const token = session.user.token;
  const user = await getUserProfile(token);
  const notificationJson: NotificationJson = await getNotifications({ token });

  return (
    <main className="w-screen m-0 p-0">
      <div className="w-screen flex justify-between items-center h-[80px] px-6 bg-red-600 border-b border-red-700">
        <h1 className="text-2xl font-bold text-white">Notifications</h1>
      </div>
      {notificationJson.data.map((notificationItem: NotificationItem) => (
        <AdminNotificationBox
          key={notificationItem._id}
          notificationItem={notificationItem}
        />
      ))}
    </main>
  );
}
