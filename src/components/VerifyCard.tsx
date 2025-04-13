'use client';
import Image from "next/image";


export default function VerifyCard() {
    // Mock Data
    interface RestaurantItem {
        // u - user
        uname: string; 
        utel: string;
        uemail: string;
        ucreatedAt: string;
        // restaurant
        name: string;
        address: string;
        province: string;
        district: string;
        postalcode: string;
        description: string;
        imgPath: string;
        foodType: string;
        openTime: string;
        closeTime: string;
        tel: string;
    }

    const mockRestaurantData: RestaurantItem[] = [
        {
            uname: 'John Doe',
            utel: '012-235-4789',
            uemail: 'johndoe@jd.com',
            ucreatedAt: '2023-10-01',
            name: 'Napoli\'s Slice',
            address: '22 Sukhumvit 31',
            province: 'Bangkok',
            district: 'Wattana',
            postalcode: '10110',
            description: 'An authentic Italian pizzeria serving wood-fired pizzas.',
            imgPath: 'https://drive.google.com/uc?id=1fgvSN79EvVx_b6Xb7mpPlYhbDecMx2Ii',
            foodType: 'Pizza',
            openTime: '11:00',
            closeTime: '22:30',
            tel: '02-123-4567',
        },
        {
            uname: 'Jane Smith',
            utel: '012-235-4789',
            uemail: 'jane@smith.com',
            ucreatedAt: '2023-10-01',
            name: 'La Cantina Mexicana',
            address: '88 Chumphon Market St',
            province: 'Chumphon',
            district: 'Mueang',
            postalcode: '86000',
            description: 'A lively Mexican eatery with tacos, burritos, and margaritas.',
            imgPath: 'https://drive.google.com/uc?id=1lwTwYL45cFtoBKQvvj0V49Zd8j_PWiyr',
            foodType: 'Mexican',
            openTime: '12:00',
            closeTime: '23:00',
            tel: '077-555-6666',
        }
    ]

    const restaurantJson = {
        data: mockRestaurantData,
    };

    return (
        <main>
            <div>
                {restaurantJson.data.map((restaurantItem: RestaurantItem) => {
                    return (
                        <main className="p-7">
                            <div className="flex flex-col">
                                <div className="flex items-center justify-between">
                                    <div className="text-3xl font-bold">
                                        {restaurantItem.uname}
                                    </div>
                                    <div className="flex flex-row">
                                        <button className="ml-4 px-6 py-2 text-white font-bold bg-[#00C642] rounded-xl hover:bg-[#7AF1A2] transition-shadow shadow-lg hover:shadow-2xl w-[150px]">
                                            Approve
                                        </button>
                                        <button className="ml-4 px-6 py-2 text-white font-bold bg-[#D40303] rounded-xl hover:bg-[#F97F7F] transition-shadow shadow-lg hover:shadow-2xl w-[150px]">
                                            Reject
                                        </button>
                                    </div>
                                </div>
                                <div className="pt-2 pb-2">
                                    <div>Tel: {restaurantItem.utel}</div>
                                    <div>Email: {restaurantItem.uemail}</div>
                                    <div>createdAt: {restaurantItem.ucreatedAt}</div>
                                </div>
                            </div>
                            
                            <div className="flex flex-col md:flex-row p-5 border border-gray-300 rounded-lg shadow-sm">
                                <div className="relative w-60 h-60 overflow-hidden object-cover rounded-lg shadow-lg">
                                    <Image
                                        src={restaurantItem.imgPath}
                                        alt="Restaurant Image"
                                        fill={true}
                                    />
                                </div>
                                <div className="pl-0 md:pl-10 pt-5 md:pt-0">
                                    <div className="text-3xl font-bold">{restaurantItem.name}</div>
                                    <div className="pt-2 pb-2">{restaurantItem.address}, {restaurantItem.province}, {restaurantItem.district}, {restaurantItem.postalcode}</div>
                                    <div className="text-xl font-bold">About the restaurant</div>
                                    <div className="pt-2 pb-2">{restaurantItem.description}</div>
                                    <div className="font-semibold">
                                        Food Type |
                                        <span className="font-normal ml-1">
                                            {restaurantItem.foodType}
                                        </span>
                                    </div>
                                    <div>{restaurantItem.openTime} - {restaurantItem.closeTime}</div>
                                    <div>{restaurantItem.tel}</div>
                                </div>
                            </div>
                            <div className="pt-10"></div>
                            <div className="border-t border-gray-300"></div>
                        </main>
                    );
                })}
            </div>
            
        </main>
    );
}