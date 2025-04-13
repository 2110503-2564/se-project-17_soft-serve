export default async function userLogIn ({userEmail, userPassword} : {userEmail : string, userPassword : string}){
    const response = await fetch(process.env.BACKEND_URL+'api/v1/auth/login', {
        method : 'POST',
        headers : {
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify({
            email : userEmail,
            password : userPassword
        }),
    });

   // console.log(await response.json());

    const data = await response.json();

    if(data.msg == 'not verified'){
        throw new Error('not verified')
    }


    if(!response.ok){
        throw new Error('Invalid credentials');
    }

    

    return await data;
}