export default async function deleteNotification ({notificationId, token} : {notificationId : string, token : string}) {
    console.log("notificationId :"+notificationId )

    const response = await fetch(process.env.BACKEND_URL+`api/v1/notifications/${notificationId}`, {
        method : 'DELETE',
        headers : {
            'Authorization': `Bearer ${token}`,
        },
    });
console.log(response )
    if(!response.ok){
        throw new Error('Failed to delete notification');
    }

    return await response.json();
}