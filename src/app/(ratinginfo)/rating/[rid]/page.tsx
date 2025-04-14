'use client'
import Image from "next/image";
import Rate from '@/components/ReviewRatings';
import TotalRate from '@/components/OverallRating';
import ReviewBox from "@/components/ReviewBox";
import getRestaurants from "@/libs/getRestaurants";
import addReview from "@/libs/addReview";

import { useEffect, useReducer, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@mui/material";

// Reducer for ratings
const ratingReducer = (state: Map<string, number>, action: { type: string, ratingName: string, value: number }) => {
    const newState = new Map(state);
    switch (action.type) {
        case 'update':
            newState.set(action.ratingName, action.value);
            return newState;
        default:
            return state;
    }
};

export default function RatingDetailPage() {
    const router = useRouter();
    const { rid } = useParams();
    
    const [restaurant, setRestaurant] = useState<{ name: string, imgPath: string } | null>(null);
    const [isLoading, setIsLoading] = useState(true); 
    const [ratings, dispatch] = useReducer(ratingReducer, new Map<string, number>());
    const [overallRating, setOverallRating] = useState(0);
    const [comment, setComment] = useState(""); 

    const token = typeof window !== "undefined" ? localStorage.getItem("token") ?? "" : "";

    // Fetch restaurant data
    useEffect(() => {
        const fetchRestaurant = async () => {
            setIsLoading(true);  
            try {
                const restaurantJson = await getRestaurants();
                const foundRestaurant = restaurantJson.data.find((r: any) => r.id === rid);
                if (foundRestaurant) {
                    setRestaurant({
                        name: foundRestaurant.name,
                        imgPath: foundRestaurant.imgPath
                    });
                }
            } catch (error) {
                console.error("Error fetching restaurants:", error);
            } finally {
                setIsLoading(false);  
            }
        };
        fetchRestaurant();
    }, [rid]);

    const handleRatingChange = (ratingName: string, value: number) => {
        dispatch({ type: 'update', ratingName, value });
    };

    // Calculate Overall Rating
    useEffect(() => {
        if (ratings.size > 0) {
            const total = Array.from(ratings.values()).reduce((acc, value) => acc + value, 0);
            const newOverallRating = total / ratings.size;
            setOverallRating(parseFloat(newOverallRating.toFixed(1)));
        } else {
            setOverallRating(0);
        }
    }, [ratings]);

    const handleSubmit = async () => {
        if (overallRating <= 0 || !comment.trim()) {
            alert('Please provide a rating and a comment.');
            return;
        }

        try {
            const res = await addReview({
                restaurantId: rid as string,
                rating: overallRating,
                review: comment,
                token: token,
            });

            alert(`Review submitted successfully!\nOverall Rating: ${res.data.rating}/5`);
            router.push("/");
        } catch (error: any) {
            alert(`Error submitting review: ${error.message}`);
        }
    };

    if (isLoading) {
        return (
            <main className="text-center p-5">
                <h1 className="text-lg font-medium">Loading...</h1>
            </main>
        );
    }

    if (!restaurant) {
        return (
            <main className="text-center p-5">
                <h1 className="text-lg font-medium">Restaurant Not Found</h1>
            </main>
        );
    }

    return (
        <main className="text-center pb-10 text-black">
            {/* Restaurant Image */}
            <div className="block p-5 m-0 w-screen h-[80vh] relative">
                <Image
                    src={restaurant.imgPath}
                    alt="Restaurant Image"
                    className="object-cover w-full h-full"
                    fill
                />
            </div>

            {/* Restaurant Name */}
            <div className="text-5xl font-bold mt-5">
                [ {restaurant.name} ]
            </div>

            {/* Description */}
            <div className="text-2xl font-bold p-2">
                Rate the Restaurant
            </div>
            <div>
                Share your thoughts about [ {restaurant.name} ] to help the restaurant improve and guide others in their dining choices!
            </div>

            {/* Ratings */}
            <div className="mt-10 flex flex-wrap flex-row justify-center">
                {['Food', 'Service', 'Ambiance', 'Value for Money'].map((category) => (
                    <div key={category} className="flex flex-col text-xl font-bold scale-125 mx-20 my-10">
                        {category}
                        <Rate
                            ratingName={category}
                            onCompare={handleRatingChange}
                            initialRating={ratings.get(category) || 0}
                        />
                    </div>
                ))}
            </div>

            {/* Review and Overall Rating */}
            <div className="flex flex-wrap flex-row justify-center p-10 gap-10 items-start">
                {/* Comment Box */}
                <div className="p-2 mb-20 mr-16">
                <ReviewBox
                    value={comment}
                    onChange={setComment}
                    restaurantId={rid as string}
                    rating={overallRating}
                />

                </div>

                {/* Overall Rating */}
                <div key="Overall Rating" className="flex flex-col text-xl font-bold mb-4 scale-150">
                    Overall Rating
                    <div className="relative flex flex-col items-center">
                        <div className="pointer-events-none">
                            <TotalRate value={overallRating} />
                        </div>
                        <div className="absolute -top-6 text-sm font-bold p-10 mt-5">
                            {overallRating}/5
                        </div>
                    </div>
                </div>
            </div>

            {/* Submit Button */}
            <Button
                onClick={handleSubmit}
                variant="contained"
                sx={{
                    backgroundColor: 'gray',
                    color: 'white',
                    fontWeight: 'bold',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    transition: 'background-color 0.3s',
                    '&:hover': {
                        backgroundColor: 'rgb(25, 146, 69)',
                    },
                }}
            >
                Submit Your Review
            </Button>
        </main>
    );
}
