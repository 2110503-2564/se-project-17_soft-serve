'use client'

import Image from "next/image"
import { StarIcon } from '@heroicons/react/20/solid'
import { ClockIcon } from '@heroicons/react/24/outline'
import { MapPinIcon } from '@heroicons/react/24/outline'
import { PhoneIcon } from '@heroicons/react/24/outline'
import getRestaurant from "@/libs/getRestaurant"
import Link from "next/link"

import { useEffect, useState } from "react";
import { useParams } from "next/navigation"

export default function RestaurantDetailPage() {
    const [restaurantDetail, setRestaurantDetail] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { rid } = useParams();

    useEffect(() => {
        const fetchRestaurant = async () => {
        if (rid) {
            try {
            const data = await getRestaurant(rid.toString());
            if (data) {
                setRestaurantDetail(data);
            } else {
                setError("Restaurant not found");
            }
            } catch (err) {
            setError("Failed to load restaurant data");
            } finally {
            setLoading(false);
            }
        }
        };

        fetchRestaurant();
    }, [rid]);

    if (loading) {
        return <div className="m-5 text-lg text-medium">Loading Restaurant...</div>;
    }

    if (error) {
        return <div className="m-5 text-lg text-medium">{error}</div>;
    }

    if (!restaurantDetail) {
        return <div className="m-5 text-lg text-medium">Invalid Restaurant ID</div>;
    }

    return (
        <main>
            <div className='w-screen h-[50vh] relative block p-5 m-0'>
                <Image src={restaurantDetail.data.imgPath}
                    alt='cover'
                    fill={true}
                    priority
                    objectFit='cover'/>
            </div>

            <div className="text-[19px] text-gray-800 px-12 mx-5">
                <div className="flex items-center text-3xl font-bold pt-8">
                    {restaurantDetail.data.name}
                    <StarIcon className="h-6 w-6 text-yellow-400 ml-2"/>
                    <span className="font-semibold text-2xl mt-1 ml-1.5">
                        {restaurantDetail.data.rating}
                    </span>
                </div> 
                <div className="pt-2 flex">
                    <MapPinIcon className="h-5 w-5 mr-2 mt-0.5"/>
                    {restaurantDetail.data.address}, {restaurantDetail.data.district}, {restaurantDetail.data.province}, Thailand {restaurantDetail.data.postalcode}
                </div>
                <div className="text-xl font-bold pt-4">
                    About this Restaurant
                    <div className="text-[19px] font-normal pt-2">
                        {restaurantDetail.data.description}
                    </div>
                </div>
                <div>
                    <div className="font-semibold pt-2">
                        Food Type |
                        <span className="font-normal ml-1">
                            {restaurantDetail.data.foodType}
                        </span>
                    </div>
                    <div className="flex pt-1.5">
                        <ClockIcon className="h-5 w-5 mr-3 mt-0.5"/>
                        {restaurantDetail.data.openTime} - {restaurantDetail.data.closeTime}
                    </div>
                    <div className="flex pt-1.5 pb-10">
                        <PhoneIcon className="h-5 w-5 mr-3 mt-0.5"/>
                        {restaurantDetail.data.tel}
                    </div>
                </div>
            </div>
            <Link href={`/reservations/${rid}`}>
                <button name="Reserve" className='block bg-myred border border-white text-white text-xl font-semibold py-2 px-10 m-5 rounded-xl z-30 absolute bottom-1 right-14 shadow-sm hover:bg-white hover:text-red-600 hover:border hover:border-red-600'>
                    Reserve
                </button>
            </Link>
        </main>
    )
}