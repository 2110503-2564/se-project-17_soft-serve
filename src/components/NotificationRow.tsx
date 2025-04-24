import { redirect } from 'next/navigation';
import { NotificationJson, NotificationItem } from "../../interfaces";
import { getServerSession } from "next-auth";
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';
import NotificationBox from "./NotificationBox";
import NotificationPanel from "./NotificationPanel";
import getNotifications from "@/libs/getNotifications";
import getUserProfile from "@/libs/getUserProfile";

export default async function NotificationRow() {
  const session = await getServerSession(authOptions);

  // If no session or user token, redirect to home page
  if (!session || !session.user || !session.user.token) {
    redirect('/');
    return null;
  }

  const token = session.user.token;

  // Fetch user profile and notifications
  let user, notificationJson;
  try {
    user = await getUserProfile(token);
    if (user.data.role !== 'user') {
      redirect('/');
      return null;
    }

    notificationJson = await getNotifications({ token });
  } catch (err) {
    console.error("Error fetching user or notifications:", err);
    // Handle error if needed, e.g., show a message or redirect
    return <div>Error loading notifications</div>;
  }

  // Render loading state if needed
  if (!notificationJson || !user) {
    return (
      <div className="absolute top-4 left-4 text-xl font-semibold text-gray-700">
        notifications loading...
      </div>
    );
  }

  // Sort notifications by `publishAt` (most recent first)
  const sortedNotifications = notificationJson.data.sort((a: NotificationItem, b: NotificationItem) => {
    const dateA = new Date(a.publishAt);
    const dateB = new Date(b.publishAt);
    return dateB.getTime() - dateA.getTime(); // Sort in descending order
  });

  return (
    <main className="w-screen m-0 p-0">
      <NotificationPanel />
      {sortedNotifications.map((notificationItem: NotificationItem) => (
        <NotificationBox
          key={notificationItem._id}
          notificationItem={notificationItem}
        />
      ))}
    </main>
  );
}
