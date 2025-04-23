import { redirect } from 'next/navigation';
import { getServerSession } from "next-auth";
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';
import NotificationRow from '@/components/NotificationRow';
import getUserProfile from "@/libs/getUserProfile";

export default async function Notification() {
    const session = await getServerSession(authOptions);
    //console.log('session', session);
    if (!session || !session.user || !session.user.token) redirect('/');

    const token = session.user.token;
    const user = await getUserProfile(token);
    //console.log('role', user.data.role);
    if (user.data.role !== 'user') {
        redirect('/');
    }



    return (
        <main>
            <NotificationRow/>
        </main>
    );
}