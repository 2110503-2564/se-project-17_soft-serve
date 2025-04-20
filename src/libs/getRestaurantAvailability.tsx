export default async function getRestaurantAvailability(restaurantId: string, date: string) {
    const response = await fetch(`${process.env.BACKEND_URL}api/v1/restaurants/${restaurantId}/availability?date=${date}`, {
        method: 'GET'
    });

    if (!response.ok) {
        throw new Error('Failed to fetch restaurant availability');
    }

    const json = await response.json();
    return json.data;
}
