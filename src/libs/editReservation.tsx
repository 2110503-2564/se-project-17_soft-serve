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

    const json = await response.json();

    if(!response.ok){
        throw new Error(json.message || 'Failed to edit reservation');
    }

    return json;
}