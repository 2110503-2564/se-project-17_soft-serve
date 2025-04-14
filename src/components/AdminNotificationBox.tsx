'use client';

import deleteNotification from "@/libs/deleteNotification";
import { NotificationItem } from "../../interfaces";
import { useSession } from "next-auth/react";
import React from "react";

export default function AdminNotificationBox({notificationItem}: { notificationItem: NotificationItem;}) {
  const { data: session } = useSession();
  if (!session) return null;

  return (
    <div className="w-full bg-white border border-gray-300 p-5 rounded-md shadow-sm">
      <div className="flex justify-between items-center">
        <div className="flex flex-col w-full">
          <h2 className="text-lg font-semibold mb-2">
            {notificationItem.title}
          </h2>
          <p className="text-gray-700 mb-4">{notificationItem.message}</p>
          <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-600">
            <div>
              <span className="font-medium">Creator ID:</span>{" "}
              {notificationItem.creatorId}
            </div>
            <div>
              <span className="font-medium">Target Audience:</span>{" "}
              {notificationItem.targetAudience}
            </div>
            <div>
              <span className="font-medium">Created By:</span>{" "}
              {notificationItem.createdBy}
            </div>
            <div>
              <span className="font-medium">Created At:</span>{" "}
              {notificationItem.createdAt
                ? new Date(notificationItem.createdAt).toLocaleString()
                : "N/A"}
            </div>
          </div>
        </div>

        <div className="ml-4 self-center">
          <button
            className="bg-red-600 border border-red-600 text-white text-lg font-semibold w-[120px] py-1 px-3 rounded-xl shadow-sm hover:bg-red-700 hover:border-red-700"
            onClick={() =>
              deleteNotification({
                notificationId: notificationItem._id,
                token: session?.user.token,
              })
            }
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
