import NotificationBox from "./NotificationBox";
import NotificationPanel from "./NotificationPanel";
import getNotifications from "@/libs/getNotifications";
import getUserProfile from "@/libs/getUserProfile";
import { redirect } from 'next/navigation';
import { NotificationJson, NotificationItem } from "../../interfaces";
import { getServerSession } from "next-auth";
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';

export default async function NotificationRow() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.token) return null;

  const token = session.user.token;
  const user = await getUserProfile(token);
  if (user.data.role !== 'user') {
    redirect('/');
    return null;
  }
  const notificationJson: NotificationJson = await getNotifications({ token });
  console.log("test user notipage2")


  return (
    <main className="w-screen m-0 p-0">
      <NotificationPanel/>
      {notificationJson.data.map((notificationItem: NotificationItem) => (
        <NotificationBox
          key={notificationItem._id}
          notificationItem={notificationItem}
        />
      ))}
    </main>
  );
}
