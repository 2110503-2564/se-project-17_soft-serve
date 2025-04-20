import ProfileMenu from '@/components/ProfileMenu';
import EditingMenu from '@/components/EditingMenu';

import { getServerSession } from "next-auth";
import getUserProfile from "@/libs/getUserProfile";
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';

export default async function Editing() {
    const session = await getServerSession(authOptions);
        
    if(!session || !session.user.token) return null;

    const token = session.user.token;
    const profile = await getUserProfile(token);

    return (
        <main className="bg-[#D40303] h-screen">
            <div className='flex justify-center p-10'>
                <div className='pt-10'>
                    <ProfileMenu user={profile.data}/>     
                </div>
                 
                <div className='ml-10'>
                    <EditingMenu token={token} user={profile.data}/>
                </div>      
            </div>

        </main>
    );
}