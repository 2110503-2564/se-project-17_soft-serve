import AdminNotificationBox from "./AdminNotificationBox";
import AdminNotificationPanel from "./AdminNotificationPanel";
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
      <AdminNotificationPanel/>
      {notificationJson.data.map((notificationItem: NotificationItem) => (
        <AdminNotificationBox
          key={notificationItem._id}
          notificationItem={notificationItem}
        />
      ))}
    </main>
  );
}