export default async function getRestaurant(id:string){
    const response = await fetch(process.env.BACKEND_URL+`api/v1/restaurants/${id}`);

    if(!response.ok){
        throw new Error('Failed to fetch restaurant');
    }

    return await response.json();
}