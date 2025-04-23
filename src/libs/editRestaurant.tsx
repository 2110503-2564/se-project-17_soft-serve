export default async function editReservation (
    {restaurantId, description, foodType, address, province, district, postalcode, tel, openTime, closeTime, token} :
    {restaurantId: string, description: string, foodType: string, address: string, province: string, district: string, postalcode: string, tel: string, openTime: string, closeTime: string, token: string}) {
    const response = await fetch(process.env.BACKEND_URL+`api/v1/restaurants/${restaurantId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
            description: description,
            foodType: foodType,
            address: address,
            province: province,
            district: district,
            postalcode: postalcode,
            tel: tel,
            openTime: openTime,
            closeTime: closeTime
        }),
    });

    const json = await response.json();

    if(!response.ok){
        throw new Error(json.message || 'Failed to edit restaurant');
    }

    return json;
}