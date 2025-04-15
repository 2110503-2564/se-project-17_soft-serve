export default async function getReviewOneRestaurant({
    restaurantId,
    token,
  }: {
    restaurantId: string;
    token: string;
  }) {
    const url = `${process.env.BACKEND_URL}api/v1/restaurants/${restaurantId}/reviews`;
    console.log("hereeeeeeeeeeeeeeeeeeeeeeeeeeeeee");
  
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  
    console.log("Status Code:", response.status);
  
    const data = await response.json();
    console.log("Response JSON:", data);
  
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch reviews from restaurant');
    }
  
    return data;
  }
  