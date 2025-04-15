interface VerifyRestaurantParams {
    userId: string;
    isApprove: boolean;
    token: string;
  }
  
  export default async function verifyRestaurant({ userId, isApprove, token }: VerifyRestaurantParams) {
    const response = await fetch(process.env.BACKEND_URL+'api/v1/auth/verify', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ userId, isApprove }),
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.msg || "Failed to verify/reject restaurant");
    }
  
    return response.json();
  }
  