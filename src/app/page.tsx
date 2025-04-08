import Banner from "@/components/Banner"
import RestaurantCardPanel from "@/components/RestaurantCardPanel";

export default function Home() {
  return (
    <main>
      <Banner/>
      <div className="
      px-10 py-10 
      text-[30px]
      font-bold
      text-black">
        ร้านอาหารแนะนำ
      </div>
      <RestaurantCardPanel/>
    </main>
  );
}
