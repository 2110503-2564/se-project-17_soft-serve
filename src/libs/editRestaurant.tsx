export default async function editRestaurant ({restaurantId, address, province, district, postalcode, description, foodType, openTime, closeTime, tel, token} : {restaurantId: string, address: string, province: string, district: string, postalcode: string, description: string, foodType: string, openTime: string, closeTime: string, tel: string, token: string}) {
    const response = await fetch(process.env.BACKEND_URL+`api/v1/restaurants/${restaurantId}`, {
        method : 'PUT',
        headers : {
            'Authorization': `Bearer ${token}`,
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify({
            address: address,
            province: province,
            district: district,
            postalcode: postalcode,
            description: description,
            foodType: foodType,
            openTime: openTime,
            closeTime: closeTime,
            tel: tel,
        }),
    });

    if(!response.ok){
        throw new Error('Failed to edit reservation');
    }

    return await response.json();
}