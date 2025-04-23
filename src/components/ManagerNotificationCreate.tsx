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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
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
      
      if (scheduledDate <= now) {
        setError('Scheduled time must be in the future');
        return;
      }
      
      publishAt = scheduledDateTime;
    }

    setIsSubmitting(true);
    setError('');
    setSuccess('');

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
      setTitle('');
      setMessage('');
      setScheduledDateTime('');
      router.replace('/');
    } catch (err: any) {
      setError(err.message || 'Failed to create notification');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Common input field styles
  const inputClass = "w-4/5 h-10 rounded-xl ring-1 ring-inset ring-gray-400 px-2 py-1 bg-slate-100 text-lg leading-4 indent-3 placeholder:text-gray-500";

  return (
    <div className="w-full bg-white text-gray-800 py-8 px-20 rounded-3xl shadow-2xl relative">
      <div className="text-center mb-8">
        <div className="text-3xl font-bold mt-6 mb-2">Create a Notification</div>
        <div className="text-lg text-gray-600">for customers with reservations at my restaurant</div>
      </div>
      
      {error && (
        <div className="mx-20 mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mx-20 mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {success}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <label htmlFor="title" className="block text-gray-800 text-lg font-semibold mb-2 pl-20">
          Title
        </label>
        <div className="flex justify-center items-center block mb-6">
          <input 
            value={title}
            onChange={(e) => setTitle(e.target.value)} 
            type="text" 
            id="title" 
            placeholder="Enter notification title"
            className={inputClass}
          />
        </div>
        
        <label htmlFor="message" className="block text-gray-800 text-lg font-semibold mb-2 pl-20">
          Message
        </label>
        <div className="flex justify-center items-center block mb-6">
          <input 
            value={message}
            onChange={(e) => setMessage(e.target.value)} 
            type="text" 
            id="message" 
            placeholder="Enter notification message"
            className={inputClass}
          />
        </div>
        
        <label htmlFor="scheduled-datetime" className="block text-gray-800 text-lg font-semibold mb-2 pl-20">
          Schedule Time (Optional)
        </label>
        <div className="flex justify-center items-center block mb-6">
          <input 
            value={scheduledDateTime}
            onChange={(e) => setScheduledDateTime(e.target.value)} 
            type="datetime-local" 
            id="scheduled-datetime" 
            placeholder="Leave empty to send now" 
            className={inputClass}
          />
        </div>
        
        <div className="flex flex-col justify-center items-center mt-8">
          <button 
            type="submit"
            disabled={isSubmitting}
            className="block bg-myred border border-white text-white text-xl font-semibold w-40 py-2 px-4 rounded-xl shadow-sm hover:bg-white hover:text-red-600 hover:border hover:border-red-600 disabled:bg-gray-400 disabled:text-gray-200 disabled:hover:bg-gray-400 disabled:hover:text-gray-200 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Sending...' : 'Submit'}
          </button>
        </div>
        
        <div className="text-center text-slate-500 mt-4 mb-4">
          {scheduledDateTime ? 'Your notification will be sent at the scheduled time.' : 'Your notification will be sent immediately.'}
        </div>
      </form>
    </div>
  );
}