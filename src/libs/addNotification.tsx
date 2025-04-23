// libs/notification-api.ts
export default async function addNotification({
    title,
    message,
    createdBy,
    targetAudience,
    publishAt,
    token,
    restaurant
  }: {
    title: string;
    message: string;
    createdBy: string;
    targetAudience: string;
    publishAt?: string;
    token: string;
    restaurant?: string;
  }) {
    const payload: any = {
      title,
      message,
      createdBy,
      targetAudience,
      publishAt: publishAt === 'now' ? new Date().toISOString() : publishAt
    };
  
    // Add required fields based on createdBy value
    
  
    if (createdBy === 'restaurantManager') {
      payload.restaurant = restaurant;
    }
  
    const response = await fetch(`${process.env.BACKEND_URL}api/v1/notifications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });
    
    const json = await response.json();
    if (!response.ok) {
      throw new Error(json.error || json.message || 'Failed to create notification');
    }
    return json;
  }