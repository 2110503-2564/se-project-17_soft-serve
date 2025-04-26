'use client'
import React, { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import addNotification from '@/libs/addNotification';

interface ManagerNotificationCreateProps {
  token: string;
  restaurantId: string;
}

export default function ManagerNotificationCreate({ token, restaurantId }: ManagerNotificationCreateProps) {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [scheduledDateTime, setScheduledDateTime] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Clear both messages before showing a new one
  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Clear any existing messages
    clearMessages();
    
    if (!title) {
      setError('Please enter a title');
      return;
    } else if (!message) {
      setError('Please enter a message');
      return;
    }

    if (!token) {
      setError('You must be logged in to create notifications');
      return;
    }

    // Set publishAt based on whether a datetime was provided
    let publishAt = 'now';
    
    if (scheduledDateTime) {
      const scheduledDate = new Date(scheduledDateTime);
      const now = new Date();
      const gracePeriodMs = 0.9 * 60 * 1000;

      if (scheduledDate.getTime() < now.getTime() - gracePeriodMs) {
        setError('Scheduled time must not be in the past');
        return;
      }
      
      publishAt = scheduledDateTime;
    }

    setIsSubmitting(true);

    try {
      await addNotification({
        title,
        message,
        targetAudience: 'Customers', // Default for restaurant manager sending to customers
        createdBy: 'restaurantManager',
        publishAt,
        token,
        restaurant: restaurantId
      });

      setSuccess('Notification created successfully!');
      router.replace('/manager/notifications');

    } catch (err: any) {
      setError(err.message || 'Failed to create notification');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Common input field styles - reduced height and padding
  const inputClass = "w-full h-8 rounded-lg ring-1 ring-inset ring-gray-400 px-2 py-1 bg-slate-100 text-sm leading-4 indent-2 placeholder:text-gray-500";

  return (
    <div className="w-full bg-white text-gray-800 py-3 px-4 rounded-xl shadow-lg relative">
      <div className="text-center mb-3">
        <div className="text-xl font-bold mt-2 mb-1">Create a Notification</div>
        <div className="text-sm text-gray-600">for customers with reservations at my restaurant</div>
      </div>
      
      {error && (
        <div className="mx-4 mb-2 p-2 bg-red-100 border border-red-400 text-red-700 text-sm rounded">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mx-4 mb-2 p-2 bg-green-100 border border-green-400 text-green-700 text-sm rounded">
          {success}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <label htmlFor="title" className="block text-gray-800 text-sm font-semibold mb-1 pl-2">
          Title
        </label>
        <div className="flex justify-center items-center block mb-3">
          <input 
            value={title}
            onChange={(e) => setTitle(e.target.value)} 
            type="text" 
            id="title" 
            placeholder="Enter notification title"
            className={inputClass}
          />
        </div>
        
        <label htmlFor="message" className="block text-gray-800 text-sm font-semibold mb-1 pl-2">
          Message
        </label>
        <div className="flex justify-center items-center block mb-3">
          <input 
            value={message}
            onChange={(e) => setMessage(e.target.value)} 
            type="text" 
            id="message" 
            placeholder="Enter notification message"
            className={inputClass}
          />
        </div>
        
        <div>
          <label htmlFor="scheduled-datetime" className="block text-gray-800 text-sm font-semibold mb-1 pl-2">
            Publish Date
          </label>
          <div className="flex justify-center items-center block mb-2">
            <input 
              value={scheduledDateTime}
              onChange={(e) => setScheduledDateTime(e.target.value)} 
              type="datetime-local" 
              id="scheduled-datetime" 
              placeholder="Leave empty to send now" 
              className={inputClass}
            />
          </div>
          <p className="text-xs text-gray-600 text-center -mt-1 mb-3">
            If left empty, the post will be published immediately upon submission.
          </p>
        </div>
        
        <div className="flex flex-col justify-center items-center mt-3">
          <button 
            type="submit"
            disabled={isSubmitting}
            className="block bg-myred border border-white text-white text-sm font-semibold w-32 py-1 px-3 rounded-lg shadow-sm hover:bg-white hover:text-red-600 hover:border hover:border-red-600 disabled:bg-gray-400 disabled:text-gray-200 disabled:hover:bg-gray-400 disabled:hover:text-gray-200 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Sending...' : 'Submit'}
          </button>
        </div>
        
        <div className="text-center text-slate-500 text-xs mt-2 mb-2">
          {scheduledDateTime ? 'Your notification will be sent at the scheduled time.' : 'Your notification will be sent immediately.'}
        </div>
      </form>
    </div>
  );
}