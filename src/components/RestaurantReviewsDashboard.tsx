
import { getServerSession } from "next-auth";
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';
import RestaurantReviewsTable from "@/components/RestaurantReviewsTable";
import TotalRate from "@/components/OverallRating";
import Image from "next/image";

import getRestaurant from "@/libs/getRestaurant";
import { OneRestaurantJson } from "../../interfaces";
import { useParams } from "next/navigation";
import { Params } from "next/dist/server/request/params";
import { ReviewJson } from "../../interfaces";
import getReviewOneRestaurant from "@/libs/getReviewsOneRestaurant";

export default async function RestaurantReviewsDashboard( {rid}:{rid:string}){

    const session = await getServerSession(authOptions);
    console.log("SESSION:", session);
    console.log("rid :",rid);

    if (!session || !session.user || !session.user.token) {
        return (
          <main className="text-white p-10">
            <h1 className="text-2xl font-bold">You must be logged in to view this page</h1>
          </main>
        );
    }

    if(!rid)return

    // Fetch restaurant data
    // const restaurantJson = await getRestaurants();
    // const restaurant: Restaurant | undefined = restaurantJson.data.find(
    //     (r: Restaurant) => r.id === rid
    // );
     const oneRestaurantJson:OneRestaurantJson = await getRestaurant(rid.toString());
     const reviewJson: ReviewJson = await getReviewOneRestaurant({
        restaurantId:rid.toString(),
        token: session.user.token,
      });
    
    if (!oneRestaurantJson.data) {
        return (
            <main className="text-white p-10">
                <h1 className="text-2xl font-bold">Restaurant Not Found</h1>
            </main>
        );
    }

    const restaurant=oneRestaurantJson.data;



    const avgRating = parseFloat((restaurant.rating || 4.2).toFixed(1));

    return (
        <main className="bg-white min-h-screen text-black">
            {/* add myred topbar */}
            <div className="w-full h-[60px] bg-myred flex flex-row justify-between items-center z-50 fixed top-15 left-0 right-0">
                <div className="text-2xl font-semibold p-5 text-white">
                Reviews
                </div>
            </div>

            {/* Image */}
            <div className="relative w-screen h-[60vh]">
                <Image
                    src={restaurant.imgPath}
                    alt="Restaurant Banner"
                    fill
                    className="object-cover"
                />
            </div>

            {/* Restaurant Name */}
            <div className="text-center mt-10 text-4xl font-bold">
                [ {restaurant.name} ]
            </div>

            {/* Overall Rating */}
            <div className="flex flex-col items-center mt-4 mb-10">
                <div className="text-lg font-semibold">Overall Rating</div>
                <div className="relative flex flex-col items-center scale-125">
                    <TotalRate value={avgRating} />
                    <div className="absolute -top-6 text-sm font-bold p-10 mt-5">
                        {avgRating}/5
                    </div>
                </div>
            </div>

            {/* Reviews Table */}
            <div className='flex flex-col items-center'>
                <RestaurantReviewsTable restaurantId ={rid.toString()} reviewJson={reviewJson} />
            </div>
        </main>

    );
}
