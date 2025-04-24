
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import getUserProfile from "@/libs/getUserProfile";
import getNotifications from "@/libs/getNotifications";
import NotificationBox from "@/components/NotificationBox";
import NotificationPanel from "@/components/NotificationPanel";
import { redirect } from "next/navigation";
import { NotificationItem } from "../../../interfaces";
import Loader from "@/components/Loader";
import { SearchParams } from "../../../interfaces";

export default async function Notification({
    searchParams,
  }: {
    searchParams?: Promise<SearchParams>;
  }) {
    const resolvedSearchParams = (await searchParams) ?? {};
  const page = parseInt(resolvedSearchParams.page || '1');
  const limit = parseInt(resolvedSearchParams.limit || '10');
    

  const session = await getServerSession(authOptions);
  if (!session || !session.user?.token) redirect('/');
  const token = session.user.token;

  const user = await getUserProfile(token);
  if (user.data.role !== 'user') redirect('/');

  const notificationJson = await getNotifications({ token, page, limit });
  if (!notificationJson || !user) {
    return (
      <Loader loadingtext="notifications loading..."/>
    );
  }

  // Calculate total pages
  const totalItems = notificationJson.total || 0;
  const totalPages = Math.ceil(totalItems / limit);



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
    
          {/* Pagination with <a> tags */}
          <div className="flex justify-center mt-0 space-x-4 py-5  ">
            <a
              href={`?page=${page - 1}&limit=${limit}`}
              className={`px-4 py-2 bg-gray-200 rounded border border-gray-200 hover:border-gray-400 ${
                page === 1 ? 'opacity-50 pointer-events-none' : ''
              }`}
            >
              Previous
            </a>
            <span className="flex items-center text-sm">
              Page {page} of {totalPages}
            </span>
            <a
              href={`?page=${page + 1}&limit=${limit}`}
              className={`px-4 py-2 bg-gray-200 rounded border border-gray-200 hover:border-gray-400 ${
                page === totalPages ? 'opacity-50 pointer-events-none' : ''
              }`}
            >
              Next
            </a>
          </div>
        </main>
      );
    }