import Image from 'next/image'
import TopMenuItem from './TopMenuItem'
import Link from 'next/link'
import { UserCircleIcon } from '@heroicons/react/24/outline'
import { getServerSession } from "next-auth"
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';
import getUserProfile from "@/libs/getUserProfile";

export default async function TopMenu() {
    const session = await getServerSession(authOptions);
    
    let isAdmin = false;
    let isManager = false;
    let res = "";
    if(session){
        const token = session.user.token;
        const user = await getUserProfile(token);
        isAdmin = user.data.role === 'admin';
        isManager = user.data.role === 'restaurantManager';
        if(isManager)res = "/restaurants/" + user.data.restaurant;
    }


    return (
        <div className="w-full h-[60px] bg-white flex flex-row justify-between items-center z-50 fixed top-0 left-0 right-0">
            <div className="flex items-center">
                <Link href={'/'} className="flex flex-row items-center">
                    <Image src={'/img/logo.png'} alt='logo' width={0} height={0} sizes='100vh'
                        className="w-auto h-auto max-w-[70px] max-h-[70px] pl-4" />
                    <Image src={'/img/logoText.png'} alt='logo text' width={0} height={0} sizes='100vh'
                        className="w-auto h-[60%] pl-3" />
                </Link>
            </div>
            <div className="flex items-center">
                {isAdmin && <TopMenuItem title='Admin' pageRef='/admin' />}
                {isManager && <TopMenuItem title='Your Restaurants' pageRef= {res} />}
                <TopMenuItem title='Home' pageRef='/' />
                <TopMenuItem title='Restaurants' pageRef='/restaurants' />
                <TopMenuItem title='Reservations' pageRef='/reservations' />

                <Link href={'/user'}>
                    <UserCircleIcon className="w-[70px] h-[70px] ml-1 pr-4 text-[#d42d2d] hover:text-myred" />
                </Link>
            </div>
        </div>
    )
}