'use client'

import { useState, useEffect } from "react";
import getReservation from "@/libs/getReservation";
import { OneReservationJson } from "../../interfaces";
import dayjs from 'dayjs';
import Image from "next/image"
import { StarIcon } from '@heroicons/react/20/solid'
import { ClockIcon } from '@heroicons/react/24/outline'
import { MapPinIcon } from '@heroicons/react/24/outline'
import { PhoneIcon } from '@heroicons/react/24/outline'
import ReserveBox from '@/components/ReserveBox';

export default function EditBox({ reservationId, token }: { reservationId: string, token: string }) {
    const [reservation, setReservation] = useState<OneReservationJson | null>(null);

    useEffect(() => {
        const fetchReservation = async () => {
            try {
                const fetchedReservation : OneReservationJson = await getReservation({ id: reservationId, token: token });
                // console.log(fetchedReservation);
                setReservation(fetchedReservation);
            } catch (error) {
                console.error(error);
            }
        };
        fetchReservation();
    }, [reservationId, token]);

    if (!reservation || !reservation.data) return;
    const restaurant = reservation.data.restaurant;
    // console.log(restaurant);

    return (
        <div className="w-[100%] flex flex-col items-center justify-center">
            {/*Banner*/}
            <div className='w-screen h-[40vh] relative'>
                <Image src={restaurant.imgPath}
                    alt='cover'
                    fill={true}
                    priority
                    className="object-cover"/>
                <div className="relative text-white z-20 flex flex-col items-center justify-end h-full">                    
                    <div className="text-4xl font-bold items-center flex"
                        style={{textShadow:'3px 3px 5px rgba(0, 0, 0, 0.6)'}}>
                        {restaurant.name}
                        <StarIcon className="h-6 w-6 text-yellow-400 mt-0.5 ml-2"/>
                        <span className="font-normal text-2xl mt-2 ml-1.5">
                            {restaurant.ratingrating}
                        </span>
                    </div>
                    <div className="text-lg pt-2 flex"
                    style={{textShadow:'4px 4px 10px rgba(0, 0, 0, 0.9)'}}>
                        <MapPinIcon className="h-5 w-5 mr-2 mt-0.5"/>
                        {restaurant.address}, {restaurant.district}, {restaurant.province}, Thailand {restaurant.postalcode}
                    </div>
                    <div className='pt-8'></div>
                    <div className="text-black flex bg-gray-100 rounded-lg px-10 py-1">
                        <ClockIcon className="h-5 w-5 mr-2 mt-0.5"/>
                            {restaurant.openTime} - {restaurant.closeTime}
                        <PhoneIcon className="h-5 w-5 ml-4 mr-2 mt-0.5"/>
                            {restaurant.tel}
                    </div>
                    <div className='pb-12'></div>
                </div>
            </div>
            
            {/*Form*/}
            <div className="text-3xl text-gray-800 pt-8 pb-8">
                <div className='font-bold'>
                    Edit the Reservation at {restaurant.name}
                </div>
            </div>
            <ReserveBox restaurantId={restaurant._id} isUpdate={true} reservationId={reservationId} reservationData={reservation}/>

            <div className="flex space-x-4 mb-4 font-semibold">
                <button 
                    name="Discard Change" 
                    className="block w-[280px] bg-gray-500 border border-white text-white text-xl px-8 py-2 rounded-xl shadow-sm hover:bg-white hover:text-gray-500 hover:border hover:border-gray-500"
                    onClick={() => window.location.href = '/reservations'}>
                    Discard Change
                </button>
             </div>
        </div>
    );
}
