import { signOut } from "next-auth/react";

export default async function userLogOut() {
    const response = await fetch(process.env.BACKEND_URL + 'api/v1/auth/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    });

    signOut();

    if (!response.ok) {
        throw new Error('Failed to log out');
    }
    
    return await response.json();
}
