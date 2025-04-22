export default async function getReservations({token} : {token: string}){
    const response = await fetch(process.env.BACKEND_URL+`api/v1/reservations`,{
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    });

    if(!response.ok){
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch reservations');
    
    }

    return await response.json();
}