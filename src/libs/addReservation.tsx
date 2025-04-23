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

    if(!response.ok){
        console.log(response.text);
        throw new Error('Failed to make reservation');
    }

    return await response.json();
}