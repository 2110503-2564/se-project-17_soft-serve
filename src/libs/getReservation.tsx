export default async function getReservation({id, token} : {id: string, token: string}) {
    const response = await fetch(process.env.BACKEND_URL + `api/v1/reservations/${id}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    if(!response.ok){
        throw new Error('Failed to fetch reservation');
    }

    return await response.json();
}
