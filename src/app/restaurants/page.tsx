import getRestaurants from "../../libs/getRestaurants";
import { RestaurantItem, RestaurantJson } from "../../../interfaces";
import RestaurantListItem from "@/components/RestaurantListItem";
import SearchBox from "@/components/SearchBox";
import Loader from "@/components/Loader";

export default async function RestaurantList() {
    const restaurantJson : RestaurantJson = await getRestaurants();

    if(!restaurantJson){
        return <Loader loadingtext="Loading restaurants..." />;
    }

    return (
        <main>
            <div className="restaurant-header">
                <div className="w-full h-[90px] bg-[#D40303] flex items-center">
                    <div className="text-white font-bold font-inter text-[30px] mx-10">ร้านอาหารทั้งหมด</div>
                    <SearchBox/>
                </div>
            </div>

            <div className="restaurant-list">
                {
                    restaurantJson.data.map((restaurantItem : RestaurantItem) => (
                        restaurantItem.verified ? (
                            <div key={restaurantItem.id}>
                                <RestaurantListItem restaurantItem={restaurantItem}/>
                            </div>
                        ) : null
                    ))
                }
            </div>
        </main>
    );
}