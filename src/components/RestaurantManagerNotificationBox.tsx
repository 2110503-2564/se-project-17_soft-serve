'use client';
import deleteNotification from "@/libs/deleteNotification";
import { NotificationItem } from "../../interfaces";
import { useSession } from "next-auth/react";
import React, { useEffect } from "react";
import { useState } from 'react';
import { useRouter } from 'next/navigation'

export default function RestaurantManagerNotificationBox({notificationItem ,  onDelete}: { notificationItem: NotificationItem ; onDelete: (id: string) => void;}) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);



  if (isDeleting) {
    return (
      <div className="w-full bg-yellow-50 border border-yellow-200 px-8 py-4 shadow-sm">
        <p className="text-yellow-700 font-medium text-center">
          Deleting notification...
        </p>
      </div>
    );
  }


  if (isDeleted) {
    return (
      <div className="w-full bg-green-50 border border-green-200 px-8 py-4 shadow-sm transition-all duration-700">
        <p className="text-green-700 font-medium text-center">
          Notification successfully deleted!
        </p>
      </div>
    );
  }


  const handleDeleteClick = async () => {
    if (!session) return;
  
    const reason = window.prompt("Please enter the reason for deleting this notification:");
    if (!reason || reason.trim() === "") {
      alert("Deletion cancelled. A reason is required.");
      return;
    }
  
    const confirmed = window.confirm("Are you sure you want to DELETE this notification?");
    if (!confirmed) return;
  
    setIsDeleting(true);
    try {
      await deleteNotification({
        notificationId: notificationItem._id,
        token: session.user.token
      });

      setTimeout(() => {
        setIsDeleting(false);
      }, 1500);
      // Show the success message for 1 seconds before refreshing
      
        setIsDeleted(true);
      
      setTimeout(() => {
        onDelete(notificationItem._id);
      }, 2500);
      
    } catch (error) {
      console.error('Failed to delete notification:', error);
      setIsDeleting(false);
      alert('Failed to delete notification. Please try again.');
    }
  };

  const isFromResM = notificationItem.createdBy === 'restaurantManager';

  return (
    <div className="w-full bg-white border border-gray-300 px-8 py-4 shadow-sm">
      <div className="flex justify-between items-center">
        <div className="flex flex-col w-full">
          <h2 className="text-lg font-semibold mb-2">
            {notificationItem.title}
          </h2>
          <p className="text-gray-700 mb-1.35">{notificationItem.message}</p>

          {isFromResM && (
            <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-600 mt-4">
              <div>
                <span className="font-medium">Publish At:</span>{" "}
                {notificationItem.publishAt
                  ? new Date(notificationItem.publishAt).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
                  : "N/A"},
                  {notificationItem.publishAt
                  ? new Date(notificationItem.publishAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true}).replace('am', 'AM').replace('pm', 'PM')
                  : "N/A"}
              </div>
            </div>
          )}
        </div>

        {isFromResM && (
          <div className="ml-4 self-center">
            <button onClick={handleDeleteClick}
              className="bg-myred border border-myred text-white text-lg font-semibold w-[120px] py-1 px-3 rounded-xl shadow-sm hover:bg-red-700 hover:border-red-700">
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}