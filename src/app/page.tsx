import Banner from "@/components/Banner"
import RestaurantCardPanel from "@/components/RestaurantCardPanel";
import getRestaurants from "@/libs/getRestaurants";
import { RestaurantJson } from "../../interfaces";
import Link from "next/link";
import Loader from "@/components/Loader";

export default async function Home() {
  const restaurantJson: RestaurantJson = await getRestaurants();
  
  if(!restaurantJson){
    return <Loader loadingtext="Loading restaurants..." />;
  }
  
  const verifiedRestaurants = restaurantJson.data.filter(item => item.verified).slice(0, 8);
  
  return (
    <main>
      <Banner/>
      <div className="px-10 py-10 text-3xl font-bold text-black flex justify-between items-center">
        <div>ร้านอาหารแนะนำ</div>
      </div>
      <RestaurantCardPanel restaurants={verifiedRestaurants} />
    </main>
  );
}