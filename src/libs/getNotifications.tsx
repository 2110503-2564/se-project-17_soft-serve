export default async function getNotifications({token} : {token: string}){
    const response = await fetch(process.env.BACKEND_URL+`api/v1/notifications`,{
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