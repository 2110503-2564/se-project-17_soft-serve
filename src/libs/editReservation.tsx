export default async function editReservation ({reservationId, revDate, numberOfPeople, token} : {reservationId : string, revDate : Date, numberOfPeople: number, token : string}) {
    const response = await fetch(process.env.BACKEND_URL+`api/v1/reservations/${reservationId}`, {
        method : 'PUT',
        headers : {
            'Authorization': `Bearer ${token}`,
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify({
            numberOfPeople : numberOfPeople,
            revDate : revDate
        }),
    });

    if(!response.ok){
        throw new Error('Failed to edit reservation');
    }

    return await response.json();
}