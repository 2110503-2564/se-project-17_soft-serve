export default async function deleteNotification ({notificationId, token} : {notificationId : string, token : string}) {

    const response = await fetch(process.env.BACKEND_URL+`api/v1/notifications/${notificationId}`, {
        method : 'DELETE',
        headers : {
            'Authorization': `Bearer ${token}`,
        },
    });
    
    if(!response.ok){
        throw new Error('Failed to delete notification');
    }

    return await response.json();
}