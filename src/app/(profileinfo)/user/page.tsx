import ProfileMenu from '@/components/ProfileMenu';

import { getServerSession } from "next-auth";
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';
import getUserProfile from "@/libs/getUserProfile";

export default async function Profile() {
    const session = await getServerSession(authOptions);
    
    if(!session || !session.user || !session.user.token) return null;

    const profile = await getUserProfile(session.user.token);

    return (
        <main className="bg-[#D40303] h-screen">
            <div className='flex justify-center p-20'>
                <ProfileMenu user={profile.data}/>    
            </div>
            
        </main>
    );
}