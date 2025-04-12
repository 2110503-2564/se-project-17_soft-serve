import AdminSearchBox from "@/components/AdminSearchBox";
import AdminReservationTable from "@/components/AdminReservationTable";

export default function ReservationsList() {
    return (
        <main className="bg-myred h-[100%] pb-10">
            
            <div className='flex flex-col items-center space--5'>
            <div className="text-3xl font-bold text-white pt-10">
                Reservations List   
            </div>
                <AdminSearchBox/>
                <AdminReservationTable/>
            </div>
        </main>
    );
}