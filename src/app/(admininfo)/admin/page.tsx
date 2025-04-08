import AdminSearchBox from "@/components/AdminSearchBox";
import AdminReservationTable from "@/components/AdminReservationTable";

export default function Admin() {
    return (
        <main className="bg-[#D40303] h-[100%] pb-10">
            
            <div className='flex flex-col items-center space--5'>
            <div className="text-3xl font-bold text-white pt-10">
                Reservation List   
            </div>
                <AdminSearchBox/>
                <AdminReservationTable/>
            </div>
        </main>
    );
}