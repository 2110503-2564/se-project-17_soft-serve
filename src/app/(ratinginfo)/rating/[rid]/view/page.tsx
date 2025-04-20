'use client'
import { getServerSession } from "next-auth";
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';
import RestaurantReviewsTable from "@/components/RestaurantReviewsTable";
import TotalRate from "@/components/OverallRating";
import Image from "next/image";
import getRestaurants from "@/libs/getRestaurants";
import getRestaurant from "@/libs/getRestaurant";
import { OneRestaurantJson, RestaurantItem } from "../../../../../../interfaces";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Loader from "@/components/Loader";

export default function RestaurantReviewsView() {
    const [restaurantDetail, setRestaurantDetail] = useState<RestaurantItem>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { rid } = useParams();

    if (!rid) {
        return (
            <div className="m-5 text-lg text-medium">
                <strong>Error:</strong> Invalid or missing restaurant ID.
            </div>
        );
    }

    useEffect(() => {
        const fetchRestaurant = async () => {
            if (rid) {
                try {
                    const data: OneRestaurantJson = await getRestaurant(rid.toString());
                    if (data) {
                        setRestaurantDetail(data.data);
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
        return <Loader loadingtext='Loading Reviews...'/>;
    }

    if (error) {
        return <div className="m-5 text-lg text-medium">{error}</div>;
    }

    if (!restaurantDetail) {
        return <div className="m-5 text-lg text-medium">Invalid Restaurant ID</div>;
    }

    return (
        <main className="bg-white min-h-screen text-black">
            {/* ✅ Fixed Top Bar */}
            <div className="w-full h-[60px] bg-myred flex flex-row justify-between items-center z-50 top-15 left-0 right-0">
                <div className="text-2xl font-semibold p-5 text-white">
                    Reviews
                </div>
            </div>

            {/* ✅ Image section pushed below the fixed bar */}
            <div className="relative w-screen h-[60vh] pt-[60px]">
                <Image
                    src={restaurantDetail.imgPath}
                    alt="Restaurant Banner"
                    fill
                    className="object-cover"
                />
            </div>

            {/* Restaurant Name */}
            <div className="text-center mt-10 text-4xl font-bold">
                [ {restaurantDetail.name} ]
            </div>

            {/* Overall Rating */}
            <div className="flex flex-col items-center mt-4 mb-10">
                <div className="text-lg font-semibold">Overall Rating</div>
                <div className="relative flex flex-col items-center scale-125">
                    <TotalRate value={restaurantDetail.ratingrating || 0} />
                    <div className="absolute -top-6 text-sm font-bold p-10 mt-5">
                        {restaurantDetail.ratingrating}/5
                    </div>
                </div>
            </div>

            {/* Reviews Table */}
            <div className="flex flex-col items-center">
                <RestaurantReviewsTable restaurantId={rid.toString()} />
            </div>
        </main>
    );
}
