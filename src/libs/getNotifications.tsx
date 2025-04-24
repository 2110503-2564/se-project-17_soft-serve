'use server'
import { useSearchParams } from 'next/navigation';
export default async function getNotifications({token , page = 1 , limit = 10 } : {token: string ; page?:number ;limit?:number}){
    const url = new URL(`${process.env.BACKEND_URL}api/v1/notifications`);
    url.searchParams.append('page', page.toString());
    url.searchParams.append('limit', limit.toString());
    
    const response = await fetch(url.toString(),{
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    });

    if(!response.ok){
        throw new Error('Failed to fetch notifications');
    }

    return await response.json();
}