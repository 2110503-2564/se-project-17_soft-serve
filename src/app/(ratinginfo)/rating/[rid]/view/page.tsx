'use client'
import { getServerSession } from "next-auth";
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';
import RestaurantReviewsTable from "@/components/RestaurantReviewsTable";
import TotalRate from "@/components/OverallRating";
import Image from "next/image";
import getRestaurants from "@/libs/getRestaurants";
import getRestaurant from "@/libs/getRestaurant";
import { OneRestaurantJson } from "../../../../../../interfaces";
import { useParams } from "next/navigation";
import { Params } from "next/dist/server/request/params";
import RestaurantReviewsDashboard from "@/components/RestaurantReviewsDashboard";

export default  function RestaurantReviewsView(){
    const { rid } = useParams();
    if(!rid)return
    return(
        <main>
            <RestaurantReviewsDashboard rid={rid.toString()}></RestaurantReviewsDashboard>
        </main>
    );
    
}
