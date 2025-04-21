'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import getRestaurants from "@/libs/getRestaurants";
import verifyRestaurant from "@/libs/verifyRestaurant";
import getAllRestaurantManagers from '@/libs/getAllRestaurantManagers';

import { StarIcon } from '@heroicons/react/20/solid'
import { ClockIcon } from '@heroicons/react/24/outline'
import { MapPinIcon } from '@heroicons/react/24/outline'
import { PhoneIcon } from '@heroicons/react/24/outline'
import { EnvelopeIcon } from '@heroicons/react/24/outline'
import { CalendarIcon } from '@heroicons/react/24/outline'


import { User, RestaurantItem } from "@../../../interfaces";
import Loader from './Loader';

export default function VerifyCard() {
    const { data: session } = useSession();
    const router = useRouter();
    const [userData, setUserData] = useState<User[]>([]);
    const [restaurantData, setRestaurantData] = useState<RestaurantItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!session || !session.user.token) return;

            try {
                const userRes = await getAllRestaurantManagers(session.user.token);
                const userList = Array.isArray(userRes.data) ? userRes.data : [userRes.data];
                setUserData(userList);
                console.log('User Data:', userList); // Log user data

                const restaurantRes = await getRestaurants();
                const restaurantList = Array.isArray(restaurantRes.data) ? restaurantRes.data : [];
                setRestaurantData(restaurantList);
                console.log('Restaurant Data:', restaurantList); // Log restaurant data
            } catch (error) {
                console.error("Failed to fetch data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [session]);

    const handleVerify = async (userId: string) => {
        const confirmed = window.confirm("Are you sure you want to APPROVE this user and restaurant?");
        if (!confirmed) return;

        if (!session || !session.user.token) return;
        try {
            await verifyRestaurant({ userId, isApprove: true, token: session.user.token });
            setUserData(prev => prev.filter(user => user._id !== userId));
            setRestaurantData(prev => prev.filter(res => res._id !== userId));
            router.refresh();
        } catch (error) {
            console.error("Failed to verify:", error);
        }
    };

    const handleReject = async (userId: string) => {
        const confirmed = window.confirm("Are you sure you want to REJECT this user and DELETE the restaurant?");
        if (!confirmed) return;

        if (!session || !session.user.token) return;
        try {
            await verifyRestaurant({ userId, isApprove: false, token: session.user.token });
            setUserData(prev => prev.filter(user => user._id !== userId));
            setRestaurantData(prev => prev.filter(res => res._id !== userId));
            router.refresh();
        } catch (error) {
            console.error("Failed to reject:", error);
        }
    };

    if (!session || !session.user.token) return <div>No token</div>;
    if (isLoading) return <Loader loadingtext="Loading ..." />;

    const unverifiedUsers = userData.filter((userItem) => !userItem.verified);
    if (unverifiedUsers.length === 0) {
        return (
            <main className="p-7">
                <div className="text-xl text-center text-gray-600 font-semibold">
                No pending restaurant verifications.
                </div>
            </main>
        );
    }

    return (
        <main>
            {userData
                .filter((userItem) => {
                    return (!userItem.verified);
                })
                .map((userItem) => {
                    console.log('Processing User:', userItem); // Log the user being processed

                    const matchedRestaurant = restaurantData.find(
                        (r) => r._id === userItem.restaurant // Check if user.restaurant matches restaurant _id
                    );

                    return (
                        <div key={userItem._id} className="p-7">
                            {/* User Info */}
                            <div className="flex flex-col">
                                <div className="flex items-center justify-between">
                                    <div className="text-3xl font-bold">{userItem.name}</div>
                                    <div className="flex flex-row">
                                        <button
                                            onClick={() => handleVerify(userItem._id)}
                                            className="ml-4 px-6 py-2 text-white font-bold bg-[#00C642] rounded-xl hover:bg-[#7AF1A2] shadow-lg w-[150px]"
                                        >
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => handleReject(userItem._id)}
                                            className="ml-4 px-6 py-2 text-white font-bold bg-[#D40303] rounded-xl hover:bg-[#F97F7F] shadow-lg w-[150px]"
                                        >
                                            Reject
                                        </button>
                                    </div>
                                </div>
                                <div className="pt-2 pb-2">
                                    <div className='flex'>
                                        <PhoneIcon className="h-5 w-5 mr-3 mt-0.5"/>
                                        {userItem.tel}
                                    </div>
                                    
                                    <div className='flex'>
                                        <EnvelopeIcon className="h-5 w-5 mr-3 mt-0.5"/>
                                        {userItem.email}
                                    </div>
                                    <div className='flex'>
                                        <CalendarIcon className="h-5 w-5 mr-3 mt-0.5"/>
                                        {new Date(userItem.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>

                            {/* Restaurant Info */}
                            {matchedRestaurant ? (
                                <div></div>
                            ) : (
                                <div className="text-lg font-semibold text-red-600">No restaurant information available for this manager.</div>
                            )}
                            {matchedRestaurant && (
                                <div className="flex flex-col md:flex-row p-5 border border-gray-300 rounded-lg shadow-sm mb-5 mt-5">
                                    <div className="relative w-[240px] h-[200px] overflow-hidden rounded-lg shadow-lg">
                                        <Image
                                            src={matchedRestaurant.imgPath}
                                            alt="Restaurant Image"
                                            fill
                                            className="rounded-lg object-cover"
                                        />
                                    </div>
                                    <div className="pl-0 md:pl-10 pt-5 md:pt-0 w-full">
                                        <div className="flex justify-between items-center">
                                            <div className="text-3xl font-bold">{matchedRestaurant.name}</div>
                                        </div>

                                        <div className='flex'>
                                            <MapPinIcon className="h-5 w-5 mr-3 mt-2.5"/>
                                            <div className="pt-2 pb-2">
                                                {matchedRestaurant.address}, {matchedRestaurant.province}, {matchedRestaurant.district}, {matchedRestaurant.postalcode}
                                            </div>    
                                        </div>
                                        
                                        <div className="text-xl font-bold">About the restaurant</div>
                                        <div className="pt-2 pb-2">{matchedRestaurant.description}</div>
                                        <div className="font-semibold">
                                            Food Type |
                                            <span className="font-normal ml-1">{matchedRestaurant.foodType}</span>
                                        </div>
                                        <div className='flex'>
                                            <ClockIcon className="h-5 w-5 mr-3 mt-0.5"/>
                                            {matchedRestaurant.openTime} - {matchedRestaurant.closeTime}
                                        </div>
                                        <div className='flex'>
                                            <PhoneIcon className="h-5 w-5 mr-3 mt-0.5"/>
                                            {matchedRestaurant.tel}
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="border-t border-gray-300 mt-10"></div>
                        </div>
                    );
                })}
        </main>
    );
}
