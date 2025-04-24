'use client'
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import addNotification from '@/libs/addNotification';

interface AdminCreateNotificationProps {
  token: string;
}

export default function AdminCreateNotification({ token }: AdminCreateNotificationProps) {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [targetAudience, setTargetAudience] = useState<string | null>(null);
  const [scheduledDateTime, setScheduledDateTime] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTargetAudience(event.target.value === targetAudience ? null : event.target.value);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!title && !message && !targetAudience) {
      setError('Please complete all fields');
      return;
    } else if(!title) {
      setError('Please enter a title');
      return;
    } else if(!message) {
      setError('Please enter a message');
      return;
    } else if(!targetAudience) {
      setError('Please select a target audience');
      return;
    }

    // Check if user is authenticated
    if (!token) {
      setError('You must be logged in to create notifications');
      return;
    }

    let apiTargetAudience: 'Customers' | 'RestaurantManagers' | 'All' | undefined;
    if (targetAudience === 'customer') {
      apiTargetAudience = 'Customers';
    } else if (targetAudience === 'manager') {
      apiTargetAudience = 'RestaurantManagers';
    } else if (targetAudience === 'all') {
      apiTargetAudience = 'All';
    }

    if (!apiTargetAudience) {
      setError('Please select a target audience');
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
            targetAudience: apiTargetAudience, // Default for restaurant manager sending to customers
            createdBy: 'admin',
            publishAt,
            token
        });

      setSuccess('Notification created successfully!');
      setTitle('');
      setMessage('');
      setTargetAudience(null);
      setScheduledDateTime('');
      router.replace('/admin/notifications');
    } catch (err: any) {
      setError(err.message || 'Failed to create notification');
    } finally {
      setIsSubmitting(false);
    }
  }

  // Common input field styles
  const inputClass = "w-4/5 h-10 rounded-xl ring-1 ring-inset ring-gray-400 px-2 py-1 bg-slate-100 text-lg leading-4 indent-3 placeholder:text-gray-500";

  return (
    <div className="w-full bg-white text-gray-800 py-8 px-20 rounded-3xl shadow-2xl relative">
      <div className="text-3xl font-bold text-center mt-6 mb-8">
        Create a Notification
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

        <div>
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
          <p className="text-sm text-gray-600 text-center -mt-4 mb-6">
            If left empty, the post will be published immediately upon submission.
          </p>
        </div>        
        
        <label htmlFor="target" className="block text-gray-800 text-lg font-semibold pl-20">
          Target Audience
        </label>
        <div className="flex justify-center items-center p-4 rounded-xl space-x-4">
          <div className="flex items-center">
            <input 
              id="customer" 
              type="checkbox" 
              value="customer" 
              name="target"
              className="w-5 h-5 border-gray-300 rounded-xl" 
              style={{accentColor:'red'}}
              checked={targetAudience === 'customer'}
              onChange={handleCheckboxChange}
            />
            <label htmlFor="customer" className="ml-2 text-lg text-gray-800">
              Customers
            </label>
          </div>
          <div className="flex items-center">
            <input 
              id="manager" 
              type="checkbox" 
              value="manager" 
              name="target"
              className="w-5 h-5 ml-12 border-gray-300 rounded-xl" 
              style={{accentColor:'red'}}
              checked={targetAudience === 'manager'}
              onChange={handleCheckboxChange}
            />
            <label htmlFor="manager" className="ml-2 text-lg text-gray-800">
              Restaurant managers
            </label>
          </div>
          <div className="flex items-center">
            <input 
              id="all" 
              type="checkbox" 
              value="all" 
              name="target"
              className="w-5 h-5 ml-12 border-gray-300 rounded-xl" 
              style={{accentColor:'red'}}
              checked={targetAudience === 'all'}
              onChange={handleCheckboxChange}
            />
            <label htmlFor="all" className="ml-2 text-lg text-gray-800">
              All
            </label>
          </div>
        </div>
        
        <div className="flex flex-col justify-center items-center mt-6">
          <button 
            type="submit"
            disabled={isSubmitting}
            className='block bg-myred border border-white text-white text-xl font-semibold w-40 py-2 px-4 rounded-xl shadow-sm hover:bg-white hover:text-red-600 hover:border hover:border-red-600 disabled:bg-gray-400 disabled:text-gray-200 disabled:hover:bg-gray-400 disabled:hover:text-gray-200 disabled:cursor-not-allowed'
          >
            {isSubmitting ? 'Sending...' : 'Submit'}
          </button>
        </div>
      </form>
      <div className="text-center text-slate-500 mt-4 mb-4">
        {scheduledDateTime ? 'Your notification will be sent at the scheduled time.' : 'Your notification will be sent immediately.'}
      </div>
    </div>
  );
}