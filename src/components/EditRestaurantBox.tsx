'use client'
import { useState, useEffect } from "react";
import Image from "next/image"
import getRestaurant from "@/libs/getRestaurant";
import { RestaurantItem } from '../../interfaces';
import { PencilIcon } from '@heroicons/react/24/outline'

export default function EditRestaurantBox({/*{ restaurantId, token }: { restaurantId: string, token: string }*/}) {
    
    const mockRestaurantData: RestaurantItem = {
      _id: "a1b2c3d4e5f67890",
      name: "The Spicy Spoon",
      description: "Authentic Thai cuisine with a modern twist.",
      foodType: "Thai",
      address: "123 Sukhumvit Road",
      province: "Bangkok",
      district: "Wattana",
      postalcode: "10110",
      tel: "02-XXX-XXXX",
      openTime: "11:00",
      closeTime: "22:00",
      rating: 4.5,
      maxReservation: 20,
      imgPath: '/img/tomyum_seafood.jpg',
      id: "a1b2c3d4e5f67890"
    };
    const { imgPath, name, address, province, district, postalcode, description, foodType, openTime, closeTime, tel } = mockRestaurantData;

    return (
        <div className="flex flex-col p-5 w-[90vw] mt-10 h-fit rounded-lg shadow-lg bg-white mx-auto">
          <div className="flex justify-center items-center mt-8 mb-4">
            <img className="w-[25vw] h-[25vw] rounded-lg" src={imgPath} alt={name}/>
          </div>
          <div className="text-3xl text-center font-bold text-myred my-5">{name}</div>
            <div className="px-12 py-2">
              {/*Address*/}
              <div className="font-semibold text-myred text-xl mb-2">
                Address:
              </div>
              <div className="text-gray-700 border-b border-gray-300 flex justify-between items-center">
                <span>{address}, {district}, {province}, Thailand {postalcode}</span>
                <PencilIcon className="h-5 w-5 mr-2 cursor-pointer"/>
              </div>  
              {/*Description*/}
              <div className="font-semibold text-myred text-xl mt-5 mb-2">
              Description:
              </div>
              <div className="text-gray-700 border-b border-gray-300 flex justify-between items-center">
                <span>{description}</span>
                <PencilIcon className="h-5 w-5 mr-2 cursor-pointer"/>
              </div>  
              {/*Food Type*/}
              <div className="font-semibold text-myred text-xl mt-5 mb-2">
                Food Type:
              </div>
              <div className="text-gray-700 border-b border-gray-300 flex justify-between items-center">
                <span>{foodType}</span>
                <PencilIcon className="h-5 w-5 mr-2 cursor-pointer"/>
              </div>  
              {/*Opening Hours*/}
              <div className="font-semibold text-myred text-xl mt-5 mb-2">
                Opening Hours:
              </div>
              <div className="text-gray-700 border-b border-gray-300 flex justify-between items-center">
                <span>{openTime} - {closeTime}</span>
                <PencilIcon className="h-5 w-5 mr-2 cursor-pointer"/>
              </div>  
              {/*Tel*/}
              <div className="font-semibold text-myred text-xl mt-5 mb-2">
                Tel:
              </div>
              <div className="text-gray-700 border-b border-gray-300 flex justify-between items-center">
                <span>{tel}</span>
                <PencilIcon className="h-5 w-5 mr-2"/>
              </div>  
            </div>
            {/*Submit Button*/}
            <div className="flex justify-center">
              <button className='block bg-red-600 border border-white text-white text-xl font-semibold py-2 px-10 m-5 rounded-xl shadow-sm hover:bg-white hover:text-red-600 hover:border hover:border-red-600'>
                  Confirm and Submit
              </button>
            </div>
        </div>
    );
}

/*
export default function EditRestaurantBox({ restaurantId, token }: { restaurantId: string, token: string }) {
    const [reservation, setReservation] = useState<OneReservationJson | null>(null);

    useEffect(() => {
        const fetchReservation = async () => {
            try {
                const fetchedReservation : OneReservationJson = await getReservation({ id: reservationId, token: token });
                // console.log(fetchedReservation);
                setReservation(fetchedReservation);
            } catch (error) {
                console.error(error);
            }
        };
        fetchReservation();
    }, [restaurantId, token]);

    if (!reservation || !reservation.data) return;
    const restaurant = reservation.data.restaurant;
    // console.log(restaurant);
    return (
        <main>
            <div className="flex flex-center p-5 w-[90vw] mt-10 h-fit rounded-lg shadow-lg bg-white mx-auto px-6 py-6">
                
            </div>
        </main>
    );
}*/