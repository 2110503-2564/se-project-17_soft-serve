export default async function getAllRestaurantManagers(token: string) {
    const response = await fetch(process.env.BACKEND_URL+'api/v1/auth/restaurantmanagers',
        {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        }
    );

    if (!response.ok) {
        throw new Error('Failed to fetch restaurant managers');
    }

    return await response.json();
}
