import Image from "next/image";
import Link from "next/link";
import { RestaurantItem } from "../../interfaces";

export default function RestaurantListItem({ restaurantItem }: { restaurantItem: RestaurantItem }) {
    return (
        <div className="mx-20 my-10 flex items-start transition-shadow duration-300 border-b border-gray-300 pb-10">
            <div className="w-[200px] h-[200px] overflow-hidden rounded-xl shadow-lg hover:shadow-2xl">
                <Link href={`/restaurants/${restaurantItem.id}`}>
                    <Image className="object-cover w-full h-full"
                        src={restaurantItem.imgPath} alt="Restaurant Image" width={200} height={200} />
                </Link>
            </div>
            <div className="ml-10 font-bold font-inter text-[18px] flex flex-col justify-center text-gray-600">
                <div className="font-bold text-[36px] text-black">{restaurantItem.name}</div>
                <div>Food Type | {restaurantItem.foodType}</div>
                <div className="flex items-center">
                    <Image className="mr-2" src="/icons/star_icon.png" alt="Star Icon" width={20} height={20} />
                    {restaurantItem.rating} • {restaurantItem.province}
                </div>
                <div className="flex items-center">
                    <Image className="mr-2" src="/icons/clock_icon.png" alt="Clock Icon" width={18} height={18} />
                    {restaurantItem.openTime} - {restaurantItem.closeTime}
                </div>
                <div className="flex flex-row">
                <Link href={`/restaurants/${restaurantItem.id}`}>
                    <button className="mt-4 mr-5 px-6 py-2 text-white bg-[#D40303] rounded-xl hover:bg-red-700 transition-shadow shadow-lg hover:shadow-2xl w-[150px]">
                        รายละเอียด
                    </button>
                </Link>
                <Link href={`/rating/${restaurantItem.id}`}>
                    <button className="mt-4 px-6 py-2 text-white bg-green-600 rounded-xl hover:bg-green-700 transition-shadow shadow-lg hover:shadow-2xl w-[150px]">
                        ให้คะแนน
                    </button>
                </Link>    
                </div>
                
            </div>
        </div>
    );
}