export default async function userRegister ({userEmail, userPassword, userName, userTel} : {userEmail : string, userPassword : string, userName : string, userTel : string}) {
    const response = await fetch(process.env.BACKEND_URL+'api/v1/auth/register', {
        method : 'POST',
        headers : {
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify({
            name : userName,
            email : userEmail,
            password : userPassword,
            tel : userTel,
            role : "user"
        }),
    });

    if(!response.ok){
        throw new Error('Failed to register');
    }

    return await response.json();
}