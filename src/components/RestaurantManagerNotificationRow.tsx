import RestaurantManagerNotificationPanel from "./RestaurantManagerNotificationPanel";
import RestaurantManagerNotificationBox from "./RestaurantManagerNotificationBox";
import getNotifications from "@/libs/getNotifications";
import getUserProfile from "@/libs/getUserProfile";
import { redirect } from 'next/navigation';
import { NotificationJson, NotificationItem } from "../../interfaces";
import { getServerSession } from "next-auth";
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';

export default async function RestaurantManagerNotificationRow() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.token) return null;

  const token = session.user.token;
  const user = await getUserProfile(token);
  if (user.data.role !== 'restaurantManager') {
    redirect('/');
    return null;
  }
  const notificationJson: NotificationJson = await getNotifications({ token });



  const adminNotifications = notificationJson.data.filter(
    (item: NotificationItem) => item.createdBy === 'admin'
  );

  const managerNotifications = notificationJson.data.filter(
    (item: NotificationItem) => item.createdBy === 'restaurantManager'
  );

  return (
    <main className="w-screen m-0 p-0">
      <RestaurantManagerNotificationPanel/>
      {adminNotifications.map((notificationItem: NotificationItem) => (
        <RestaurantManagerNotificationBox
          key={notificationItem._id}
          notificationItem={notificationItem}
        />
      ))}
      <RestaurantManagerNotificationPanel/>
      {managerNotifications.map((notificationItem: NotificationItem) => (
        <RestaurantManagerNotificationBox
          key={notificationItem._id}
          notificationItem={notificationItem}
        />
      ))}
    </main>
    
  );
}