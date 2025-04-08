export default async function deleteReservation ({reservationId, token} : {reservationId : string, token : string}) {
    const response = await fetch(process.env.BACKEND_URL+`api/v1/reservations/${reservationId}`, {
        method : 'DELETE',
        headers : {
            'Authorization': `Bearer ${token}`,
        },
    });

    if(!response.ok){
        throw new Error('Failed to delete reservation');
    }

    return await response.json();
}