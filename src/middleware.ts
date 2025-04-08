export { default } from 'next-auth/middleware'

export const config = {
    matcher: [
        "/admin", 
        "/reservations", 
        "/reservations/[rid]", 
        "/rating/[rid]", 
        "/user", 
        "/user/profile", 
        "/user/changepassword"
    ]
};
