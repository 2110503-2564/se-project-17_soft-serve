'use client';
import deleteNotification from "@/libs/deleteNotification";
import { NotificationItem } from "../../interfaces";
import { useSession } from "next-auth/react";
import React from "react";
import { useState } from 'react';
import { useRouter } from 'next/navigation'

export default function AdminNotificationBox({notificationItem}: { notificationItem: NotificationItem}) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  if (isDeleting) return null;

  const handleDeleteClick = async () => {
    const confirmed = window.confirm("Are you sure you want to DELETE this notification?");
    if (!confirmed) return;
    if (!session) return;
    setIsDeleting(true);
    try {
      await deleteNotification({notificationId: notificationItem._id, token: session?.user.token});
      router.refresh();
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  return (
    <div className="w-full bg-white border border-gray-300 px-8 py-4 rounded-md shadow-sm">
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
                //? new Date(notificationItem.createdAt).toLocaleString()
                ? new Date(notificationItem.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
                : "N/A"},
                {notificationItem.createdAt
                ? new Date(notificationItem.createdAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true}).replace('am', 'AM').replace('pm', 'PM')
                : "N/A"}
            </div>
          </div>
        </div>

        <div className="ml-4 self-center">
          <button onClick={handleDeleteClick}
            className="bg-myred border border-myred text-white text-lg font-semibold w-[120px] py-1 px-3 rounded-xl shadow-sm hover:bg-red-700 hover:border-red-700">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
