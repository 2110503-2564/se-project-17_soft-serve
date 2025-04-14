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
    // ใช้ BACKEND_URL สำหรับ API URL
    const response = await fetch(`${process.env.BACKEND_URL}api/v1/restaurants/${restaurantId}/reviews`, {
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

    // ตรวจสอบว่า response.ok เป็น true
    if (!response.ok) {
        // ถ้าผิดพลาดให้ throw error
        const errorData = await response.text(); // อ่านข้อความถ้ามี error HTML
        throw new Error(`Failed to submit review: ${errorData}`);
    }

    // หากสำเร็จ ให้ return ข้อมูล JSON
    return await response.json();
}
