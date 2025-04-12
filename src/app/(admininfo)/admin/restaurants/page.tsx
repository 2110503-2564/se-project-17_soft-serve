import AdminSearchBox from "@/components/AdminSearchBoxRestaurant";
import AdminRestaurantTable from "@/components/AdminRestaurantTable";

export default function RestaurantsList() {
    return (
        <main className="bg-myred min-h-screen pb-10">
            <div className='flex flex-col items-center space--5'>
            <div className="text-3xl font-bold text-white pt-10">
                Restaurants List   
            </div>
                <AdminSearchBox/>
                <AdminRestaurantTable/>
            </div>
        </main>
    );
}