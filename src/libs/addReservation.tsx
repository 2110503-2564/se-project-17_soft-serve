export default async function addReservation ({restaurantId, revDate, numberOfPeople, token} : {restaurantId : string, revDate : Date, numberOfPeople: number, token : string}) {
    const response = await fetch(process.env.BACKEND_URL+`api/v1/restaurants/${restaurantId}/reservations`, {
        method : 'POST',
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
        throw new Error(json.message || 'Failed to make reservation');
    }

    return json;
}