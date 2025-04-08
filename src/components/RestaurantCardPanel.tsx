'use client'
import { useReducer, useEffect, useState } from "react";
import RestaurantCard from "./RestaurantCard";
import Link from "next/link";
import getRestaurants from "@/libs/getRestaurants";

export default function RestaurantCardPanel() {
    const comparerReducer = (compareList:Map<string, number>, action:{type:string; restaurantName:string; rating?: number})=>{
        const newList = new Map(compareList)
        switch(action.type) {
            case 'add': {
                if (action.rating !== undefined) {
                    newList.set(action.restaurantName, action.rating);
                }
                return newList;            
            }
            case 'remove': {
                newList.delete(action.restaurantName);
                return newList;
            }
            default: return compareList
        }
    }

    const initialCompareList = new Map<string, number>([ ]);
    const [compareList, dispatchCompare] = useReducer(comparerReducer, initialCompareList);
    const [restaurants, setRestaurants] = useState<any[]>([]);

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const restaurantJson = await getRestaurants();
                const shuffled = restaurantJson.data.sort(() => 0.5 - Math.random()).slice(0, 8);
                setRestaurants(shuffled);
            } catch (error) {
                console.error("Error fetching restaurants:", error);
            }
        };
        fetchRestaurants();
    }, []);

    return (
        <div>
            <div style={{ margin: "20px", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" }}>
                {
                    restaurants.map((restaurantItem) => (
                        <Link 
                            key={restaurantItem.id}
                            href={`/restaurants/${restaurantItem.id}`}
                            className="text-black">
                            <RestaurantCard 
                                restaurantName={restaurantItem.name} 
                                imgSrc={restaurantItem.imgPath} 
                                onCompare={(restaurant, rating) => dispatchCompare({ type: 'add', restaurantName: restaurant, rating })} 
                                rid={restaurantItem.id}
                                overallRating={restaurantItem.rating} 
                            />
                        </Link>
                    ))
                }
            </div>
        </div>
    );
}
