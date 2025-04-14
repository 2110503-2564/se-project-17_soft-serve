export default async function addReview({
    restaurantId,
    rating,
    review,
    token, 
  }: {
    restaurantId: string;
    rating: number;
    review: string;
    token: string;
  }) {
    const res = await fetch(`/api/v1/restaurants/${restaurantId}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        rating,
        review,
      }),
    });
  
    const data = await res.json();
  
    if (!res.ok) {
      throw new Error('Failed to submit review');
    }
  
    return data;
  }
  