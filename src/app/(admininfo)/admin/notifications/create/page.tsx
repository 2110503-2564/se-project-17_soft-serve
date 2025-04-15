'use client'
import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import getUserProfile from '@/libs/getUserProfile';

export default function CreateNotification() {
    const router = useRouter();
    const { data: session } = useSession();
    
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [targetAudience, setTargetAudience] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
        setTargetAudience(event.target.value === targetAudience ? null : event.target.value);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        
        if (!title || !message || !targetAudience) {
            setError('Please complete all fields');
            return;
        }

        // Check if user is authenticated
        if (!session || !session.user || !session.user.token) {
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

        setIsSubmitting(true);
        setError('');
        setSuccess('');

        try {
            const token = session.user.token;
            
            const response = await fetch(`${process.env.BACKEND_URL}api/v1/notifications`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    title,
                    message,
                    targetAudience: apiTargetAudience
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to create notification');
            }

            setSuccess('Notification created successfully!');
            setTitle('');
            setMessage('');
            setTargetAudience(null);
            router.replace('/admin/notifications');
        } catch (err: any) {
            setError(err.message || 'Failed to create notification');
        } finally {
            setIsSubmitting(false);
        }
    }

    const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
    
    useEffect(() => {
        const checkAdmin = async () => {
            if (!session || !session.user?.token) {
                setIsAdmin(false);
                router.push('/');
                return;
            }

            try {
                const userProfile = await getUserProfile(session.user.token);
                const isUserAdmin = userProfile.data.role === 'admin';
                setIsAdmin(isUserAdmin);

                // ❗ redirect only after role is known
                if (!isUserAdmin) {
                    router.push('/');
                }
            } catch (error) {
                console.error("Failed to fetch user profile:", error);
                setIsAdmin(false);
                router.push('/');
            }
        };

        checkAdmin();
    }, [session, router]);

    if (isAdmin === null) return <div>Loading...</div>;

    if (!isAdmin) return null; // wait for router.push to trigger


    return (
        <main className="bg-myred h-[calc(100vh-60px)] flex justify-center items-center flex-col md:px-20 lg:px-80 overflow-auto">
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
                            placeholder="title"
                            className="w-4/5 h-10 rounded-xl ring-1 ring-inset ring-gray-400 px-2 py-1 bg-slate-100 text-lg leading-4 indent-3 placeholder:text-gray-800"
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
                            placeholder="message"
                            className="w-4/5 h-10 rounded-xl ring-1 ring-inset ring-gray-400 px-2 py-1 bg-slate-100 text-lg leading-4 indent-3 placeholder:text-gray-800"
                        />
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
                    
                    <div className="flex flex-col justify-center items-center">
                        <div className="relative">
                            <button 
                                type="submit"
                                disabled={isSubmitting}
                                className='block bg-myred border border-white text-white text-xl font-semibold w-[150px] py-2 px-4 m-5 rounded-xl shadow-sm hover:bg-white hover:text-red-600 hover:border hover:border-red-600 disabled:bg-gray-400 disabled:text-gray-200 disabled:hover:bg-gray-400 disabled:hover:text-gray-200 disabled:cursor-not-allowed'
                            >
                                {isSubmitting ? 'Sending...' : 'Submit'}
                            </button>
                        </div>
                    </div>
                </form>
                <div className="text-center text-slate-500 mb-4">
                    Please review your input carefully before sending the notification.
                </div>
            </div>
        </main>
    );
}