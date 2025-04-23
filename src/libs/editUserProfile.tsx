export default async function editUserProfile(
    token: string,
    data: { name: string, tel: string }
) {
    const response = await fetch(`${process.env.BACKEND_URL}api/v1/auth/me`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    const json = await response.json();
    // console.log(json);

    if (!response.ok) {
        throw new Error(json.message || 'Can not edit your profile');
    }

    return json;
}
  