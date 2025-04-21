'use client'
import Image from "next/image";
import Rate from '@/components/ReviewRatings';
import TotalRate from '@/components/OverallRating';
import ReviewBox from "@/components/ReviewBox";
import getRestaurants from "@/libs/getRestaurants";
import addReview from "@/libs/addReview";
import { useSession } from "next-auth/react";
import { useEffect, useReducer, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { redirect } from 'next/navigation';
import getUserProfile from '@/libs/getUserProfile';
import Loader from "@/components/Loader";

// Reducer for ratings
const ratingReducer = (
    state: Map<string, number | null>,
    action: { type: string, ratingName: string, value: number | null }) => {
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
    const { rid } = useParams();
    const { data: session } = useSession();
    const router = useRouter();

    const [restaurant, setRestaurant] = useState<{ name: string, imgPath: string } | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [ratings, dispatch] = useReducer(ratingReducer, new Map<string, number | null>());
    const [overallRating, setOverallRating] = useState(0);
    const [comment, setComment] = useState("");

    const [isLoadingRoleCheck, setIsLoadingRoleCheck] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);
    useEffect(() => {
        if (!session || !session.user?.token) {
            return;
        }
        const checkRole = async () => {
            try {
                const userProfile = await getUserProfile(session.user.token);
                if (userProfile?.data?.role === 'admin' || userProfile?.data?.role === 'user') {
                    setIsAuthorized(true);
                } else {
                    alert(`Your role (${session.user.role}) is not authorized to access this page.`);
                    router.replace('/');
                }
                
            } catch (error) {
                console.error("Failed to fetch user profile:", error);
                setIsAuthorized(false);
                router.replace('/');
            } finally {
                setIsLoadingRoleCheck(false);
            }
        };
        checkRole();
    }, [session]);
    
    // Fetch restaurant data
    useEffect(() => {
        if (!rid) return;
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

    // Edit here
    // Calculate Overall Rating
    useEffect(() => {
        const validRatings = Array.from(ratings.values()).filter(value => value !== null);
        // console.log("validRatings.length", validRatings.length)
        if (validRatings.length > 0) {
            const sumRatings = validRatings.reduce((sum, value) => sum + (value as number), 0);
            const newOverallRating = sumRatings / 4;
            setOverallRating(parseFloat(newOverallRating.toFixed(1)));
        } else {
            setOverallRating(0);
        }
    }, [ratings]);
    if (!session || !session.user?.token || isLoadingRoleCheck) {
        return <Loader loadingtext="Loading ..." />;;
    }

    if (!isAuthorized) return null;
    if (isLoading) {
        return <Loader loadingtext="Loading ..." />;
    }
    const handleRatingChange = (ratingName: string, value: number | null) => {
        dispatch({ type: 'update', ratingName, value });
    };

    const handleSubmit = async () => {
        if (overallRating <= 1 || !comment.trim()) {
            alert("Please provide a comment and rate all categories before submitting your review.");
            return;
        }

        try {
            const res = await addReview({
                restaurantId: rid as string,
                rating: overallRating,
                review: comment,
                token: session.user.token,
            });

            alert(`Review submitted successfully!\nOverall Rating: ${res.data.rating}/5`);
            router.push("/restaurants");
        } catch (error: any) {
            alert(`Error submitting review: ${error.message}`);
        }
    };

    if (isLoading) {
        return <Loader loadingtext="Loading ..." />;
    }

    if (!restaurant) {
        return (
            <main className="text-center p-5">
                <h1 className="text-lg font-medium">Restaurant Not Found</h1>
            </main>
        );
    }

    return (
        <main className="text-center text-gray-800">
            {/* Restaurant Image */}
            <div className="w-screen h-[50vh] relative block p-5">
                <Image src={restaurant.imgPath}
                    alt='cover'
                    fill={true}
                    priority
                    objectFit='cover'/>
            </div>
            {/* Restaurant Name */}
            <div className="text-4xl font-bold mt-10 mb-6">
                {restaurant.name}
            </div>
            {/* Description */}
            <div className="text-xl font-bold mb-2">
                Rate the Restaurant
            </div>
            <div className="mb-10">
                Share your thoughts about <span className="font-semibold">{restaurant.name}</span> to help the restaurant improve and guide others in their dining choices!
            </div>

            {/* Ratings */}
            <div className="mt-18 flex flex-wrap flex-row justify-center">
                {['Food', 'Service', 'Ambiance', 'Value for Money'].map((category) => (
                    <div key={category} className="flex flex-col text-[26px] font-bold mx-20 mt-15">
                        {category}
                        <Rate
                            ratingName={category}
                            onCompare={handleRatingChange}
                            initialRating={ratings.get(category) || null}
                        />
                    </div>
                ))}
            </div>

            {/* Review and Overall Rating */}
            <div className="flex flex-wrap flex-row justify-center pt-5 items-start">
                {/* Comment Box */}
                <div className="mr-16">
                    <ReviewBox
                        value={comment}
                        onChange={setComment}
                        restaurantId={rid as string}
                        rating={overallRating}
                    />
                </div>
                {/* Overall Rating */}
                <div key="Overall Rating" className="flex flex-col justify-center text-[26px] font-bold mx-20 h-40">
                    Overall Rating
                    <div className="relative flex flex-col items-center">
                        <div className="pointer-events-none">
                            <TotalRate value={overallRating} />
                        </div>
                        <div className="absolute text-lg font-semibold mt-10">
                            {overallRating}/5
                        </div>
                    </div>
                </div>
            </div>

            {/* Submit Button */}
            <div className="flex flex-col justify-center items-center mb-5">
                <button name="Reserve"className="block bg-myred border border-white text-white text-xl font-semibold py-2 px-5 m-5 rounded-xl shadow-sm hover:bg-white hover:text-red-600 hover:border hover:border-red-600"
                    onClick={handleSubmit}>
                    Submit Your Review  
                </button>
            </div>
        </main>
    );
}