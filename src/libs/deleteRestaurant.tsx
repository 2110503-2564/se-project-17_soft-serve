export default async function deleteRestaurant ({restaurantId, token} : {restaurantId : string, token : string}) {
    const response = await fetch(process.env.BACKEND_URL+`api/v1/restaurants/${restaurantId}`, {
        method : 'DELETE',
        headers : {
            'Authorization': `Bearer ${token}`,
        },
    });

    if(!response.ok){
        throw new Error('Failed to delete restaurant');
    }

    return await response.json();
}