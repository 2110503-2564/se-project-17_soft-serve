import ReservationListItem from "@/components/ReservationListItem";
import { ReservationJson, ReservationItem } from "../../../interfaces";
import getReservations from "@/libs/getReservations";

import { getServerSession } from "next-auth";
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';

export default async function ReservationPage(){
    const session = await getServerSession(authOptions);
        
    if(!session || !session.user || !session.user.token) return null;

    const token = session.user.token;
    const reservationJson : ReservationJson = await getReservations({token});

    return (
        <main>
            <div className="restaurant-header">
                <div className="w-full h-[90px] bg-[#D40303] flex items-center">
                    <div className="text-white font-bold font-inter text-[30px] mx-10">My Reservations</div>
                </div>
            </div>

            <div className="reservation-list">
                {
                    reservationJson.data.map((reservationItem : ReservationItem) => (
                        <div key={reservationItem._id}>
                            <ReservationListItem reservationItem={reservationItem} restaurantItem={{imgPath : reservationItem.restaurant.imgPath, name : reservationItem.restaurant.name}}/>
                        </div>
                    ))
                }
            </div>
        </main>
    );
}